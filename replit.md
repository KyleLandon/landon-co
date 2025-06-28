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
- December 27, 2025. Implemented "Submit Project & Create Account" authentication flow
  - Added automatic Google OAuth authentication before project submission
  - Project form data is temporarily stored during authentication process
  - After successful login, project is automatically submitted and linked to user account
  - Authenticated users get proper projects created instead of just submissions
  - Users are redirected to dashboard after successful project creation
  - Modified authentication callback to return to home page for seamless flow
- December 27, 2025. Complete admin dashboard redesign with sidebar navigation
  - Rebuilt admin interface with left sidebar navigation for better organization
  - Created dedicated admin pages: Projects, Clients, Messages, Settings
  - Added user management with search functionality and edit/delete capabilities
  - Implemented comprehensive project management with status filtering and grid view
  - Created messages center combining contact forms and project submissions
  - Added settings page with system statistics and configuration options
  - Fixed project creation validation errors with proper data formatting
  - Enhanced client dashboard with functional Profile, Support, and View Progress buttons
  - All admin pages maintain consistent black/white/gray theme with monospace fonts
- December 27, 2025. Real-time messaging and admin project editing features
  - Implemented auto-refreshing messages (3-second intervals) to eliminate need for manual refresh
  - Added comprehensive admin project editing interface accessible from project detail pages
  - Created Discord-style notification bell component for real-time admin alerts
  - Added WebSocket infrastructure for future real-time messaging (currently using polling)
  - Admin editing includes: title, description, status, budget, start/end dates
  - Notification system tracks new messages, project requests, and contact submissions
  - Enhanced admin layout with notification bell in both mobile and desktop headers
- December 27, 2025. Advanced messaging system improvements and UI fixes
  - Fixed emoji picker layout with proper 6-column grid spacing and sizing
  - Resolved message input text visibility issue (white text on black background)
  - Simplified navigation to match client dashboard style (logo + account icon only)
  - Enhanced messaging with emoji support, reply functionality, and search
  - Removed complex file upload temporarily to focus on core messaging stability
  - Messages now send successfully without errors, with real-time updates every 3 seconds
  - Started development of comprehensive project dashboard with sidebar navigation
- December 27, 2025. Complete project structure reorganization and admin project management
  - Reorganized entire codebase with clear admin/client separation:
    * Admin files: admin/dashboard/, admin/project/, admin/clients.tsx, admin/projects.tsx, admin/messages.tsx, admin/settings.tsx
    * Client files: client/dashboard/, client/project/ (all client project management pages)
  - Created comprehensive admin project management system:
    * Admin Project Detail: Full project editing with client info, message history, and project stats
    * Admin Project Messages: Real-time messaging interface with auto-refresh and read status tracking
    * Admin Project Timeline: Timeline management with milestone tracking and update creation/editing
  - Added admin project routes: /admin/projects/:id, /admin/projects/:id/messages, /admin/projects/:id/timeline
  - Fixed all TypeScript errors across reorganized structure with proper null safety handling
  - Updated all import paths to match new folder structure throughout App.tsx and components
  - Maintained consistent dark theme styling (gray-950/900/800) across all admin interfaces
- December 27, 2025. Real-time notification system with audio alerts
  - Added notification sounds using Web Audio API for admin notifications
  - Implemented audio alerts for new messages in project messaging (plays when new messages arrive)
  - Enhanced notification bell with dual-tone beep system (800Hz-600Hz for notifications, 600Hz-800Hz for messages)
  - All real-time updates working: messages refresh every 3 seconds, project edits update immediately
  - Added comprehensive API endpoints: PATCH /api/projects/:id, PATCH /api/project-updates/:id, GET /api/users/:id
  - Notification system tracks new messages, contacts, and project submissions with audio feedback
  - Graceful audio fallback for browsers that block autoplay or don't support Web Audio API
