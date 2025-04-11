# SoulSooth

Experience personalized AI-powered meditation sessions tailored to your emotional state. SoulSooth uses advanced AI to create custom meditation scripts and soothing audio guidance just for you.

## Tech Stack

- IDE: [Cursor](https://www.cursor.com/)
- AI Tools: [V0](https://v0.dev/), [Perplexity](https://www.perplexity.com/)
- Frontend: [Next.js](https://nextjs.org/docs), [Tailwind](https://tailwindcss.com/docs/guides/nextjs), [Shadcn](https://ui.shadcn.com/docs/installation), [Framer Motion](https://www.framer.com/motion/introduction/)
- Backend: [PostgreSQL](https://www.postgresql.org/about/), [Supabase](https://supabase.com/), [Drizzle](https://orm.drizzle.team/docs/get-started-postgresql), [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- Auth: [Clerk](https://clerk.com/)
- Analytics: [PostHog](https://posthog.com/)

## Prerequisites

You will need accounts for the following services.

They all have free plans that you can use to get started.

- Create a [Cursor](https://www.cursor.com/) account
- Create a [GitHub](https://github.com/) account
- Create a [Supabase](https://supabase.com/) account
- Create a [Clerk](https://clerk.com/) account
- Create a [Vercel](https://vercel.com/) account

You will likely not need paid plans unless you are building a business.

## Environment Variables

```bash
# DB (Supabase)
DATABASE_URL=

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# Payments (Stripe)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PORTAL_LINK=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY=

# Analytics (PostHog)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in the environment variables from above
3. Run `npm install` to install dependencies
4. Run `npm run dev` to run the app locally

## Installation Notes

### Node.js Version

- Required Node.js version: `^18.18.0 || ^19.8.0 || >= 20.0.0`
- Check your Node.js version: `node -v`
- Update Node.js using n version manager:

  ```bash
  # Install n version manager
  sudo npm install -g n

  # Install latest LTS version of Node.js
  sudo n lts

  # Verify new Node.js version
  node -v
  ```

### Package Installation Methods

#### Method 1: Latest Versions (Recommended)

1. **Update All Dependencies**

   ```bash
   # Install npm-check-updates globally
   sudo npm install -g npm-check-updates

   # Check and update all dependencies in package.json
   ncu -u

   # Remove existing dependencies
   rm -rf node_modules package-lock.json

   # Install updated dependencies
   npm install
   ```

#### Method 2: Legacy Installation

1. **Clean Install with Legacy Peer Dependencies**

   ```bash
   # Remove existing dependencies
   rm -rf node_modules package-lock.json

   # Install dependencies with legacy peer deps
   npm install --legacy-peer-deps
   ```

2. **Common Installation Issues**

   - If you encounter peer dependency conflicts, use `--legacy-peer-deps` flag
   - You may see some deprecation warnings - these are from dependencies and won't affect functionality
   - Make sure your Node.js version meets the requirements before running `npm run dev`

3. **Verifying Installation**
   ```bash
   # Start the development server
   npm run dev
   ```
   If you see a Node.js version error, update your Node.js version first.

## Fixes

### Database Connection

- If getting `getaddrinfo ENOTFOUND` error:
  - URL encode special characters in DB password (e.g., `#` becomes `%23`)
  - Remove any `http://` or `https://` from the database URL

### Database Schema

- If `relation does not exist` error:
  - Run `npx drizzle-kit push` to push schema to database

### Node Version

- Required: `^18.18.0 || ^19.8.0 || >= 20.0.0`
- Update Node using nvm: `nvm install 20` and `nvm use 20`

## Development Notes

Key learnings from implementing the meditation app:

### 1. Next.js App Router & Server Components

- Keep data fetching in server components for better performance
- Use client components only when needed (state, interactivity)
- Properly handle loading states with Suspense boundaries
- Structure routes with \_components folder for route-specific components

### 2. OpenAI Integration

- GPT-4o-mini works well for short, focused content generation
- OpenAI's TTS service (tts-1) provides high-quality audio output
- Store API responses properly with error handling
- Use appropriate system prompts for consistent output
- Keep prompts focused and specific for better results
- Adjust content length based on target duration (150 words per minute)
- Structure segments appropriately for different meditation lengths
- Include positive reinforcement at the end of each meditation

### 3. Database & File Management

- Always include timestamps (createdAt, updatedAt) in tables
- Use snake_case for PostgreSQL column names
- Handle file storage with proper directory checks
- Generate unique filenames with timestamps
- Store relative paths in database for easier deployment

### 4. Error Handling & Type Safety

- Use ActionState type for consistent API responses
- Implement proper error boundaries in components
- Handle both client and server-side errors gracefully
- Type database operations with Drizzle's $inferInsert and $inferSelect

### 5. Authentication & Security

- Properly await auth() calls in API routes
- Check userId before any protected operations
- Keep environment variables secure
- Never expose API keys to the client

### 6. Performance Optimization

- Use Promise.all() for parallel TTS generation
- Split meditation segments by type for efficient processing
- Maintain segment order with index tracking
- Process speech and pause segments concurrently
- Show immediate feedback with early script display
- Use TransformStream for real-time progress updates
- Send granular progress updates from backend
- Match status messages to actual processing steps
- Handle streaming responses with error boundaries
- Combine parallel operations with proper error handling
- Display progress updates that reflect real processing time
- Balance user experience with processing requirements
- Use streaming responses for long-running operations
- Provide immediate feedback while processing continues

### Important Notes

1. **Environment Setup**

   - Required Node.js version: `^18.18.0 || ^19.8.0 || >= 20.0.0`
   - Required environment variables:
     ```
     DATABASE_URL=
     OPENAI_API_KEY=
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
     CLERK_SECRET_KEY=
     ```

2. **Database Management**

   - Run `npx drizzle-kit push` after schema changes
   - Check database connection string format
   - URL encode special characters in DB password

3. **File Storage**

   - Audio files are stored in `public/audio`
   - Clean up unused audio files periodically
   - Consider cloud storage for production

4. **Performance**

   - Audio generation can take a few seconds
   - Implement proper loading states
   - Consider caching for frequently accessed data

5. **Security**
   - Validate user input
   - Limit file sizes and types
   - Implement rate limiting for API routes
   - Regular security audits
