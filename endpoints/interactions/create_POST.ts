import { schema, OutputType } from "./create_POST.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { NotAuthenticatedError } from "../../helpers/getSetServerSession";

export async function handle(request: Request) {
  try {
    // Authenticate user
    await getServerUserSession(request);

    const json = superjson.parse(await request.text());
    const data = schema.parse(json);

    const interaction = await db
      .insertInto("interactions")
      .values({
        id: crypto.randomUUID(),
        mode: data.mode,
        type: data.type,
        userInput: data.userInput ?? null,
        systemResponse: data.systemResponse,
        confidence: data.confidence ?? null,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify(interaction satisfies OutputType), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return new Response(superjson.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: message }), { status: 400 });
  }
}
