import { db } from "../../helpers/db";
import { schema } from "./register_with_password_POST.schema";
import { randomBytes } from "crypto";
import {
  setServerSession,
  SessionExpirationSeconds,
} from "../../helpers/getSetServerSession";
import { generatePasswordHash } from "../../helpers/generatePasswordHash";

export async function handle(request: Request) {
  try {
    const json = await request.json();
    const { email, password, displayName } = schema.parse(json);

    // Normalize email to lowercase for consistent handling
    const normalizedEmail = email.toLowerCase().trim();

    const passwordHash = await generatePasswordHash(password);

    // Create new user inside a transaction
    // The UNIQUE constraint on users.email handles the race condition atomically
    const newUser = await db.transaction().execute(async (trx) => {
      let user;
      try {
        [user] = await trx
          .insertInto("users")
          .values({
            email: normalizedEmail,
            displayName: displayName.trim(),
            role: "user",
          })
          .returning(["id", "email", "displayName", "createdAt"])
          .execute();
      } catch (err: unknown) {
        // PostgreSQL unique violation error code
        const pgErr = err as { code?: string };
        if (pgErr?.code === "23505") {
          throw new ConflictError("email already in use");
        }
        throw err;
      }

      await trx
        .insertInto("userPasswords")
        .values({
          userId: user.id,
          passwordHash,
        })
        .execute();

      return user;
    });

    const sessionId = randomBytes(32).toString("hex");
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SessionExpirationSeconds * 1000);

    await db
      .insertInto("sessions")
      .values({
        id: sessionId,
        userId: newUser.id,
        createdAt: now,
        lastAccessed: now,
        expiresAt,
      })
      .execute();

    const response = Response.json({
      user: {
        ...newUser,
        role: "user" as const,
      },
    });

    await setServerSession(response, {
      id: sessionId,
      createdAt: now.getTime(),
      lastAccessed: now.getTime(),
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof ConflictError) {
      return Response.json({ message: error.message }, { status: 409 });
    }
    console.error("Registration error:", error);
    return Response.json({ message: "Registration failed" }, { status: 400 });
  }
}

class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}
