# Project Documentation

This directory contains the canonical project documentation for the Inventory Management Application developed as part of the engineering thesis **"Full-Stack Implementation of a Modern Inventory Management Application with Next.js"**.

The documentation is intentionally lightweight. It describes the project intent, requirements, architecture, API contracts, data model, feature behaviour, and important technical decisions without duplicating the source code.

## Documents

| File | Purpose |
|---|---|
| [`project.md`](./project.md) | Project purpose, target users, product principles, scope boundaries, and current status. |
| [`requirements.md`](./requirements.md) | Functional and non-functional requirements and key business rules. |
| [`architecture.md`](./architecture.md) | System structure, application layers, data flow, infrastructure, and architectural rules. |
| [`api.md`](./api.md) | Planned/current API surface, endpoint responsibilities, request/response expectations, and API rules. |
| [`database.md`](./database.md) | PostgreSQL/Prisma data model, relationships, invariants, history model, and persistence rules. |
| [`features.md`](./features.md) | Functional behaviour of Item Management, Actions, Change Tracking, Timeline, and AI Assistant. |
| [`decisions.md`](./decisions.md) | Accepted architectural and product decisions that should not be changed accidentally. |

## How to use this documentation

- Read `project.md` to understand what the application is and what it is not.
- Read `requirements.md` before changing user-visible behaviour.
- Read `architecture.md` before introducing or restructuring technical components.
- Read `api.md` when adding or changing API endpoints.
- Read `database.md` before changing Prisma models, relationships, or persistence behaviour.
- Read the relevant section of `features.md` before implementing feature logic.
- Read `decisions.md` when a proposed change conflicts with an existing architectural decision.

## Source of truth

The documentation describes intended behaviour and architectural constraints. The running code, Prisma schema, and database migrations remain the authoritative source for what is actually implemented.

When documentation and implementation disagree:

1. Do not silently choose one.
2. Identify the discrepancy.
3. Determine whether the code or documentation is outdated.
4. Update the appropriate source so that the project becomes internally consistent.

Documentation should describe **why** and **what**. Source code should describe **how**.
