import { schema, OutputType } from "./analyze_POST.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    // Authenticate user
    await getServerUserSession(request);

    // Parse request body
    const json = superjson.parse(await request.text());
    const data = schema.parse(json);

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured no servidor.");
    }

    // Clean base64 string
    const base64Data = data.imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Construct the prompt based on mode
    let promptText =
      "Você é um assistente visual para pessoas cegas. Descreva o que você vê na imagem de forma concisa (máximo 2 frases). Foque em: obstáculos, pessoas, objetos importantes, texto visível e perigos.";

    if (data.mode === "smart") {
      promptText +=
        " Compare com o contexto anterior. Se NÃO houver mudanças significativas ou novos perigos, responda EXATAMENTE com 'SEM_MUDANCA'. Só descreva se algo novo, diferente ou perigoso aparecer.";
    } else {
      promptText +=
        " Se o contexto anterior for fornecido, NÃO repita informações já descritas - foque apenas no que mudou ou é novo.";
    }

    promptText += ` Responda em ${data.language || "português do Brasil"}.`;

    if (data.previousContext && data.previousContext.trim() !== "") {
      promptText += `\n\nContexto anterior: ${data.previousContext}`;
    }

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
      },
    };

    // Call Gemini 2.5 Flash API (Non-streaming for fast, complete response)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API do Gemini: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    const generatedText =
      responseData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Check if the model determined there was no change in smart mode
    const isNoChange =
      data.mode === "smart" &&
      (generatedText.includes("SEM_MUDANCA") || generatedText === "");

    const output: OutputType = {
      description: isNoChange ? "" : generatedText,
      hasChange: !isNoChange,
    };

    // Save interaction to the database if there was a meaningful change
    if (output.hasChange && output.description) {
      await db
        .insertInto("interactions")
        .values({
          id: crypto.randomUUID(),
          mode: data.mode,
          type: "description",
          systemResponse: output.description,
          createdAt: new Date(),
        })
        .execute();
    }

    return new Response(superjson.stringify(output));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(superjson.stringify({ error: message }), { status: 400 });
  }
}