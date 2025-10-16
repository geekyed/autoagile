# Working in the project

## Functions

Local running of functions
To run the functions locally, you can use the following command:

```bash
supabase functions serve
```

to deploy the functions to your Supabase project, use:

```bash
supabase functions deploy
```

## Database

To make changes to the db, change the schema in `src/lib/db/schema.ts` and then run:

```bash
bun run db:generate
```

This will generate the necessary SQL migrations based on your schema changes in `supabase/migrations`.

To apply the migrations to your local database, run:

```bash
supabase migrations up --local
```

to push to production, use:

```bash
supabase migrations up --linked
```

To Generate types for the db in the fucnitons folder:

```bun run db::types```

## Sveletekit Project

To develop locally, you can run the SvelteKit development server with:

```bash
bun install
bun run dev
```

to deploy just commit to main or PR a branch to main. The CI will automatically build and deploy your app to production on vercel.

## Environment Variables

you need an env file with the following variables set up:

```env
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
DATABASE_URL

PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_ANON_KEY

PROD_PASS

GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=
```
