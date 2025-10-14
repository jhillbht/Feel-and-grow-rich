# Feel and Grow Rich - Wealth, Worthiness & Personal Development Platform

## Overview
A comprehensive web application providing transformative tools and assessments for wealth, worthiness, and personal development. Built with React, TypeScript, and Express, featuring AI-powered guidance through OpenAI integration to help you feel and grow rich in all areas of life.

## Project Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Wouter (routing), TanStack Query
- **Backend**: Node.js, Express
- **Styling**: Tailwind CSS, Shadcn UI components
- **AI Integration**: OpenAI Responses API (via Replit AI Integrations)
- **Data Export**: xlsx library for Excel generation
- **Storage**: In-memory (MemStorage) with JSON file persistence

### Design System
- **Color Palette**: Rich blues and empowering accents for abundance and growth
- **Typography**: Inter (body), Lexend (headings) - optimized for readability
- **Dark Mode**: Full support with persistent theme switching
- **Responsive**: Mobile-first design approach

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
   - JSON export (raw data)
   - Excel export (spreadsheet format)
   - Track your journey to feeling and growing rich

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
- `POST /api/respond` - AI-powered wealth consciousness guidance (OpenAI)
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
- 2025-10-14: Complete MVP implementation & Rebranding to "Feel and Grow Rich"
  - All 8 transformative tools fully functional
  - Backend API with session management and persistence
  - OpenAI integration for AI-powered wealth consciousness insights
  - JSON and Excel export functionality
  - End-to-end testing completed successfully
  - Session data hydration and persistence across page reloads
  - Fixed critical apiRequest JSON parsing bug
  - Rebranded from mental health focus to wealth, worthiness & abundance

## User Preferences
- Rich, empowering visual design with Inter/Lexend fonts
- Easy navigation between transformative tools
- Progress tracking and data export for wealth consciousness journey
- AI-powered abundance guidance via OpenAI
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
