# Project Overview

## 1. Project Identity

**Working thesis title:**

> Full-Stack Implementation of a Modern Inventory Management Application with Next.js

The project is a lightweight web-based inventory management application designed around simplicity, usability, flexibility, and transparent inventory history.

The application is intentionally **not** a full enterprise Warehouse Management System (WMS) or ERP platform. Its purpose is to cover the essential inventory-management workflows without reproducing the complexity and learning curve of large enterprise products.

## 2. Problem Being Addressed

Many inventory-management systems are designed for large-scale business environments. Their interfaces, workflows, and data models can be excessive for small teams or individual users who need a straightforward way to manage an inventory.

The project addresses this by combining:

- a simple inventory model,
- customizable item attributes,
- reusable actions for repetitive operations,
- transparent change tracking,
- historical state reconstruction and restoration,
- a visual timeline of inventory changes,
- and an AI assistant for natural-language interaction with the system.

The central product principle is to provide useful inventory functionality **without unnecessary enterprise complexity**.

## 3. Target Users

The application is intended primarily for:

- small teams,
- small organizations,
- individual users,
- and users managing relatively small or specialized inventories.

The system should not require extensive technical knowledge or formal training for normal day-to-day use.

## 4. Core Product Principles

### Simplicity

Common inventory operations should be understandable and fast to perform.

### Usability

The interface should prioritize clarity, predictable workflows, and low cognitive overhead.

### Flexibility

Items can use customizable attributes instead of forcing every use case into a rigid predefined data model.

### Transparency

Inventory mutations should be traceable. Users should be able to understand what changed, when it changed, and what caused the change.

### Safe automation

Reusable Actions and the AI Assistant may automate operations, but mutations must go through application validation and the same domain rules as manual operations.

### History preservation

Restoring a historical state creates a new change. Existing history is never silently erased or rewritten.

## 5. Main Modules

The system consists of five main functional areas:

1. **Item Management System** — creation, editing, archiving, quantity management, and customizable item attributes.
2. **Action System** — reusable operations that can modify one or multiple items and their attributes.
3. **Change Tracking System** — records inventory mutations and stores historical snapshots.
4. **Visual Timeline Interface** — presents change history in chronological form.
5. **AI Assistant** — a conversational interface that helps users navigate the system and proposes controlled operations through validated application functions.

## 6. Current Product Scope

The current product represents a **single logical warehouse context**. The data model supports users belonging to warehouses, but the current product experience does not attempt to provide a complete multi-warehouse management interface.

The application focuses on inventory data and its history. It does not attempt to become a complete business-management platform.

## 7. Explicitly Out of Scope

The following are intentionally outside the current project scope unless explicitly reconsidered later:

- full ERP functionality,
- supplier management,
- purchase orders and procurement workflows,
- invoicing and accounting,
- advanced warehouse logistics,
- shipping and transportation management,
- a full warehouse-location/bin management system,
- a general-purpose scripting or rule engine,
- persistent AI chat history,
- arbitrary AI-generated SQL,
- unrestricted autonomous AI mutations,
- a full multi-warehouse administration UI.

## 8. User Interface Direction

The application uses a desktop-first interface with a clean, neutral visual style inspired by products such as Linear and Notion.

Important UI principles include:

- clear hierarchy,
- minimal unnecessary decoration,
- strong typography,
- consistent spacing,
- explicit previews before consequential mutations,
- responsive behaviour for smaller screens,
- and a persistent navigation structure.

Primary application areas are currently represented by short routes such as:

- `/dashboard`
- `/items`
- `/actions`
- `/timeline`
- `/settings`

The AI Assistant is a popup/chat interface rather than a separate `/ai` route.

## 9. Technology and Design Stack

The current project stack is:

- **Next.js** with **TypeScript** for the full-stack application,
- **PostgreSQL** for persistence,
- **Prisma ORM** for data access and migrations,
- **Tailwind CSS** for styling,
- **Lucide** for interface icons,
- **Playwright** for end-to-end/user-flow testing,
- **Docker / Docker Compose** for reproducible application and database environments.

The UI and interaction design is maintained in the project's Figma design. The implementation should follow the established product decisions and visual direction rather than independently inventing a second product experience.

## 10. Current Implementation Status

The project has already established its core development infrastructure and database foundation, including:

- Next.js with TypeScript,
- PostgreSQL,
- Prisma ORM,
- Docker Compose,
- Prisma migrations,
- generated Prisma Client,
- PostgreSQL driver adapter,
- and the initial database schema.

The application is being developed incrementally. A feature described in this documentation should not automatically be interpreted as fully implemented unless the source code confirms it.
