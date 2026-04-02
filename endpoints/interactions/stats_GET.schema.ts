import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  totalInteractions: number;
  todayInteractions: number;
  byMode: {
    full: number;
    smart: number;
  };
  byType: {
    description: number;
    question: number;
    alert: number;
    command: number;
  };
  avgConfidence: number;
};

export const getInteractionsStats = async (
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/interactions/stats`, {
    method: "GET",
    ...init,
    headers: {
      "Accept": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!result.ok) {
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error);
  }

  return superjson.parse<OutputType>(await result.text());
};