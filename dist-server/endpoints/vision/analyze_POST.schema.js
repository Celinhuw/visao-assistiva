import { z } from "zod";
import superjson from "superjson";
export const schema = z.object({
    imageBase64: z.string().min(1, "Imagem é obrigatória"),
    mode: z.enum(["full", "smart"]),
    previousContext: z.string().optional(),
    language: z.string().default("pt-BR").optional(),
});
export const postVisionAnalyze = async (body, init) => {
    const validatedInput = schema.parse(body);
    const result = await fetch(`/_api/vision/analyze`, {
        method: "POST",
        body: superjson.stringify(validatedInput),
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });
    if (!result.ok) {
        const errorObject = superjson.parse(await result.text());
        throw new Error(errorObject.error);
    }
    return superjson.parse(await result.text());
};
