# Project Context: botthef Portfolio

**Last Updated**: February 16, 2026

## Project Overview

**botthef** is a developer portfolio website featuring a blog, learning playbook, and LeetCode progress tracking. Built with Next.js 14 (App Router), TypeScript, and AWS infrastructure (DynamoDB + S3).

**Key Identity**:
- **Site Name**: botthef
- **Developer**: Utkarsh
- **Theme**: Dark Pastel (Soft Lavender, Sky Blue, Rose Pink, Mint Green, Peach)
- **Design Philosophy**: Professional, accessible, modern portfolio-first design

---

## Frontend Architecture

### Technology Stack

- **Framework**: Next.js 14.2.35 (App Router, React 18)
- **Language**: TypeScript
- **Styling**: CSS Modules + Global CSS Variables
- **Fonts**:
  - Sans: Inter (Google Fonts)
  - Mono: Menlo, Monaco, Courier New
- **Icons**: lucide-react
- **Markdown**: next-mdx-remote with rehype plugins

### Design System

#### Color Palette (Dark Pastel Theme)

```css
/* Primary Colors */
--primary: #B8A8E6;        /* Soft Lavender */
--secondary: #9DD9FF;      /* Sky Blue */
--error: #FFB3CC;          /* Rose Pink */

/* Pastel Accents */
--pastel-mint: #B8F3D8;    /* Mint Green - Easy/Success */
--pastel-peach: #FFD4B8;   /* Peach - Medium/Warning */
--pastel-pink: #FFB3CC;    /* Rose Pink - Hard/Error */

/* Gradients & Glows */
--gradient-purple-blue: linear-gradient(135deg, #B8A8E6, #9DD9FF);
--glow-purple: rgba(184, 168, 230, 0.3);
--glow-blue: rgba(157, 217, 255, 0.3);

/* Base Colors */
--background: #050505;     /* Deep black */
--foreground: #ededed;     /* Light gray */
--card-bg: #111111;        /* Card background */
--card-border: #222222;    /* Subtle borders */
--muted: #888888;          /* Muted text */
--accent: #1a1a1a;         /* Slightly lighter black */
```

#### Typography
- **Headings**: Bold, letter-spacing: -0.05em
- **Body**: 1rem, line-height: 1.5-1.75
- **Code**: Monospace, highlighted with pastel colors

#### Layout
- **Max Width**: 1400px
- **Border Radius**: 8px
- **Grid Gaps**: 1.5-2rem
- **Padding**: 1.5-2rem

### Routing Structure

| Route | Description | Component |
|-------|-------------|-----------|
| `/` | Portfolio home (split-screen) | `src/app/page.tsx` |
| `/blog` | Blog listing page | `src/app/blog/page.tsx` |
| `/blog/[slug]` | Individual blog post | `src/app/blog/[slug]/page.tsx` |
| `/playbook` | Learning modules listing | `src/app/playbook/page.tsx` |
| `/playbook/[slug]` | Individual module | `src/app/playbook/[slug]/page.tsx` |

**Note**: Routes were renamed from `posts` → `blog` and `modules` → `playbook` (Feb 2026).

### Page Structures

#### Home Page (`/`)
**Layout**: Split-screen (50/50 on desktop, stacked on mobile)

**Left Pane Components**:
1. **Hero Section**
   - Name: "Utkarsh" (gradient text)
   - Title: "Full Stack Developer" (sky blue)
   - Bio: 2-line description

2. **LeetCode Progress Tracker**
   - Stats: Easy (mint dot), Medium (peach dot), Hard (pink dot)
   - Total problems solved
   - Component: `src/components/LeetCodeTracker.tsx`

3. **Terminal Animation**
   - macOS-style window chrome (red, yellow, green buttons)
   - Typing animation with 5 commands
   - Prompt: `utkarsh@macbook ~ %`
   - Commands: whoami, cat interests.txt, ls projects/, git log, echo $MOTTO
   - Component: `src/components/ui/TerminalBackground.tsx`

4. **Social Links** (Bottom)
   - GitHub and LinkedIn buttons
   - Hover effect: lift, sky blue border & shadow
   - Component: `src/components/SocialLinks.tsx`

**Right Pane**:
- Caricature image placeholder ("U")
- Pulsing glow effect (purple/blue)
- Image path: `/public/caricature.png` (when uploaded)

**Responsive**:
- Desktop (>1024px): Side-by-side
- Tablet (768-1024px): Side-by-side, smaller
- Mobile (<768px): Stacked (caricature first, then content)

#### Blog Page (`/blog`)
- Hero: "Blog" title (gradient)
- Subtitle: "Thoughts, learnings, and documentation of my journey"
- Grid of blog post cards (auto-fill, 300px min)
- Card hover: Lift 4px, lavender border, purple shadow

