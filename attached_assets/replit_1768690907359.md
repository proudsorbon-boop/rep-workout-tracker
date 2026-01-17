# Rep - Workout Tracker

## Overview

Rep is a minimalist fitness web application for tracking workouts, exercises, and sets. It's built as a full-stack TypeScript application with a React frontend and Express backend, designed to work both as a web app and as a mobile app via Capacitor (Android). Users can create workouts, add exercises with sets (reps/weight), view an exercise library, follow workout plans, track progress, and manage their profile.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and list animations
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite

The frontend follows a pages-based structure under `client/src/pages/` with shared components in `client/src/components/`. Custom hooks handle data fetching (`use-workouts.ts`) and UI state (`use-toast.ts`, `use-mobile.tsx`).

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: REST endpoints defined in `shared/routes.ts` with Zod schema validation
- **Build**: esbuild for server bundling, Vite for client

The API follows a simple resource pattern:
- `/api/workouts` - CRUD operations for workouts
- `/api/exercises` - Create/delete exercises (nested under workouts)
- `/api/sets` - Create/delete sets (nested under exercises)

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Generated via `drizzle-kit push`

Database schema consists of three main tables:
- `workouts`: id, name, date
- `exercises`: id, workoutId, name
- `sets`: id, exerciseId, reps, weight

Relations are defined using Drizzle's relations API for nested queries.

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Database schema and Zod insert schemas
- `routes.ts`: API route definitions with input/output type safety

### Mobile Support
- **Platform**: Capacitor for Android wrapper
- **Configuration**: `capacitor.config.json`
- **Web Directory**: `dist` (built output)

## External Dependencies

### Database
- PostgreSQL (required via `DATABASE_URL` environment variable)
- Drizzle ORM for database operations
- connect-pg-simple for session storage (if sessions are added)

### UI Component Library
- shadcn/ui components built on Radix UI primitives
- Full component set available in `client/src/components/ui/`

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animations
- `date-fns`: Date formatting
- `zod`: Schema validation (shared between client and server)
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `@capacitor/core` / `@capacitor/android`: Mobile app wrapper

### Development Tools
- TypeScript across the entire stack
- Vite dev server with HMR
- Replit-specific plugins for development experience