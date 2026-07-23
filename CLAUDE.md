# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

SITIVENT is a Next.js application built with **PBAC (Permission-Based Access Control)** architecture. Focus on client-facing components with **Common** (atomic) and **Mixins** (composite) component patterns.

## Core Technology Stack

- **Next.js 16** (React 19) - App Router with Turbopack development
- **Tailwind CSS v4** with @tailwindcss/typography
- **Prisma ORM** for PostgreSQL database
- **Better Auth** integrated for authentication
- **TanStack Query** and **TanStack Table** for data handling
- **Zod** and **React Hook Form** for validation schemas

## Development Setup

### Key Commands

- `pnpm dev` - Start Next.js development server (Turbopack)
- `pnpm build` - Build for production  
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Auto-fix lint issues
- `pnpm prisma migrate dev` - Run database migrations
- `pnpm prisma db seed` - Seed initial data

### Environment Setup

1. Copy `.env.example` → `.env`
2. Configure database URL and secrets
3. Run migrations and seed data

```bash
# After cd into project
pnpm install
pnpm prisma migrate dev
pnpm prisma db seed
```

## Architecture Pattern

### Directory Structure

```
/src/
├── app/        # Next.js App Router (pages + API)
├── components/ # UI components
│   ├── Common/    # Atomic components
│   ├── Mixins/    # Composite components  
│   └── ui/        # Ready-to-use Shadcn components
├── providers/   # Theme, Permission, Query providers
├── services/    # Server Actions & authz
├── lib/         # Utils, Better Auth config, Prisma client
├── data/        # Static metadata
├── schemas/     # Zod validation schemas
├── hooks/       # Custom React hooks
└── interfaces/  # TypeScript interfaces
```

### Key Files

- **proxy.ts** - PBAC routing protection (middleware-based auth) & Next.js proxy security
- **src/lib/auth.ts** - Better Auth configuration
- **src/lib/prisma/** - Prisma client wrapper
- **prisma/schema.prisma** - Database schema
- **prisma/seed.ts** - Data seeding script
- **generate/index.ts** - Auto-generates frontend types from DB schema and Prisma models
- **generate/script.ts** - Auto-generates Zod schemas and TypeScript interfaces from DB schemas
- **next.config.ts** - Turbopack, caching, security headers, React compiler config

## Database Schema

PostgreSQL with extensive models for:
- **Events** with categories, pricing, quotas
- **Registrations** with QR codes and attendance tracking  
- **Payments** with verification workflow
- **Certificates** with template support
- **Users** with role-based permissions
- **Articles**, **Galleries**, **Support tickets**

## Authentication

Better Auth with role-based access control through PBAC proxy. All routes protected by permission checks at middleware level. Available roles: **superadmin, panitia, scanner, peserta**.

## Build Configuration

**next.config.ts** includes security headers, image optimization, and Cloudflare analytics proxy routing. Strict caching for `/assets/` with 1-year TTL.

**TypeScript** with path aliases:
- `@/*` → `./src/*`
- `@/generated/*` → `./generated/*`

## Code Standards

**ESLint** with Next.js config, Prettier integration, and React hooks rules. Custom rules enforce proper quoting and single quotes.

**Tailwind** with typography plugin and semantic color tokens.

## Deployment

**Vercel** optimized with:
- `output: 'standalone'` for serverless deployment
- Typed routes enabled
- React compiler optimization
- Static asset aggressive caching

Fallback CDN for images: **tibatibangoding.io**

## Build Scripts (pnpm)

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack", 
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "check-types": "pnpm check-types"
  }
}
```

## Version Control

**Conventional Commits** with specific release workflow:
- `pnpm version:minor -- --dev` for dev releases (creates `-dev.0` tag)
- `pnpm version:patch` for dev version increments
- `node scripts/increment-version.cjs release` for production releases

## Testing

**Playwright** available for end-to-end testing. Test scenarios in `/test/scenario/`.

## Available Hooks

**Custom React hooks** in `/src/hooks/`:
- `useDebounce` - Input action delays
- `usePagination` - Query param pagination
- `useSort` - Data sorting logic

## Key Services

**Server Actions** in `/src/services/`:
- Auth, dashboard, emails, events, certificates, attendance
- Payment verification and support ticket management
- Event categories, galleries, registrations

## Version Information

Current version: **1.0.0**

See **CHANGELOG.md** for release history.

## Important Notes

- All API endpoints under `/api` from `src/app/api/`
- Admin panel accessible at `/admin` (login: `admin@gmail.com`)
- Production deployment via Vercel Marketplace deployment workflows
- Canvas camera + permission flow handled via middleware auth checks