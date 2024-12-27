import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const meditationsTable = pgTable("meditations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  userInput: text("user_input").notNull(),
  meditationScript: jsonb("meditation_script").notNull(),
  audioFilePath: text("audio_file_path"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export interface MeditationScript {
  title: string
  targetWordCount: number
  actualWordCount: number
  durationMinutes: number
  segments: Array<
    | {
        type: "speech"
        content: string
        wordCount: number
        duration: number
      }
    | {
        type: "pause"
        duration: number
      }
  >
}

export type InsertMeditation = typeof meditationsTable.$inferInsert
export type SelectMeditation = typeof meditationsTable.$inferSelect
