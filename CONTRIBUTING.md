# Contributing to Vocaldesk

Thanks for taking the time to contribute.

## Before you start

1. Check existing issues and open an issue for substantial behavior or schema changes.
2. Do not include customer data, call recordings, credentials, or production configuration in issues, fixtures, screenshots, or pull requests.
3. For security issues, follow [SECURITY.md](SECURITY.md) instead of opening a public issue.

## Local workflow

1. Follow the setup in [README.md](README.md).
2. Create a focused branch from the default branch.
3. Keep database changes in a new Supabase migration; do not edit an already-applied migration.
4. Run `npm run lint`, `npm run typecheck`, and `npm run build` before opening a pull request.
5. Explain the user-facing behavior, configuration changes, and validation performed in the pull request.

Keep contributions scoped and avoid unrelated formatting or dependency churn.