- December 27, 2025. Enhanced message notification sounds for all users
  - Added notification sounds to AdvancedMessaging component for both admin and client interfaces
  - Messages play gentle notification sound (520Hz-660Hz) when receiving messages from other users
  - Smart detection: only plays sound for incoming messages from others, not self-sent messages
  - Admin messaging interface has dedicated sound for client messages (600Hz-800Hz pattern)
  - Client messaging interface has notification sound for admin/other user messages
  - All messaging interfaces now provide immediate audio feedback for new message arrivals
- December 27, 2025. Comprehensive file storage and sharing system implementation
  - Added projectFiles database table with full file metadata tracking (name, size, type, category, visibility)
  - Implemented secure file upload system with multer middleware for handling multipart form data
  - Created file permission system: admin sees all files, clients see only public files or their own uploads
  - Built comprehensive FileManager component with drag-and-drop upload, category organization, and file operations
  - Added file management pages for both admin (/admin/projects/:id/files) and client (/projects/:id/files) interfaces
  - File operations include: upload with descriptions, download, delete, visibility toggle (admin-only)
  - File categorization system: General, Assets, Deliverables, Reference for better organization
  - Integrated file icons based on MIME types and formatted file size display
  - Files stored in uploads directory with secure access control and download endpoints
  - Added API endpoints: POST /api/projects/:id/files, GET /api/projects/:id/files, DELETE /api/files/:id
- December 27, 2025. Brand logo asset replacement with authentic grunge-style signature logos
  - Replaced placeholder SVG logos with actual "LANDON & CO." grunge signature artwork
  - Updated all logo references throughout the site: navigation, hero, footer, contact, and project layouts
  - White logo (logo-white.png) for dark backgrounds, black logo (logo-black.png) for light backgrounds
  - Maintained consistent branding across all user interfaces and admin panels
  - Authentic grunge aesthetic now properly represented throughout the entire application
- December 27, 2025. WillWork Construction project image replacement
  - Updated featured work gallery with actual WillWork Construction website screenshot
  - Replaced placeholder SVG with authentic project image showing professional construction website
  - Updated both gallery component and projects page to display real project portfolio
  - Maintained consistent image handling and responsive design across all project showcases
- December 27, 2025. Comic Mystery Boxes project image replacement
  - Added authentic Comic Mystery Boxes e-commerce website screenshot to portfolio
  - Replaced placeholder SVG with actual project showing comic book mystery box platform
  - Updated both featured work gallery and projects page with real client work
  - Showcases vibrant e-commerce design with comic-themed branding and modern UI
- December 27, 2025. Complete admin project detail page redesign and routing fix
  - Completely revamped admin project detail page to match modern client-side interface design
  - Added professional dashboard-style layout with stats cards, navigation tabs, and clean typography
  - Implemented modern header with breadcrumb navigation and action buttons
  - Added quick stats overview (budget, messages, status, creation date) with colored icons
  - Created tabbed navigation system for Overview, Communication, Timeline, and Files
  - Redesigned project information section with better typography and data organization
  - Enhanced client information display with profile images and contact details
  - Added quick action buttons for common tasks (send message, view timeline, manage files)
  - Maintained consistent dark theme (gray-950/900/800) and monospace fonts throughout
  - Fixed all TypeScript errors and improved null safety handling for dates
  - Fixed admin dashboard routing: "View" button now correctly links to /admin/projects/:id instead of /project/:id
- December 27, 2025. Messaging auto-refresh fix and notification system improvements
  - Fixed client messaging refresh issue: added 3-second auto-refresh to client messaging pages
  - Updated client messaging to use Apple-style messaging interface with clean white/gray bubbles
  - Fixed notification system routing: notifications now navigate to correct admin routes
    * Message notifications → /admin/projects/{id}/messages
    * Project requests → /admin/messages  
    * Other notifications → /admin/projects/{id}
  - Enhanced notification count system with red badge showing unread count on bell icon
  - Added automatic read status tracking: clicking notifications marks them as read
  - Improved notification visual indicators: blue dot for unread notifications, "Mark all read" button
  - Real-time messaging now works seamlessly between admin and client without manual refresh
