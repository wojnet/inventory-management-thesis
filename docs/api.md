# API

## 1. Purpose

This document defines the intended API surface and the responsibilities of backend operations.

It describes **contracts and behaviour**, not implementation details. Route files and service modules remain the source of truth for exact code.

The API is expected to remain scoped to the current warehouse context. The current application uses short user-facing routes rather than embedding a warehouse identifier in every URL.

## 2. API Conventions

### Response format

Responses should use predictable JSON structures for JSON endpoints.

### Validation

All external input must be validated before reaching domain logic.

Validation must not rely on the AI model.

### Authorization

Authorization is a backend responsibility. Client-side visibility is not an authorization boundary.

### Errors

Errors should be deterministic and distinguish at least:

- invalid input,
- unauthenticated/unauthorized access,
- missing resources,
- domain rule violations,
- unexpected internal failures.

### Mutations

Mutations should return enough information for the client to update its state without guessing what the backend did.

Every successful mutation that changes inventory must also create appropriate change-tracking records.

## 3. API Surface Status

The API is being introduced incrementally. Only endpoints that are actually implemented should be treated as available in the running application. The sections below describe the intended product API and therefore use **planned** status unless the source code confirms implementation.

Authentication/session endpoints and detailed Settings/Membership endpoints are intentionally not specified here yet because their final application flow has not been established in the current project scope. Do not invent them solely from the database schema.

## 4. Existing Infrastructure Endpoint

### `GET /api/test-db`

**Status:** development/test endpoint; not part of the final product API.

Returns the current number of warehouses and is used only to verify PostgreSQL/Prisma connectivity.

This endpoint should be removed once it is no longer needed for infrastructure verification.

## 5. Planned Item Endpoints

These endpoints describe the intended API surface. Exact paths may evolve during implementation, but the responsibilities should remain stable.

### `GET /api/items`

Returns items in the current warehouse context.

Expected responsibilities:

- scope results to the current warehouse,
- exclude archived items by default unless explicitly requested,
- support the filtering/sorting required by the Items UI,
- return current item state.

### `POST /api/items`

Creates an item.

Expected responsibilities:

- validate name and supported fields,
- validate initial quantity,
- validate custom attributes,
- create the item transactionally,
- record a `CREATE` change event.

### `GET /api/items/:id`

Returns a single item and its relevant data.

The endpoint must ensure the item belongs to the current warehouse context.

### `PATCH /api/items/:id`

Updates general item metadata and/or supported item attributes.

A metadata edit should be treated as an explicit mutation and recorded in change tracking.

Quantity changes should use the dedicated stock operation rather than being silently mixed into unrelated metadata updates.

### `POST /api/items/:id/stock`

Changes the quantity of one item.

Supported operations conceptually include:

- increase,
- decrease,
- set.

The backend must validate the resulting quantity according to the application's domain rules and record the change.

### `POST /api/items/:id/archive`

Archives an item by setting its archival state rather than physically deleting the record.

The operation must be recorded in change tracking.

## 6. Planned Action Endpoints

### `GET /api/actions`

Returns available Actions in the current warehouse context.

### `POST /api/actions`

Creates a reusable Action with ordered steps.

Validation must ensure that each step contains the fields required for its selected operation.

### `GET /api/actions/:id`

Returns an Action and its ordered steps.

### `PATCH /api/actions/:id`

Updates an Action definition.

### `POST /api/actions/:id/preview`

Builds a deterministic preview of what would change if the Action were executed.

The preview is not itself a mutation and should not create a change event.

### `POST /api/actions/:id/execute`

Executes the Action.

The operation should:

1. validate the Action definition,
2. resolve targets,
3. validate all steps,
4. apply all required changes transactionally,
5. create one logical `ChangeEvent` with source `ACTION`,
6. create appropriate `ChangeEntry` records.

If execution fails validation, the inventory must remain unchanged.

## 7. Planned Timeline Endpoints

### `GET /api/timeline`

Returns chronological change events for the current warehouse.

Expected capabilities may include pagination and filters such as source/date, depending on the final UI requirements.

### `GET /api/timeline/:eventId`

Returns details for one ChangeEvent, including its change entries and relevant snapshot information.

## 8. Planned Restore Endpoints

### `POST /api/timeline/:eventId/restore-preview`

Builds a preview showing the differences between the selected historical state and the current state.

No inventory mutation occurs.

### `POST /api/timeline/:eventId/restore`

Restores the selected historical state.

The backend must:

- verify authorization,
- verify that the historical state belongs to the current warehouse,
- calculate the required changes,
- apply them transactionally,
- create a new `ChangeEvent` with source `RESTORE`,
- preserve the original historical event.

## 9. Planned AI Backend Surface

The AI integration may use internal tool/function interfaces rather than exposing every operation as a public REST endpoint.

Conceptually supported capabilities include:

- search/read inventory information,
- inspect item details,
- prepare item creation,
- prepare stock changes,
- prepare Action operations,
- other explicitly approved workflows.

AI tools must call validated application services rather than querying PostgreSQL directly.

For mutations:

```text
AI request
 → structured proposal
 → user confirmation
 → application service
 → database transaction
 → ChangeEvent(source = AI)
```

## 10. API Design Rules

- Every warehouse-scoped resource must be checked against the current warehouse context.
- Do not trust IDs supplied by the client without verifying ownership/context.
- Do not allow mutation endpoints to bypass change tracking.
- Keep preview operations side-effect free.
- Prefer dedicated domain endpoints for meaningful operations such as stock adjustment and restore rather than overloading generic CRUD endpoints.
- Keep the external API simple enough for the UI and AI tool layer to consume safely.
