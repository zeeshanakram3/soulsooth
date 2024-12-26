import { createMeditationAction } from "@/actions/db/meditations-actions"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

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

    // Generate meditation script using GPT-4o-mini
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a meditation guide. Generate a calming and personalized meditation script based on the user's current emotional state or needs. The script should be about 30 seconds long when read aloud. So just 3 lines should be enough. Focus on breathing, mindfulness, and addressing their specific situation."
        },
        {
          role: "user",
          content: userInput
        }
      ]
    })

    const meditationScript = completion.choices[0]?.message?.content

    if (!meditationScript) {
      return NextResponse.json(
        { error: "Failed to generate meditation script" },
        {
          status: 500
        }
      )
    }

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
