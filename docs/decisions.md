# Architectural and Product Decisions

This document records decisions that have been intentionally accepted for the current project. A new implementation should respect these decisions unless the project scope or architecture is explicitly reconsidered.

## ADR-001 — Lightweight inventory scope

**Status:** Accepted

### Decision

The application is intentionally a lightweight inventory-management system rather than a complete enterprise WMS/ERP.

### Consequences

Features such as supplier management, purchasing, invoicing, logistics, and advanced warehouse operations are outside the current scope.

---

## ADR-002 — Single logical warehouse in the product experience

**Status:** Accepted

### Decision

The current product experience focuses on one active warehouse context. The data model retains a warehouse entity and memberships, allowing future expansion without making multi-warehouse management a core v1 feature.

### Consequences

Routes and UI should remain simple. Do not introduce a multi-warehouse administration system unless the scope is explicitly expanded.

---

## ADR-003 — Next.js as the full-stack application framework

**Status:** Accepted

### Decision

Next.js with TypeScript is used for both the user interface and backend application layer within a single repository.

### Consequences

The project can share types and modules across frontend/backend boundaries, but business logic should still be separated into reusable application services rather than being embedded in route handlers or components.

---

## ADR-004 — PostgreSQL for persistence

**Status:** Accepted

### Decision

PostgreSQL is the primary database.

### Rationale

The project needs relational integrity, transactions, timestamps, structured querying, and JSONB support for flexible attribute/snapshot data.

---

## ADR-005 — Prisma for database access

**Status:** Accepted

### Decision

Prisma is used as the application's ORM and migration workflow.

### Consequences

Schema changes are represented in `prisma/schema.prisma` and Prisma migrations rather than being maintained as ad-hoc manual database changes.

---

## ADR-006 — Separate ChangeEvent, ChangeEntry, and WarehouseSnapshot

**Status:** Accepted

### Decision

The history model deliberately separates logical events, detailed field/item changes, and full historical state snapshots.

### Rationale

A single user operation may change multiple items, so timeline-level events and low-level field changes need different representations. Snapshots additionally allow historical state reconstruction/restoration.

### Consequences

Do not collapse these three concepts into a single generic history table merely for simplicity.

---

## ADR-007 — Restore creates a new history event

**Status:** Accepted

### Decision

Restoring an old inventory state is itself a new mutation with `ChangeSource.RESTORE`.

### Rationale

Destructive rollback would make history ambiguous. A new restore event preserves a complete audit trail.

### Consequences

Never delete or rewrite previous change events as part of restore.

---

## ADR-008 — Actions are structured operations, not a scripting engine

**Status:** Accepted

### Decision

Actions consist of predefined, validated operation types and ordered steps.

### Rationale

The feature exists to simplify repetitive inventory tasks, not to introduce a general-purpose programming language or rule engine.

### Consequences

New Action operation types should be explicitly designed and validated. Arbitrary code execution is outside scope.

---

## ADR-009 — AI is an orchestrator, not the source of truth

**Status:** Accepted

### Decision

The AI Assistant interacts with validated application capabilities/tools. It does not receive unrestricted database access and must not generate arbitrary SQL for direct execution.

### Rationale

Business rules, authorization, and consistency must remain deterministic application responsibilities.

### Consequences

AI-related backend code should call domain/application services rather than bypassing them.

---

## ADR-010 — Explicit confirmation for AI mutations

**Status:** Accepted

### Decision

AI-generated mutations require explicit user confirmation before execution.

### Rationale

Natural-language interpretation is inherently less deterministic than direct structured input. The user should be able to inspect the proposed change before it becomes persistent state.

### Consequences

The AI flow requires a proposal/preview stage. An LLM response itself is never considered sufficient authorization to mutate inventory.

---

## ADR-011 — AI conversations are not persisted

**Status:** Accepted

### Decision

The application does not persist AI chat conversations, messages, or AI-specific proposals as database entities.

### Rationale

Persistent conversational history is not required for the current product scope and would add storage and privacy complexity.

### Consequences

Each chat session is independent. The durable representation of a confirmed AI mutation is the normal inventory change history with source `AI`.

---

## ADR-012 — Quantity changes are a distinct workflow

**Status:** Accepted

### Decision

Stock quantity modification is treated separately from general item metadata editing.

### Rationale

Quantity changes are operational inventory events and deserve an explicit interaction and audit trail.

### Consequences

A dedicated stock-adjustment operation is preferred over allowing every generic item update endpoint to silently modify quantity.

---

## ADR-013 — Custom attributes use a small fixed set of data types

**Status:** Accepted

### Decision

Custom item attributes support `TEXT`, `NUMBER`, `BOOLEAN`, and `DATE`.

### Consequences

The system remains flexible without introducing a large type system. The attribute value is stored as JSONB, while the declared data type controls validation and presentation.

---

## ADR-014 — Short application routes

**Status:** Accepted

### Decision

The user-facing application uses short routes such as `/items`, `/actions`, and `/timeline` rather than embedding a warehouse ID in every route.

### Consequences

The active warehouse context is resolved by application/session context rather than being repeated in every URL.

---

## ADR-015 — AI Assistant is a popup, not a primary navigation route

**Status:** Accepted

### Decision

The AI Assistant is presented as an interactive popup/chat experience rather than as a separate `/ai` page in the main navigation.

### Consequences

The AI should be accessible from the application without becoming a separate destination that duplicates existing workflows.
