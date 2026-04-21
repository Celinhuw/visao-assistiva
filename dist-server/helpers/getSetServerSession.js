import { jwtVerify, SignJWT } from "jose";
const encoder = new TextEncoder();
const secret = process.env.JWT_SECRET;
// Validate at startup that JWT_SECRET is configured
if (!secret || secret === "... fill this up ...") {
    throw new Error("JWT_SECRET environment variable is not configured. Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"");
}
export const SessionExpirationSeconds = 60 * 60 * 24 * 7; // 1 week
// Probability to run cleanup (10%)
export const CleanupProbability = 0.1;
const CookieName = "floot_built_app_session";
export class NotAuthenticatedError extends Error {
    constructor(message) {
        super(message ?? "Not authenticated");
        this.name = "NotAuthenticatedError";
    }
}
/**
 * Returns the user session or throw an error. Make sure to handle the error (return a proper request)
 */
export async function getServerSessionOrThrow(request) {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookieHeader
        .split(";")
        .reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split("=");
        if (name && value) {
            cookies[name] = decodeURIComponent(value);
        }
        return cookies;
    }, {});
    const sessionCookie = cookies[CookieName];
    if (!sessionCookie) {
        throw new NotAuthenticatedError();
    }
    try {
        const { payload } = await jwtVerify(sessionCookie, encoder.encode(secret));
        return {
            id: payload.id,
            createdAt: payload.createdAt,
            lastAccessed: payload.lastAccessed,
            passwordChangeRequired: payload.passwordChangeRequired,
        };
    }
    catch (error) {
        throw new NotAuthenticatedError();
    }
}
export async function setServerSession(response, session) {
    const token = await new SignJWT({
        id: session.id,
        createdAt: session.createdAt,
        lastAccessed: session.lastAccessed,
        passwordChangeRequired: session.passwordChangeRequired,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encoder.encode(secret));
    const cookieValue = [
        `${CookieName}=${token}`,
        "HttpOnly",
        "Secure",
        "SameSite=Lax",
        "Path=/",
        `Max-Age=${SessionExpirationSeconds}`,
    ].join("; ");
    response.headers.set("Set-Cookie", cookieValue);
}
export function clearServerSession(response) {
    const cookieValue = [
        `${CookieName}=`,
        "HttpOnly",
        "Secure",
        "SameSite=Lax",
        "Path=/",
        "Max-Age=0",
    ].join("; ");
    response.headers.set("Set-Cookie", cookieValue);
}
