# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: botthef Portfolio

A Next.js 14 developer portfolio with blog, learning playbook, and AWS-backed content management.

---

## Build & Development Commands

```bash
npm install    # Install dependencies
npm run dev    # Start dev server (http://localhost:3000)
npm run build  # Production build (validates routes, generates static pages)
npm start      # Serve production build
npm run lint   # Run ESLint
```

**Build validation**: `npm run build` is the primary way to verify changes. It prerenders all routes and will fail on TypeScript errors or broken imports.

**Path alias**: Use `@/*` for imports from `src/` (e.g., `import { Post } from '@/types'`).

---

## Architecture Overview

### Content Service Layer (Critical Pattern)

The app uses a **factory pattern** to abstract content storage. Routes and components never directly access storage.

**Flow**: `Component` → `getContentService()` → `ContentService` interface → `AwsContentService` OR `MockContentService`

**Files**:
- `src/services/content.ts` - Interface defining all content methods
- `src/services/factory.ts` - Factory that returns AWS or Mock implementation
- `src/services/aws-content.ts` - DynamoDB + S3 implementation
- `src/services/mock-content.ts` - Local file fallback

**Environment behavior**:
- Defaults to `MockContentService` (reads from `src/content/blog/`)
- Set `USE_MOCK=false` to use `AwsContentService` (requires AWS credentials)

**Why this matters**: When adding features that need content (new page, new component), ALWAYS use `getContentService()`, never hardcode data sources.

### Route Naming Convention

**IMPORTANT**: Routes were renamed in Feb 2026 redesign. The URL paths and underlying data keys don't match:

| URL Route | DynamoDB Key | Directory |
|-----------|--------------|-----------|
| `/blog` | `POST#` | `src/app/blog/` |
| `/blog/[slug]` | `POST#<slug>` | `src/app/blog/[slug]/` |
| `/playbook` | `MODULE#` | `src/app/playbook/` |
| `/playbook/[slug]` | `MODULE#<slug>` | `src/app/playbook/[slug]/` |

**Never rename DynamoDB keys** - they're fixed in production. Route changes are frontend-only.

### DynamoDB Schema

**Table**: `botthef-content`

**Key structure**:
```
PK (Partition Key): POST#<slug> or MODULE#<slug>
SK (Sort Key): METADATA
```

**Access patterns**:
- List posts: `Scan` with filter `begins_with(PK, 'POST#')`
- Get post: `GetCommand` with `PK=POST#<slug>`, `SK=METADATA`
- List modules: `Scan` with filter `begins_with(PK, 'MODULE#')`
- Get module: `GetCommand` with `PK=MODULE#<slug>`, `SK=METADATA`

**Content storage**:
- Small content: Inline in DynamoDB `content` field
- Large content: S3 at `s3://botthef-content-bucket/posts/<slug>.mdx`, referenced via `s3_key` field

### Design System (CSS Variables)

The app uses a **dark pastel theme** with CSS variables defined in `src/app/globals.css`:

**Primary colors**:
```css
--primary: #B8A8E6      /* Soft Lavender */
--secondary: #9DD9FF    /* Sky Blue */
--error: #FFB3CC        /* Rose Pink */
--pastel-mint: #B8F3D8  /* Easy/Success */
--pastel-peach: #FFD4B8 /* Medium/Warning */
--pastel-pink: #FFB3CC  /* Hard/Error */
```

**When styling**:
- Use CSS Modules (`.module.css` files) for component-scoped styles
- Reference CSS variables via `var(--primary)`, `var(--card-bg)`, etc.
- Never hardcode colors - always use the design tokens

### Server Components

All pages are React Server Components by default (async functions). Data fetching via `getContentService()` happens server-side at build time. Client components must be explicitly marked with `'use client'`.

### Component Patterns

**Styling approach**:
1. Global styles/tokens: `src/app/globals.css`
2. Component styles: Co-located `ComponentName.module.css`
3. Import pattern: `import styles from './ComponentName.module.css'`

**UI components** (`src/components/ui/`):
- Self-contained, reusable
- Props follow TypeScript interfaces
- Variants via props (e.g., `variant="primary"`)

**Feature components** (`src/components/`):
- Domain-specific (LeetCodeTracker, SocialLinks, etc.)
- Can use multiple UI components

**Layout components** (`src/components/layout/`):
- Header, Footer
- Shared across all pages via `src/app/layout.tsx`

### MDX Rendering Pipeline

**Posts and modules use MDX** (Markdown + JSX) with enhanced rendering:

**Pipeline**: MDX file → `next-mdx-remote` → rehype plugins → styled HTML

**Plugins** (configured in `src/app/blog/[slug]/page.tsx` and `src/app/playbook/[slug]/page.tsx`):
1. `rehype-slug` - Adds IDs to headings
2. `rehype-autolink-headings` - Makes headings clickable
3. `rehype-pretty-code` - Syntax highlighting (GitHub Dark theme)

**Rendering wrapper**: All MDX content wrapped in `<div className="prose">` for consistent typography.

**Styling**: Prose styles defined in `src/app/globals.css` (search for `.prose`)

---

