# Decisions

## Why this stack?

I chose React, Express, PostgreSQL, and Prisma because they are simple, common, and fast to build for a CRUD practice app.

## Why no auth?

Authentication is intentionally excluded because this practice app focuses on CRUD, service-layer business rules, testing, and AI-assisted workflow.

## Why status validation in service?

The status transition rule is business logic, so it belongs in the service layer. This keeps route handlers thin and makes the behavior easy to unit test.

## If I had one more day

I would add authentication, per-user task ownership, and an audit trail for task status changes.