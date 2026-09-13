# Database

## 1. Database Technology

The application uses **PostgreSQL** as its relational database and **Prisma** as its ORM/data-access layer.

Prisma migrations are the mechanism for versioning schema changes.

The current schema uses UUID identifiers, PostgreSQL timestamps, decimal quantities, and JSONB for flexible values where required.

## 2. Core Tables

The current domain model contains ten main tables/models:

1. `app_user`
2. `warehouse`
3. `warehouse_membership`
4. `item`
5. `item_attribute`
6. `action`
7. `action_step`
8. `change_event`
9. `change_entry`
10. `warehouse_snapshot`

The exact Prisma schema is maintained in `prisma/schema.prisma` and is the authoritative representation of the implemented model.

## 3. Users and Warehouses

### `app_user`

Represents an application user.

Important fields:

- `id`
- `email`
- `passwordHash`
- `name`
- `createdAt`
- `updatedAt`

A user can belong to multiple warehouses through memberships.

### `warehouse`

Represents a logical inventory context.

Important fields:

- `id`
- `name`
- `description`
- timestamps

A warehouse owns items, attributes, Actions, change events, and snapshots.

### `warehouse_membership`

Represents the relationship between a user and a warehouse.

The role belongs here because the same user may have different permissions in different warehouses.

Supported roles:

- `ADMIN`
- `WORKER`

Important invariant:

```text
(user_id, warehouse_id) must be unique
```

A separate index on `warehouse_id` supports warehouse-scoped queries.

## 4. Items

### `item`

Represents an inventory item.

Important fields:

- `name`
- `description`
- `quantity`
- `warehouseId`
- `archivedAt`
- timestamps

Quantity is stored as a PostgreSQL decimal with three decimal places. This allows quantities that are not necessarily whole numbers.

`archivedAt` is used instead of a boolean archive flag so the system can record when an item entered the archived state.

Items are warehouse-scoped.

### `item_attribute`

Stores customizable item attributes.

Supported data types:

- `TEXT`
- `NUMBER`
- `BOOLEAN`
- `DATE`

The value itself is stored as JSONB because the structure depends on the declared attribute data type.

Attributes contain timestamps because attribute changes are relevant to the historical model.

## 5. Actions

### `action`

Represents a reusable operation defined for a warehouse.

Important fields include:

- `warehouseId`
- optional `createdByUserId`
- `name`
- `description`
- archival state

### `action_step`

Represents one ordered operation inside an Action.

Supported operation types are:

- `INCREASE_QUANTITY`
- `DECREASE_QUANTITY`
- `SET_QUANTITY`
- `SET_ATTRIBUTE`

An Action step has a unique `(actionId, position)` pair so execution order is deterministic.

The fields used by a step depend on the selected operation. The application's validation/service layer is responsible for enforcing these cross-field rules.

## 6. Change Tracking Model

### `change_event`

Represents one logical inventory operation.

Possible sources:

- `MANUAL`
- `ACTION`
- `AI`
- `RESTORE`

Possible change types are represented on individual entries rather than on the event itself.

Useful relationships:

- warehouse,
- actor user,
- Action when applicable,
- restored event when this event is a restore,
- change entries,
- optional warehouse snapshot.

The event is the unit shown to users as one meaningful timeline operation.

### `change_entry`

Represents an individual field/item-level change within a logical event.

Important fields include:

- `itemId`
- `changeType`
- `fieldPath`
- `beforeValue`
- `afterValue`

Possible change types:

- `CREATE`
- `UPDATE`
- `ARCHIVE`
- `RESTORE`

A single event can contain multiple entries.

For example, an Action changing three items can produce:

```text
1 ChangeEvent
3+ ChangeEntry records
```

This keeps the event-level timeline understandable while retaining detailed audit information.

## 7. Warehouse Snapshots

### `warehouse_snapshot`

Stores a JSONB representation of warehouse state associated with a specific change event.

Important relationships:

- one warehouse,
- one unique change event.

Snapshots provide the state required for historical inspection and restoration.

The snapshot mechanism is not intended to replace change entries. The two serve different purposes:

- entries explain **what changed**,
- snapshots represent **what the warehouse looked like** at a recorded point in time.

## 8. Restore Relationship

`change_event.restoredEventId` links a RESTORE event to the historical event/state it was created from.

Conceptually:

```text
Event A  ───── historical state
   │
   ▼
Restore request
   │
   ▼
Event B (source = RESTORE)
```

Event A remains unchanged. Event B becomes part of the history.

## 9. Referential Integrity

The database uses foreign keys with deliberate deletion behaviour.

Important examples:

- Deleting a warehouse can cascade to warehouse-owned data.
- Deleting a user can remove their memberships.
- Deleting the creator of an Action does not destroy the Action; the creator reference can become null.
- Deleting an item is restricted where an existing Action step depends on that item.
- Change entries can retain historical information even if the current item reference is later unavailable.

Application code should not bypass these integrity constraints.

## 10. Data Invariants

The following rules are important enough to preserve whenever the schema evolves:

1. Every item belongs to exactly one warehouse.
2. Every item attribute belongs to both an item and its warehouse context.
3. Every Action belongs to one warehouse.
4. Action step ordering is unique within its Action.
5. A user's warehouse membership is unique per `(user, warehouse)` pair.
6. Change events are warehouse-scoped.
7. Snapshots belong to the same warehouse as their associated event.
8. AI is not represented as a database user; AI is represented by `ChangeSource.AI` while the human actor can still be recorded.
9. Historical restoration must not rewrite previous events.
10. Quantity changes must preserve the database's numeric precision and application-level domain rules.

## 11. Schema vs Application Validation

Not every business rule should be encoded directly in Prisma schema declarations.

For example, an `ActionStep` may require different combinations of `itemId`, `attributeId`, `numericValue`, and `attributeValue` depending on its operation.

These rules belong in the application validation/domain layer unless a database-level constraint is deliberately added.

## 12. Database Changes

Schema changes should be made through Prisma migrations rather than manually modifying the live database.

Development workflow:

```text
Edit Prisma schema
      ↓
prisma migrate dev --name <change>
      ↓
Review migration
      ↓
Generate Prisma Client when required
      ↓
Commit schema + migration
```

Containerized environments apply committed migrations with:

```text
prisma migrate deploy
```
