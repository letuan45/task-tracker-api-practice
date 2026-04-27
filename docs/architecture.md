# Architecture

## Backend

The backend uses a simple layered architecture:

Route -> Controller -> Service -> Prisma

Routes define URL mappings.
Controllers parse requests and call services.
Services contain business logic.
Prisma handles database access.

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

Allowed:
- TODO -> IN_PROGRESS
- IN_PROGRESS -> DONE

Blocked:
- DONE -> TODO
- DONE -> IN_PROGRESS
- TODO -> DONE directly