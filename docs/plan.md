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
- Integration test key API flow

## Phase 5: Frontend
- Task list
- Create/edit form
- Status badge
- Delete button
- Loading and error states

## Phase 6: Documentation
- README
- DECISIONS
- AI usage note