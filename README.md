# Reusable Monorepo Setup

This repository is a reusable TypeScript monorepo setup for building full-stack applications with a modular, feature-based architecture.

The current example app is `job-finder`, but the structure is intentionally generic enough to reuse for other products. It separates deployable applications from shared packages, keeps domain features isolated, and provides common tooling for TypeScript, linting, validation, styling, API access, and logging.

## What This Monorepo Gives You

- npm workspaces for managing multiple apps and internal packages from one root.
- Turborepo for running `dev`, `build`, `lint`, and `typecheck` tasks across the workspace.
- A React + Vite client app.
- An Express API app.
- Frontend feature-based architecture under `apps/client/src/features`.
- Backend module-based architecture under `apps/api/src/modules`.
- Shared frontend primitives under `apps/client/src/shared`.
- Shared backend infrastructure under `apps/api/src/shared`.
- Cross-app TypeScript types in `packages/shared-types`.
- Cross-app Zod validation schemas in `packages/shared-schemas`.
- Shared Pino logger package in `packages/logger`.
- Shared ESLint and TypeScript config packages.

## Architecture Overview

The repo is split into three main layers:

```text
apps/
  Deployable applications.

packages/
  Reusable internal packages shared by apps.

root tooling/
  Workspace scripts, Turbo pipeline, lockfile, and repo-level config.
```

Inside each app, code is further split by responsibility:

```text
app/
  Application composition: providers, router, store, layouts.

features/ or modules/
  Business/domain features grouped by capability.

shared/
  Reusable infrastructure and generic utilities used by many features/modules.
```

The intended rule is simple:

- Put product/domain code inside a feature or module.
- Put reusable, non-domain-specific code in `shared`.
- Put cross-application contracts in `packages`.
- Keep app startup and wiring in `app`, `app.ts`, or `server.ts`.

## Folder Structure

Generated folders such as `node_modules`, `dist`, `.turbo`, and cache folders are not shown.

```text
.
|-- apps
|   |-- api
|   |   |-- src
|   |   |   |-- app.ts
|   |   |   |-- server.ts
|   |   |   |-- config
|   |   |   |-- modules
|   |   |   |   |-- auth
|   |   |   |   `-- users
|   |   |   `-- shared
|   |   |       |-- constants
|   |   |       |-- db
|   |   |       |-- middleware
|   |   |       |   `-- errorHandler.ts
|   |   |       |-- queues
|   |   |       |-- types
|   |   |       `-- utils
|   |   |           `-- AppError.ts
|   |   |-- eslint.config.js
|   |   |-- package.json
|   |   `-- tsconfig.json
|   `-- client
|       |-- src
|       |   |-- app
|       |   |   |-- layouts
|       |   |   |-- providers
|       |   |   |   `-- index.tsx
|       |   |   |-- router
|       |   |   |   `-- index.tsx
|       |   |   `-- store
|       |   |       `-- index.ts
|       |   |-- assets
|       |   |-- features
|       |   |   `-- auth
|       |   |       |-- api
|       |   |       |-- components
|       |   |       |-- hooks
|       |   |       |-- pages
|       |   |       |-- routes
|       |   |       |-- schemas
|       |   |       |-- store
|       |   |       `-- types
|       |   |-- shared
|       |   |   |-- api
|       |   |   |   `-- baseApi.ts
|       |   |   |-- components
|       |   |   |   `-- ui
|       |   |   |       `-- button.tsx
|       |   |   |-- constants
|       |   |   |-- hooks
|       |   |   |-- lib
|       |   |   |   `-- utils.ts
|       |   |   |-- types
|       |   |   `-- utils
|       |   |-- index.css
|       |   |-- main.tsx
|       |   `-- vite-env.d.ts
|       |-- components.json
|       |-- eslint.config.js
|       |-- index.html
|       |-- package.json
|       |-- tsconfig.json
|       |-- tsconfig.node.json
|       `-- vite.config.ts
|-- packages
|   |-- eslint-config
|   |   |-- index.js
|   |   `-- package.json
|   |-- logger
|   |   |-- src
|   |   |   `-- index.ts
|   |   |-- eslint.config.js
|   |   |-- package.json
|   |   `-- tsconfig.json
|   |-- shared-schemas
|   |   |-- src
|   |   |   `-- index.ts
|   |   `-- package.json
|   |-- shared-types
|   |   |-- src
|   |   |   |-- index.ts
|   |   |   |-- job.ts
|   |   |   `-- user.ts
|   |   `-- package.json
|   `-- typescript-config
|       |-- base.json
|       |-- node-library.json
|       |-- package.json
|       `-- react-library.json
|-- package.json
|-- package-lock.json
|-- turbo.json
`-- README.md
```

## Root Workspace

The root `package.json` defines the monorepo.

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