#### Playbook Page (`/playbook`)
- Hero: "The Playbook" title (gradient)
- Subtitle: "Master the patterns. Defeat the algorithm."
- Grid of module cards
- Badges: Problem count (lavender), Review Due (pink)

### Component Library

#### Layout Components

**Header** (`src/components/layout/Header.tsx`)
- Sticky with backdrop blur (`blur(10px)`)
- Semi-transparent background (`rgba(5, 5, 5, 0.8)`)
- Navigation: Home | Blog | Playbook
- Active state: Gradient text + underline
- Border: 0.5px (subtle divider)

**Footer** (`src/components/layout/Footer.tsx`)
- Copyright notice
- Centered text
- Dark background with top border

#### UI Components

**Card** (`src/components/ui/Card.tsx`)
- Base: Dark card bg, subtle border, 8px radius
- Hover: `translateY(-4px)`, lavender border, purple shadow
- Variants: Default, with hover effect

**Badge** (`src/components/ui/Badge.tsx`)
- Variants:
  - `default`: Gray background
  - `outline`: Transparent, border
  - `secondary`: Lavender tint, border
  - `accent`: Pink tint, border

**Button** (`src/components/ui/Button.tsx`)
- Variants: primary, secondary, outline, ghost
- Sizes: sm, md, lg
- Smooth hover transitions

