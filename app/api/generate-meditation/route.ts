import { createMeditationAction } from "@/actions/db/meditations-actions"
import { MeditationScript } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
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

// Helper to send progress updates
function sendUpdate(
  stream: TransformStream<Uint8Array, Uint8Array>["writable"],
  update: any
) {
  const encoder = new TextEncoder()
  const writer = stream.getWriter()
  writer.write(encoder.encode(JSON.stringify(update) + "\n"))
  writer.releaseLock()
}

export async function POST(req: Request) {
  const startTime = Date.now()
  let stepStartTime = startTime

  // Create a transform stream for sending updates
  const stream = new TransformStream()
  const response = new Response(stream.readable, {
    headers: { "Content-Type": "text/event-stream" }
  })

  // Process in background
  const process = async () => {
    try {
      // Auth check
      const session = await auth()
      const userId = session?.userId

      if (!userId) {
        throw new Error("Unauthorized")
      }

      // Input validation and preparation
      const {
        userInput,
        musicVolume = DEFAULT_MUSIC_VOLUME,
        durationMinutes = 5
      } = await req.json()

      if (!userInput) {
        throw new Error("User input is required")
      }

      // Validate music volume and duration
      const validatedVolume = Math.max(0, Math.min(1, Number(musicVolume)))
      const validatedDuration = Math.max(
        1,
        Math.min(10, Number(durationMinutes))
      )

      // Calculate target word count and segments based on duration
      const targetWordCount = validatedDuration * 150
      const totalSeconds = validatedDuration * 60
      const silenceSeconds = totalSeconds / 2 // 50% of total time should be silence

      // Send initial progress
      sendUpdate(stream.writable, {
        type: "progress",
        step: "generating-script",
        progress: 5
      })

      // System prompt for GPT
      const systemPrompt = `You are a meditation guide. Generate a structured meditation script based on the user's current emotional state or needs.
      The script should be formatted as JSON with the following structure:
      {
        "title": "string",
        "targetWordCount": number,
        "actualWordCount": number,
        "durationMinutes": number,
        "segments": [
          {
            "type": "speech",
            "content": "string",
            "wordCount": number,
            "duration": number
          },
          {
            "type": "pause",
            "duration": number
          }
        ]
      }
      Rules:
      - Generate a ${validatedDuration}-minute meditation (${targetWordCount} total words)
      - EXACTLY 50% of the time (${silenceSeconds} seconds) must be silence, distributed across pause segments
      - Before each pause, end the speech segment with "Now, let's take a [X] second pause to [purpose]"
      - Structure segments in this pattern:
        1. Welcome and initial guidance
        2. [Announce pause duration] + Pause
        3. Deeper meditation instruction
        4. [Announce pause duration] + Pause
        5. Final guidance and positive reinforcement
      - Each minute of speech should have roughly 150 words
      - Speech segments should be calming and focused on breathing and mindfulness
      - Address their specific situation in the content
      - End with a gentle positive reinforcement that makes the user feel accomplished
      - Return ONLY valid JSON, no other text`

      // Generate script
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
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
        throw new Error("Failed to generate meditation script")
      }

      // Parse script
      const parsedScript: MeditationScript = JSON.parse(meditationScript)
      if (!parsedScript.title || !Array.isArray(parsedScript.segments)) {
        throw new Error("Invalid script format")
      }

      // Send script to frontend immediately
      sendUpdate(stream.writable, {
        type: "script",
        meditation: {
          meditationScript: parsedScript,
          audioFilePath: null
        }
      })

      // Audio directory setup
      const audioDir = path.join(globalThis.process.cwd(), "public", "audio")
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true })
      }
      const baseFilename = `meditation-${Date.now()}`

      // Process segments in parallel
      sendUpdate(stream.writable, {
        type: "progress",
        step: "generating-speech",
        progress: 20
      })

      const speechSegments = parsedScript.segments
        .map((segment, index) => ({ segment, index }))
        .filter(({ segment }) => segment.type === "speech") as Array<{
        segment: {
          type: "speech"
          content: string
          wordCount: number
          duration: number
        }
        index: number
      }>

      const pauseSegments = parsedScript.segments
        .map((segment, index) => ({ segment, index }))
        .filter(({ segment }) => segment.type === "pause") as Array<{
        segment: { type: "pause"; duration: number }
        index: number
      }>

      // Generate speech segments with progress updates
      const speechPromises = speechSegments.map(
        async ({ segment, index }, i) => {
          const segmentPath = path.join(
            audioDir,
            `${baseFilename}-segment-${index}.mp3`
          )

          const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: segment.content
          })

          const buffer = Buffer.from(await mp3.arrayBuffer())
          const tempPath = path.join(
            audioDir,
            `${baseFilename}-temp-${index}.mp3`
          )
          fs.writeFileSync(tempPath, buffer)

          await execAsync(
            `ffmpeg -i "${tempPath}" -ar 44100 -ac 2 -b:a 192k "${segmentPath}"`
          )
          fs.unlinkSync(tempPath)

          // Update progress for each speech segment
          const progress =
            20 + Math.round((40 * (i + 1)) / speechSegments.length)
          sendUpdate(stream.writable, {
            type: "progress",
            step: "generating-speech",
            progress
          })

          return { index, path: segmentPath }
        }
      )

      // Generate silence segments
      sendUpdate(stream.writable, {
        type: "progress",
        step: "generating-silence",
        progress: 65
      })

      const pausePromises = pauseSegments.map(async ({ segment, index }) => {
        const segmentPath = path.join(
          audioDir,
          `${baseFilename}-segment-${index}.mp3`
        )
        await execAsync(
          `ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t ${segment.duration} -b:a 192k -ar 44100 -ac 2 "${segmentPath}"`
        )
        return { index, path: segmentPath }
      })

      // Wait for all segments
      const [speechResults, pauseResults] = await Promise.all([
        Promise.all(speechPromises),
        Promise.all(pausePromises)
      ])

      sendUpdate(stream.writable, {
        type: "progress",
        step: "combining-audio",
        progress: 75
      })

      // Combine segments
      const allResults = [...speechResults, ...pauseResults].sort(
        (a, b) => a.index - b.index
      )
      const segmentFiles = allResults.map(r => r.path)

      const concatListPath = path.join(audioDir, `${baseFilename}-list.txt`)
      const concatList = segmentFiles.map(file => `file '${file}'`).join("\n")
      fs.writeFileSync(concatListPath, concatList)
      const meditationPath = path.join(
        audioDir,
        `${baseFilename}-meditation.mp3`
      )
      await execAsync(
        `ffmpeg -f concat -safe 0 -i "${concatListPath}" -ar 44100 -ac 2 -b:a 192k "${meditationPath}"`
      )

      // Add background music
      sendUpdate(stream.writable, {
        type: "progress",
        step: "adding-music",
        progress: 85
      })

      const bgMusicPath = path.join(
        globalThis.process.cwd(),
        "public",
        "background",
        "background-music.mp3"
      )
      const trimmedMusicPath = path.join(audioDir, `${baseFilename}-music.mp3`)
      const finalPath = path.join(audioDir, `${baseFilename}.mp3`)

      // Get duration and trim music
      const { stdout: durationStr } = await execAsync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${meditationPath}"`
      )
      const duration = parseFloat(durationStr)

      await execAsync(
        `ffmpeg -i "${bgMusicPath}" -t ${duration} -ar 44100 -ac 2 "${trimmedMusicPath}"`
      )

      // Final mix
      await execAsync(
        `ffmpeg -i "${meditationPath}" -i "${trimmedMusicPath}" -filter_complex "[1:a]volume=${validatedVolume}[m];[0:a][m]amix=inputs=2:duration=longest" -ar 44100 -ac 2 "${finalPath}"`
      )

      // Cleanup
      segmentFiles.forEach(file => fs.unlinkSync(file))
      fs.unlinkSync(concatListPath)
      fs.unlinkSync(meditationPath)
      fs.unlinkSync(trimmedMusicPath)

      // Save to database
      const audioPath = `/audio/${baseFilename}.mp3`
      const result = await createMeditationAction({
        userId,
        userInput,
        meditationScript: parsedScript,
        audioFilePath: audioPath
      })

      if (!result.isSuccess) {
        throw new Error(result.message)
      }

      // Send final update
      sendUpdate(stream.writable, {
        type: "complete",
        meditation: result.data
      })

      // Close the stream
      const writer = stream.writable.getWriter()
      await writer.close()
    } catch (error) {
      console.error("Error generating meditation:", error)
      const writer = stream.writable.getWriter()
      writer.write(
        new TextEncoder().encode(
          JSON.stringify({
            type: "error",
            message: error instanceof Error ? error.message : "Unknown error"
          }) + "\n"
        )
      )
      await writer.close()
    }
  }

  // Start processing in background
  process()

  return response
}
