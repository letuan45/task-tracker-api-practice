# AI Usage

Use Codex for small, reviewable implementation steps. Read `AGENTS.md`, `docs/plan.md`, and the relevant source files before editing.

## Backend Guidance

- Keep routes focused on endpoint wiring.
- Put request shape validation in feature middleware files.
- Keep controllers thin and free of business rules.
- Keep task status transition rules in `task.service.ts`.
- Put reusable constants in `task.const.ts`.
- Put reusable types in `task.types.ts`.
- Put shared Express utilities in `backend/src/lib`.

## Verification

After backend changes, run:

- `cd backend && npm run typecheck`
- `cd backend && npm run build`
- `cd backend && npm run test`

If a command cannot run because Docker, the database, dependencies, or sandbox permissions are unavailable, state the exact blocker.

## Scope Control

Do not add authentication, users, background jobs, or complex state management unless explicitly requested.
