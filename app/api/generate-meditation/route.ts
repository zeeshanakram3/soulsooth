import { createMeditationAction } from "@/actions/db/meditations-actions"
import { MeditationScript } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { exec } from "child_process"
import fs from "fs"
import { cookies } from "next/headers"
import OpenAI from "openai"
import path from "path"
import { promisify } from "util"

const execAsync = promisify(exec)

// Create OpenAI client with default API key
const defaultOpenai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Default background music volume (0-1)
const DEFAULT_MUSIC_VOLUME = 0.15

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
    let writer: WritableStreamDefaultWriter<Uint8Array> | null = null
    try {
      // Auth check
      const session = await auth()
      const userId = session?.userId

      if (!userId) {
        throw new Error("Unauthorized")
      }

      // Check for personal API key
      const cookieStore = await cookies()
      const personalApiKey = cookieStore.get("openai-api-key")?.value
      const openai = personalApiKey
        ? new OpenAI({ apiKey: personalApiKey })
        : defaultOpenai

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
      - Structure segments based on duration:
        For 1-2 minutes:
        1. Welcome and initial guidance (15-20 seconds speech)
        2. Short pause (10-15 seconds)
        3. Quick guidance (15-20 seconds speech)
        4. Brief pause (10-15 seconds)
        5. Final guidance and positive reinforcement (15-20 seconds speech)

        For 5 minutes:
        1. Welcome and initial guidance (30-45 seconds speech)
        2. Short pause (15-20 seconds)
        3. Quick check-in and guidance (20-30 seconds speech)
        4. Brief pause (10-15 seconds)
        5. Deeper instruction (20-30 seconds speech)
        6. Medium pause (20-30 seconds)
        7. Gentle reminder and guidance (20-30 seconds speech)
        8. Longer centering pause (30-45 seconds)
        9. Final guidance and positive reinforcement (30-45 seconds speech)

        For 10 minutes:
        1. Welcome and initial guidance (30-45 seconds speech)
        2. Short pause (15-20 seconds)
        3. Quick check-in and guidance (20-30 seconds speech)
        4. Brief pause (10-15 seconds)
        5. Deeper instruction (20-30 seconds speech)
        6. Medium pause (20-30 seconds)
        7. Gentle reminder and guidance (20-30 seconds speech)
        8. Longer centering pause (30-45 seconds)
        9. Re-engagement and guidance (20-30 seconds speech)
        10. Brief pause (10-15 seconds)
        11. Final guidance and positive reinforcement (30-45 seconds speech)
      - Each minute of speech should have roughly 150 words
      - For 1-2 minute meditations, use 100 words per minute to keep it concise
      - Speech segments should be concise, active, and focused on the present moment
      - Keep the guidance practical and grounded:
        * Focus on tangible sensations like breathing, posture, and physical comfort
        * Use clear, simple language without metaphysical or abstract concepts
        * Avoid phrases like "energy flowing", "light filling", or similar esoteric language
        * Stick to observable experiences like breath, body sensations, and thoughts
      - Before pauses, naturally transition with phrases that indicate the pause length:
        * For short pauses (10-15s): "Let's take a brief moment to settle into this..."
        * For medium pauses (20-30s): "We'll pause here for a moment to deepen this experience..."
        * For longer pauses (30-45s): "Now we'll take a longer pause to fully absorb this..."
      - Keep instructions clear, practical, and actionable
      - Actively guide the user with frequent check-ins about physical sensations and breath
      - Address their specific situation with practical solutions
      - IMPORTANT: The meditation MUST end with a speech segment, not a pause
      - End with specific, achievable positive reinforcement
      - IMPORTANT: After the positive reinforcement, conclude with a brief casual goodbye like "Bye. See you soon." or similar short message
      - Return ONLY valid JSON, no other text`

      // Generate script
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
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

          // Get actual duration of the speech segment
          const { stdout: durationStr } = await execAsync(
            `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${segmentPath}"`
          )
          const actualDuration = parseFloat(durationStr)

          fs.unlinkSync(tempPath)

          // Update progress for each speech segment
          const progress =
            20 + Math.round((40 * (i + 1)) / speechSegments.length)
          sendUpdate(stream.writable, {
            type: "progress",
            step: "generating-speech",
            progress
          })

          return { index, path: segmentPath, duration: actualDuration }
        }
      )

      // Generate silence segments
      sendUpdate(stream.writable, {
        type: "progress",
        step: "generating-silence",
        progress: 65
      })

      // Calculate total duration and adjust pause lengths
      const [speechResults] = await Promise.all([Promise.all(speechPromises)])

      // Calculate total speech duration
      const totalSpeechDuration = speechResults.reduce(
        (sum, result) => sum + result.duration,
        0
      )
      const totalDurationSeconds = validatedDuration * 60

      // Only adjust pause durations if speech is shorter than target
      const shouldAdjustPauses = totalSpeechDuration < totalDurationSeconds
      const remainingTime = shouldAdjustPauses
        ? totalDurationSeconds - totalSpeechDuration
        : 0
      const adjustedPauseDuration =
        shouldAdjustPauses && pauseSegments.length > 0
          ? remainingTime / pauseSegments.length
          : 0

      // Debug logging
      console.log({
        validatedDuration,
        totalDurationSeconds,
        totalSpeechDuration,
        remainingTime,
        adjustedPauseDuration,
        shouldAdjustPauses,
        speechSegmentsCount: speechSegments.length,
        pauseSegmentsCount: pauseSegments.length,
        speechDurations: speechResults.map(r => r.duration),
        originalPauseDurations: pauseSegments.map(p => p.segment.duration)
      })

      // Update pause durations only if speech is shorter than target
      parsedScript.segments = parsedScript.segments.map(segment => {
        if (segment.type === "pause") {
          return shouldAdjustPauses
            ? { ...segment, duration: adjustedPauseDuration }
            : segment // Keep original duration
        }
        return segment
      })

      // Generate pause segments with original or adjusted durations
      const pausePromises = pauseSegments.map(async ({ segment, index }) => {
        const segmentPath = path.join(
          audioDir,
          `${baseFilename}-segment-${index}.mp3`
        )
        const pauseDuration = shouldAdjustPauses
          ? adjustedPauseDuration
          : segment.duration
        await execAsync(
          `ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t ${pauseDuration} -b:a 192k -ar 44100 -ac 2 "${segmentPath}"`
        )
        return { index, path: segmentPath }
      })

      // Wait for all segments
      const [, pauseResults] = await Promise.all([
        Promise.resolve(speechResults),
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

      // Loop background music for the full duration
      await execAsync(
        `ffmpeg -stream_loop -1 -i "${bgMusicPath}" -t ${duration} -ar 44100 -ac 2 "${trimmedMusicPath}"`
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
    } catch (error) {
      console.error("Error:", error)
      sendUpdate(stream.writable, {
        type: "error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred"
      })
    } finally {
      try {
        writer = stream.writable.getWriter()
        await writer.close()
      } catch (e) {
        console.error("Error closing stream:", e)
      }
    }
  }

  // Start processing in background
  process()

  return response
}
