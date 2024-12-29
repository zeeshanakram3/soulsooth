# Meditation App Milestones

This document outlines the milestones for building a meditation app that generates personalized audio meditations based on user input.

## Overview

The app will allow users to input their current emotional state. It will then use OpenAI's GPT-4o-mini model to generate a tailored meditation script. Finally, a text-to-speech (TTS) service will convert the script into an audio file for the user to listen to.

## Phases

### Phase 1: Core Functionality - Text Input and Meditation Script Generation ✅

**Objective:** Set up the basic structure of the app, allowing users to input their feelings and receive a generated meditation script.

**Tasks:**

1. **Project Setup:** ✅
    -   Initialize a new Next.js project ✅
    -   Install necessary dependencies: Tailwind CSS, Shadcn, Framer Motion, Drizzle ORM, Supabase client ✅
    -   Set up environment variables in `.env.local` and update `.env.example` ✅
    -   Initialize Supabase and Drizzle ORM ✅
2. **Database Schema:** ✅
    -   Create a `meditations` table in the database to store user inputs, generated scripts, and audio file paths ✅
    -   Define the schema in `db/schema/meditations-schema.ts` ✅
    -   Export the schema in `db/schema/index.ts` ✅
    -   Add the schema to the `schema` object in `db/db.ts` ✅
    -   Columns: ✅
        -   `id` (uuid, primary key)
        -   `userId` (text, not null)
        -   `userInput` (text, not null)
        -   `meditationScript` (text, not null)
        -   `audioFilePath` (text)
        -   `createdAt` (timestamp, not null, default now)
        -   `updatedAt` (timestamp, not null, default now, on update now)
3. **Frontend - User Input:** ✅
    -   Create a client component `meditate/page.tsx` with form and display ✅
    -   Design a form with a text area for users to input their feelings ✅
    -   Implement basic styling using Tailwind CSS and Shadcn components ✅
4. **API Route - Meditation Script Generation:** ✅
    -   Create an API route `app/api/generate-meditation/route.ts` ✅
    -   Use the OpenAI API (specifically the GPT-4o-mini model) to generate a meditation script based on the user's input ✅
    -   Store the user input and generated script in the `meditations` table ✅
5. **Frontend - Display Meditation:** ✅
    -   Display the generated meditation script in the page ✅
    -   Show loading states during generation ✅
    -   Handle errors gracefully ✅
6. **Server Actions:** ✅
    -   Create server actions in `actions/db/meditations-actions.ts` for: ✅
        -   `createMeditationAction`: Inserts a new meditation record (user input, generated script)
        -   `getMeditationAction`: Retrieves a meditation record by ID
    -   Return `ActionState` from each action ✅

**Verification:** ✅

-   Users can input their feelings in the text area ✅
-   The app sends the input to the backend and receives a generated meditation script ✅
-   The generated script is displayed on the page ✅
-   The user input and generated script are stored in the database ✅

### Phase 2: Text-to-Speech and Audio Playback ✅

**Objective:** Convert the generated meditation script into an audio file and provide audio playback functionality.

**Tasks:**

1. **Text-to-Speech Integration:** ✅
    -   Choose a text-to-speech (TTS) service - Selected OpenAI's TTS service ✅
    -   Integrate OpenAI TTS into the backend ✅
    -   Update the `app/api/generate-meditation/route.ts` to: ✅
        -   Generate the meditation script ✅
        -   Convert the script to audio using OpenAI TTS ✅
        -   Save the audio file in `public/audio` ✅
        -   Store the audio file path in the `meditations` table ✅
2. **Frontend - Audio Player:** ✅
    -   Audio player already implemented in the page using HTML5 `<audio>` element ✅
    -   Fetch and display the audio file path from the database ✅
    -   Play the generated audio meditation ✅
3. **Server Actions:** ✅
    -   Updated `createMeditationAction` to handle audio file path storage ✅
    -   `getMeditationAction` already returns the audio file path ✅

