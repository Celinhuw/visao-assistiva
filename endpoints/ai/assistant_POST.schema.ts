import { z } from "zod";
import superjson from "superjson";

export const MessageRoleArrayValues = ["user", "model"] as const;

export const schema = z.object({
  message: z.string().min(1, "Mensagem não pode estar vazia"),
  imageBase64: z.string().optional(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(MessageRoleArrayValues),
        text: z.string(),
      })
    )
    .optional(),
});

export type InputType = z.infer<typeof schema>;

// We don't define an OutputType because the output is a streaming Response (text/event-stream)
// To interact with this endpoint, we'll use raw fetch in the frontend hook to process the stream chunks.

export const postAssistantApiUrl = "/_api/ai/assistant";