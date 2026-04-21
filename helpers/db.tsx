import { Kysely, CamelCasePlugin } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import { DB } from './schema.js'
import postgres from 'postgres'

const dbUrl = process.env.FLOOT_DATABASE_URL
const missingDbError = new Error(
  'FLOOT_DATABASE_URL environment variable is not configured. Set your PostgreSQL connection string in Vercel env vars.'
)

function createDb() {
  if (!dbUrl || dbUrl === '... fill this up ...') {
    return new Proxy({} as Kysely<DB>, {
      get() {
        return () => {
          throw missingDbError
        }
      },
    })
  }

  return new Kysely<DB>({
    plugins: [new CamelCasePlugin()],
    dialect: new PostgresJSDialect({
      postgres: postgres(dbUrl, {
        prepare: false,
        idle_timeout: 10,
        max: 3,
      }),
    }),
  })
}

export const db = createDb()
