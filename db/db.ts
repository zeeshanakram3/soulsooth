/*
<ai_context>
Initializes the database connection and schema for the app.
</ai_context>
*/

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { meditationsTable, profilesTable, todosTable } from "@/db/schema"

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString)

const schema = {
  profiles: profilesTable,
  todos: todosTable,
  meditations: meditationsTable
}

export const db = drizzle(client, { schema })
