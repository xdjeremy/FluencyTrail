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
*   **User Model**:
    * Central model with one-to-many relationship to `Activity`
    * Many-to-many relationship with `Language` (languages user is learning)
    * One-to-one relationship with `Language` (primary language)
    * One-to-many relationship with `OAuth` (auth providers)
*   **Activity Model**:
    * Many-to-one relationship with `User`
    * Many-to-one relationship with `Language` (required)
    * Optional many-to-one relationship with `Media`
*   **Media Model**:
    * One-to-many relationship with `Activity`
    * One-to-one relationships with `MovieMetadata` or `TvMetadata`
*   **Language Model**:
    * Many-to-many with `User` (languages being learned)
    * One-to-many with `User` (as primary language)
    * One-to-many with `Activity`

## 5. Critical Implementation Paths

### User Authentication Flow
*   Steps: Standard RedwoodJS dbAuth with OAuth support
*   Components Involved:
    * Frontend: LoginPage, SignupPage
    * Backend: auth function, users service
*   Error Handling: Form validation, API error responses

### Data Flow: Activity Creation
*   Request Path:
    1. User interaction with `ActivityForm`
    2. Language data fetched via `NewActivityCell`
    3. Form data validation with `ActivitySchema`
    4. GraphQL mutation to create activity
*   Response Path:
    1. Activity creation in database with language association
    2. Success/error response to client
    3. UI updates (notifications, form reset)
*   Error Handling:
    * Frontend form validation (required fields, constraints)
    * Backend service validation
    * GraphQL error responses

### Data Flow: Language Management
*   Request Path:
    1. User interaction with language settings
    2. GraphQL mutations for language operations
*   Response Path:
    1. Database updates (add/remove languages, set primary)
    2. UI updates reflecting changes
*   Error Handling:
    * Validation for primary language requirement
    * Cascade handling for related activities

## 6. System Constraints

*   **Performance Requirements:**
    *   Constraint: ...
*   **Security Requirements:**
    *   Constraint: ...

*(This document should be updated when architectural decisions change or new patterns emerge.)*
