# 📝 Inventory Management Thesis

This project is being developed as a part of an engineering thesis. It's a modern full-stack inventory management application with focus on simplicity and intuitiveness. (●'◡'●)

### 📦 Scope

- Warehouse and user management
- Inventory items with custom attributes
- Reusable inventory actions
- Change tracking and warehouse snapshots
- Role-based access control
- AI-assisted inventory operations

### 🧰 Tech stack

- Next.js with TypeScript
- PostgreSQL
- Docker
- ☆ Playwright ☆
- AI model to be determined

### 🚢 Docker Services

|service|port|
|-|-|
|app|3000|
|db|5000|

### 🗝️ Environment Variables

|name|description|
|-|-|
|POSTGRES_USER||
|POSTGRES_PASSWORD||
|POSTGRES_DB||
|DATABASE_URL||
|NODE_ENV||

### ⚡ Handy Shortcuts

|command|description|
|-|-|
|`npm run dev`|start dev server|
|`npm run build`|build for production|
|`npm run start`|serve production build|
|`npm run lint`|check code with Biome|
|`npm run format`|format code with Biome|
|`npm run seed`|seed the database|
|`npx prisma migrate dev`|create and apply migration|
|`npx prisma db push`|sync schema without migration|
|`npx prisma generate`|generate Prisma Client|
|`npx prisma studio`|open database GUI|
|`npx prisma migrate reset`|reset database and reseed|
|`npx playwright test`|run e2e tests|
|`docker compose up -d`|start app and db in background|
|`docker compose down`|stop and remove containers|