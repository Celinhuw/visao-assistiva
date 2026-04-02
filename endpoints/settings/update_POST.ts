import { schema, OutputType } from "./update_POST.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { NotAuthenticatedError } from "../../helpers/getSetServerSession";

export async function handle(request: Request) {
  try {
    // Authenticate user
    const { user } = await getServerUserSession(request);

    // Only admins can update settings
    if (user.role !== "admin") {
      return new Response(superjson.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const json = superjson.parse(await request.text());
    const result = schema.parse(json);

    if (Object.keys(result).length === 0) {
      const current = await db
        .selectFrom("settings")
        .selectAll()
        .where("id", "=", "default")
        .executeTakeFirst();
        
      if (!current) {
        throw new Error("Settings not found");
      }
      return new Response(superjson.stringify(current satisfies OutputType));
    }

    const updatedSettings = await db
      .updateTable("settings")
      .set({
        ...result,
        updatedAt: new Date(),
      })
      .where("id", "=", "default")
      .returningAll()
      .executeTakeFirst();

    if (!updatedSettings) {
      throw new Error("Settings not found to update");
    }

    return new Response(superjson.stringify(updatedSettings satisfies OutputType));
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return new Response(superjson.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: message }), { status: 400 });
  }
}