- December 27, 2025. Comprehensive contracts and invoices system implementation
  - Added contracts and invoices database tables with full relational schema
  - Created complete admin contract management system with WYSIWYG editor and digital signature tracking
  - Built admin invoice management with itemized billing, tax calculations, and payment tracking
  - Implemented client-side contract signing interface with HTML5 canvas digital signatures
  - Added client invoice payment system with Stripe integration placeholders
  - Created comprehensive API endpoints for all contract and invoice operations
  - Enhanced admin project detail page with contract and invoice navigation buttons
  - Added client dashboard navigation to contracts and invoices sections
  - Database schema includes: contracts (title, content, terms, signatures), invoices (items, totals, payment status)
  - Contract workflow: draft → sent → signed → completed with full audit trail
  - Invoice workflow: draft → sent → paid with overdue detection and payment processing
- December 27, 2025. Unified dashboard UX optimization and authentication improvements
  - Created UnifiedDashboard component for clients with single-page project management and real-time messaging
  - Built UnifiedAdminDashboard with consolidated project management, inline editing, and integrated communication
  - Eliminated multi-page navigation complexity - everything accessible from main dashboard views
  - Added automatic authentication redirect system to prevent 404 errors on protected routes
  - Fixed authentication strategy hostname resolution for proper Replit auth integration
  - Enhanced auth hook with automatic login redirects for expired sessions
  - Unified dashboards available at /dashboard (client) and /admin (admin) with legacy versions at /dashboard/legacy and /admin/legacy
  - Real-time messaging integrated directly into dashboard views with Apple-style interface
  - Quick project switching, inline status updates, and streamlined file/contract/invoice access
- December 28, 2025. Automatic project selection and intelligent caching system
  - Implemented auto-selection of newest project when client dashboard loads
  - Added localStorage caching to remember last selected project across sessions
  - Client dashboard now automatically opens most recent project or restores cached selection
  - Newest project selection logic: chooses project with highest ID (most recently created)
  - Seamless user experience: no manual clicking required to access project on dashboard load
  - Cache fallback system: if cached project no longer exists, automatically selects newest available project
- December 28, 2025. Fixed messaging window height constraints and scrolling behavior
  - Resolved messaging container expanding vertically and overlapping other dashboard content
  - Added max-height constraints (500px) to messaging window with internal scrolling
  - Enhanced AppleMessaging component with proper overflow handling and min-height constraints
  - Messages now scroll within fixed container instead of pushing page content down
  - Improved dashboard layout stability with consistent messaging window sizing
  - Fixed CardContent overflow settings to ensure proper container boundaries
- December 28, 2025. Unified dashboard tab system to replace old multi-page navigation
  - Replaced external navigation buttons with integrated tab system within unified dashboard
  - Created inline Files, Contracts, and Invoices components maintaining modern UX design
  - Added tab switching with visual indicators (active tab gets white background)
  - Users remain in unified dashboard instead of being redirected to legacy pages
  - Tab system includes: Messages (default), Files, Contracts, and Invoices
  - Each tab displays relevant project data with consistent dark theme styling
  - Eliminated need to navigate away from main dashboard for project management tasks
- December 28, 2025. Fixed admin messaging height constraints across all interfaces
  - Applied messaging window height constraints to admin unified dashboard
  - Fixed admin project messaging pages with proper overflow handling
  - Added max-height (500px) constraints to all admin messaging containers
  - Ensured consistent messaging behavior between client and admin interfaces
  - All messaging windows now maintain fixed sizes with internal scrolling
- December 28, 2025. Eliminated automatic window scrolling when receiving messages
  - Fixed messaging interfaces to prevent automatic page scrolling when new messages arrive
  - Modified auto-scroll behavior to only trigger when user sends their own messages
  - Changed scroll behavior from 'smooth' with default block to 'smooth' with 'nearest' block positioning
  - Applied fixes to both AppleMessaging and AdvancedMessaging components
  - Window position now remains stable when receiving messages from other users
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```