**TerminalBackground** (`src/components/ui/TerminalBackground.tsx`)
- macOS window chrome
- Typing animation (40-80ms per character)
- Cursor blinking (530ms interval)
- Commands loop infinitely (2s pause before restart)
- Colors: Sky blue (#9DD9FF) for prompts, white for output
- Terminal bg: #1E1E1E (VS Code dark theme)
- Accessibility: Respects `prefers-reduced-motion`
- Height: 350px (300px on mobile)

#### Feature Components

**LeetCodeTracker** (`src/components/LeetCodeTracker.tsx`)
- Hardcoded stats: Easy: 12, Medium: 5, Hard: 1
- Visual: Pastel dot indicators (mint, peach, pink)
- Grid layout (3 columns)
- Total count at bottom

**SocialLinks** (`src/components/SocialLinks.tsx`)
- GitHub and LinkedIn links
- Icons from lucide-react
- Hover: Lift, sky blue border & shadow
- Responsive: Horizontal (desktop), vertical (mobile)

### Removed Components

- **MatrixBackground** - Replaced with TerminalBackground (Feb 2026)

### Accessibility Features

1. **Focus Indicators**: 2px sky blue outline on all interactive elements
2. **Reduced Motion**: All animations respect `prefers-reduced-motion: reduce`
   - Animations set to `0.01ms` duration
   - Terminal shows static state
   - Glow effects static
3. **Keyboard Navigation**: All interactive elements focusable with Tab
4. **ARIA Labels**: Social links, terminal (hidden from screen readers)
5. **Color Contrast**: WCAG AA compliant (4.5:1 for body, 3:1 for UI)
6. **Skip to Main**: CSS-only skip link (currently in globals.css)

### Performance Optimizations

- **Static Generation**: All pages prerendered at build time
- **Image Optimization**: Next.js Image component with priority flag
- **Code Splitting**: Automatic per-route
- **Bundle Size**: ~87.3 kB shared JS
- **Lighthouse Target**: 90+ across all categories

---

## Backend Architecture

### Service Layer

**Content Service Interface** (`src/services/content.ts`)
```typescript
interface ContentService {
  getDailyLogs(): Promise<Post[]>
  getModules(): Promise<Module[]>
  getModuleBySlug(slug: string): Promise<Module | null>
  getPostBySlug(slug: string): Promise<Post | null>
}
```

**Implementations**:
1. **AwsContentService** (`src/services/aws-content.ts`) - Production (DynamoDB + S3)
2. **MockContentService** (`src/services/mock-content.ts`) - Development fallback

**Factory Pattern** (`src/services/factory.ts`)
- Auto-detects AWS credentials
- Falls back to mock if AWS unavailable
- Singleton pattern

### Data Types

**Post** (`src/types/index.ts`)
```typescript
interface Post {
  slug: string
  title: string
  date: string  // ISO format
  excerpt: string
  tags: string[]
  content: string  // MDX markdown
}
```

**Module** (`src/types/index.ts`)
```typescript
interface Module {
  slug: string
  title: string
  description: string
  content: string  // MDX markdown
  problems: Problem[]
}

interface Problem {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  status: 'Solved' | 'Due' | 'Pending'
  link?: string
}
```

---

## Infrastructure

### AWS Architecture

#### DynamoDB Table

**Table Name**: `botthef-content`

**Key Schema**:
```
PK (Partition Key): String
SK (Sort Key): String
```

**Item Structure**:

**Posts**:
```json
{
  "PK": "POST#<slug>",
  "SK": "METADATA",
  "title": "Post Title",
  "date": "2026-02-16T00:00:00Z",
  "excerpt": "Brief description",
  "tags": ["tag1", "tag2"],
  "s3_key": "posts/<slug>.mdx",  // Optional, for large content
  "content": "Small inline content"  // Fallback for small posts
}
```

**Modules**:
```json
{
  "PK": "MODULE#<slug>",
  "SK": "METADATA",
  "title": "Module Title",
  "description": "Module description",
  "s3_key": "modules/<slug>.mdx",  // Optional, for large content
  "content": "Small inline content",  // Fallback
  "problems": [
    {
      "id": "1",
      "title": "Two Sum",
      "difficulty": "Easy",
      "status": "Solved",
      "link": "https://leetcode.com/problems/two-sum"
    }
  ]
}
```

**Access Patterns**:
1. **List all posts**: Scan with `begins_with(PK, 'POST#')`
2. **Get post by slug**: GetItem with `PK=POST#<slug>`, `SK=METADATA`
3. **List all modules**: Scan with `begins_with(PK, 'MODULE#')`
4. **Get module by slug**: GetItem with `PK=MODULE#<slug>`, `SK=METADATA`

**Note**: Current implementation uses Scan (suitable for small datasets). For production scale, add GSI (Global Secondary Index) for date-based sorting.

#### S3 Bucket

**Bucket Name**: `botthef-content-bucket`

**Structure**:
```
posts/
  ├── hello-world.mdx
  └── another-post.mdx
modules/
  ├── two-pointers.mdx
  └── sliding-window.mdx
```

**Usage**: Store large MDX content files. DynamoDB items reference S3 keys via `s3_key` field.

**Access**: Private bucket, accessed via AWS SDK with IAM credentials.

### Environment Variables

Required for AWS integration:
```env
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
AWS_REGION=us-east-1
DYNAMODB_TABLE=botthef-content
S3_BUCKET=botthef-content-bucket
```

**Fallback Behavior**: If AWS credentials not found, application uses `MockContentService` (local file-based content from `src/content/blog/`).

---

## Infrastructure Impact Analysis (Feb 2026 Redesign)

### Changes Made
1. **Route Renaming**: `/posts` → `/blog`, `/modules` → `/playbook`
2. **New Components**: SocialLinks, redesigned LeetCodeTracker, TerminalBackground (macOS)
3. **Removed Components**: MatrixBackground
4. **Color System**: Neon → Dark Pastel
5. **Home Page**: Blog listing → Portfolio landing

### Infrastructure Impact: ✅ NO CHANGES NEEDED

**Reasoning**:
- DynamoDB keys (`POST#`, `MODULE#`) remain unchanged
- S3 structure (`posts/`, `modules/`) remains unchanged
- Service layer abstraction handles route changes transparently
- Route changes are purely frontend routing (Next.js App Router)

**Data Migration**: Not required. All existing data compatible.

**API Compatibility**: Fully maintained. Backend service methods unchanged:
- `getDailyLogs()` → Still returns posts
- `getModules()` → Still returns modules
- Keys unchanged in DynamoDB

---

## Content Management

### Local Development (Mock Mode)

**Content Location**: `src/content/blog/`

**File Format**: MDX with frontmatter
```mdx
---
title: "Post Title"
date: "2026-02-16"
excerpt: "Brief description"
tags: ["tag1", "tag2"]
---

# Content here

MDX markdown with React components support.
```

### Production (AWS Mode)

**Upload Process**:
1. **Small Content**: Store directly in DynamoDB `content` field
2. **Large Content**: Upload MDX to S3, reference via `s3_key` in DynamoDB

**Example DynamoDB Write**:
```typescript
await dynamoDb.send(new PutCommand({
  TableName: 'botthef-content',
  Item: {
    PK: 'POST#my-new-post',
    SK: 'METADATA',
    title: 'My New Post',
    date: new Date().toISOString(),
    excerpt: 'This is a new post',
    tags: ['javascript', 'tutorial'],
    s3_key: 'posts/my-new-post.mdx'
  }
}));
```

---

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

### Key Commands

- `npm run dev` - Development server (http://localhost:3000)
- `npm run build` - Production build (validates routes, generates static pages)
- `npm start` - Serve production build locally

### File Structure

```
blog/
├── public/
│   ├── logo.png              # Site logo
│   └── caricature.png        # Portfolio image (upload needed)
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home (portfolio)
│   │   ├── home.module.css   # Home page styles
│   │   ├── globals.css       # Global styles & design tokens
│   │   ├── blog/
│   │   │   ├── page.tsx      # Blog listing
│   │   │   ├── page.module.css
│   │   │   └── [slug]/
│   │   │       └── page.tsx  # Individual blog post
│   │   └── playbook/
│   │       ├── page.tsx      # Playbook listing
│   │       ├── page.module.css
│   │       └── [slug]/
│   │           ├── page.tsx  # Individual module
│   │           └── page.module.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Header.module.css
│   │   │   ├── Footer.tsx
│   │   │   └── Footer.module.css
│   │   ├── ui/
│   │   │   ├── Card.tsx
│   │   │   ├── Card.module.css
│   │   │   ├── Badge.tsx
│   │   │   ├── Badge.module.css
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── TerminalBackground.tsx  # macOS terminal
│   │   │   └── [other UI components]
│   │   ├── playbook/
│   │   │   ├── ProblemList.tsx
│   │   │   └── ProblemList.module.css
│   │   ├── LeetCodeTracker.tsx
│   │   ├── LeetCodeTracker.module.css
│   │   ├── SocialLinks.tsx
│   │   └── SocialLinks.module.css
│   ├── services/
│   │   ├── content.ts        # Interface
│   │   ├── aws-content.ts    # AWS implementation
│   │   ├── mock-content.ts   # Local fallback
│   │   └── factory.ts        # Service factory
│   ├── lib/
│   │   ├── aws-client.ts     # DynamoDB & S3 clients
│   │   └── posts.ts          # Local file reader (fallback)
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   └── content/
│       └── blog/             # Local MDX files (dev mode)
│           └── hello-world.mdx
├── project_context.md        # This file
└── package.json
```

---

## Deployment

### Build Verification

```bash
# Clean build
rm -rf .next
npm run build

# Verify routes
# Expected output:
# ○ / (home)
# ○ /blog (blog listing)
# ● /blog/[slug] (SSG)
# ○ /playbook (playbook listing)
# ● /playbook/[slug] (SSG)
```

### Environment Setup

**Production**:
- Set AWS credentials as environment variables
- Ensure DynamoDB table and S3 bucket exist
- Configure IAM permissions for read access

**Staging/Development**:
- Can run without AWS (uses mock service)
- Local MDX files in `src/content/blog/`

### Vercel Deployment (Recommended)

1. Connect GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy (automatic on push to main)

---

## Customization Guide

### Update Personal Information

1. **Name**: `src/app/page.tsx` - Change "Utkarsh"
2. **Bio**: `src/app/page.tsx` - Update bio text
3. **Social Links**: `src/components/SocialLinks.tsx` - Update GitHub/LinkedIn URLs
4. **Terminal Commands**: `src/components/ui/TerminalBackground.tsx` - Customize COMMANDS array
5. **LeetCode Stats**: `src/components/LeetCodeTracker.tsx` - Update hardcoded stats (or integrate API)

### Add Caricature Image

1. Export image as 500x500px PNG (transparent background preferred)
2. Save to `/public/caricature.png`
3. Uncomment lines 52-61 in `src/app/page.tsx`
4. Remove placeholder (lines 48-51)

### Update Colors

Edit `src/app/globals.css` CSS variables:
```css
--primary: #B8A8E6;    /* Change to your primary color */
--secondary: #9DD9FF;  /* Change to your secondary color */
```

### Add New Content

**Blog Post**:
1. Add item to DynamoDB (or local MDX file)
2. Automatically appears on `/blog`

**Playbook Module**:
1. Add item to DynamoDB (or local MDX file)
2. Automatically appears on `/playbook`

---

## Known Issues & Future Enhancements

### Current Limitations
1. LeetCode stats are hardcoded (no API integration)
2. No admin panel for content management
3. DynamoDB uses Scan (inefficient for large datasets)
4. No search functionality

### Planned Improvements
1. LeetCode API integration for live stats
2. Admin dashboard for content CRUD
3. DynamoDB GSI for efficient date-based queries
4. Full-text search (Algolia or ElasticSearch)
5. Dark/light theme toggle
6. Contact form
7. Projects showcase section

---

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ Graceful degradation for older browsers (no blur, simpler animations)

**Requires**:
- CSS Grid
- CSS Variables
- `backdrop-filter` (for header blur)

---

## License & Credits

**Built by**: Utkarsh (botthef)
**Framework**: Next.js by Vercel
**Fonts**: Inter by Google Fonts
**Icons**: lucide-react
**Deployment**: Vercel Platform

---

## Contact & Links

- **Portfolio**: https://botthef.com (update when deployed)
- **GitHub**: https://github.com/utkarsh
- **LinkedIn**: https://linkedin.com/in/utkarsh

---

**Document Version**: 1.0
**Last Major Update**: February 16, 2026 (Complete portfolio redesign)
