import { z } from "zod";
import superjson from 'superjson';
import type { Selectable } from "kysely";
import type { FirmwareVersions } from "../../helpers/schema.js";

export const schema = z.object({
  firmwareId: z.string().min(1, "Firmware ID is required"),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = Selectable<FirmwareVersions>;

export const postFirmwareInstall = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
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
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error);
  }
  return superjson.parse<OutputType>(await result.text());
};