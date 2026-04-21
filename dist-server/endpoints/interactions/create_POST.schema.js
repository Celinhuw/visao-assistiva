import { z } from "zod";
import superjson from "superjson";
import { VisionModeArrayValues, InteractionTypeArrayValues } from "../../helpers/schema.js";
export const schema = z.object({
    mode: z.enum(VisionModeArrayValues),
    type: z.enum(InteractionTypeArrayValues),
    userInput: z.string().optional(),
    systemResponse: z.string(),
    confidence: z.number().min(0).max(1).optional(),
});
export const postInteractionsCreate = async (body, init) => {
    const validatedInput = schema.parse(body);
    const result = await fetch(`/_api/interactions/create`, {
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
