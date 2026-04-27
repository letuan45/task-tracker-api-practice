# Architecture

## Backend

The backend uses a simple layered architecture:

Route -> Middleware -> Controller -> Service -> Prisma

Routes define URL mappings.
Middlewares validate request params and body shape.
Controllers call services with validated input and format success responses.
Services contain business logic.
Prisma handles database access.

Current task feature layout:

src/tasks/
- task.routes.ts: endpoint wiring and middleware order
- task.middlewares.ts: request param/body validation
- task.controller.ts: thin HTTP success response layer
- task.service.ts: business logic and Prisma calls
- task.const.ts: reusable task constants and error codes
- task.types.ts: task input and route-local types
- task.errors.ts: task-facing error exports

Shared backend helpers:

src/lib/
- async-handler.ts: forwards async route errors to Express
- error-handler.ts: sends consistent JSON error responses
- app-error.ts: typed application errors
- prisma.ts: Prisma client

## Frontend

The frontend is organized by feature:

src/features/tasks/
- TaskList.tsx
- TaskForm.tsx
- TaskStatusBadge.tsx

API calls live in:
src/api/tasksApi.ts

## Status transition

Task status transitions are enforced in task.service.ts.
Validation middleware may verify that a status value is syntactically valid, but it must not decide whether a transition is allowed.

Allowed:
- TODO -> IN_PROGRESS
- IN_PROGRESS -> DONE

Blocked:
- DONE -> TODO
- DONE -> IN_PROGRESS
- TODO -> DONE directly