Root scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run all workspace `dev` tasks through Turbo. |
| `npm run dev:tui` | Run Turbo dev mode with the terminal UI. |
| `npm run build` | Build all workspaces with a `build` script. |
| `npm run lint` | Lint all workspaces with a `lint` script. |
| `npm run typecheck` | Type-check all workspaces with a `typecheck` script. |

The root `turbo.json` controls task orchestration:

- `build` depends on upstream package builds.
- `dev` is persistent and uncached.
- `lint` and `typecheck` also run dependency tasks first.

## Frontend App: `apps/client`

The client is a React 19 + Vite app using TypeScript, React Router, Redux Toolkit, RTK Query, Tailwind CSS, Radix primitives, and a shadcn-style component setup.

### Client Responsibilities

- Render browser UI.
- Own frontend routing.
- Own client-side state and API cache.
- Organize product UI by feature.
- Share generic UI, hooks, constants, and helpers through `src/shared`.
- Import cross-app contracts from `packages/shared-types` and `packages/shared-schemas`.

### Client App Layer

```text
apps/client/src/app
|-- layouts
|-- providers
|   `-- index.tsx
|-- router
|   `-- index.tsx
`-- store
    `-- index.ts
```

Use this layer for application wiring only.

- `main.tsx` mounts React and renders the router inside app providers.
- `providers/index.tsx` registers global providers such as Redux.
- `router/index.tsx` defines top-level routes.
- `store/index.ts` configures Redux and RTK Query middleware.
- `layouts` is reserved for app-level page shells.

Avoid placing business logic directly in this layer. Business logic should live in `features`.

### Client Feature Layer

```text
apps/client/src/features
`-- auth
    |-- api
    |-- components
    |-- hooks
    |-- pages
    |-- routes
    |-- schemas
    |-- store
    `-- types
```

Each feature should be self-contained. The existing `auth` feature folder is the template for future features.

Recommended feature folder meanings:

| Folder | What goes here |
| --- | --- |
| `api` | Feature-specific RTK Query endpoint injection or API client helpers. |
| `components` | Components used only by this feature. |
| `hooks` | Feature-specific React hooks. |
| `pages` | Route-level screens for this feature. |
| `routes` | Feature route definitions or route objects. |
| `schemas` | Feature-specific form or runtime validation schemas. |
| `store` | Feature-specific Redux slices or state utilities. |
| `types` | Feature-only TypeScript types. |

Example future feature:

```text
apps/client/src/features/jobs
|-- api
|   `-- jobsApi.ts
|-- components
|   |-- JobCard.tsx
|   `-- JobFilters.tsx
|-- hooks
|   `-- useJobFilters.ts
|-- pages
|   |-- JobDetailsPage.tsx
|   `-- JobsPage.tsx
|-- routes
|   `-- jobsRoutes.tsx
|-- schemas
|   `-- jobSearchSchema.ts
|-- store
|   `-- jobsSlice.ts
`-- types
    `-- index.ts
```

### Client Shared Layer

```text
apps/client/src/shared
|-- api
|   `-- baseApi.ts
|-- components
|   `-- ui
|       `-- button.tsx
|-- constants
|-- hooks
|-- lib
|   `-- utils.ts
|-- types
`-- utils
```

Use `shared` for code that is not owned by one feature.

Current shared pieces:

- `shared/api/baseApi.ts` creates the base RTK Query API with `Auth`, `User`, and `Jobs` tag types.
- `shared/components/ui/button.tsx` provides a reusable variant-based button.
- `shared/lib/utils.ts` exposes `cn`, a class name helper that combines `clsx` and `tailwind-merge`.

Good candidates for `shared`:

- Generic UI primitives.
- Generic hooks.
- App-wide constants.
- Reusable formatting helpers.
- Generic API base configuration.
- Utility types used by many features.

Do not put feature-specific components, hooks, schemas, or state in `shared`.

### Client Aliases

The client supports these imports through `vite.config.ts` and `tsconfig.json`:

| Alias | Path |
| --- | --- |
| `@app/*` | `apps/client/src/app/*` |
| `@shared/*` | `apps/client/src/shared/*` |
| `@features/*` | `apps/client/src/features/*` |
| `@assets/*` | `apps/client/src/assets/*` |

Example:

```ts
import { Button } from '@shared/components/ui/button';
import { router } from '@app/router';
```

## Backend App: `apps/api`

The API is an Express 5 app using TypeScript, `dotenv`, CORS, JSON body parsing, and centralized error handling.

### API Responsibilities

- Expose HTTP routes.
- Own backend domain modules.
- Load environment variables.
- Compose middleware and routers.
- Keep backend-only infrastructure under `src/shared`.
- Import shared contracts from `packages/shared-types` and `packages/shared-schemas`.

### API Runtime Layer

