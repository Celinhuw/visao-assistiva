import { z } from "zod";
export const schema = z.object({
    email: z.string().email("Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    displayName: z.string().min(1, "Name is required"),
});
export const postRegister = async (body, init) => {
    const validatedInput = schema.parse(body);
    const result = await fetch(`/_api/auth/register_with_password`, {
        method: "POST",
        body: JSON.stringify(validatedInput),
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
        credentials: "include", // Important for cookies to be sent and received
    });
    const contentType = result.headers.get("content-type") || "";
    if (!result.ok) {
        let message = "Registration failed";
        if (contentType.includes("application/json")) {
            try {
                const errorData = await result.json();
                message = errorData.message || message;
            }
            catch {
                message = await result.text();
            }
        }
        else {
            message = await result.text();
        }
        throw new Error(message);
    }
    if (contentType.includes("application/json")) {
        return result.json();
    }
    const text = await result.text();
    return JSON.parse(text);
};
