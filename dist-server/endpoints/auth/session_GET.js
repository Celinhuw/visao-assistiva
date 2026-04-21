import { setServerSession, NotAuthenticatedError, } from "../../helpers/getSetServerSession.js";
import { getServerUserSession } from "../../helpers/getServerUserSession.js";
export async function handle(request) {
    try {
        const { user, session } = await getServerUserSession(request);
        // Create response with user data
        const response = Response.json({
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl,
                role: user.role,
            },
        });
        // Update the session cookie with the new lastAccessed time
        await setServerSession(response, {
            id: session.id,
            createdAt: session.createdAt,
            lastAccessed: session.lastAccessed.getTime(),
        });
        return response;
    }
    catch (error) {
        if (error instanceof NotAuthenticatedError) {
            return Response.json({ error: "Not authenticated" }, { status: 401 });
        }
        console.error("Session validation error:", error);
        return Response.json({ error: "Session validation failed" }, { status: 400 });
    }
}
