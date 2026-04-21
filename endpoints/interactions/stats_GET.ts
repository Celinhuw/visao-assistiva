import { OutputType } from "./stats_GET.schema.js";
import superjson from "superjson";
import { db } from "../../helpers/db.js";
import { getServerUserSession } from "../../helpers/getServerUserSession.js";
import { NotAuthenticatedError } from "../../helpers/getSetServerSession.js";

export async function handle(request: Request) {
  try {
    // Authenticate user
    await getServerUserSession(request);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalAndAvg, todayCount, modeCounts, typeCounts] = await Promise.all([
      db
        .selectFrom("interactions")
        .select(({ fn }) => [
          fn.count<string>("id").as("total"),
          fn.avg<number | string>("confidence").as("avgConfidence"),
        ])
        .executeTakeFirst(),

      db
        .selectFrom("interactions")
        .select(({ fn }) => fn.count<string>("id").as("today"))
        .where("createdAt", ">=", todayStart)
        .executeTakeFirst(),

      db
        .selectFrom("interactions")
        .select(["mode", ({ fn }) => fn.count<string>("id").as("count")])
        .groupBy("mode")
        .execute(),

      db
        .selectFrom("interactions")
        .select(["type", ({ fn }) => fn.count<string>("id").as("count")])
        .groupBy("type")
        .execute(),
    ]);

    const stats: OutputType = {
      totalInteractions: totalAndAvg ? Number(totalAndAvg.total) : 0,
      todayInteractions: todayCount ? Number(todayCount.today) : 0,
      avgConfidence: totalAndAvg?.avgConfidence ? Number(totalAndAvg.avgConfidence) : 0,
      byMode: {
        full: 0,
        smart: 0,
      },
      byType: {
        description: 0,
        question: 0,
        alert: 0,
        command: 0,
      },
    };

    modeCounts.forEach((row) => {
      if (row.mode === "full" || row.mode === "smart") {
        stats.byMode[row.mode] = Number(row.count);
      }
    });

    typeCounts.forEach((row) => {
      if (
        row.type === "description" ||
        row.type === "question" ||
        row.type === "alert" ||
        row.type === "command"
      ) {
        stats.byType[row.type] = Number(row.count);
      }
    });

    return new Response(superjson.stringify(stats satisfies OutputType), {
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