## Authentication & Admin Implementation

The admin area is protected by OAuth-based authentication and restricted to whitelisted emails.

### Auth Architecture (NextAuth.js)

**Providers**: GitHub and Google OAuth.
**Access Control**: Whitelist based on `ADMIN_EMAIL` environment variable.

**Core Files**:
- `src/app/api/auth/[...nextauth]/route.ts`: NextAuth handler with whitelisting logic in `signIn` callback.
- `src/middleware.ts`: Protects `/admin` routes by checking for a valid session.
- `src/lib/auth.ts`: Shared auth options and helper to get the JWT for backend calls.

### Admin Flow

1. **Login**: User hits `/admin`, middleware redirects to `/api/auth/signin` if not authenticated.
2. **Whitelisting**: `signIn` callback checks `user.email === process.env.ADMIN_EMAIL`. If false, access is denied.
3. **JWT Management**: NextAuth `jwt` callback must include the raw token or custom claims required by the `blog-backend`.
4. **API Requests**: Frontend calls to `blog-backend` (Lambda/API Gateway) must include the JWT in the `Authorization: Bearer <token>` header.

### Admin Routes (`src/app/admin/`)

| URL Route | Purpose |
|-----------|---------|
| `/admin` | Dashboard / Overview |
| `/admin/blog` | List and manage blog posts |
| `/admin/blog/new` | Editor for new post |
| `/admin/blog/[slug]/edit` | Editor for existing post |
| `/admin/playbook` | Manage playbook modules and problems |

---

## Key Files & Their Roles

**Service Layer**:
- `src/services/factory.ts` - **Entry point** for all content access
- `src/lib/aws-client.ts` - DynamoDB & S3 client configuration

**Type Definitions**:
- `src/types/index.ts` - `Post`, `Module`, `Problem` interfaces

**Routing**:
- `src/app/page.tsx` - Home (portfolio landing)
- `src/app/blog/page.tsx` - Blog listing
- `src/app/playbook/page.tsx` - Playbook listing

**Critical Components**:
- `src/components/ui/TerminalBackground.tsx` - Animated terminal (typing effect, loops)
- `src/components/LeetCodeTracker.tsx` - Stats display (hardcoded, update here for changes)

---

## When Adding New Features

### Adding a Blog Post (Production)
1. Add item to DynamoDB with `PK=POST#<slug>`, `SK=METADATA`
2. If large, upload MDX to S3 and reference via `s3_key`
3. Post automatically appears on `/blog`

### Adding a Blog Post (Local Dev)
1. Create `src/content/blog/<slug>.mdx` with frontmatter
2. Post automatically appears on `/blog`

### Adding a New Route
1. Create `src/app/<route>/page.tsx`
2. If needs content, use `getContentService()` - never bypass service layer
3. If needs styling, create co-located `page.module.css`

### Modifying Components
- **UI components**: Change in `src/components/ui/`, ensure variants still work
- **Feature components**: Check where used (search imports) before changing props
- **Layout components**: Changes affect all pages

### Updating Design System
1. Edit CSS variables in `src/app/globals.css`
2. Run `npm run build` to verify no contrast issues
3. Colors propagate automatically to all components

---

## Environment Variables & Integration

**Core environment variables**:
```env
# Content Access
USE_MOCK=false
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_REGION=us-west-2
DYNAMODB_TABLE=botthef-content
S3_BUCKET=botthef-content-bucket

# NextAuth (Authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-secret>
GITHUB_ID=<github-client-id>
GITHUB_SECRET=<github-client-secret>
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>
ADMIN_EMAIL=your-email@example.com

# Backend API (Writes)
NEXT_PUBLIC_API_URL=<api-gateway-url>
```

**Without AWS credentials**: App automatically falls back to `MockContentService` and reads from `src/content/blog/`.

**Error handling**: Services return empty arrays `[]` or `null` on errors (logged to console).

---

## Common Pitfalls

1. **Route confusion**: URLs say `/blog`, data says `POST#`. Don't rename data keys.

2. **Hardcoded content**: Never fetch from DynamoDB/S3 directly. Always use `getContentService()`.

3. **Color inconsistency**: Don't use hex colors in components. Use CSS variables.

4. **CSS modules scope**: Styles in `.module.css` are scoped. Global styles go in `globals.css`.

5. **Build vs dev**: Some errors only show in `npm run build` (especially TypeScript, static generation).

6. **DynamoDB Scan**: Current implementation uses `Scan` (works for small datasets). For production scale, add GSI for date sorting.

---

## Testing Changes

**Minimal verification**:
```bash
npm run build  # Must pass
```

**Full verification**:
```bash
rm -rf .next && npm run build  # Clean build
npm run dev  # Test locally
```

**Routes to check**:
- http://localhost:3000 (home)
- http://localhost:3000/blog (blog listing)
- http://localhost:3000/blog/hello-world (sample post)
- http://localhost:3000/playbook (playbook listing)
- http://localhost:3000/playbook/two-pointers (sample module)

---

## Reference Documentation

See `project_context.md` for comprehensive details on:
- Complete component library
- Infrastructure setup
- Deployment guide
- Customization instructions
