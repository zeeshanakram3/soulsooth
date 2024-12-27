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
  const startTime = Date.now()
  let stepStartTime = startTime

  const logStep = (stepName: string) => {
    const now = Date.now()
    const stepDuration = now - stepStartTime
    const totalDuration = now - startTime
    console.log(`\n=== ${stepName} ===`)
    console.log(`Step duration: ${stepDuration}ms`)
    console.log(`Total duration: ${totalDuration}ms`)
    console.log("=================")
    stepStartTime = now
  }

  try {
    // Auth check
    const session = await auth()
    const userId = session?.userId
    logStep("Auth Check")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Input validation and preparation
    const {
      userInput,
      musicVolume = DEFAULT_MUSIC_VOLUME,
      durationMinutes = 5
    } = await req.json()

    if (!userInput) {
      return NextResponse.json(
        { error: "User input is required" },
        {
          status: 400
        }
      )
    }

    // Validate music volume and duration
    const validatedVolume = Math.max(0, Math.min(1, Number(musicVolume)))
    const validatedDuration = Math.max(1, Math.min(10, Number(durationMinutes)))

    // Calculate target word count and segments based on duration
    const targetWordCount = validatedDuration * 150
    const totalSeconds = validatedDuration * 60
    const silenceSeconds = totalSeconds / 2 // 50% of total time should be silence

    // Debug log for prompt
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
    - Return ONLY valid JSON, no other text
    
    Example for a 2-minute meditation:
    - Total time: 120 seconds
    - Silence time: 60 seconds (50%)
    - Speech time: 60 seconds
    - Speech word count: ~150 words
    - End speech segments with pause announcements like:
      "Now, let's take a 30-second pause to let this sink in"
      "Now, let's take a 15-second pause to focus on your breath"
      "Now, let's pause for 15 seconds to feel this sense of calm"`

    console.log("\n=== Meditation Generation Debug ===")
    console.log("Duration:", validatedDuration, "minutes")
    console.log("Target Word Count:", targetWordCount)
    console.log("Total Silence:", silenceSeconds, "seconds")
    console.log("\nSystem Prompt:")
    console.log(systemPrompt)
    console.log("\n================================")

    // GPT Script Generation
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
    logStep("GPT Script Generation")

    const meditationScript = completion.choices[0]?.message?.content
    if (!meditationScript) {
      return NextResponse.json(
        { error: "Failed to generate meditation script" },
        { status: 500 }
      )
    }

    // Script parsing and validation
    let parsedScript: MeditationScript
    try {
      parsedScript = JSON.parse(meditationScript)
      if (!parsedScript.title || !Array.isArray(parsedScript.segments)) {
        throw new Error("Invalid script format")
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid meditation script format" },
        { status: 500 }
      )
    }
    logStep("Script Parsing")

    // Audio directory setup
    const audioDir = path.join(process.cwd(), "public", "audio")
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true })
    }
    const baseFilename = `meditation-${Date.now()}`
    logStep("Audio Directory Setup")

    // Process each segment
    const segmentFiles: string[] = []
    for (let i = 0; i < parsedScript.segments.length; i++) {
      const segment = parsedScript.segments[i]
      const segmentPath = path.join(
        audioDir,
        `${baseFilename}-segment-${i}.mp3`
      )

      if (segment.type === "speech") {
        console.log(
          `\nGenerating speech segment ${i + 1}/${parsedScript.segments.length}`
        )
        // Generate speech audio
        const mp3 = await openai.audio.speech.create({
          model: "tts-1",
          voice: "alloy",
          input: segment.content
        })
        const buffer = Buffer.from(await mp3.arrayBuffer())
        const tempPath = path.join(audioDir, `${baseFilename}-temp-${i}.mp3`)
        fs.writeFileSync(tempPath, buffer)
        logStep(`TTS Generation - Segment ${i + 1}`)

        // Normalize audio
        await execAsync(
          `ffmpeg -i "${tempPath}" -ar 44100 -ac 2 -b:a 192k "${segmentPath}"`
        )
        fs.unlinkSync(tempPath)
        logStep(`Audio Normalization - Segment ${i + 1}`)
      } else if (segment.type === "pause") {
        // Generate silence
        await execAsync(
          `ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t ${segment.duration} -b:a 192k -ar 44100 -ac 2 "${segmentPath}"`
        )
        logStep(`Silence Generation - Segment ${i + 1}`)
      }
      segmentFiles.push(segmentPath)
    }

    // Combine segments
    const concatListPath = path.join(audioDir, `${baseFilename}-list.txt`)
    const concatList = segmentFiles.map(file => `file '${file}'`).join("\n")
    fs.writeFileSync(concatListPath, concatList)
    const meditationPath = path.join(audioDir, `${baseFilename}-meditation.mp3`)
    await execAsync(
      `ffmpeg -f concat -safe 0 -i "${concatListPath}" -ar 44100 -ac 2 -b:a 192k "${meditationPath}"`
    )
    logStep("Segments Combination")

    // Get meditation duration
    const { stdout: durationStr } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${meditationPath}"`
    )
    const duration = parseFloat(durationStr)
    logStep("Duration Check")

    // Background music processing
    const bgMusicPath = path.join(
      process.cwd(),
      "public",
      "background",
      "background-music.mp3"
    )
    const trimmedMusicPath = path.join(audioDir, `${baseFilename}-music.mp3`)
    await execAsync(
      `ffmpeg -i "${bgMusicPath}" -t ${duration} -ar 44100 -ac 2 "${trimmedMusicPath}"`
    )
    logStep("Background Music Preparation")

    // Final mix
    const finalPath = path.join(audioDir, `${baseFilename}.mp3`)
    await execAsync(
      `ffmpeg -i "${meditationPath}" -i "${trimmedMusicPath}" -filter_complex "[1:a]volume=${validatedVolume}[m];[0:a][m]amix=inputs=2:duration=longest" -ar 44100 -ac 2 "${finalPath}"`
    )
    logStep("Final Audio Mixing")

    // Cleanup
    segmentFiles.forEach(file => fs.unlinkSync(file))
    fs.unlinkSync(concatListPath)
    fs.unlinkSync(meditationPath)
    fs.unlinkSync(trimmedMusicPath)
    logStep("Cleanup")

    // Database update
    const audioPath = `/audio/${baseFilename}.mp3`
    const result = await createMeditationAction({
      userId,
      userInput,
      meditationScript: parsedScript,
      audioFilePath: audioPath
    })
    logStep("Database Update")

    if (!result.isSuccess) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }

    const totalProcessingTime = Date.now() - startTime
    console.log(`\n=== Total Processing Time: ${totalProcessingTime}ms ===\n`)

    return NextResponse.json(result)
  } catch (error) {
    const totalProcessingTime = Date.now() - startTime
    console.error("\n=== Error occurred after", totalProcessingTime, "ms ===")
    console.error("Error generating meditation:", error)
    return NextResponse.json(
      { error: "Failed to generate meditation" },
      { status: 500 }
    )
  }
}
