# My Posts App

A Next.js 16 app for authenticated post management using Supabase, Drizzle ORM, oRPC, and React Query.

## Features

- Email/password authentication with Supabase
- Create, edit, and delete posts
- Protected routes and middleware‑based auth redirects
- Typed API layer powered by oRPC
- Database schema defined with Drizzle and Supabase PostgreSQL
- Client + server Supabase setup for secure session handling

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Supabase (Auth + PostgreSQL)
- Drizzle ORM (schema + migrations)
- Zod (validation)
- oRPC (typed API layer)
- TanStack React Query
- Tailwind CSS (optional; assumed from typical setup)

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Create a `.env.local` file with your Supabase credentials:

```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

3. Run the development server

```bash
npm run dev
```

4. Open the app

```text
http://localhost:3000
```

> After signing in, the app redirects to `/posts` where you can manage your posts.

## Project Structure


src/
├── app/
│ ├── page.tsx # Home page (redirects to /posts)
│ ├── (auth)/sign-in/page.tsx # Sign‑in form
│ ├── (auth)/sign-up/page.tsx # Sign‑up form
│ ├── posts/ # Posts CRUD pages
│ └── api/[[...rest]]/route.ts # Single oRPC API entry point
├── middleware.ts # Auth‑based routing & session refresh
├── db/
│ ├── schema.ts # Drizzle schema for posts table
│ ├── index.ts # DB connection (Supabase PostgreSQL)
│ └── migrations/ # Auto‑generated Drizzle migrations
├── lib/
│ ├── validators/post.ts # Zod schemas for post operations
│ ├── supabase/
│ │ ├── client.ts # Browser‑side Supabase client
│ │ └── server.ts # Server‑side Supabase client
│ └── orpc/ # Typed oRPC plumbing
│ ├── base.ts
│ ├── routes/post.ts
│ ├── router.ts
│ └── client.ts
├── services/post.service.ts # Post CRUD business logic
├── providers/query-provider.tsx # React Query provider wrapper
└── layout.tsx # Root layout (wraps app in QueryProvider)


## Database & Migrations

This app uses **Drizzle ORM** for schema definition and migrations.

- `drizzle.config.ts` configures the schema source and migration output.
- Run Drizzle commands when you change the schema:

```bash
npx drizzle-kit push
npx drizzle-kit generate
```

## Authentication

Authentication is handled by **Supabase**:

- Signed‑in users can access `/posts`.
- Unauthenticated users are redirected to `/sign-in`.
- Authenticated users are redirected away from `/sign-in` and `/sign-up`.

The app also includes:

- `src/app/auth/callback/route.ts` for OAuth/email‑verification callbacks.
- `src/middleware.ts` that refreshes the Supabase session cookie and handles auth redirects.

## API Flow

1. UI calls the typed oRPC client from React components.
2. Request lands on `src/app/api/[[...rest]]/route.ts`.
3. Supabase server client reads the session and user ID.
4. oRPC routes the request to `src/lib/orpc/routes/post.ts`.
5. `post.service.ts` performs database operations.
6. `src/db/index.ts` interacts with Supabase PostgreSQL.

## Layer Overview

### 🗄️ Database Layer — `src/db/`

- `schema.ts`: Drizzle schema for the `posts` table (single source of truth).
- `index.ts`: Exports the database connection using `DATABASE_URL`.
- `migrations/`: Auto‑generated SQL migrations from Drizzle.

### ✅ Validation Layer — `src/lib/validators/`

- `post.ts`: Zod schemas for create, update, delete, and get operations. Also exports inferred TypeScript types.

### 🔌 Supabase Layer — `src/lib/supabase/`

- `client.ts`: Browser‑side Supabase client for sign‑in, sign‑up, etc.
- `server.ts`: Server‑side Supabase client with session cookie handling.

### 🧠 Business Logic Layer — `src/services/`

- `post.service.ts`: Contains all post CRUD operations and business logic (e.g., “send email when a post is published” would live here).

### 🔗 API Layer — `src/lib/orpc/`

- `base.ts`: Defines `publicProcedure` and `protectedProcedure` with auth context.
- `routes/post.ts`: Post router mapping each operation to a procedure + Zod validation + service call.
- `router.ts`: Root `appRouter` combining all routers.
- `client.ts`: Typed oRPC client for use in React components (e.g., `orpc.post.list.queryOptions()`).

### 🌐 API Route — `src/app/api/[[...rest]]/route.ts`

The single entry point for `/api/*` requests:

- Creates a Supabase server client.
- Reads the current user from the session.
- Passes `userId` into the oRPC context and routes the request.

### 🔒 Auth Layer

- `sign-in/page.tsx`: Signs in via `supabase.auth.signInWithPassword()` and redirects to `/posts`.
- `sign-up/page.tsx`: Registers new users with `supabase.auth.signUp()` and redirects on success.
- `auth/callback/route.ts`: Handles Supabase OAuth/email‑verification callbacks.
- `middleware.ts`: Handles auth redirects and session refresh globally.

### 🎨 UI Layer — `src/app/posts/`

- `page.tsx`: Posts list page using `orpc.post.list.queryOptions()` and React Query.
- `create/page.tsx`: Form that validates with Zod, calls `orpc.post.create`, and invalidates the posts cache.
- `[id]/edit/page.tsx`: Fetches and edits a post with Zod validation.
- `[id]/delete/page.tsx`: Confirmation page that calls `orpc.post.delete`.

### 🔧 Providers & Config

- `query-provider.tsx`: Wraps the app with React Query’s `QueryClientProvider`.
- `layout.tsx`: Root layout metal (fonts, metadata, providers).
- `drizzle.config.ts`: Config for Drizzle migrations and schema location.

## Request Flow Summary

```text
Browser
  → middleware.ts (auth check + session refresh)
  → page.tsx (UI)
  → oRPC client (typed API call)
  → /api/[[...rest]]/route.ts (API entry)
  → oRPC router (routing)
  → oRPC procedure (auth + Zod validation)
  → post.service.ts (business logic)
  → db/index.ts (database query)
  → Supabase PostgreSQL
```

## Notes

- The API layer is thin: business logic lives in `src/services/`.
- All post operations are validated with Zod before execution.
- React Query handles caching, refetching, and optimistic updates.
- Easy to extend with more routers (e.g., `userRouter`, `commentRouter`).