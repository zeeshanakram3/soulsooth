"use server"

import { db } from "@/db/db"
import { InsertMeditation, SelectMeditation, meditationsTable } from "@/db/schema"
import { ActionState } from "@/types/server-action-types"
import { eq } from "drizzle-orm"

export async function createMeditationAction(
  meditation: InsertMeditation
): Promise<ActionState<SelectMeditation>> {
  try {
    const [newMeditation] = await db
      .insert(meditationsTable)
      .values(meditation)
      .returning()

    return {
      isSuccess: true,
      message: "Meditation created successfully",
      data: newMeditation
    }
  } catch (error) {
    console.error("Error creating meditation:", error)
    return { isSuccess: false, message: "Failed to create meditation" }
  }
}

export async function getMeditationAction(
  id: string
): Promise<ActionState<SelectMeditation>> {
  try {
    const meditation = await db.query.meditations.findFirst({
      where: eq(meditationsTable.id, id)
    })

    if (!meditation) {
      return {
        isSuccess: false,
        message: "Meditation not found"
      }
    }

    return {
      isSuccess: true,
      message: "Meditation retrieved successfully",
      data: meditation
    }
  } catch (error) {
    console.error("Error getting meditation:", error)
    return { isSuccess: false, message: "Failed to get meditation" }
  }
} 