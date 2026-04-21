import { db } from "../../helpers/db.js";
import { sql } from "kysely";

export async function handle(request: Request) {
  const secret = request.headers.get("x-migrate-secret");
  if (secret !== "visao-migrate-2026") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const results: string[] = [];

    for (const [enumName, values] of [
      ["user_role", ["admin", "user"]],
      ["vision_mode", ["full", "smart"]],
      ["interaction_type", ["alert", "command", "description", "question"]],
      ["speech_rate", ["fast", "normal", "slow"]],
      ["voice_type", ["feminine", "masculine"]],
      ["firmware_status", ["available", "downloading", "installed", "installing"]],
    ] as [string, string[]][]) {
      const enumVals = values.map(v => `'${v}'`).join(", ");
      await sql.raw(`DO $$ BEGIN CREATE TYPE ${enumName} AS ENUM (${enumVals}); EXCEPTION WHEN duplicate_object THEN NULL; END $$`).execute(db);
      results.push(`${enumName} OK`);
    }

    const tables = [
      `CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, display_name TEXT NOT NULL, avatar_url TEXT, role user_role NOT NULL DEFAULT 'user', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
      `CREATE TABLE IF NOT EXISTS user_passwords (user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, password_hash TEXT NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), last_accessed TIMESTAMPTZ NOT NULL DEFAULT NOW(), expires_at TIMESTAMPTZ NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS login_attempts (id SERIAL PRIMARY KEY, email TEXT NOT NULL, attempted_at TIMESTAMPTZ DEFAULT NOW(), success BOOLEAN DEFAULT FALSE)`,
      `CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, default_vision_mode vision_mode NOT NULL DEFAULT 'smart', audio_volume INTEGER NOT NULL DEFAULT 80, speech_rate speech_rate NOT NULL DEFAULT 'normal', voice_type voice_type NOT NULL DEFAULT 'feminine', vibration_feedback BOOLEAN NOT NULL DEFAULT TRUE, alert_priority BOOLEAN NOT NULL DEFAULT TRUE, confidence_threshold FLOAT NOT NULL DEFAULT 0.7, update_interval_ms INTEGER NOT NULL DEFAULT 1000, head_rotation_threshold FLOAT NOT NULL DEFAULT 15.0, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
      `CREATE TABLE IF NOT EXISTS interactions (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, type interaction_type NOT NULL, mode vision_mode NOT NULL, user_input TEXT, system_response TEXT NOT NULL, confidence FLOAT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
      `CREATE TABLE IF NOT EXISTS firmware_versions (id TEXT PRIMARY KEY, version TEXT NOT NULL, changelog TEXT NOT NULL, release_date TIMESTAMPTZ NOT NULL, size_mb FLOAT NOT NULL, status firmware_status NOT NULL DEFAULT 'available', installed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
    ];

    for (const ddl of tables) {
      await sql.raw(ddl).execute(db);
      const name = ddl.match(/TABLE IF NOT EXISTS (\w+)/)?.[1] ?? "?";
      results.push(`${name} OK`);
    }

    return Response.json({ ok: true, results });
  } catch (error: unknown) {
    console.error("Migration error:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
