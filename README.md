# Mckay's App Template

This is a full-stack app template for courses on [Takeoff](https://JoinTakeoff.com/).

## Sponsors

If you are interested in sponsoring my repos, please contact me at [ads@takeoffai.org](mailto:ads@takeoffai.org).

Or sponsor me directly on [GitHub Sponsors](https://github.com/sponsors/mckaywrigley).

## Tech Stack

- IDE: [Cursor](https://www.cursor.com/)
- AI Tools: [V0](https://v0.dev/), [Perplexity](https://www.perplexity.com/)
- Frontend: [Next.js](https://nextjs.org/docs), [Tailwind](https://tailwindcss.com/docs/guides/nextjs), [Shadcn](https://ui.shadcn.com/docs/installation), [Framer Motion](https://www.framer.com/motion/introduction/)
- Backend: [PostgreSQL](https://www.postgresql.org/about/), [Supabase](https://supabase.com/), [Drizzle](https://orm.drizzle.team/docs/get-started-postgresql), [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- Auth: [Clerk](https://clerk.com/)
- Payments: [Stripe](https://stripe.com/)
- Analytics: [PostHog](https://posthog.com/)

## Prerequisites

You will need accounts for the following services.

They all have free plans that you can use to get started.

- Create a [Cursor](https://www.cursor.com/) account
- Create a [GitHub](https://github.com/) account
- Create a [Supabase](https://supabase.com/) account
- Create a [Clerk](https://clerk.com/) account
- Create a [Stripe](https://stripe.com/) account
- Create a [PostHog](https://posthog.com/) account
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


## Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in the environment variables from above
3. Run `npm install` to install dependencies
4. Run `npm run dev` to run the app locally

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


1. **Next.js API Routes with Dynamic Parameters**
   - Dynamic route parameters in API routes must be properly awaited
   - Use the pattern: `const { paramName } = await params` instead of directly accessing `params.paramName`
   - Type dynamic params as: `params: Promise<{ paramName: string }> | { paramName: string }`

2. **Client vs Server Components**
   - Server components should be used for data fetching and initial state
   - Convert to client components when using hooks (useState, useEffect)
   - Use loading states and error handling in client components
   - Keep state management close to where it's needed

3. **Database Schema Best Practices**
   - Always include `createdAt` and `updatedAt` timestamps
   - Use snake_case for column names in PostgreSQL
   - Properly type database operations with Drizzle's `$inferInsert` and `$inferSelect`

4. **Error Handling**
   - Implement consistent error handling patterns across API routes
   - Return appropriate HTTP status codes
   - Provide meaningful error messages
   - Handle both client and server-side errors gracefully

5. **API Response Structure**
   - Use consistent response format: `{ isSuccess, message, data }`
   - Include proper typing for all API responses
   - Handle null/undefined cases explicitly
   - For generation, the model is gpt-4o-mini

6. **Environment Setup** ( this step is already done but if the errors are not going away, check this )
   - Always push database schema changes with `npx drizzle-kit push`
   - Keep environment variables in `.env.local`
   - Document required environment variables in `.env.example`
