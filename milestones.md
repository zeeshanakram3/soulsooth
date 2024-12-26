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

### Phase 3: User Authentication and History

**Objective:** Implement user authentication and allow users to view their past meditations.

**Tasks:**

1. **User Authentication:**
    -   Integrate Supabase Authentication into the app.
    -   Create login/signup pages using pre-built Supabase UI components or custom forms.
    -   Protect relevant routes and API endpoints to ensure only authenticated users can access them.
2. **User Profiles:**
    -   Create a `profiles` table to store user-specific information (if needed).
    -   Link the `meditations` table to the `profiles` table via the `userId` foreign key.
3. **Frontend - User Dashboard:**
    -   Create a new route `app/dashboard` for the user dashboard.
    -   Design a dashboard layout (`layout.tsx`) and page (`page.tsx`).
    -   Create a server component `meditation-history.tsx` in `app/dashboard/_components`.
    -   Fetch the user's past meditations from the database using a server action.
    -   Display the list of past meditations, including user input, generated script, and audio playback.
4. **Server Actions:**
    -   Create a new server action `getMeditationsByUserAction` in `actions/db/meditations-actions.ts` to retrieve all meditations for a given user ID.

**Verification:**

-   Users can sign up and log in to the app.
-   Authenticated users can access the dashboard.
-   The dashboard displays a list of the user's past meditations.
-   Users can view the details and play the audio of their past meditations.

**Note:** Don't be lazy and write code to complete each task.

### Phase 4: Enhanced UI/UX and Additional Features

**Objective:** Improve the user interface and user experience, and add optional features based on user feedback and feasibility.

**Tasks:**

1. **UI/UX Improvements:**
    -   Refine the overall design and layout of the app using Tailwind CSS and Shadcn components.
    -   Implement smooth transitions and animations using Framer Motion.
    -   Improve the responsiveness of the app for different screen sizes.
2. **Advanced Meditation Options:**
    -   Allow users to select a meditation style or theme (e.g., mindfulness, relaxation, focus).
    -   Incorporate background music or ambient sounds into the generated meditations.
    -   Provide options to adjust the voice, speed, and other parameters of the TTS output.
3. **Progress Tracking:**
    -   Implement a system to track the user's meditation progress (e.g., number of sessions, total time spent meditating).
    -   Display progress statistics on the user dashboard.
4. **Community Features (Optional):**
    -   Allow users to share their favorite meditations with others.
    -   Create a forum or discussion board for users to connect and share their experiences.
5. **Feedback and Iteration:**
    -   Collect user feedback through surveys or feedback forms.
    -   Iterate on the app's design and functionality based on user feedback.

**Verification:**

-   The app has a polished and intuitive user interface.
-   Users can customize their meditation experience.
-   Progress tracking is accurate and informative.
-   Optional features (if implemented) are functional and enhance the user experience.

**Note:** Don't be lazy and write code to complete each task. 