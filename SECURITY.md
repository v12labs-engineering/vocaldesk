# Security policy

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability or include secrets in an issue, pull request, screenshot, or log.

Report security concerns privately through GitHub's **Security** tab by selecting **Report a vulnerability**. Include the affected revision, reproduction steps, impact, and any suggested mitigation. The maintainers will acknowledge the report and coordinate disclosure after a fix is available.

## Credential handling

- Copy `.env.example` to `.env.local`; never commit `.env.local` or real credentials.
- Treat Supabase service-role keys, database passwords, provider secrets, OAuth client secrets, and webhook secrets as server-only values.
- `NEXT_PUBLIC_*` values are included in browser bundles and must not contain secrets. The Supabase anonymous key is intended for client use only when Row Level Security is correctly configured.
- Rotate a credential immediately if it is committed, logged, shared in a screenshot, or otherwise exposed. Removing it from the latest commit does not remove it from Git history.
- Keep `API_PROXY_ALLOWED_HOSTS` limited to exact third-party API hosts you trust. The request tester is disabled when this value is blank.

## Supported versions

Security fixes are applied to the default branch. This project does not currently publish versioned support releases.
