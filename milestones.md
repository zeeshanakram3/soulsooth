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

### Phase 5: Structured Meditation with Pauses

**Objective:** Create structured meditation scripts with timed pauses using JSON output format.

**Tasks:**

1. **Structured Script Generation:**
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
    - Configure OpenAI API to enforce JSON schema
    - Target 30-second total meditation length
    - Each pause segment will be 10 seconds

2. **Audio Processing:**
    - Parse JSON response to extract segments
    - Generate audio files for speech segments using OpenAI TTS
    - Create 10-second silent audio files for pause segments
    - Combine segments in sequence
    - Export as single meditation audio file

3. **Backend Updates:**
    - Modify `app/api/generate-meditation/route.ts` to:
        - Request and validate JSON responses
        - Process structured segments
        - Handle audio generation per segment
        - Manage file combining
    - Update database schema to store structured script JSON

4. **Frontend Updates:**
    - Display speech and pause segments
    - Update audio player UI to show:
        - Current segment type (speech/pause)
        - Progress through meditation

**Verification:**

- Generated scripts follow JSON schema
- Audio files include proper speech and silence segments
- Total meditation length is approximately 30 seconds
- Audio player reflects current segment
- Database correctly stores structured format

### Phase 6: Background Music Integration

**Objective:** Add background music support to enhance meditation experience.

**Tasks:**

1. **Music Features:**
    - Create a collection of meditation background tracks
    - Implement volume control for background music
    - Add music selection interface
    - Store user music preferences

2. **Audio Processing:**
    - Add background music layer to meditation audio
    - Balance voice and music volumes
    - Ensure smooth transitions between segments
    - Fade music in/out at start/end

3. **Backend Updates:**
    - Add music file management
    - Update audio processing to mix music
    - Store music selection in database
    - Handle music file cleanup

4. **Frontend Updates:**
    - Add music selection UI
    - Display current music track
    - Add volume controls
    - Show music progress

**Verification:**

- Users can select background music
- Music volume is balanced with voice
- Transitions are smooth
- Music preferences are saved
- Audio player shows music information
