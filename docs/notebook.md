# Project Notebook

Chronological record of the work completed on the Inventory Management Thesis project.

## 2026-09-13

### 1. Project orientation and documentation review
- Read the canonical documentation in `docs/README.md`, `docs/project.md`, `docs/requirements.md`, `docs/architecture.md`, `docs/api.md`, `docs/database.md`, `docs/features.md`, and `docs/decisions.md`.
- Established the project scope as a lightweight inventory management application, not an ERP/WMS.
- Identified the main product areas: items, reusable actions, change tracking, timeline, and AI assistant.
- Recorded the initial implementation plan in session memory.

### 2. Determined the first implementation slice
- Chose item listing as the first concrete feature slice because it was low-risk and useful for proving the app-to-database flow.
- Confirmed that the `src/app/api` folder was empty and the Items UI was still hardcoded.
- Verified the Prisma schema already supported the warehouse, user, membership, item, attribute, change event, and snapshot models.

### 3. Added local development seed data
- Added seed support for a default user named `admin` and a default warehouse named `warehouse`.
- Created starter inventory items in that warehouse so the UI would have meaningful data before authentication exists.
- Added `npm run seed` support and configured Prisma so `prisma db seed` works correctly.
- Updated the Docker startup flow so the app runs migrations and seeds automatically when the container starts.

### 4. Built the first read-only item flow
- Implemented warehouse-scoped item listing through shared item service code.
- Added `GET /api/items`.
- Replaced the hardcoded item list with real data from PostgreSQL.
- Kept the list page server-rendered so it reads from the database directly.

### 5. Added item creation
- Implemented `POST /api/items`.
- Added a create-item form at `/items/new`.
- Supported custom attributes on new items, including `TEXT`, `NUMBER`, `BOOLEAN`, and `DATE` values.
- Wrote the new item data to the database and recorded a change event, change entries, and a warehouse snapshot.

### 6. Added item detail, edit, and archive flow
- Added item detail pages and `GET /api/items/[itemId]`.
- Linked item names from the list to the detail page.
- Implemented item editing through `PATCH /api/items/[itemId]` and a dedicated edit form at `/items/[itemId]/edit`.
- Implemented item archive through `POST /api/items/[itemId]` and a client-side archive button on the detail page.
- Ensured edits and archive actions also create change-tracking records and updated snapshots.

### 7. Added timeline browsing
- Built a shared timeline service for reading change events and event details.
- Added `GET /api/timeline` and `GET /api/timeline/[eventId]`.
- Implemented the timeline list page at `/timeline`.
- Implemented the timeline event detail page at `/timeline/[eventId]`.
- Displayed change entries and stored snapshot JSON so historical mutations can be inspected.

### 8. Cleaned up the timeline page structure
- Removed a leftover duplicate client stub from `src/app/(routes)/timeline/page.tsx`.
- Kept the timeline page as a single server component export.

### 9. Backlog tracking
- Created `docs/todo.md` as a working backlog for remaining implementation slices.
- Seeded the backlog with the next major tasks: item flow completion, timeline enhancement, actions, and placeholder route replacement.

### 10. Validation and workflow fixes
- Validated touched files repeatedly with the TypeScript checker and targeted workspace error checks.
- Fixed Prisma seed configuration when `npm run seed` initially reported that no seed command was configured.
- Confirmed Docker Compose can bring up the database and app successfully after the seed and startup fixes.
- Confirmed the current item and timeline files compile cleanly after the edits.

## Summary of current state
- Items now support list, create, detail, edit, archive, and custom attributes.
- Seed data is available for local development using the default `admin` user and `warehouse` warehouse.
- Timeline browsing is implemented for change events and event details.
- The next major unfinished areas are reusable actions, restore flows, and replacing placeholder routes such as dashboard, settings, and actions.
