import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Settings, SpeechRateArrayValues, VoiceTypeArrayValues, VisionModeArrayValues } from "../../helpers/schema.js";

export const schema = z.object({
  audioVolume: z.number().min(0).max(100).optional(),
  speechRate: z.enum(SpeechRateArrayValues).optional(),
  voiceType: z.enum(VoiceTypeArrayValues).optional(),
  defaultVisionMode: z.enum(VisionModeArrayValues).optional(),
  updateIntervalMs: z.number().positive().optional(),
  headRotationThreshold: z.number().positive().optional(),
  confidenceThreshold: z.number().min(0).max(1).optional(),
  alertPriority: z.boolean().optional(),
  vibrationFeedback: z.boolean().optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = Selectable<Settings>;

export const postUpdateSettings = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/settings/update`, {
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