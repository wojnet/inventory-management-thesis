# Features

## 1. Item Management

### Purpose

Provide a fast, understandable way to create and maintain inventory items without forcing users into a rigid enterprise data model.

### Item data

An item has core fields such as:

- name,
- description,
- quantity,
- custom attributes,
- timestamps,
- archive state.

### Custom attributes

Users can attach additional attributes to items. Attribute definitions are associated with the warehouse and item and have a declared data type.

Supported types are:

- text,
- number,
- boolean,
- date.

### Quantity management

Quantity changes are treated as a dedicated workflow rather than an incidental part of arbitrary metadata editing.

Supported conceptual operations:

- increase,
- decrease,
- set.

Quantity mutations must be tracked in history.

### Archiving

Archiving removes an item from normal active inventory views without physically deleting its record.

Archiving is itself a tracked change.

---

## 2. Action System

### Purpose

Actions provide reusable operations for repetitive inventory work.

Instead of manually applying the same operation to multiple items repeatedly, a user can define an Action and execute it when needed.

### Action structure

An Action contains ordered ActionSteps.

Supported operations:

- `INCREASE_QUANTITY`
- `DECREASE_QUANTITY`
- `SET_QUANTITY`
- `SET_ATTRIBUTE`

### Why `SET_ATTRIBUTE` exists

Actions are not limited to quantity management. Some repetitive workflows require changing custom item data, so the Action model supports setting an item's custom attribute value as well.

### Preview

Action execution should have a preview stage that shows expected effects before the actual mutation.

The preview must not modify the database.

### Execution

Execution is transactional. If validation fails, the operation should not leave a partial inventory update behind.

One Action execution represents one logical change event, even if it affects multiple items.

---

## 3. Change Tracking System

### Purpose

The Change Tracking System makes inventory state auditable and recoverable.

It is intentionally closer to version/history concepts than to a simple "last modified" field.

### Event model

A ChangeEvent answers:

> What logical operation happened?

A ChangeEntry answers:

> What specific item/field changed because of it?

A WarehouseSnapshot answers:

> What did the warehouse look like at this point in time?

### Sources

Every mutation has one source:

- `MANUAL`
- `ACTION`
- `AI`
- `RESTORE`

This allows the Timeline to explain not only what changed, but how the change originated.

### Historical state

Users can inspect historical state without changing the current state.

### Restore

Restore is itself a normal domain mutation.

The selected historical snapshot is used as the target state. The application calculates and applies the differences required to move the current warehouse toward that state.

A new ChangeEvent with source `RESTORE` records the operation.

The old event and snapshot remain intact.

---

## 4. Visual Timeline

### Purpose

The Timeline is the user-facing presentation of the Change Tracking System.

The Change Tracking System is the backend/history mechanism; the Timeline is the UI that makes that history understandable.

### Expected interaction

A typical flow is:

```text
Timeline
  ↓
Select event
  ↓
Inspect change details
  ↓
Inspect historical state / restore preview
  ↓
Optionally confirm restore
```

The Timeline should present history in chronological order and group multiple low-level entries that belong to the same logical event.

### Important distinction

Do not redesign the history model merely to make the Timeline easier to render. The backend model and the presentation model have different responsibilities.

---

## 5. AI Assistant

### Purpose

The AI Assistant provides natural-language access to selected application capabilities.

It is intended to reduce the learning curve and make common tasks easier to discover and perform.

### Session behaviour

AI conversations are intentionally not persisted. A new chat is a new session.

The project does not maintain AI conversation/message/proposal tables.

### Read operations

For read-oriented requests, the AI can use approved application capabilities to retrieve relevant inventory information and help users navigate the system.

### Mutation operations

Mutations follow a stricter flow:

```text
User request
   ↓
AI interprets intent
   ↓
Structured operation proposal
   ↓
Application validation
   ↓
User sees before → after preview
   ↓
User confirms
   ↓
Application service executes mutation
   ↓
ChangeEvent(source = AI)
```

### Safety rules

The AI:

- does not execute arbitrary SQL,
- does not access PostgreSQL directly,
- does not bypass authorization,
- does not decide whether an operation is allowed,
- does not execute a mutation before explicit confirmation.

The application, not the model, is responsible for correctness and enforcement.
