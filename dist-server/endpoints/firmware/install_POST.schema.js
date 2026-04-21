import { z } from "zod";
import superjson from 'superjson';
export const schema = z.object({
    firmwareId: z.string().min(1, "Firmware ID is required"),
});
export const postFirmwareInstall = async (body, init) => {
    const validatedInput = schema.parse(body);
    const result = await fetch(`/_api/firmware/install`, {
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
