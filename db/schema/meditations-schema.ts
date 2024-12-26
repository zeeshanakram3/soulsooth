import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const meditationsTable = pgTable("meditations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  userInput: text("user_input").notNull(),
  meditationScript: text("meditation_script").notNull(),
  audioFilePath: text("audio_file_path"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertMeditation = typeof meditationsTable.$inferInsert
export type SelectMeditation = typeof meditationsTable.$inferSelect
