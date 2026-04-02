import { z } from "zod";
import superjson from 'superjson';
import type { Selectable } from "kysely";
import type { FirmwareVersions } from "../../helpers/schema";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  versions: Selectable<FirmwareVersions>[];
  currentVersion: Selectable<FirmwareVersions> | null;
};

export const getFirmwareList = async (init?: RequestInit): Promise<OutputType> => {
  const result = await fetch(`/_api/firmware/list`, {
    method: "GET",
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