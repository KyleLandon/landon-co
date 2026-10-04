# Portfolio Website - Landon & Co.

## Overview

This is a modern portfolio website for "Landon & Co." — a Texas-based web design, branding, and automation studio serving small businesses across the South Texas triangle (San Antonio, Corpus Christi, Victoria) and nationwide. The application is built with a full-stack TypeScript architecture featuring a React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.

## SEO

- `react-helmet-async` is wired up at the app root via `HelmetProvider` (`client/src/main.tsx`).
- Reusable `<SEO>` component (`client/src/components/seo.tsx`) handles title, description, canonical, OG/Twitter, and JSON-LD per page.
- Base meta + LocalBusiness/ProfessionalService JSON-LD live in `client/index.html`.
- Static SEO assets in `client/public/`: `robots.txt`, `sitemap.xml`, `og-image.jpg` (1200x630).
- Programmatic location pages: `/web-design-san-antonio`, `/web-design-corpus-christi`, `/web-design-victoria-tx` (driven by configs exported from `client/src/pages/location.tsx`).
- Service pages: `/services/{web-design,branding,ecommerce,automation}` (configs exported from `client/src/pages/service.tsx`).
- Insights blog: `/insights` index + `/insights/:slug` posts (data in `client/src/pages/insights.tsx`, with Article JSON-LD).
- Home page renders an `<FAQ>` section with FAQPage JSON-LD.
- Whenever you add an indexable public route, update `client/public/sitemap.xml`. Unlisted `/pricing` and `/brand` must remain excluded.

## Code-splitting

Public pages are pre-rendered at build time through `client/src/entry-server.tsx` and `scripts/prerender.mjs`, then hydrated by `client/src/public-app.tsx`. Register public routes in that file's routes and `publicPaths` list. Run `node --test scripts/prerender.test.mjs` after a build to check HTML, metadata, and asset references. Development renders the same components on the server through Vite.

Private and sign-in routes load `client/src/App.tsx` separately and retain client-side rendering and Clerk authentication. Public pages do not mount Clerk or wait for authentication; the homepage stays public for signed-in visitors. Preserve the empty `app-shell.html` for private routes—never serve pre-rendered marketing content as a dashboard shell.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Animations**: Framer Motion for smooth animations and transitions
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with middleware for logging and error handling
- **Database ORM**: Drizzle ORM with PostgreSQL (via Neon Database)
- **API Design**: RESTful endpoints with JSON responses
- **Authentication**: Replit-managed Clerk with browser session cookies, embedded branded sign-in/sign-up, and production Frontend API proxy
- **Authorization**: Local users table retains roles and project relationships; first authenticated request resolves or provisions the local user by Clerk's `sessionClaims.userId` (legacy ID for migrated users). Existing users and sessions tables and all foreign keys are preserved.
- **Validation**: Zod schemas for data validation

### Build System
- **Bundler**: Vite for frontend development and building
- **Transpiler**: esbuild for backend bundling
- **Development**: Hot Module Replacement (HMR) via Vite
- **TypeScript**: Strict mode enabled with path mapping

## Key Components

### Database Schema
- **Users Table**: Application user IDs, roles, and relationships; Clerk owns identity and login. Nullable legacy identity columns are retained without login-time synchronization.
- **Contacts Table**: Contact form submissions (id, name, email, project, message, createdAt)
- **Migrations**: Drizzle Kit for database schema management

### Frontend Components
- **Navigation**: Responsive navbar with smooth scrolling and scroll-based styling
- **Hero Section**: Landing area with call-to-action and animations
- **Portfolio**: Project showcase with filtering and hover effects
- **Services**: Service offerings with detailed feature lists
- **About**: Company information with animated content
- **Contact**: Form with validation and submission handling
- **Footer**: Site footer with links and branding

### API Endpoints
- `POST /api/contact`: Submit contact form with validation
- `GET /api/contacts`: Retrieve all contact submissions (admin)

