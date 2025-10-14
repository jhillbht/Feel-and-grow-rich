# Inner Journey - Mental Health & Personal Development Platform

## Overview
A comprehensive web application providing therapeutic tools and assessments for mental health and personal development. Built with React, TypeScript, and Express, featuring AI-powered guidance through OpenAI integration.

## Project Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Wouter (routing), TanStack Query
- **Backend**: Node.js, Express
- **Styling**: Tailwind CSS, Shadcn UI components
- **AI Integration**: OpenAI Responses API (via Replit AI Integrations)
- **Data Export**: xlsx library for Excel generation
- **Storage**: In-memory (MemStorage) with JSON file persistence

### Design System
- **Color Palette**: Calming blues and soft accents for therapeutic experience
- **Typography**: Inter (body), Lexend (headings) - optimized for readability
- **Dark Mode**: Full support with persistent theme switching
- **Responsive**: Mobile-first design approach

## Features

### Therapeutic Tools
1. **Intake Wizard** - Multi-step assessment capturing:
   - Personal information
   - Birth data (optional)
   - Consent acknowledgment
   - Life conditions description
   - Loops to break identification

2. **Belief Mapper** - Visual tool for mapping:
   - Events → Beliefs → Loops → Disconnections
   - Interactive item management
   - Category-based organization

3. **Triangle Shift** - Perspective transformation:
   - Victim/Hero/Persecutor → Creator/Coach/Challenger
   - Situation analysis
   - New perspective development

4. **Six Fears Assessment** - Core fear identification:
   - Fear of failure, success, rejection, abandonment, loss of control, death
   - Reflective notes for each fear
   - Progress tracking

5. **Feelings Dial** - Emotional awareness tool:
   - 6 emotion ratings (Anger, Sadness, Guilt, Shame, Fear, Joy)
   - 90-second mindfulness timer
   - Reflection journaling

6. **Hill Overlay** - Principle-based micro-actions:
   - Guiding principle selection
   - Micro-action commitment
   - Personal commitment statement

7. **Daily 10** - 10-minute reflection practice:
   - 5 structured prompts
   - Timer tracking
   - Completion celebration

8. **Export** - Data portability:
   - JSON export (raw data)
   - Excel export (spreadsheet format)
   - Privacy-focused, client-side downloads

### Data Model
Located in `shared/schema.ts`:
- Session schema with all assessment data
- Individual assessment schemas with validation
- TypeScript types for type safety
- Zod validation schemas

### API Routes
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Retrieve session data
- `PATCH /api/sessions/:id` - Update session data
- `DELETE /api/sessions/:id` - Delete session
- `POST /api/respond` - AI-powered therapeutic guidance (OpenAI)
- `GET /api/export/json` - Export session as JSON
- `GET /api/export/excel` - Export session as Excel

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
- 2025-10-14: Complete MVP implementation
  - All 8 therapeutic tools fully functional
  - Backend API with session management and persistence
  - OpenAI integration for AI-powered therapeutic insights
  - JSON and Excel export functionality
  - End-to-end testing completed successfully
  - Session data hydration and persistence across page reloads
  - Fixed critical apiRequest JSON parsing bug

## User Preferences
- Calming, therapeutic visual design with Inter/Lexend fonts
- Easy navigation between assessment tools
- Progress tracking and data export capabilities
- AI-powered therapeutic guidance via OpenAI
- File-based storage for MVP (in-memory with JSON persistence)

## Development Status
- ✅ Phase 1: Schema & Frontend Complete
- ✅ Phase 2: Backend Implementation Complete
- ✅ Phase 3: Integration & Testing Complete
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
- Therapeutic system prompt for mental health guidance
- JSON-structured responses with insights and suggestions

### Data Persistence
- File-based storage (data/sessions.json)
- MemStorage class with async file operations
- All therapeutic tool data persists across sessions
- Form state hydration via useEffect hooks

### Export Features
- JSON export: Raw session data download
- Excel export: Formatted spreadsheet with all assessment data
- Server-side file generation
- Client-side download triggers