**Verification:** ✅

-   After generating a meditation script, the app also generates an audio file ✅
-   The audio file is stored in public/audio and the path is saved in the database ✅
-   The frontend displays an audio player that can play the generated meditation ✅
-   Users can listen to the personalized meditation ✅

### Phase 3: User Authentication and History ✅

**Objective:** Allow users to view their past meditations.

**Tasks:**

1. **User Authentication:** ✅
    -Already implemented with Clerk ✅
    -Login/signup pages already available at /login and /signup ✅
    -Protected routes and API endpoints already secured with auth middleware ✅

2. **Frontend - User Dashboard:** ✅
    - Create a new route `app/dashboard` for the user dashboard ✅
    - Design a simple dashboard page that shows past meditations ✅
    - Display meditation history with: ✅
        - Date created ✅
        - User input ✅
        - Meditation script ✅
        - Audio playback ✅

3. **Server Actions:** ✅
    - Add `getMeditationsByUserId` action to fetch user's meditation history ✅
    - Add pagination support for large histories ✅

**Verification:** ✅

- Users can access their dashboard when logged in ✅
- Past meditations are displayed in chronological order ✅
- Users can replay their past meditations ✅
- History is paginated for better performance ✅

### Phase 4: Landing Page and Navigation ✅

**Objective:** Create a focused landing page and navigation for the meditation app.

**Tasks:**

1. **Landing Page:** ✅
    - Create a simple landing page that:
        - Explains the meditation app's purpose ✅
        - Shows how to get started ✅
    - Add clear call-to-action buttons: ✅
        - "Start Meditating" (for logged-in users) ✅
        - "Sign Up" (for new users) ✅

2. **Navigation:** ✅
    - Update the main navigation: ✅
        - Home (landing page) ✅
        - Meditate ✅
        - Dashboard (meditation history) ✅
        - Login/Signup (for logged-out users) ✅
    - Ensure responsive design for mobile ✅

3. **Route Protection:** ✅
    - Redirect logged-out users to login ✅
    - Add loading states during auth checks ✅

**Verification:** ✅

- Landing page clearly communicates the app's purpose ✅
- Users can easily navigate to key features ✅
- Navigation updates based on auth state ✅
- All routes are properly protected ✅

### Phase 5: Structured Meditation with Pauses ✅

**Objective:** Create structured meditation scripts with timed pauses using JSON output format.

**Tasks:**

1. **Structured Script Generation:** ✅
    - Update the prompt to generate JSON-formatted meditation scripts with:
        ```json
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
        ```
    - Configure OpenAI API to enforce JSON schema ✅
    - Target 30-second total meditation length ✅
    - Each pause segment will be 10 seconds ✅

2. **Audio Processing:** ✅
    - Parse JSON response to extract segments ✅
    - Generate audio files for speech segments using OpenAI TTS ✅
    - Create 10-second silent audio files for pause segments ✅
    - Combine segments in sequence ✅
    - Export as single meditation audio file ✅

3. **Backend Updates:** ✅
    - Modify `app/api/generate-meditation/route.ts` to:
        - Request and validate JSON responses ✅
        - Process structured segments ✅
        - Handle audio generation per segment ✅
        - Manage file combining ✅
    - Update database schema to store structured script JSON ✅

4. **Frontend Updates:** ✅
    - Display speech and pause segments ✅
    - Update audio player UI to show:
        - Current segment type (speech/pause) ✅
        - Progress through meditation ✅

**Verification:** ✅

- Generated scripts follow JSON schema ✅
- Audio files include proper speech and silence segments ✅
- Total meditation length is approximately 30 seconds ✅
- Audio player reflects current segment ✅
- Database correctly stores structured format ✅

### Phase 6: Background Music Integration

**Objective:** Add background music support with volume control to enhance meditation experience.

**Tasks:**

