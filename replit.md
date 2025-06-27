# Portfolio Website - Landon & Co.

## Overview

This is a modern portfolio website for "Landon & Co." - a web design and development agency focused on local businesses. The application is built with a full-stack TypeScript architecture featuring a React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.

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
- **Session Management**: Express sessions with PostgreSQL store
- **Validation**: Zod schemas for data validation

### Build System
- **Bundler**: Vite for frontend development and building
- **Transpiler**: esbuild for backend bundling
- **Development**: Hot Module Replacement (HMR) via Vite
- **TypeScript**: Strict mode enabled with path mapping

## Key Components

### Database Schema
- **Users Table**: Authentication system (id, username, password)
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
- **Server**: Express.js with session management
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
Changelog:
- June 26, 2025. Initial setup
- June 26, 2025. Major redesign: Transformed website to match grunge signature logo aesthetic
  - Integrated grunge signature logo (white version) throughout navigation and footer
  - Updated color scheme to deeper blacks and enhanced contrast
  - Added grunge typography with bold fonts and text shadows
  - Implemented grunge button styles with enhanced shadows and textures
  - Updated hero section with prominent logo display and raw, authentic messaging
  - Modified footer tagline to match grunge brand voice
- June 26, 2025. Complete V0 design transformation: Clean modern aesthetic while maintaining grunge logo
  - Transformed hero section with V0-style animated canvas background and 150-particle system
  - Redesigned portfolio section with clean grid layout and minimalist project cards
  - Updated contact form to clean V0 styling with simplified form design
  - Created new gallery component for featured work showcase with clean aesthetic
  - Redesigned footer with V0-style clean layout and minimal branding
  - Streamlined home page layout: Hero → Gallery → Portfolio → Contact → Footer
  - Fixed all TypeScript errors and API integration issues
  - Maintained grunge signature logo integration within clean V0 design framework
- June 26, 2025. Phone contact functionality implementation
  - Added client phone number (940) 389-2685 prominently displayed in contact section
  - Enhanced contact form with phone number field and preferred contact method dropdown
  - Updated database schema to store phone and preferredContact fields
  - Implemented click-to-call functionality for direct client communication
  - Contact form now captures: name, email, phone, preferred method (email/text/call), budget, message
- June 26, 2025. Email integration and project restructuring
  - Integrated SendGrid email service to send contact form submissions to info@landonco.co
  - Created professional contact information section with email, phone, and Discord details
  - Restructured portfolio sections: combined featured work and all projects into single dedicated page
  - Added /projects route with comprehensive project showcase and category filtering
  - Updated home page to Hero → Gallery → Contact → Footer for cleaner user flow
  - Added "View All Projects" button in gallery section linking to dedicated projects page
  - Fixed dropdown text visibility and styling consistency throughout the site
  - Added Will Work Construction (willworkconstruction.com) as featured project in both gallery and projects page
- June 26, 2025. Navigation and contact form optimization
  - Removed "Services" from navigation and changed "Work" to "Projects" 
  - Updated navigation to scroll to gallery section for better user flow
  - Redesigned contact section with modern, clean approach removing box styling
  - Moved contact info below form to prioritize form completion
  - Fixed contact form functionality - now properly stores submissions
  - Updated error handling to provide better user feedback
- December 27, 2025. About section reconstruction and layout optimization
  - Rebuilt About section with V0-style design matching site aesthetic
  - Added personal image to About section using uploaded photo
  - Reordered page layout: Hero → Gallery → About → Contact → Footer
  - Updated About section with professional description and skills showcase
  - Applied consistent styling with monospace fonts and grid background
- December 27, 2025. Performance optimization based on PageSpeed Insights
  - Optimized images with proper sizing, lazy loading, and next-gen format URLs
  - Added resource preloading for critical fonts and hero logo
  - Enhanced image alt text for better accessibility and SEO
  - Implemented DNS prefetching for external domains
  - Added viewport meta tag and theme color for mobile optimization
  - Layered font imports to reduce render-blocking resources
  - Added comprehensive meta tags for better SEO and social sharing
- December 27, 2025. Contact form budget options update
  - Updated budget dropdown to include: Less than $500, $1,000, $2,500, $5,000, Greater than $10,000
  - Simplified budget ranges to match client's preferred pricing structure
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```