import { z } from "zod";
import superjson from "superjson";
import { VisionModeArrayValues, InteractionTypeArrayValues } from "../../helpers/schema.js";
export const schema = z.object({
    mode: z.enum(VisionModeArrayValues).optional(),
    type: z.enum(InteractionTypeArrayValues).optional(),
    limit: z.coerce.number().min(1).max(100).default(50),
    offset: z.coerce.number().min(0).default(0),
});
export const getInteractionsList = async (query, init) => {
    const validatedQuery = schema.parse(query);
    const searchParams = new URLSearchParams();
    if (validatedQuery.mode)
        searchParams.set("mode", validatedQuery.mode);
    if (validatedQuery.type)
        searchParams.set("type", validatedQuery.type);
    searchParams.set("limit", validatedQuery.limit.toString());
    searchParams.set("offset", validatedQuery.offset.toString());
    const result = await fetch(`/_api/interactions/list?${searchParams.toString()}`, {
        method: "GET",
        ...init,
        headers: {
            "Accept": "application/json",
            ...(init?.headers ?? {}),
        },
    });
    if (!result.ok) {
        const errorObject = superjson.parse(await result.text());
        throw new Error(errorObject.error);
    }
    return superjson.parse(await result.text());
};
