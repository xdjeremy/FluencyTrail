# Technical Context: FluencyTrail

*This document details the technologies used, development setup, technical constraints, dependencies, and tool usage patterns.*

## 1. Technology Stack

### Core Technologies
*   **Frontend:**
    *   React (v18.3.1)
    *   TypeScript
    *   TailwindCSS (v3.4.17)
    *   Vite (via `@redwoodjs/vite`)
*   **Backend:**
    *   Node.js (v20.x)
    *   TypeScript
    *   GraphQL (Apollo via `@redwoodjs/graphql-server`)
    *   Prisma ORM
*   **Database:**
    *   PostgreSQL

### Development Tools
*   **Framework:** RedwoodJS (v8.6.0)
*   **Version Control:** Git
*   **Package Manager:** Yarn (v4.6.0)
*   **IDE:** VSCode (Assumed)
*   **Database Tools:** Prisma Migrate, Docker Compose (for local PG)
*   **Linting/Formatting:** ESLint (`@redwoodjs/eslint-config`), Prettier (`prettier-plugin-tailwindcss`), lint-staged, husky
*   **API Client (Backend):** Axios (for external API calls)
*   **Email:** Nodemailer

## 2. Development Setup

### Prerequisites
*   Node.js (v20.x)
*   Yarn (v4.6.0)
*   PostgreSQL (Docker recommended)
*   Git

### Environment Configuration
*   `.env.defaults`, `.env.example` (standard Redwood)
*   `redwood.toml` (Ports 8910/8911, Netlify `apiUrl`, OAuth Client IDs included for web)
*   Requires `DATABASE_URL` environment variable.
*   Requires `GITHUB_CLIENT_ID`, `GOOGLE_CLIENT_ID` for OAuth functionality.

### Local Development
*   **Running the App:** `yarn rw dev` (Assumed standard Redwood command)
*   **Database Setup:** `yarn postgres:up` (Starts Docker container), `yarn rw prisma migrate dev` (Apply migrations), `yarn rw exec seed` (Seed data)
*   **Testing:** `yarn rw test` (Assumed standard Redwood command)

## 3. Technical Constraints

### Performance
*   Constraints: ...
*   Monitoring: ...

### Security
*   Authentication: ...
*   Authorization: ...
*   Data Protection: ...

### Scalability
*   Current Limits: ...
*   Growth Considerations: ...

## 4. Dependencies

### Frontend Dependencies (Key Libraries)
*   `@redwoodjs/*` (web, forms, router, auth-dbauth-web)
*   `@spoonjoy/redwoodjs-dbauth-oauth-web`
*   `shadcn/ui` related:
    * `@radix-ui/react-select` (Language selection dropdown)
    * `@radix-ui/react-dialog` (Activity form)
    * Other base components (`tailwind-merge`, `clsx`, `lucide-react`)
*   Form handling:
    * `react-hook-form`
    * `zod` (Form validation including language requirement)
*   Date handling:
    * `date-fns`
    * `date-fns-tz`
    * `react-day-picker`
*   UI components/features:
    * `@uiw/react-heat-map` (Activity visualization)
    * `next-themes` (Dark mode support)
    * `sonner` (Toast notifications)

### Backend Dependencies (Key Libraries)
*   `@redwoodjs/*`:
    * `api` (Core API functionality)
    * `auth-dbauth-api` (Authentication)
    * `graphql-server` (GraphQL API)
*   `@spoonjoy/redwoodjs-dbauth-oauth-api` (OAuth support)
*   External API integration:
    * `axios`
    * `axios-rate-limit`
*   Date/time handling:
    * `date-fns`
    * `date-fns-tz`
*   Caching and email:
    * `node-cache`
    * `nodemailer`
*   Database:
    * `prisma` client (ORM with type-safe queries)

## 5. Tool Usage Patterns

### Authentication
*   User authentication:
    * Redwood `dbAuth` (email/password)
    * OAuth (Google, GitHub) via `@spoonjoy` packages
    * Email verification and password reset flows (`nodemailer`)
*   Data access:
    * Authorization checks in GraphQL resolvers
    * Language-specific data filtering per user

### CI/CD
*   Build process: ...
*   Deployment steps: ...
*   Environment management: ...

### Monitoring & Debugging
*   Tools: ...
*   Logging patterns: ...
*   Error tracking: ...

*(This document should be updated when adding new technologies, changing development processes, or updating significant dependencies.)*
