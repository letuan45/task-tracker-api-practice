# AGENTS.md

## Project

Build a simple fullstack Task Tracker CRUD app for practicing AI-assisted development.

## Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Express + TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Testing: Vitest + Supertest
- Infra: Docker Compose

## Domain

Task fields:
- id
- title
- description
- status: TODO | IN_PROGRESS | DONE
- createdAt
- updatedAt

Status rules:
- TODO -> IN_PROGRESS
- IN_PROGRESS -> DONE
- DONE is terminal
- DONE cannot go back to TODO or IN_PROGRESS

## Architecture rules

- Controllers/routes must stay thin.
- Business logic must live in task.service.ts.
- Status transition validation must live in the service layer.
- Do not put business rules directly in route handlers.
- Keep implementation simple and readable.

## Testing rules

- Add unit tests for status transition logic.
- Add one API integration test for create task -> update status -> list tasks.

## Commands

Backend:
- cd backend && npm run dev
- cd backend && npm run test
- cd backend && npx prisma migrate dev

Frontend:
- cd frontend && npm run dev

Infra:
- docker compose up -d

## Scope control

Do not add authentication.
Do not add users.
Do not add background jobs.
Do not add complex state management.
Prioritize clean CRUD, tests, and documentation.