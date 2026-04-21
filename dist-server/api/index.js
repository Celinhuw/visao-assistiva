import { Hono } from "hono";
import { handle } from "hono/vercel";
const app = new Hono().basePath("/");
async function routeHandler(c, importFn) {
    try {
        const mod = await importFn();
        const response = await mod.handle(c.req.raw);
        if (!(response instanceof Response) && response.constructor.name !== "Response") {
            return c.json({ message: "Invalid response format" }, 500);
        }
        return response;
    }
    catch (e) {
        console.error(e);
        return c.json({
            message: e?.message || "Error",
        }, 500);
    }
}
app.get("/_api/settings", (c) => routeHandler(c, () => import("../endpoints/settings_GET.js")));
app.post("/_api/auth/logout", (c) => routeHandler(c, () => import("../endpoints/auth/logout_POST.js")));
app.get("/_api/auth/session", (c) => routeHandler(c, () => import("../endpoints/auth/session_GET.js")));
app.post("/_api/ai/assistant", (c) => routeHandler(c, () => import("../endpoints/ai/assistant_POST.js")));
app.get("/_api/firmware/list", (c) => routeHandler(c, () => import("../endpoints/firmware/list_GET.js")));
app.post("/_api/vision/analyze", (c) => routeHandler(c, () => import("../endpoints/vision/analyze_POST.js")));
app.post("/_api/settings/update", (c) => routeHandler(c, () => import("../endpoints/settings/update_POST.js")));
app.post("/_api/firmware/install", (c) => routeHandler(c, () => import("../endpoints/firmware/install_POST.js")));
app.get("/_api/interactions/list", (c) => routeHandler(c, () => import("../endpoints/interactions/list_GET.js")));
app.get("/_api/interactions/stats", (c) => routeHandler(c, () => import("../endpoints/interactions/stats_GET.js")));
app.post("/_api/interactions/create", (c) => routeHandler(c, () => import("../endpoints/interactions/create_POST.js")));
app.post("/_api/auth/login_with_password", (c) => routeHandler(c, () => import("../endpoints/auth/login_with_password_POST.js")));
app.post("/_api/auth/register_with_password", (c) => routeHandler(c, () => import("../endpoints/auth/register_with_password_POST.js")));
export const GET = handle(app);
export const POST = handle(app);
