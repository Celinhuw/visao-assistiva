import { schema, OutputType } from "./install_POST.schema.js";
import superjson from 'superjson';
import { db } from "../../helpers/db.js";
import { getServerUserSession } from "../../helpers/getServerUserSession.js";
import { NotAuthenticatedError } from "../../helpers/getSetServerSession.js";

export async function handle(request: Request) {
  try {
    // Authenticate user - only admins can install firmware
    const { user } = await getServerUserSession(request);
    
    if (user.role !== "admin") {
      return new Response(superjson.stringify({ error: "Forbidden: admin role required" }), { status: 403 });
    }

    const text = await request.text();
    const json = superjson.parse(text);
    const result = schema.parse(json);

    // Reset all other firmwares to "available" before installing new one
    await db
      .updateTable("firmwareVersions")
      .set({ status: "available", installedAt: null })
      .where("status", "=", "installed")
      .execute();

    const updatedFirmware = await db
      .updateTable("firmwareVersions")
      .set({
        status: "installed",
        installedAt: new Date()
      })
      .where("id", "=", result.firmwareId)
      .returningAll()
      .executeTakeFirst();

    if (!updatedFirmware) {
      return new Response(superjson.stringify({ error: "Firmware version not found" }), { status: 404 });
    }

    return new Response(superjson.stringify(updatedFirmware satisfies OutputType));
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return new Response(superjson.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}
