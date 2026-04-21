import superjson from 'superjson';
import { db } from "../../helpers/db.js";
import { getServerUserSession } from "../../helpers/getServerUserSession.js";
import { NotAuthenticatedError } from "../../helpers/getSetServerSession.js";
export async function handle(request) {
    try {
        // Authenticate user
        await getServerUserSession(request);
        const versions = await db
            .selectFrom("firmwareVersions")
            .selectAll()
            .orderBy("releaseDate", "desc")
            .execute();
        const currentVersion = versions.find(v => v.status === "installed") || null;
        return new Response(superjson.stringify({
            versions,
            currentVersion
        }));
    }
    catch (error) {
        if (error instanceof NotAuthenticatedError) {
            return new Response(superjson.stringify({ error: "Not authenticated" }), { status: 401 });
        }
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return new Response(superjson.stringify({ error: errorMessage }), { status: 500 });
    }
}
