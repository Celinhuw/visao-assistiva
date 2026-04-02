import { schema, OutputType } from "./list_GET.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { NotAuthenticatedError } from "../../helpers/getSetServerSession";

export async function handle(request: Request) {
  try {
    // Authenticate user
    await getServerUserSession(request);

    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const query = schema.parse(queryParams);

    let dataQuery = db.selectFrom("interactions").selectAll();
    let countQuery = db.selectFrom("interactions").select(({ fn }) => fn.count<string>("id").as("total"));

    if (query.mode) {
      dataQuery = dataQuery.where("mode", "=", query.mode);
      countQuery = countQuery.where("mode", "=", query.mode);
    }

    if (query.type) {
      dataQuery = dataQuery.where("type", "=", query.type);
      countQuery = countQuery.where("type", "=", query.type);
    }

    const [interactions, totalResult] = await Promise.all([
      dataQuery
        .orderBy("createdAt", "desc")
        .limit(query.limit)
        .offset(query.offset)
        .execute(),
      countQuery.executeTakeFirst(),
    ]);

    const total = totalResult ? Number(totalResult.total) : 0;

    return new Response(
      superjson.stringify({ interactions, total } satisfies OutputType),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return new Response(superjson.stringify({ error: "Not authenticated" }), { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(superjson.stringify({ error: message }), { status: 400 });
  }
}