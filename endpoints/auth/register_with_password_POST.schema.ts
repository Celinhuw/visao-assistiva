import { z } from "zod";
import { User } from "../../helpers/User";

export const schema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Por favor, informe seu email" })
    .email({ message: "Por favor, informe um email válido" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  displayName: z
    .string()
    .trim()
    .min(1, { message: "Por favor, informe seu nome" })
    .max(100, { message: "Nome muito longo" }),
});

export type OutputType = {
  user: User;
};

export const postRegister = async (
  body: z.infer<typeof schema>,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/auth/register_with_password`, {
    method: "POST",
    body: JSON.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: "include",
  });

  if (!result.ok) {
    const errorData = await result.json();
    throw new Error(errorData.message || "Falha no cadastro");
  }

  return result.json();
};
