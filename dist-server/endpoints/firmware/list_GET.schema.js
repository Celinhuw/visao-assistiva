import { z } from "zod";
import superjson from 'superjson';
export const schema = z.object({});
export const getFirmwareList = async (init) => {
    const result = await fetch(`/_api/firmware/list`, {
        method: "GET",
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
