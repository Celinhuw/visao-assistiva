import { schema } from "./assistant_POST.schema.js";
import superjson from "superjson";
import { db } from "../../helpers/db.js";
import { getServerUserSession } from "../../helpers/getServerUserSession.js";

export async function handle(request: Request) {
  try {
    // 1. Authenticate user
    await getServerUserSession(request);

    // 2. Parse request body
    const json = superjson.parse(await request.text());
    const data = schema.parse(json);

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured on the server.");
    }

    // 3. Construct Gemini payload
    const contents: any[] = [];

    if (data.conversationHistory) {
      for (const msg of data.conversationHistory) {
        contents.push({
          role: msg.role,
          parts: [{ text: msg.text }],
        });
      }
    }

    const currentMessageParts: any[] = [{ text: data.message }];
    
    // Add image if provided
    if (data.imageBase64) {
      const base64Data = data.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      currentMessageParts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
    }

    contents.push({
      role: "user",
      parts: currentMessageParts,
    });

    const geminiPayload = {
      systemInstruction: {
        parts: [
          {
            text: "Você é o Vision, um assistente visual inteligente para pessoas cegas. Descreva ambientes, objetos, detecte perigos e responda a perguntas sobre o que está ao redor do usuário. Seja conciso, claro e priorize alertas de segurança. Responda sempre em português do Brasil (pt-BR). Se uma imagem for fornecida, descreva o que você vê nela. Se nenhuma imagem for fornecida, responda com base na pergunta de texto.",
          },
        ],
      },
      contents,
    };

    // 4. Call Gemini API with streaming
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(geminiPayload),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
    }

    if (!geminiResponse.body) {
      throw new Error("No response body from Gemini API");
    }

    // 5. Create a TransformStream to pass the response to the client
    // while simultaneously intercepting and accumulating the text for database logging.
    const stream = new ReadableStream({
      async start(controller) {
        const reader = geminiResponse.body!.getReader();
        const decoder = new TextDecoder("utf-8");
        let fullText = "";
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Enqueue the raw chunk to the client immediately
            controller.enqueue(value);

            // Decode and parse the SSE chunk to accumulate the text
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            // Keep the last partial line in the buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ") && line.trim() !== "data:") {
                try {
                  const jsonData = JSON.parse(line.slice(6));
                  const text = jsonData.candidates?.[0]?.content?.parts?.[0]?.text || "";
                  fullText += text;
                } catch (e) {
                  // Ignore JSON parse errors for incomplete or empty data lines
                }
              }
            }
          }
          controller.close();

          // After stream completes successfully, save the interaction to the database
          if (fullText.trim().length > 0) {
            await db
              .insertInto("interactions")
              .values({
                id: crypto.randomUUID(),
                mode: "smart",
                type: "question",
                userInput: data.message,
                systemResponse: fullText,
              })
              .execute();
          }
        } catch (err) {
          controller.error(err);
          console.error("Stream processing error:", err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: message }), { status: 400 });
  }
}