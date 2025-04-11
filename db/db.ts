/*
<ai_context>
Initializes the database connection and schema for the app.
</ai_context>
*/

import { meditationsTable, profilesTable } from "@/db/schema"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString)

const schema = {
  profiles: profilesTable,
  meditations: meditationsTable
}

export const db = drizzle(client, { schema })
