# Task Manager

A full-stack task management app built with Next.js 16 (App Router). Supports creating, toggling, and deleting tasks via both a web UI and a REST API.

> **Note:** Tasks are stored in an in-memory `Map`. Data does not persist between server restarts. This is intentional — see [Technical Decisions](#technical-decisions).

---

## Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.2 |
| Runtime | React | 19.2.4 |
| Validation | Zod | 4.x |
| Styling | Tailwind CSS | 4.x |
| Testing | Vitest | 4.x |
| Language | TypeScript | 5.x |

---

## Setup

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available scripts

```bash
npm run dev       # Start dev server with hot reload
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run test      # Run tests in watch mode
npm run test:run  # Run tests once (CI)
```

---

## Project Structure

```
├── app/
│   ├── page.tsx              # Home page (Server Component)
│   ├── layout.tsx            # Root layout
│   ├── error.tsx             # Error boundary
│   ├── loading.tsx           # Suspense loading UI
│   ├── globals.css           # Global styles
│   ├── actions/
│   │   └── tasks.ts          # Server Actions (UI mutations)
│   └── api/
│       └── tasks/
│           ├── route.ts      # GET /api/tasks, POST /api/tasks
│           └── [id]/
│               └── route.ts  # GET, PUT, DELETE /api/tasks/:id
├── components/
│   ├── TaskForm.tsx          # Create task form (Client Component)
│   ├── TaskList.tsx          # Task list renderer
│   ├── TaskCard.tsx          # Single task card with toggle/delete (Client Component)
│   └── FormMessage.tsx       # Success/error feedback banner
├── lib/
│   ├── types.ts              # Zod schemas + TypeScript types
│   ├── store.ts              # In-memory Map store (singleton)
│   └── tasks.service.ts      # Business logic (CRUD operations)
└── __tests__/
    ├── tasks.service.test.ts # Service unit tests
    └── api/
        └── tasks.test.ts     # API route integration tests
```

---

## Architecture

The app follows a layered architecture with a strict dependency direction:

```
┌─────────────────────────────────────┐
│           Browser (Client)          │
│   TaskForm, TaskCard (useTransition) │
└──────────────┬──────────────────────┘
               │ Server Actions (progressive enhancement)
               ▼
┌─────────────────────────────────────┐
│         app/actions/tasks.ts        │  ← revalidatePath after mutation
│         app/api/tasks/route.ts      │  ← REST API (JSON)
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│       lib/tasks.service.ts          │  ← Validates input via Zod
│                                     │     Returns ServiceResult<T>
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│          lib/store.ts               │  ← In-memory Map<string, Task>
└─────────────────────────────────────┘
```

All service functions return a discriminated union `ServiceResult<T>`:

```ts
type ServiceResult<T> =
  | { success: true;  data: T }
  | { success: false; error: { code: ServiceErrorCode; message: string } }
```

Error codes: `NOT_FOUND` | `VALIDATION_ERROR`

---

## API Reference

Base URL: `http://localhost:3000`

### Task object

```json
{
  "id": "uuid",
  "title": "Buy milk",
  "description": "Optional description",
  "status": "PENDING" | "COMPLETED"
}
```

### Endpoints

#### `GET /api/tasks`

Returns all tasks.

**Response `200`**
```json
[
  { "id": "...", "title": "Buy milk", "status": "PENDING" }
]
```

---

#### `POST /api/tasks`

Creates a new task.

**Request body**
```json
{
  "title": "Buy milk",
  "description": "Optional",
  "status": "PENDING"
}
```

| Field | Type | Required |
|---|---|---|
| `title` | `string` (min 1) | ✅ |
| `description` | `string` | — |
| `status` | `"PENDING" \| "COMPLETED"` | ✅ |

**Response `201`** — created task object

**Response `400`** — `VALIDATION_ERROR` or `PARSE_ERROR`
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

---

#### `GET /api/tasks/:id`

Returns a single task by ID.

**Response `200`** — task object

**Response `404`** — `NOT_FOUND`

---

#### `PUT /api/tasks/:id`

Partially updates a task. All fields are optional.

**Request body**
```json
{
  "title": "Updated title",
  "status": "COMPLETED"
}
```

**Response `200`** — updated task object

**Response `400`** — `VALIDATION_ERROR` or `PARSE_ERROR`

**Response `404`** — `NOT_FOUND`

---

#### `DELETE /api/tasks/:id`

Deletes a task.

**Response `204`** — no body

**Response `404`** — `NOT_FOUND`

---

## Technical Decisions

**In-memory store instead of a database**
The store is a module-level `Map<string, Task>`. This keeps the project focused on Next.js patterns (Server Actions, route handlers, App Router) without DB overhead. A real persistence layer (e.g. Prisma + SQLite) can replace `lib/store.ts` without touching the service or API layers.

**Server Actions + REST API coexisting**
The UI uses Server Actions (`app/actions/tasks.ts`) for mutations — they give `useTransition` support and automatic path revalidation with zero client-side fetch boilerplate. The REST API (`app/api/tasks/`) exists for external consumers and is tested independently. Both go through the same service layer.

**Zod validation at the service boundary**
Input is validated inside `tasks.service.ts` before touching the store. Route handlers and Server Actions pass raw input down and let the service return a typed `ServiceResult`. Validation logic lives in exactly one place.

**Vitest over Jest**
Vitest has native ESM support, shares the Vite transform pipeline (so `@/*` path aliases work without extra config), and is significantly faster. Route handlers are tested by importing and calling them directly with native `Request` objects — no HTTP server required.