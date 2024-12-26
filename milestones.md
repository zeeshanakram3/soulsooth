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
    - Already implemented with Clerk ✅
    - Login/signup pages already available at /login and /signup ✅
    - Protected routes and API endpoints already secured with auth middleware ✅

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

### Phase 4: Landing Page and Navigation

**Objective:** Create a focused landing page that highlights the meditation features and provides clear navigation to key functionality.

**Tasks:**

1. **Landing Page Redesign:**
    - Remove existing marketing/template content
    - Create a new landing page that:
        - Explains the meditation app's purpose
        - Shows how to get started
        - Highlights key features (personalized meditations, audio generation)
    - Add clear call-to-action buttons for:
        - "Start Meditating" (for logged-in users)
        - "Sign Up" (for new users)
        - "View History" (for logged-in users)

2. **Navigation Updates:**
    - Update the main navigation to include:
        - Home (landing page)
        - Meditate
        - Dashboard (meditation history)
        - Login/Signup (for logged-out users)
        - User menu (for logged-in users)
    - Ensure responsive design for mobile devices
    - Add proper active states for current route

3. **Route Protection:**
    - Redirect logged-out users to login when accessing protected routes
    - Redirect logged-in users to dashboard from login/signup pages
    - Add loading states during auth checks

4. **Cleanup:**
    - Remove unused marketing routes and components
    - Clean up unused assets and dependencies
    - Update metadata and SEO information

**Verification:**

- Landing page clearly communicates the app's purpose
- Users can easily navigate to meditation and history features
- Navigation updates based on auth state
- All routes are properly protected
- No unused code or assets remain
- App maintains consistent styling and branding
