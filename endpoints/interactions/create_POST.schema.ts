import { z } from "zod";
import superjson from "superjson";
import { VisionModeArrayValues, InteractionTypeArrayValues } from "../../helpers/schema";
import type { Selectable } from "kysely";
import type { Interactions } from "../../helpers/schema";

export const schema = z.object({
  mode: z.enum(VisionModeArrayValues),
  type: z.enum(InteractionTypeArrayValues),
  userInput: z.string().optional(),
  systemResponse: z.string(),
  confidence: z.number().min(0).max(1).optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = Selectable<Interactions>;

export const postInteractionsCreate = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
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
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error);
  }

  return superjson.parse<OutputType>(await result.text());
};