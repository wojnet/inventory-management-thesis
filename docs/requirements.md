# Requirements

## 1. Functional Requirements

The identifiers below provide stable references for implementation and testing. They describe intended system behaviour; implementation status must be verified in the codebase.

### Item Management

**FR-01 — Create item**  
A user can create an inventory item within the current warehouse context.

**FR-02 — View items**  
A user can browse inventory items and inspect their current state.

**FR-03 — Edit item metadata**  
A user can modify an item's general metadata such as name and description.

**FR-04 — Archive item**  
A user can archive an item without physically deleting its historical record.

**FR-05 — Manage quantity**  
A user can increase, decrease, or explicitly set an item's quantity.

**FR-06 — Custom attributes**  
An item can have user-defined attributes with supported data types: `TEXT`, `NUMBER`, `BOOLEAN`, and `DATE`.

**FR-07 — Inspect item details**  
A user can inspect an item's metadata, quantity, attributes, and relevant history.

### Actions

**FR-08 — Create reusable action**  
A user can define a named Action consisting of ordered steps.

**FR-09 — Configure action steps**  
An Action step can represent one of the supported operations:

- `INCREASE_QUANTITY`
- `DECREASE_QUANTITY`
- `SET_QUANTITY`
- `SET_ATTRIBUTE`

**FR-10 — Preview action execution**  
Before an Action is executed, the application should be able to present the expected before/after effects.

**FR-11 — Execute action**  
A user can execute a previously defined Action against its configured targets.

**FR-12 — Track action changes**  
An Action execution is represented as a single logical change event with one or more individual change entries.

### Change Tracking

**FR-13 — Record mutations**  
Every inventory mutation must produce an auditable change event.

**FR-14 — Record field/item-level changes**  
A change event can contain multiple change entries describing individual affected items or fields.

**FR-15 — Store historical snapshots**  
The system stores a snapshot of warehouse state for supported historical points.

**FR-16 — Browse history**  
A user can browse recorded inventory changes chronologically.

**FR-17 — Inspect change details**  
A user can inspect the cause and details of a change, including before/after values where available.

**FR-18 — View historical state**  
A user can inspect a historical state without modifying the current state.

**FR-19 — Restore historical state**  
A user can request restoration of a historical state. Restoration must create a new change event with source `RESTORE`.

**FR-20 — Preserve previous history**  
Restoration must not delete, rewrite, or silently alter previous history.

### AI Assistant

**FR-21 — Natural-language assistance**  
A user can interact with the system through natural-language requests.

**FR-22 — Read-oriented assistance**  
The AI can assist with navigation and questions about the current inventory through approved application capabilities.

**FR-23 — Propose mutations**  
For supported mutations, the AI can prepare a structured proposal describing the intended changes.

**FR-24 — Confirm AI mutations**  
The user must explicitly confirm a proposed AI mutation before it is executed.

**FR-25 — No direct database access for AI**  
The AI must not execute arbitrary SQL or access PostgreSQL directly.

**FR-26 — Track AI mutations**  
Confirmed AI mutations must be recorded with `ChangeSource.AI`.

**FR-27 — Non-persistent chat sessions**  
AI conversations are not persisted as application data. Each new session starts as a new chat.

### Warehouse and Membership

**FR-28 — User membership**  
A user can belong to a warehouse through a membership record.

**FR-29 — Warehouse-specific role**  
A user's role is defined per warehouse membership and currently supports `ADMIN` and `WORKER`.

## 2. Non-Functional Requirements

**NFR-01 — Usability**  
The interface should be learnable without extensive training and should make common operations straightforward.

**NFR-02 — Maintainability**  
Business logic should be organized into clear modules/services rather than being tightly coupled to UI or HTTP handlers.

**NFR-03 — Reliability**  
Inventory mutations should maintain database consistency and should not leave partially applied state.

**NFR-04 — Auditability**  
Inventory changes must be traceable to a source and actor when applicable.

**NFR-05 — Security**  
Authorization, input validation, and business-rule enforcement must be deterministic application concerns and must not depend on an LLM behaving correctly.

**NFR-06 — Responsiveness**  
The interface should remain usable across supported desktop and smaller-screen layouts.

**NFR-07 — Performance**  
Common inventory operations should avoid unnecessary database queries and client-side work.

**NFR-08 — Portability**  
The application should be reproducible across development environments through Docker-based infrastructure.

**NFR-09 — Testability**  
Core behaviour should be testable independently of presentation where practical, and important user workflows should be covered by automated tests.

**NFR-10 — Extensibility**  
The architecture should permit additional features without requiring a rewrite of the core inventory model.

## 3. Important Business Rules

1. Every inventory mutation has a source: `MANUAL`, `ACTION`, `AI`, or `RESTORE`.
2. An AI proposal is not a mutation. It becomes a mutation only after explicit user confirmation.
3. A restore operation creates new history rather than rewriting old history.
4. Change history should remain internally consistent with the resulting inventory state.
5. Quantity operations and general item metadata editing are conceptually separate workflows.
6. Actions are reusable, structured operations, not a general scripting language.
7. The AI Assistant is an orchestrator of approved application capabilities, not a replacement for domain logic.
8. User-to-warehouse roles are properties of the membership relationship, not global user properties.
