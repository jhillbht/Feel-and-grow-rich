## Overview
"Feel and Grow Rich" is a comprehensive web application designed to empower users in their journey toward wealth, worthiness, and personal development. It offers transformative tools and assessments, leveraging a modern tech stack (React, TypeScript, Node.js, PostgreSQL) and AI-powered guidance through OpenAI integration. The platform aims to provide a rich, interactive experience, helping individuals identify and overcome limiting beliefs, transform their mindset, and commit to actions that foster abundance in all aspects of life.

## User Preferences
- Rich, empowering visual design with Inter/Lexend fonts
- Easy navigation between transformative tools
- Progress tracking and data export for wealth consciousness journey
- AI-powered abundance guidance via OpenAI
- File-based storage for MVP (in-memory with JSON persistence)

## System Architecture
The application is built with a React frontend (TypeScript, Wouter, TanStack Query), a Node.js/Express backend, and a PostgreSQL database using Drizzle ORM. Authentication is handled via standard OAuth (Google and GitHub) using Passport.js. Styling is managed with Tailwind CSS and Shadcn UI components. AI integration uses the OpenAI API.

**Recent Migration (2025):**
- Migrated from Replit Auth to standard OAuth for local development compatibility
- Now supports deployment to Vercel, Railway, and other platforms
- Added comprehensive local development setup with Cursor IDE support

**Key Features:**
-   **Transformative Tools:**
    -   Intake Wizard: Comprehensive personal and life condition assessment.
    -   Belief Mapper: Visual tool for identifying and transforming limiting beliefs.
    -   Triangle Shift: Framework for shifting from scarcity to abundance mindset.
    -   Six Fears Assessment: Helps identify fears blocking wealth.
    -   Feelings Dial: Emotional wealth awareness and mindfulness practice.
    -   Hill Overlay: Guides principle-based wealth actions and commitments.
    -   Daily 10: Structured daily practice for wealth consciousness.
-   **Data Export:** Supports JSON, Excel (8 worksheets), and professional PDF report exports of all assessment data.
-   **AI Integration:** A floating action button provides AI-powered wealth consciousness guidance and growth suggestions via OpenAI.
-   **Design System ("Science of Abundance"):** Features an earth-tone color palette (Terracotta, Sage, Teal, Amber), Helvetica Neue typography for an ancient wisdom aesthetic, full dark mode support, and a mobile-first responsive design.

**Data Model:**
-   PostgreSQL schema includes `users` (id, email, oauth_sub, profile info, timestamps), `userAssessments` (userId, JSONB columns for all assessment data), and `sessions` (Passport session storage).
-   Assessment data is stored efficiently in JSONB columns.

**API Routes:**
-   **Authentication:** `GET /api/auth/google`, `GET /api/auth/google/callback`, `GET /api/auth/github`, `GET /api/auth/github/callback`, `GET /api/logout`, `GET /api/auth/user`.
-   **User Assessments:** `POST /api/sessions`, `GET /api/sessions/:id`, `PATCH /api/sessions/:id`, `DELETE /api/sessions/:id`.
-   **AI & Export:** `POST /api/respond`, `GET /api/export/json`, `GET /api/export/excel`, `GET /api/export/pdf`.

**Technical Implementations:**
-   Session management via `SessionProvider` context with `localStorage` persistence for session ID and `TanStack Query` for data fetching.
-   Client-side hydration of form states.
-   Server-side file generation for export features.

## External Dependencies
-   **Frontend:** React 18, TypeScript, Wouter (routing), TanStack Query.
-   **Backend:** Node.js, Express, Passport.js.
-   **Database:** PostgreSQL (via Supabase `DATABASE_URL`), Drizzle ORM.
-   **Authentication:** Standard OAuth via Passport.js (Google OAuth 2.0, GitHub OAuth).
-   **Styling:** Tailwind CSS, Shadcn UI components.
-   **AI Integration:** OpenAI Responses API (via Replit AI Integrations).
-   **Data Export:** `xlsx` (Excel), `pdfkit` (PDF).
-   **CRM Integration:**
    -   **Kajabi:** Webhook integration (`/api/webhooks/kajabi`) for automatic user account creation and linking upon course enrollment, matching users by email with OAuth.
    -   **GoHighLevel (GHL):** One-way sync of user assessment progress to GHL contacts. Requires `GHL_API_KEY` and `GHL_LOCATION_ID`. Features immediate and batch syncing, contact matching by email, and updates custom fields for all 8 assessment tools.
-   **Session Storage:** `connect-pg-simple` for persistent Passport sessions in PostgreSQL.
-   **Environment Variables:** `DATABASE_URL`, `SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `APP_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GHL_API_KEY`, `GHL_LOCATION_ID`, `NODE_ENV`.