### Storage Layer
- **Production**: PostgreSQL with Drizzle ORM
- **Development**: In-memory storage implementation
- **Interface**: IStorage abstraction for data operations

## Data Flow

1. **Contact Form Submission**:
   - Frontend validates form using Zod schema
   - Data sent to `/api/contact` endpoint
   - Backend validates and stores in database
   - Success/error response returned to client
   - Toast notification displayed to user

2. **Page Navigation**:
   - Smooth scroll navigation between sections
   - URL routing handled by Wouter
   - Dynamic content loading with animations

3. **Responsive Design**:
   - Mobile-first approach with Tailwind breakpoints
   - Custom hooks for mobile detection and scroll tracking
   - Adaptive navigation and layout components

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Libraries**: Radix UI components, Lucide icons
- **Animation**: Framer Motion
- **State Management**: TanStack Query
- **Validation**: Zod with Hookform resolvers
- **Styling**: Tailwind CSS, class-variance-authority, clsx

### Backend Dependencies
- **Server**: Express.js with Clerk middleware and local authorization
- **Database**: Drizzle ORM, Neon Database serverless driver
- **Development**: tsx for TypeScript execution

### Development Tools
- **Build**: Vite, esbuild, TypeScript
- **Linting**: Integrated with Replit environment
- **Database**: Drizzle Kit for migrations

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Development Server**: Vite dev server with Express backend
- **Port Configuration**: Backend on 5000, proxied through Vite

### Production Build
- **Frontend**: Vite builds to `dist/public`
- **Backend**: esbuild bundles to `dist/index.js`
- **Static Assets**: Served by Express in production
- **Environment**: Production mode with optimized builds

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Development**: `npm run dev`

## Changelog

```
Changelog (condensed — older granular entries trimmed June 17, 2026):

2025 (June–December) — Initial build & major systems:
- Initial setup, then redesign to a clean modern aesthetic ("V0" style) while keeping the
  grunge "LANDON & CO." signature logo. Animated particle canvas hero.
- Home flow settled on: Hero → Gallery → About → Contact → Footer. Dedicated /projects page
  with category filtering. Real project screenshots (WillWork Construction, Comic Mystery Boxes).
- Contact form: name, email, phone, preferred contact method, budget, message. Click-to-call.
  Email delivery of submissions; budget tiers simplified.
- Authentication now uses Clerk for protected application pages. Public customer intake
  requires no account or login, never creates accounts or projects automatically, and
  notifies the owner through the existing email and Discord setup.
- Admin dashboard: sidebar nav plus a unified single-page dashboard (/admin) with inline project
  editing, clickable status badges, clients/messages/settings. Legacy pages at /admin/legacy.
- Client dashboard: unified single-page view (/dashboard) with auto-selection of newest project
  and localStorage caching. Legacy at /dashboard/legacy.
- Messaging: real-time via 3s polling, Apple-style bubbles, emoji + reply, Web Audio notification
  sounds, fixed-height scrolling containers, no page-jump on incoming messages.
- Files: projectFiles table + multer uploads, categories, visibility control, role-based access.
- Contracts & invoices: full schema + admin management, client signing (canvas signatures),
  invoice payment workflow (Stripe placeholders).
- Notification bell with unread badge and correct routing to admin views.
- Performance/SEO pass: image optimization, lazy loading, preloading, meta tags.

2026 (June) — Marketing & brand:
- SEO system: react-helmet-async, reusable <SEO> component, JSON-LD, location pages
  (San Antonio / Corpus Christi / Victoria), service pages, /insights blog, FAQ. (See SEO section.)
- Route-level code-splitting (see Code-splitting section).
- Portfolio: added Moose & the Bear and DLT Custom Homes as featured projects.
- Brand: swapped the displayed logo sitewide to a scalable SVG (white + black variants) across
  hero, nav, footer, and client project layout. Regenerated the /brand download kit (SVG/PNG/WebP +
  email-signature sizes) and added SVG downloads to the /brand page.
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```