1. **Audio Processing:**
    - Mix background music with meditation audio using ffmpeg
    - Implement volume control for background music
    - Ensure smooth transitions between segments
    - Maintain high audio quality

2. **Frontend Updates:**
    - Add volume slider component for background music
    - Display current volume level
    - Implement real-time volume adjustment
    - Save user's volume preference

**Verification:**

- Background music plays smoothly with meditation
- Volume slider adjusts music intensity in real-time
- Audio quality remains high after mixing
- User volume preferences persist between sessions

### Phase 7: Meditation Duration Selection

**Objective:** Implement meditation duration selection to allow users to choose their preferred meditation length.

**Tasks:**

1. **Duration Selection UI:** ✅
    - Add duration selection buttons in `app/meditate/_components/user-input-form.tsx`:
        - 1 minute
        - 2 minutes
        - 5 minutes
        - 10 minutes
    - Style buttons to be visually appealing and clear
    - Show selected duration prominently
    - Store selected duration in form state

2. **Prompt Engineering:**
    - Update OpenAI prompt in `app/api/generate-meditation/route.ts` to:
        - Calculate target word count based on duration (150 words per minute)
            - 1 minute ≈ 150 words
            - 2 minutes ≈ 300 words
            - 5 minutes ≈ 750 words
            - 10 minutes ≈ 1500 words
        - Adjust number of segments based on duration:
            - Short (1-2 min): 3-4 segments
            - Medium (5 min): 6-8 segments
            - Long (10 min): 10-12 segments
        - Include subtle positive reinforcement at meditation end
        - Example prompt structure:
            ```
            Generate a {duration}-minute meditation script with approximately {duration * 150} words.
            Structure the content with {n} segments, alternating between speech and pauses.
            End with a gentle positive reinforcement that makes the user feel accomplished.
            Format the response as JSON with the following structure:
            ```
        - Example segment structure for 5 minutes:
            ```json
            {
              "title": "5-Minute Calm",
              "targetWordCount": 750,
              "actualWordCount": 742,
              "duration": 300,
              "segments": [
                {
                  "type": "speech",
                  "content": "Welcome to your meditation. Find a comfortable position...",
                  "wordCount": 120,
                  "duration": 30
                },
                {
                  "type": "pause",
                  "duration": 30
                },
                // ... middle segments ...
                {
                  "type": "speech",
                  "content": "You've done wonderfully. Take a moment to appreciate the peace you've created within yourself. As you prepare to return to your day, carry this sense of calm with you.",
                  "wordCount": 100,
                  "duration": 25
                }
              ]
            }
            ```

3. **Duration Display:**
    - Add duration display component
    - Show total meditation length
    - Display remaining time during playback
    - Use clean, minimal design

4. **Testing and Verification:**
    - Test all duration options (1, 2, 5, 10 minutes)
    - Verify content length matches selected duration
    - Check segment distribution is appropriate for each duration
    - Validate positive ending messages
    - Test user experience across different durations

**Verification:**

- Users can select from 1, 2, 5, or 10 minute options
- Generated content matches selected duration
- Meditation script adapts appropriately to chosen length
- Ending messages provide positive reinforcement
- Duration is clearly displayed during meditation

### Phase 8: Performance Optimizations

**Objective:** Reduce meditation generation time from ~37s to ~20s and improve user experience.

**Tasks:**

1. **TTS Parallelization:** ✅
    - Previous: Sequential TTS (~25s)
    - Solution: Parallel TTS using Promise.all()
    - Expected: ~10s (60% faster)
    - Implementation:
        - Split segments into speech and pause arrays
        - Process all speech segments in parallel
        - Process all pause segments in parallel
        - Combine results in correct order

2. **Progress Display Optimization:** ✅
    - Previous: Script hidden until audio complete
    - Solution: Real-time progress updates with streaming response
    - Implementation:
        - Use TransformStream for real-time updates
        - Show script immediately after generation (~2-3s)
        - Send granular progress updates:
            - Script Generation: 0-15%
            - Script Ready: 15-20%
            - Speech Generation: 20-60% (with per-segment updates)
            - Silence Generation: 60-70%
            - Audio Combining: 70-85%
            - Music Addition: 85-95%
            - Completion: 95-100%
        - Handle errors gracefully with error messages
        - Maintain smooth progress animation

