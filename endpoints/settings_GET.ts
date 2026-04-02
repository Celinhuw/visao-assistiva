import { OutputType } from "./settings_GET.schema";
import superjson from "superjson";
import { db } from "../helpers/db";
import { getServerUserSession } from "../helpers/getServerUserSession";
import { NotAuthenticatedError } from "../helpers/getSetServerSession";

export async function handle(request: Request) {
  try {
    // Authenticate user
    await getServerUserSession(request);

    let settings = await db
      .selectFrom("settings")
      .selectAll()
      .where("id", "=", "default")
      .executeTakeFirst();

    if (!settings) {
      settings = await db
        .insertInto("settings")
        .values({
          id: "default",
          audioVolume: 50,
          speechRate: "normal",
          voiceType: "feminine",
          defaultVisionMode: "smart",
          updateIntervalMs: 1000,
          headRotationThreshold: 15,
          confidenceThreshold: 0.7,
          alertPriority: true,
          vibrationFeedback: true,
          updatedAt: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    }

    return new Response(superjson.stringify(settings satisfies OutputType));
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return new Response(superjson.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: message }), { status: 400 });
  }
}
