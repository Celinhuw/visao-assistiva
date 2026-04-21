// adapt this to your database schema
import { db } from "../../helpers/db.js";
import { getServerSessionOrThrow, clearServerSession, NotAuthenticatedError, } from "../../helpers/getSetServerSession.js";
export async function handle(request) {
    try {
        // Get the current session
        const session = await getServerSessionOrThrow(request);
        // Delete the session from the database
        await db.deleteFrom("sessions").where("id", "=", session.id).execute();
        // Create response with success message
        const response = Response.json({
            success: true,
            message: "Logged out successfully",
        });
        clearServerSession(response);
        return response;
    }
    catch (error) {
        if (error instanceof NotAuthenticatedError) {
            return Response.json({ error: "Not authenticated" }, { status: 401 });
        }
        console.error("Logout error:", error);
        return Response.json({
            error: "Logout failed",
            message: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 });
    }
}
