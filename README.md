# Task Tracker API Practice

A simple fullstack Task Tracker CRUD app for practicing AI-assisted development.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Express, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Testing: Vitest, Supertest
- Infra: Docker Compose

## Domain

Tasks have:

- `id`
- `title`
- `description`
- `status`: `TODO`, `IN_PROGRESS`, or `DONE`
- `createdAt`
- `updatedAt`

Allowed status transitions:

- `TODO` -> `IN_PROGRESS`
- `IN_PROGRESS` -> `DONE`
- `DONE` is terminal

## Prerequisites

- Node.js
- npm
- Docker and Docker Compose

## Setup

Start PostgreSQL:

```sh
docker compose up -d
```

Install backend dependencies:

```sh
cd backend
npm install
```

Create backend environment config:

```sh
cp .env.example .env
```

Run the database migration:

```sh
npx prisma migrate dev
```

Install frontend dependencies:

```sh
cd ../frontend
npm install
```

## Run Locally

Start the backend:

```sh
cd backend
npm run dev
```

Start the frontend in another terminal:

```sh
cd frontend
npm run dev
```

The frontend dev server proxies `/api/*` requests to the backend at `http://localhost:3000`.

## API Endpoints

Base backend URL: `http://localhost:3000`

- `GET /health`
- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks`
- `PUT /tasks/:id`
- `PATCH /tasks/:id/status`
- `DELETE /tasks/:id`

Example create request:

```json
{
  "title": "Write tests",
  "description": "Cover the task API flow"
}
```

Example status update request:

```json
{
  "status": "IN_PROGRESS"
}
```

## Tests

Backend:

```sh
cd backend
npm run typecheck
npm run build
npm run test
```

Frontend:

```sh
cd frontend
npm run typecheck
npm run build
npm run test
```

Backend API tests use the configured `DATABASE_URL` and clear the `Task` table during test setup and teardown. Use a local practice database, not shared or production data.

## Documentation

- `AGENTS.md`: project instructions and scope rules
- `docs/plan.md`: implementation plan
- `docs/architecture.md`: backend and frontend structure
- `docs/ai-usage.md`: guidance for AI-assisted changes
- `docs/ui-wireframe.md`: text-based UI wireframe
- `DECISIONS.md`: project decisions