3. **FFmpeg Optimization:**
    - Current: Multiple operations (~5s)
        ```
        Audio Normalization: ~400ms × 3
        Segments Combination: ~1.1s
        Background Music: ~1.3s
        Final Mixing: ~1.4s
        ```
    - Solution: Combine operations and optimize filters
    - Expected: ~4s (20% faster)

**Verification:**
- Total time: ~37s → ~20s
- Script appears within 3s
- Progress accurately reflects processing stages
- Real-time updates from backend
- No quality loss
- Stable across durations

### Phase 9A: Meditation Credits System ✅

**Objective:** Implement a basic credits system to limit free meditation generations.

**Tasks:**

1. **Database Requirements:** ✅
    - Store meditation credits per user (default: 3 free credits) ✅
    - Track total meditations generated ✅
    - Ensure atomic credit operations to prevent race conditions ✅

2. **Credit Management Logic:** ✅
    - Added credit management actions:
        - `checkCreditsAction`: Check if user has available credits
        - `deductCreditAction`: Atomically deduct a credit and increment total meditations
        - `addCreditsAction`: Add credits to a user's account
    - Validate credit availability before generation starts ✅
    - Only deduct credits after successful meditation generation ✅
    - Atomic operations with rollback on insufficient credits ✅

3. **User Experience Requirements:** ✅
    - Show remaining credits prominently in the UI ✅
    - Show credit history in user dashboard ✅
    - Display warning when credits are low (1 remaining) ✅

**Verification Criteria:** ✅

- Credits accurately track across multiple sessions ✅
- Credit deduction only occurs after successful generation ✅
- Users cannot generate meditations without credits ✅
- Credit display updates in real-time ✅
- Atomic operations prevent race conditions ✅
- Low credit warnings display correctly ✅

### Phase 9B.1: Basic BYOK Implementation

**Objective:** Implement basic "Bring Your Own Key" functionality with session-based storage.

**Tasks:**

1. **Basic API Key Management:**
    - Add API key input component to meditation page
    - Implement basic key validation (format check)
    - Store key in HTTP-only cookie with secure settings
    - Clear key on session end

2. **Simple Toggle System:**
    - Add toggle between credits and API key mode
    - Show/hide API key input based on mode
    - Display current active mode

3. **Basic Error Handling:**
    - Validate API key format (starts with "sk-")
    - Show user-friendly error messages
    - Basic error logging (without exposing keys)

**Verification:**
- Users can input their API key
- Basic validation works
- Keys are stored securely in cookies
- Simple mode switching works
- Basic error messages display correctly

### Phase 9B.2: Advanced BYOK Integration

**Objective:** Enhance BYOK system with full credit integration and robust error handling.

**Tasks:**

1. **Advanced API Key Management:**
    - Implement proper key rotation
    - Add key validation against OpenAI API
    - Handle key expiration gracefully
    - Implement secure key cleanup

2. **Full Credit System Integration:**
    - Integrate with existing credit system
    - Skip credit checks for personal API keys
    - Prevent double credit deductions
    - Handle fallback to credit system

3. **Enhanced Error Handling:**
    - Handle all OpenAI API errors:
        - Invalid keys
        - Expired keys
        - Quota exceeded
        - Rate limits
    - Implement proper error recovery
    - Add detailed error logging
    - Provide specific user guidance

4. **State Management:**
    - Implement robust state tracking
    - Handle race conditions
    - Manage transitions between modes
    - Persist state appropriately

**Verification:**
- Full credit system integration works
- All error cases handled properly
- Smooth transitions between modes
- No security vulnerabilities
- Complete user feedback system
