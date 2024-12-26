import { createMeditationAction } from "@/actions/db/meditations-actions"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = session?.userId

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401
        }
      )
    }

    const { userInput } = await req.json()
    if (!userInput) {
      return NextResponse.json(
        { error: "User input is required" },
        {
          status: 400
        }
      )
    }

    // TODO: Replace with actual GPT-4o-mini call
    const meditationScript = `Here is a meditation for you based on your input: "${userInput}"\n\nTake a deep breath...`

    const result = await createMeditationAction({
      userId,
      userInput,
      meditationScript
    })

    if (!result.isSuccess) {
      return NextResponse.json(
        { error: result.message },
        {
          status: 500
        }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error generating meditation:", error)
    return NextResponse.json(
      { error: "Failed to generate meditation" },
      {
        status: 500
      }
    )
  }
}
