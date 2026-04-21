import { z } from "zod";
import superjson from "superjson";
export const schema = z.object({});
export const getInteractionsStats = async (init) => {
    const result = await fetch(`/_api/interactions/stats`, {
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
