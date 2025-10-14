# Feel and Grow Rich - Wealth, Worthiness & Personal Development Platform

## Overview
A comprehensive web application providing transformative tools and assessments for wealth, worthiness, and personal development. Built with React, TypeScript, and Express, featuring AI-powered guidance through OpenAI integration to help you feel and grow rich in all areas of life.

## Project Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Wouter (routing), TanStack Query
- **Backend**: Node.js, Express, Passport.js
- **Database**: PostgreSQL (via Supabase/DATABASE_URL), Drizzle ORM
- **Authentication**: Replit Auth (OAuth) - supports Google, GitHub, X, Apple, email/password
- **Styling**: Tailwind CSS, Shadcn UI components
- **AI Integration**: OpenAI Responses API (via Replit AI Integrations)
- **Data Export**: xlsx (Excel), pdfkit (PDF), JSON
- **Storage**: PostgreSQL for users, user assessments, and session management

### Design System (Science of Abundance Visual Identity)
- **Color Palette**: Earth tones - Terracotta (#8B6B47) primary, Sage (#6B8E6B) success, Teal (#4A7C7E) info, Amber (#C4A661) accent
- **Typography**: Helvetica Neue (body & headings) - ancient wisdom aesthetic
- **Dark Mode**: Full support with persistent theme switching
- **Responsive**: Mobile-first design approach
- **Branding**: "Feel and Grow Rich" name with Science of Abundance visual language

## Features

### Transformative Tools for Wealth & Worthiness
1. **Intake Wizard** - Multi-step assessment capturing:
   - Personal information
   - Birth data (optional)
   - Consent acknowledgment
   - Life conditions description
   - Patterns to transform for wealth and worthiness

2. **Belief Mapper** - Visual tool for mapping wealth consciousness:
   - Events → Beliefs → Patterns → Blocks
   - Identify limiting beliefs about money and worthiness
   - Interactive transformation planning

3. **Triangle Shift** - Perspective transformation for abundance:
   - Victim/Hero/Persecutor → Creator/Coach/Challenger
   - Transform scarcity mindset to abundance mindset
   - New empowering perspective development

4. **Six Fears Assessment** - Fear identification blocking wealth:
   - Fear of failure, success, rejection, abandonment, loss of control, death
   - Understand fears limiting prosperity
   - Transform fear into fuel for growth

5. **Feelings Dial** - Emotional wealth awareness:
   - 6 emotion ratings (Anger, Sadness, Guilt, Shame, Fear, Joy)
   - 90-second prosperity mindfulness practice
   - Emotional abundance reflection

6. **Hill Overlay** - Principle-based wealth actions:
   - Guiding principle selection for prosperity
   - Micro-action commitment toward financial and emotional wealth
   - Personal abundance commitment

7. **Daily 10** - 10-minute wealth consciousness practice:
   - 5 structured prompts for growth and prosperity
   - Timer tracking
   - Celebration of daily progress

8. **Export** - Data portability:
   - JSON export (raw session data download)
   - Excel export (8 worksheets with all assessment data)
   - PDF export (professional report with all insights formatted with pdfkit)
   - Track your journey to feeling and growing rich

### Data Model
PostgreSQL schemas in `server/db/schema.ts`:
- **Users table**: id (VARCHAR/UUID), email, oauth_sub (OAuth subject), firstName, lastName, profileImageUrl, timestamps
- **userAssessments table**: id (UUID), userId (FK), timestamps, JSONB columns for all assessment data
- **sessions table**: Passport session storage (managed by connect-pg-simple)
- Assessment data stored in JSONB columns: intake, belief_map, triangle_shift, six_fears, feelings_dial, hill_overlay, daily_10, ai_interactions

Legacy in-memory schemas in `shared/schema.ts`:
- Session schema with all assessment data (kept for backwards compatibility)
- Individual assessment schemas with validation
- TypeScript types for type safety
- Zod validation schemas

### API Routes

**Authentication (Replit Auth OAuth):**
- `GET /auth/signin` - Initiate OAuth flow with provider selection
- `GET /auth/callback` - OAuth callback handler
- `GET /auth/signout` - Destroy OAuth session
- `GET /api/auth/user` - Get current authenticated user
- `GET /api/auth/me` - Legacy endpoint for current user

**User Assessments (Sessions):**
- `POST /api/sessions` - Create new user assessment session (authenticated)
- `GET /api/sessions/:id` - Retrieve user assessment data (authenticated)
- `PATCH /api/sessions/:id` - Update user assessment data (authenticated)
- `DELETE /api/sessions/:id` - Delete user assessment session (authenticated)

**AI & Export:**
- `POST /api/respond` - AI-powered wealth consciousness guidance (OpenAI)
- `GET /api/export/json` - Export session as JSON
- `GET /api/export/excel` - Export session as Excel (8 worksheets)
- `GET /api/export/pdf` - Export session as PDF report

## Project Structure
```
client/
├── src/
│   ├── components/
│   │   ├── ui/ (Shadcn components)
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── app-nav.tsx
│   │   └── progress-stepper.tsx
│   ├── pages/
│   │   ├── home.tsx
│   │   ├── intake-wizard.tsx
│   │   ├── belief-mapper.tsx
│   │   ├── triangle-shift.tsx
│   │   ├── six-fears.tsx
│   │   ├── feelings-dial.tsx
│   │   ├── hill-overlay.tsx
│   │   ├── daily-10.tsx
│   │   └── export.tsx
│   └── App.tsx
server/
├── routes.ts (API implementation)
├── storage.ts (Data persistence)
└── index.ts
shared/
└── schema.ts (Data models and validation)
```

## Recent Changes
- 2025-10-14: OAuth Migration (Replit Auth) & Kajabi Integration Fix
  - **Replaced email/password auth with Replit Auth OAuth** to fix production authentication issues
  - **OAuth Providers**: Google, GitHub, X, Apple, email/password fallback
  - **Database Schema Updates**:
    - Added oauth_sub column to users table for OAuth subject linking
    - Renamed sessions table to userAssessments for clarity
    - Passport session storage via connect-pg-simple
  - **Kajabi Webhook Compatibility**:
    - Webhook creates placeholder users with email
    - OAuth login automatically links accounts by matching email
    - oauth_sub populated on first OAuth login
    - Seamless account linking prevents duplicate users
  - **Frontend Updates**:
    - New OAuth login page with provider icons
    - useAuth hook integrated with Replit Auth
    - App.tsx guards routes with authentication check
    - Removed ProtectedRoute component (replaced with Router-level auth)

- 2025-10-14: Complete MVP implementation, Rebranding & Database Migration
  - All 8 transformative tools fully functional
  - Backend API with session management and persistence
  - OpenAI integration for AI-powered wealth consciousness insights
  - **Enhanced Export System**: 
    - PDF export using pdfkit for professional reports with all assessment data
    - Excel export expanded to 8 worksheets (was 3) covering all tools
    - JSON export for raw data backup
  - End-to-end testing completed successfully
  - Session data hydration and persistence across page reloads
  - **Visual Rebranding**: "Feel and Grow Rich" with Science of Abundance visual identity
    - Earth tone color palette: Terracotta (#8B6B47), Sage (#6B8E6B), Teal (#4A7C7E), Amber (#C4A661)
    - Typography: Helvetica Neue replacing Inter/Lexend for ancient wisdom aesthetic
    - Updated all UI components with new brand colors

## User Preferences
- Rich, empowering visual design with Inter/Lexend fonts
- Easy navigation between transformative tools
- Progress tracking and data export for wealth consciousness journey
- AI-powered abundance guidance via OpenAI
- File-based storage for MVP (in-memory with JSON persistence)

## Kajabi Integration

### Automatic Account Creation for Course Students

**Webhook Endpoint:** `/api/webhooks/kajabi`

When a student enrolls in your Kajabi course, their account is automatically created in the app:

1. **Kajabi sends webhook** with student name & email
2. **App creates placeholder user** (no password needed - OAuth only)
3. **Student signs in via OAuth** (Google, GitHub, etc.) to complete account setup
4. **Account automatically linked** on first OAuth login by matching email

**Setup Instructions:** See `KAJABI_SETUP.md` for complete configuration guide.

**Webhook Features:**
- ✅ Duplicate prevention (checks if user already exists)
- ✅ Email normalization (lowercase, trimmed)
- ✅ Placeholder account creation for OAuth linking
- ✅ Auto-linking on first OAuth login via oauth_sub column
- ✅ Auto-logging of enrollments

**How OAuth Linking Works:**
1. Kajabi webhook creates user with email (no oauth_sub)
2. Student clicks OAuth login (Google, GitHub, etc.)
3. System finds existing user by email
4. Updates user record with oauth_sub for future logins
5. Student can now access all 8 assessment tools

## Environment Variables
**Required for Production:**
- `DATABASE_URL` - PostgreSQL connection string (via Supabase)
- `SESSION_SECRET` - Secure secret for Passport session signing (32+ random characters)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `REPLIT_DOMAINS` - Auto-provided by Replit for OAuth callback URLs

**Note:** 
- Replit Auth automatically manages OAuth configuration via REPL_ID and REPLIT_DOMAINS
- Session storage uses connect-pg-simple (PostgreSQL) for persistence across deployments
- OAuth sessions survive server restarts and scale across instances

## Development Status
- ✅ Phase 1: Schema & Frontend Complete
- ✅ Phase 2: Backend Implementation Complete
- ✅ Phase 3: Integration & Testing Complete
- ✅ OAuth Authentication Migration Complete
- ✅ Kajabi Integration Verified
- ✅ MVP Ready for Production

## Key Implementation Details

### Session Management
- SessionProvider context manages global session state
- Automatic session creation on app load
- localStorage persistence of session ID
- TanStack Query for data fetching and caching
- All forms hydrate from session data on mount

### AI Integration
- Floating action button for AI insights (bottom-right)
- OpenAI Responses API integration via Replit AI Integrations
- Abundance and wealth consciousness system prompt
- JSON-structured responses with prosperity insights and growth suggestions

### Data Persistence
- File-based storage (data/sessions.json)
- MemStorage class with async file operations
- All transformative tool data persists across sessions
- Form state hydration via useEffect hooks

### Export Features
- JSON export: Raw session data download
- Excel export: Formatted spreadsheet with all assessment data
- Server-side file generation
- Client-side download triggers
