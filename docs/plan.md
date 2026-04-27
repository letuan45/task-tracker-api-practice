# Implementation Plan

## Phase 1: Project setup
- Create monorepo structure
- Add backend and frontend folders
- Add Docker Compose with PostgreSQL
- Add .env.example

## Phase 2: Backend data model
- Add Prisma
- Define Task model
- Add migration
- Add seed if useful

## Phase 3: Backend API
- Implement task service
- Implement task routes
- Add CRUD endpoints
- Add status transition validation

## Phase 4: Tests
- Unit test task service status transitions
- Integration test key API

## Phase 5: Backend refactor
- const values must put inside const.ts file
- Some validation check, must implement in middlewares.ts, so route can use it
- Put some chore logic to utils.ts if needed
- Put test logics to module, Example: task/tests/*.test.ts

## Phase 6: Frontend
- Task list
- Create/edit form
- Status badge
- Delete button
- Loading and error states
- Add unit test for UI test cases, assumed that the is a mocked backend

## Phase 7: Documentation
- README
- DECISIONS
- AI usage note