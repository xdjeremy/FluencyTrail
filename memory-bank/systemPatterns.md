# System Patterns: FluencyTrail

*This document details the system architecture, key technical decisions, design patterns in use, component relationships, and critical implementation paths.*

## 1. Architecture Overview

### Core Architecture
*   **Framework:** RedwoodJS (v8.6.0)
*   **Frontend:** React (v18.3.1) with TypeScript, Vite bundler
*   **Backend:** Node.js (v20.x) with TypeScript
*   **Database:** PostgreSQL (Managed via Docker Compose locally)
*   **ORM:** Prisma
*   **API:** GraphQL (Apollo Server/Client)
*   **Styling:** TailwindCSS with shadcn/ui components
*   **Deployment Target (Implied):** Netlify (based on `apiUrl` in `redwood.toml`)

### Directory Structure
*   Standard RedwoodJS structure (`/api`, `/web`, `/scripts`)

## 2. Key Technical Decisions

*   **Full-Stack Framework:** RedwoodJS - Provides conventions, integrated tooling (GraphQL, Prisma, Auth, Testing).
*   **Database ORM:** Prisma - Strong typing, migration management, ease of use.
*   **Authentication:** RedwoodJS `dbAuth` (email/password) extended with `@spoonjoy/redwoodjs-dbauth-oauth-api/web` for OAuth (Google, GitHub confirmed).
*   **UI Library:** shadcn/ui with Radix UI primitives and TailwindCSS - Modern, accessible, customizable component library.
*   **State Management (Frontend):** Likely Redwood Cells for data fetching + React Context/Hooks for local UI state (Standard RedwoodJS pattern).

## 3. Design Patterns

### Frontend Patterns
*   **Component Organization:**
    *   Pattern: ...
    *   Usage: ...
*   **State Management:**
    *   Pattern: ...
    *   Usage: ...

### Backend Patterns
*   **Service Layer:**
    *   Pattern: ...
    *   Usage: ...
*   **Data Access:**
    *   Pattern: ...
    *   Usage: ...

## 4. Component Relationships

### Backend Services / Data Models (from `schema.prisma`)
*   `User` central model, linked to `Activity`, `Language`, `OAuth`.
*   `Activity` linked to `User`, `Language`, optionally `Media`.
*   `Media` linked to `Activity`, `MovieMetadata`, `TvMetadata`.
*   `Language` linked to `User`, `Activity`.
*   `OAuth` linked to `User`.

## 5. Critical Implementation Paths

### User Authentication Flow
*   Steps: ...
*   Components Involved: ...
*   Error Handling: ...

### Data Flow
*   Request Path: ...
*   Response Path: ...
*   Error Handling: ...

## 6. System Constraints

*   **Performance Requirements:**
    *   Constraint: ...
*   **Security Requirements:**
    *   Constraint: ...

*(This document should be updated when architectural decisions change or new patterns emerge.)*