```text
apps/api/src
|-- app.ts
`-- server.ts
```

- `app.ts` creates and configures the Express app.
- `server.ts` loads environment variables and starts the HTTP server.

Current API route:

| Method | Path | Response |
| --- | --- | --- |
| `GET` | `/health` | `{ "status": "ok" }` |

### API Module Layer

```text
apps/api/src/modules
|-- auth
`-- users
```

Domain modules should live here. A backend module should contain everything needed for one business capability.

Recommended module structure:

```text
apps/api/src/modules/<module-name>
|-- <module-name>.controller.ts
|-- <module-name>.routes.ts
|-- <module-name>.service.ts
|-- <module-name>.schema.ts
|-- <module-name>.types.ts
`-- index.ts
```

Example future `jobs` module:

```text
apps/api/src/modules/jobs
|-- jobs.controller.ts
|-- jobs.routes.ts
|-- jobs.service.ts
|-- jobs.schema.ts
|-- jobs.types.ts
`-- index.ts
```

Suggested responsibilities:

| File | What goes here |
| --- | --- |
| `*.routes.ts` | Express router definitions for the module. |
| `*.controller.ts` | Request/response handling. |
| `*.service.ts` | Business logic and persistence orchestration. |
| `*.schema.ts` | Request validation schemas, often using shared Zod schemas. |
| `*.types.ts` | Module-specific backend types. |
| `index.ts` | Public exports for the module. |

Register module routers in `apps/api/src/app.ts`.

### API Shared Layer

```text
apps/api/src/shared
|-- constants
|-- db
|-- middleware
|   `-- errorHandler.ts
|-- queues
|-- types
`-- utils
    `-- AppError.ts
```

Use API `shared` for backend infrastructure used across modules.

Current shared pieces:

- `shared/middleware/errorHandler.ts` handles `AppError` responses and unexpected errors.
- `shared/utils/AppError.ts` defines a custom operational error class.

Recommended folder meanings:

| Folder | What goes here |
| --- | --- |
| `constants` | API-wide constants. |
| `db` | Database clients, connection helpers, and persistence adapters. |
| `middleware` | Shared Express middleware. |
| `queues` | Queue clients, producers, consumers, and job helpers. |
| `types` | Backend-only shared types. |
| `utils` | Backend-only utility functions and classes. |

## Shared Internal Packages

Internal packages live under `packages`. They are reusable across apps and other packages.

### `@job-finder/shared-types`

Path: `packages/shared-types`

Exports TypeScript-only contracts:

- `User`
- `Job`

Example:

```ts
import type { Job, User } from '@job-finder/shared-types';
```

Use this package when both frontend and backend need the same type shape.

### `@job-finder/shared-schemas`

Path: `packages/shared-schemas`

Exports shared Zod schemas:

- `userSchema`
- `jobSchema`

Example:

```ts
import { jobSchema, userSchema } from '@job-finder/shared-schemas';
```

Use this package for runtime validation contracts that should stay aligned across apps.

### `@job-finder/logger`

Path: `packages/logger`

Exports:

- `createLogger(serviceName)`
- Pino `Logger` type

Features:

- Pretty logs in development.
- JSON logs in production.
- `LOG_LEVEL` support.
- Error object formatting with message, stack, and cause.
- Service name tagging.

Example:

```ts
import { createLogger } from '@job-finder/logger';

const logger = createLogger('api');

logger.info('Server started');
```

### `@job-finder/eslint-config`

Path: `packages/eslint-config`

Shared ESLint flat config with:

- ESLint recommended rules.
- TypeScript ESLint recommended rules.
- React rules.
- React Hooks rules.
- Prettier compatibility.

Apps use it through their local `eslint.config.js`.

### `@job-finder/typescript-config`

Path: `packages/typescript-config`

Shared TypeScript presets:

| Config | Use case |
| --- | --- |
| `base.json` | Common strict TypeScript settings. |
| `react-library.json` | Browser and React workspaces. |
| `node-library.json` | Node.js apps and packages. |

## Dependency Boundaries

Recommended dependency direction:

```text
apps/client  ---> packages/shared-types
apps/client  ---> packages/shared-schemas
apps/api     ---> packages/shared-types
apps/api     ---> packages/shared-schemas
apps/api     ---> packages/logger

features     ---> shared
modules      ---> shared
app wiring   ---> features/modules/shared
shared       ---> generic libraries only
packages     ---> no app imports
```

Avoid these patterns:

- A shared package importing from an app.
- One frontend feature importing deeply from another feature.
- API shared infrastructure importing from a domain module.
- App startup files containing business logic.

## How to Add a New Frontend Feature

Create a folder under `apps/client/src/features`.

```text
apps/client/src/features/<feature-name>
|-- api
|-- components
|-- hooks
|-- pages
|-- routes
|-- schemas
|-- store
`-- types
```

