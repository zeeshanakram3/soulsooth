import { createMeditationAction } from "@/actions/db/meditations-actions"
import { MeditationScript } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import OpenAI from "openai"
import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Default background music volume (0-1)
const DEFAULT_MUSIC_VOLUME = 0.3

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

    const { userInput, musicVolume = DEFAULT_MUSIC_VOLUME } = await req.json()
    if (!userInput) {
      return NextResponse.json(
        { error: "User input is required" },
        {
          status: 400
        }
      )
    }

    // Validate music volume
    const validatedVolume = Math.max(0, Math.min(1, Number(musicVolume)))

    // Generate structured meditation script using GPT-4o-mini
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a meditation guide. Generate a structured meditation script based on the user's current emotional state or needs.
          The script should be formatted as JSON with the following structure:
          {
            "title": "string",
            "segments": [
              {
                "type": "speech",
                "content": "string"
              },
              {
                "type": "pause",
                "duration": 10
              }
            ]
          }
          Rules:
          - The total meditation should be about 30 seconds when read aloud
          - Include 2-3 speech segments with a pause between each
          - Each pause should be 10 seconds
          - Speech segments should be calming and focused on breathing and mindfulness
          - Address their specific situation in the content
          - Return ONLY valid JSON, no other text`
        },
        {
          role: "user",
          content: userInput
        }
      ],
      response_format: { type: "json_object" }
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

    // Parse and validate the meditation script
    let parsedScript: MeditationScript
    try {
      parsedScript = JSON.parse(meditationScript)
      if (!parsedScript.title || !Array.isArray(parsedScript.segments)) {
        throw new Error("Invalid script format")
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid meditation script format" },
        {
          status: 500
        }
      )
    }

    // Create public/audio directory if it doesn't exist
    const audioDir = path.join(process.cwd(), "public", "audio")
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true })
    }

    // Generate a unique base filename
    const baseFilename = `meditation-${Date.now()}`

    // Process each segment
    const segmentFiles: string[] = []
    for (let i = 0; i < parsedScript.segments.length; i++) {
      const segment = parsedScript.segments[i]
      const segmentPath = path.join(
        audioDir,
        `${baseFilename}-segment-${i}.mp3`
      )

      if (segment.type === "speech") {
        // Generate speech audio for speech segments
        const mp3 = await openai.audio.speech.create({
          model: "tts-1",
          voice: "alloy",
          input: segment.content
        })
        const buffer = Buffer.from(await mp3.arrayBuffer())
        const tempPath = path.join(audioDir, `${baseFilename}-temp-${i}.mp3`)
        fs.writeFileSync(tempPath, buffer)

        // Normalize the audio properties
        await execAsync(
          `ffmpeg -i "${tempPath}" -ar 44100 -ac 2 -b:a 192k "${segmentPath}"`
        )
        fs.unlinkSync(tempPath)
      } else if (segment.type === "pause") {
        // Generate silence with matching audio properties
        await execAsync(
          `ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t ${segment.duration} -b:a 192k -ar 44100 -ac 2 "${segmentPath}"`
        )
      }
      segmentFiles.push(segmentPath)
    }

    // Create a file list for ffmpeg
    const concatListPath = path.join(audioDir, `${baseFilename}-list.txt`)
    const concatList = segmentFiles.map(file => `file '${file}'`).join("\n")
    fs.writeFileSync(concatListPath, concatList)

    // First combine all meditation segments
    const meditationPath = path.join(audioDir, `${baseFilename}-meditation.mp3`)
    await execAsync(
      `ffmpeg -f concat -safe 0 -i "${concatListPath}" -ar 44100 -ac 2 -b:a 192k "${meditationPath}"`
    )

    // Calculate total duration of meditation
    const { stdout: durationStr } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${meditationPath}"`
    )
    const duration = parseFloat(durationStr)

    // Get background music path
    const bgMusicPath = path.join(
      process.cwd(),
      "public",
      "background",
      "background-music.mp3"
    )

    // Create a trimmed version of the background music that matches meditation length
    const trimmedMusicPath = path.join(audioDir, `${baseFilename}-music.mp3`)
    await execAsync(
      `ffmpeg -i "${bgMusicPath}" -t ${duration} -ar 44100 -ac 2 "${trimmedMusicPath}"`
    )

    // Mix meditation audio with background music
    const finalPath = path.join(audioDir, `${baseFilename}.mp3`)
    await execAsync(
      `ffmpeg -i "${meditationPath}" -i "${trimmedMusicPath}" -filter_complex "[1:a]volume=${validatedVolume}[m];[0:a][m]amix=inputs=2:duration=longest" -ar 44100 -ac 2 "${finalPath}"`
    )

    // Clean up intermediate files
    segmentFiles.forEach(file => fs.unlinkSync(file))
    fs.unlinkSync(concatListPath)
    fs.unlinkSync(meditationPath)
    fs.unlinkSync(trimmedMusicPath)

    // Get the relative path to the final audio file
    const audioPath = `/audio/${baseFilename}.mp3`

    const result = await createMeditationAction({
      userId,
      userInput,
      meditationScript: parsedScript,
      audioFilePath: audioPath
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
