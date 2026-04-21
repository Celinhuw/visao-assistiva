import { z } from "zod";
// No input required for logout
export const schema = z.object({});
export const postLogout = async (body = {}, init) => {
    const result = await fetch(`/_api/auth/logout`, {
        method: "POST",
        body: JSON.stringify(body),
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });
    return result.json();
};
