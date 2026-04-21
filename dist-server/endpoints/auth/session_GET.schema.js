import { z } from "zod";
// no schema, just a simple GET request
export const schema = z.object({});
export const getSession = async (body = {}, init) => {
    const result = await fetch(`/_api/auth/session`, {
        method: "GET",
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });
    return result.json();
};
