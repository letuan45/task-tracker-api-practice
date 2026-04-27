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
- Keep API tests pointed at a local practice database. The current integration test clears task data through Prisma, so never run it against shared or production data.

## Frontend Guidance

- Keep task UI under `frontend/src/features/tasks`.
- Keep API request logic in `frontend/src/api/tasksApi.ts`.
- Keep state local to the task feature; do not add complex state management.
- Preserve loading, error, empty, create, edit, status update, and delete states.
- During local development, the Vite server proxies `/api/*` requests to the backend.

## Documentation Guidance

- Update `README.md` when setup commands, environment variables, ports, or API endpoints change.
- Update `docs/architecture.md` when feature structure or responsibility boundaries change.
- Update `DECISIONS.md` when a technical choice changes or a scope decision needs to be recorded.
- Keep documentation scoped to the practice app. Do not document auth, users, or background jobs as planned work.

## Verification

After backend changes, run:

- `cd backend && npm run typecheck`
- `cd backend && npm run build`
- `cd backend && npm run test`

After frontend changes, run:

- `cd frontend && npm run typecheck`
- `cd frontend && npm run build`
- `cd frontend && npm run test`

After documentation-only changes, read the changed files and check that commands, paths, and scope statements match the repository.

If a command cannot run because Docker, the database, dependencies, or sandbox permissions are unavailable, state the exact blocker.

## Scope Control

Do not add authentication, users, background jobs, or complex state management unless explicitly requested.
