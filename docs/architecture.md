# Architecture

## 1. Architectural Goal

The application uses a modular full-stack architecture intended to keep presentation, application logic, persistence, and infrastructure concerns understandable and independently maintainable.

The project uses Next.js as the main application framework, allowing frontend and backend functionality to live in one repository and deployment unit. This does **not** mean that business logic should be embedded directly into UI components or route handlers.

## 2. High-Level System

```text
┌──────────────────────────────┐
│            Browser           │
│   Next.js / React UI         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Next.js Backend        │
│ API / Server Components      │
│ Route Handlers / Server Code │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│   Application / Domain       │
│   Services + Validation      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Prisma Client          │
│   PostgreSQL Driver Adapter  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         PostgreSQL           │
└──────────────────────────────┘
```

## 3. Frontend

The frontend is implemented with React and Next.js using TypeScript.

The UI should be composed from reusable components and should keep client-side state only where interaction genuinely requires it.

Prefer server-side rendering/server components by default where appropriate. A component should become a client component because it needs client-side behaviour, not simply because it is convenient.

The current visual direction is a desktop-first, minimal interface with responsive support for smaller screens.

## 4. Backend and Application Logic

Next.js route handlers and server-side code expose application capabilities, but domain/business logic should be kept in reusable application services or modules.

The intended flow is:

```text
HTTP / Server Action / AI Tool
          ↓
     Validation
          ↓
Authorization / context checks
          ↓
 Application service / domain logic
          ↓
 Transactional persistence
          ↓
 Change tracking
```

The same underlying application services should be reused by different entry points whenever possible. For example, a manual quantity adjustment, an Action execution, and a confirmed AI proposal should not each implement their own independent inventory mutation rules.

## 5. Mutation Architecture

Inventory mutations are treated as controlled application operations.

A mutation should:

1. validate the input,
2. resolve the current warehouse/user context,
3. verify authorization,
4. load the required state,
5. validate domain rules,
6. apply the state change transactionally,
7. create the corresponding change event/entries,
8. create or update the relevant snapshot data,
9. return a deterministic result.

Where multiple records must change together, the operation should use a database transaction.

## 6. Change Tracking Architecture

The history subsystem separates three concepts:

- **ChangeEvent** — one logical operation, such as a manual edit, an Action execution, an AI-confirmed operation, or a restore.
- **ChangeEntry** — one specific item/field-level change belonging to a ChangeEvent.
- **WarehouseSnapshot** — a point-in-time representation of warehouse state associated with a ChangeEvent.

An Action that modifies three items therefore creates one logical `ChangeEvent` with multiple `ChangeEntry` records.

This structure allows the Timeline UI to present operations as meaningful user-level events while retaining detailed field-level information.

## 7. Restore Architecture

Restoration is implemented as a new mutation rather than a destructive time-travel operation.

Conceptually:

```text
Historical snapshot
        ↓
Compare with current state
        ↓
Apply required changes
        ↓
Create RESTORE ChangeEvent
        ↓
Store resulting state/snapshot
```

Previous events remain intact. A restored state can therefore itself become part of the subsequent history.

## 8. Action Architecture

Actions are persisted, reusable operations composed from ordered `ActionStep` records.

The Action system is intentionally limited to supported operations such as:

- increase quantity,
- decrease quantity,
- set quantity,
- set an attribute.

Actions are **not** a general-purpose scripting engine. Arbitrary code execution and unrestricted rule evaluation are outside the project scope.

Before execution, the system should be able to construct a deterministic preview of intended effects. Execution then goes through the same domain validation and change-tracking mechanism as other mutations.

## 9. AI Architecture

The AI Assistant is a conversational orchestration layer.

```text
User
 ↓
Chat UI
 ↓
AI API integration
 ↓
Tool / function call
 ↓
Validated application service
 ↓
Confirmation for mutations
 ↓
Transactional domain operation
 ↓
Change tracking
```

The model must not receive unrestricted database credentials or execute arbitrary SQL.

The AI should request structured capabilities exposed by the application. The application remains responsible for:

- authorization,
- validation,
- consistency,
- transaction boundaries,
- and mutation execution.

A mutation proposal should clearly show what will change. The user confirms before the actual mutation is performed.

AI chat content is intentionally not persisted in the application's database.

## 10. Persistence

PostgreSQL is the primary persistence layer.

Prisma is used as the ORM/data access abstraction. The current Prisma setup uses the PostgreSQL driver adapter required by the project's Prisma version.

Database schema evolution is handled through Prisma migrations.

Development uses `prisma migrate dev`; containerized application startup applies committed migrations through `prisma migrate deploy`.

## 11. Docker and Development Environment

The project uses Docker Compose for reproducible application and database infrastructure.

The intended local setup contains at least:

- an application container,
- a PostgreSQL container,
- a persistent PostgreSQL volume.

The application connects to PostgreSQL through the Docker service name inside the Compose network. Host tools such as pgAdmin can connect through the mapped host port.

The `.env` file contains local secrets/configuration and is not committed. `.env.example` contains non-secret placeholders.

## 12. Architectural Rules

- Keep business rules out of React components.
- Keep substantial business logic out of route handlers.
- Do not duplicate mutation logic across manual, Action, AI, and restore flows.
- Keep authorization deterministic and outside the LLM.
- Do not give the AI arbitrary SQL/database access.
- Use transactions for logically atomic multi-record mutations.
- Preserve change history when restoring state.
- Prefer explicit domain operations over generic database mutation helpers.
- Do not expand the project into an enterprise WMS/ERP without an explicit scope decision.