Then:

1. Add feature-specific pages in `pages`.
2. Add feature-specific components in `components`.
3. Add API endpoints by injecting into `shared/api/baseApi.ts` from the feature `api` folder.
4. Add route definitions in `routes`.
5. Register the feature routes from `apps/client/src/app/router/index.tsx`.
6. Keep only reusable primitives in `apps/client/src/shared`.

## How to Add a New API Module

Create a folder under `apps/api/src/modules`.

```text
apps/api/src/modules/<module-name>
|-- <module-name>.controller.ts
|-- <module-name>.routes.ts
|-- <module-name>.service.ts
|-- <module-name>.schema.ts
|-- <module-name>.types.ts
`-- index.ts
```

Then:

1. Define request schemas in `*.schema.ts`.
2. Put business logic in `*.service.ts`.
3. Put request handlers in `*.controller.ts`.
4. Create the Express router in `*.routes.ts`.
5. Export the router from `index.ts`.
6. Register the router in `apps/api/src/app.ts`.
7. Use `AppError` for operational errors.

## How to Add Shared Contracts

Use `packages/shared-types` for compile-time TypeScript types.

```text
packages/shared-types/src/<entity>.ts
```

Export it from:

```text
packages/shared-types/src/index.ts
```

Use `packages/shared-schemas` for runtime validation.

```text
packages/shared-schemas/src/index.ts
```

If a schema grows large, split it into files and re-export from `index.ts`.

## Installation

Install dependencies from the repository root:

```bash
npm install
```

The root workspace links internal packages automatically. Do not run separate installs inside every app unless you intentionally need to debug one workspace.

## Running the Monorepo

Start all development processes:

```bash
npm run dev
```

Start all development processes with Turbo's terminal UI:

```bash
npm run dev:tui
```

Default local URLs:

| App | URL |
| --- | --- |
| API | `http://localhost:3001` |
| Client | Vite dev URL, usually `http://localhost:5173` |

Check the API:

```bash
curl http://localhost:3001/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## Running One Workspace

Run only the client:

```bash
npm run dev --workspace=client
```

Run only the API:

```bash
npm run dev --workspace=api
```

Build only the client:

```bash
npm run build --workspace=client
```

Build only the API:

```bash
npm run build --workspace=api
```

Preview the built client:

```bash
npm run preview --workspace=client
```

## Environment Variables

The API loads environment variables with `dotenv`.

Create a local API environment file when needed:

```bash
touch apps/api/.env
```

Useful variables:

```env
PORT=3001
NODE_ENV=development
LOG_LEVEL=debug
```

| Variable | Purpose |
| --- | --- |
| `PORT` | API port. Defaults to `3001`. |
| `NODE_ENV` | Controls development vs production behavior. |
| `LOG_LEVEL` | Overrides logger verbosity. |

## Quality Checks

Run all checks from the root:

```bash
npm run lint
npm run typecheck
npm run build
```

Workspace-specific checks:

```bash
npm run lint --workspace=client
npm run typecheck --workspace=client
npm run build --workspace=client
```

```bash
npm run lint --workspace=api
npm run typecheck --workspace=api
npm run build --workspace=api
```

## Adding Dependencies

Add a dependency to the client:

```bash
npm install <package-name> --workspace=client
```

Add a dependency to the API:

```bash
npm install <package-name> --workspace=api
```

Add a dependency to an internal package:

```bash
npm install <package-name> --workspace=@job-finder/shared-schemas
```

Add a root development dependency:

```bash
npm install <package-name> --save-dev
```

## Reusing This Setup for Another App

To reuse this as a generic monorepo setup:

1. Rename the root package in `package.json`.
2. Rename internal package scopes from `@job-finder/*` to your own scope.
3. Keep `apps/client` and `apps/api`, or rename them to match your product.
4. Keep the same app, feature, module, shared, and package boundaries.
5. Add product features under `apps/client/src/features`.
6. Add backend domain modules under `apps/api/src/modules`.
7. Add cross-app contracts under `packages/shared-types` and `packages/shared-schemas`.
8. Add reusable infrastructure packages under `packages`.

## Development Rules of Thumb

- `apps/client/src/app` is for frontend composition, not feature logic.
- `apps/client/src/features` is for frontend business features.
- `apps/client/src/shared` is for reusable frontend building blocks.
- `apps/api/src/modules` is for backend domain modules.
- `apps/api/src/shared` is for reusable backend infrastructure.
- `packages/shared-types` is for shared compile-time contracts.
- `packages/shared-schemas` is for shared runtime validation contracts.
- `packages/logger`, `packages/eslint-config`, and `packages/typescript-config` are reusable tooling/infrastructure packages.
- If code belongs to only one feature or module, keep it inside that feature or module.
- If code is reused by multiple apps, move it to `packages`.
