# Vocaldesk

Vocaldesk is a Next.js application for configuring and operating AI phone agents. It combines Supabase authentication and application data with Bland AI phone-agent APIs, call logs and analytics, outbound call batches, prompts, external API tools, calendar connections, and configurable notifications.

> This repository provides the application source. A working phone agent requires accounts and credentials for the services you choose to connect. Do not use production credentials or customer data in a local development environment.

## What is included

- Email, password, magic-link, and Google OAuth sign-in through Supabase
- AI phone-agent configuration for prompt, voice, language, call settings, and live transfer
- Inbound call history, transcripts, recordings, and call analytics
- CSV-driven outbound call batches
- Reusable prompts and agent API-key management
- Google Calendar and Calendly connections
- Email, SMS, webhook, SMTP, Twilio, and TextGrid notification settings
- Optional multi-domain branding and whitelabel administration
- Supabase schema, migrations, seed data, and an Edge Function for OAuth token refresh

## Architecture

Vocaldesk uses the Next.js App Router. Pages and route handlers live in `app/`, reusable interface components live in `components/`, and service/authentication helpers live in `utils/`. Supabase provides authentication and Postgres-backed application data. Server-side calls to the phone-agent provider are centralized in `utils/agent/`. The database history is tracked in `supabase/migrations/`.

The main stack is TypeScript, React 18, Next.js 14, Tailwind CSS, Radix UI, Supabase, Bland AI, and Recharts/Nivo.

## Prerequisites

- Node.js 20 or newer and npm 10 or newer
- A Supabase project, or Docker Desktop for the local Supabase stack
- A Bland AI account for phone-agent and call features
- Provider credentials for any optional OAuth or notification integrations you enable

## Setup

1. Install dependencies with `npm install`.
2. Run `cp .env.example .env.local`.
3. Choose a Supabase environment:
   - **Local:** start Docker Desktop, run `npm run supabase:start`, and copy the printed local API URL, anonymous key, and service-role key into `.env.local`. The checked-in migrations and seed data define the local database.
   - **Hosted:** create a Supabase project, apply the migrations in `supabase/migrations/`, and add that project's URL and keys to `.env.local`.
4. Add credentials for the features you intend to exercise. Placeholder values in `.env.example` are not working credentials.
5. Run `npm run dev` and open [http://localhost:4000](http://localhost:4000).

The root route redirects signed-out users to `/signin` and signed-in users to `/dashboard`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public application origin; use `http://localhost:4000` locally. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project API URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Browser-safe Supabase anonymous key. Row Level Security must remain enabled. |
| `SUPABASE_SERVICE_ROLE_KEY` | For server admin operations | Server-only Supabase service-role key. |
| `BLAND_API_URL` / `BLAND_API_KEY` | For phone features | Bland AI base URL and server-only credential. |
| `BLAND_WEBHOOK_SECRET` | For call webhooks | Secret used to verify Bland webhook signatures. |
| `TWILIO_ENCRYPTED_KEY` | For Twilio-backed numbers | Encrypted Twilio key supplied to Bland AI requests. |
| `NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID` / `GOOGLE_OAUTH_CLIENT_SECRET` | For Google Calendar | Google OAuth credentials; the secret is server-only. |
| `NEXT_PUBLIC_CALENDLY_OAUTH_CLIENT_ID` / `CALENDLY_OAUTH_CLIENT_SECRET` | For Calendly | Calendly OAuth credentials; the secret is server-only. |
| `NEXT_PUBLIC_CALENDLY_AUTH_BASE_URL` | For Calendly | Calendly OAuth base URL. |
| `NOTIFICATION_PROVIDER` / `RESEND_API_KEY` | Optional | Notification provider selection and its server-only credential. |
| `JILLS_OFFICE_API` / `JILLS_OFFICE_API_KEY` | Optional | External office integration endpoint and credential. |
| `API_PROXY_ALLOWED_HOSTS` | Optional | Comma-separated exact HTTPS hosts available to the signed-in API request tester. Blank disables requests. |
| `SUPABASE_PROJECT_REF` / `SUPABASE_DB_PASSWORD` | Remote CLI only | Used by `npm run supabase:link`; not required at application runtime. |
| `SERVICE_ROLE_KEY` | Edge Function only | Service-role secret expected by `supabase/functions/refresh_tokens`. |

Variables beginning with `NEXT_PUBLIC_` are compiled into browser code and must never contain secrets.

## Commands

```bash
npm run dev        # development server on http://localhost:4000
npm run lint       # Next.js ESLint checks
npm run typecheck  # TypeScript checks without emitting files
npm run build      # production build
npm run start      # serve the production build on port 4000
npm run email      # preview React Email templates
```

Supabase helpers are available as `npm run supabase:start`, `npm run supabase:link`, `npm run supabase:generate-types`, and `npm run supabase:generate-migration`. `npm run supabase:migrate` changes the linked remote database; review the target and migration first.

## Security notes

- Never commit `.env.local`, service-role keys, database passwords, provider tokens, call recordings, or customer exports.
- Configure webhook secrets before accepting internet traffic and retain Supabase Row Level Security policies.
- Keep `API_PROXY_ALLOWED_HOSTS` to the minimum exact host set. Outbound redirects are rejected by the request tester.
- Rotate any secret that has appeared in Git history or logs; deleting the current copy is not sufficient.
- Review [SECURITY.md](SECURITY.md) before reporting a vulnerability.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). This project is distributed under the terms in [LICENSE](LICENSE).
