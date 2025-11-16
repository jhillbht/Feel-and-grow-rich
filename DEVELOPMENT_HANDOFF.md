# Development Handoff - Feel and Grow Rich

**Date:** November 16, 2025  
**Current Status:** Google OAuth working, Replit Auth removed, app running on Neon PostgreSQL

---

## 🎯 Project Overview

"Feel and Grow Rich" is a comprehensive wealth consciousness platform with 8 transformative tools:
1. Intake Wizard
2. Belief Mapper
3. Triangle Shift
4. Six Fears Assessment
5. Feelings Dial
6. Hill Overlay
7. Daily 10
8. Export (JSON/Excel/PDF)

**Tech Stack:**
- Frontend: React 18 + TypeScript + Wouter + TanStack Query + Tailwind + Shadcn UI
- Backend: Node.js + Express + Passport.js
- Database: PostgreSQL (Neon via Replit) - **NEW DATABASE as of Nov 16, 2025**
- Auth: Google OAuth 2.0 (Standard Passport, NOT Replit Auth)
- AI: OpenAI GPT-4 via Replit AI Integrations
- CRM: Kajabi webhooks + GoHighLevel sync

**Live URL:** https://miracleacademy.ai

---

## 🔧 Recent Critical Fixes (Nov 16, 2025)

### Problem: Persistent "getaddrinfo EAI_AGAIN helium" Error
**Root Cause:** Multiple layers of corruption:
1. Old DATABASE_URL pointed to malformed "helium.db.elephantsql.com"
2. 7,155 cached sessions in `data/sessions.json` referenced old database
3. Replit Auth integration packages still installed
4. Express error handler sent headers after OAuth redirects

### Solutions Applied:

#### 1. New Database Created
```bash
# Old (BROKEN):
DATABASE_URL=postgres://...@helium.db.elephantsql.com:5432/...

# New (WORKING):
DATABASE_URL=postgres://...@ep-muddy-breeze-ae8zt97c.c-2.us-east-2.aws.neon.tech/...
```
- Created fresh Replit PostgreSQL database (Neon-hosted)
- All user assessment data safely preserved in `userAssessments` table
- Sessions.json only had auth metadata (IDs, timestamps), no user data lost

#### 2. Removed Replit Auth Completely
**Packages Uninstalled:**
```bash
npm uninstall openid-client memoizee @types/memoizee
```

**Files Deleted:**
- `server/replitAuth.ts.backup`

**Integration Status:**
- Still listed in `.replit` config (can't edit that file directly)
- BUT implementation packages removed, so it can't intercept OAuth

#### 3. Fixed Express Error Handler
**Problem:** Error handler called `res.json()` after Passport already sent OAuth redirect
**Solution:** Added `return` statements to prevent execution after redirect

```typescript
// server/index.ts - Line 48-60
app.use((err: any, req: any, res: any, next: any) => {
  if (res.headersSent) {
    console.error('Error after headers sent:', err);
    return;  // ← CRITICAL: Don't try to send response
  }
  // ... rest of error handler
});
```

#### 4. Verified Google OAuth Working
```bash
curl -I http://localhost:5000/api/auth/google
# Returns: Location: https://accounts.google.com/o/oauth2/v2/auth...
```

---

## 🗄️ Database Schema

**Database:** Neon PostgreSQL  
**Connection:** `ep-muddy-breeze-ae8zt97c.c-2.us-east-2.aws.neon.tech`

### Tables:

#### `users`
```typescript
{
  id: serial PRIMARY KEY,
  email: varchar UNIQUE,
  oauthSub: varchar UNIQUE,  // Google OAuth subject ID
  firstName: varchar,
  lastName: varchar,
  profileImageUrl: varchar,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `userAssessments`
```typescript
{
  id: serial PRIMARY KEY,
  userId: integer REFERENCES users(id),
  intakeData: jsonb,
  beliefMapperData: jsonb,
  triangleShiftData: jsonb,
  sixFearsData: jsonb,
  feelingsDialData: jsonb,
  hillOverlayData: jsonb,
  daily10Data: jsonb,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `sessions`
```typescript
{
  sid: varchar PRIMARY KEY,
  sess: jsonb,
  expire: timestamp
}
```

---

## 🔐 Authentication Flow

**IMPORTANT:** Uses **standard OAuth**, NOT Replit Auth

### Google OAuth Routes (server/auth.ts)

```typescript
// Initiate login
GET /api/auth/google
→ Redirects to accounts.google.com

// OAuth callback
GET /api/auth/google/callback
→ Exchanges code for tokens
→ Creates/updates user in database
→ Redirects to / (home page)

// Logout
GET /api/logout
→ Destroys session
→ Redirects to /

// Get current user
GET /api/auth/user (protected)
→ Returns user object or 401
```

### Session Configuration
```typescript
// server/auth.ts
import connectPg from "connect-pg-simple";

const pgStore = connectPg(session);
const sessionStore = new pgStore({
  conString: process.env.DATABASE_URL,
  tableName: "sessions",
  ttl: 7 * 24 * 60 * 60  // 7 days
});
```

### Middleware
```typescript
// server/auth.ts
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
```

---

## 🔌 API Routes (server/routes.ts)

### Authentication
- `GET /api/auth/google` - Start Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/logout` - Logout
- `GET /api/auth/user` - Get current user (protected)

### User Assessments (All Protected)
- `POST /api/sessions` - Create new assessment
- `GET /api/sessions/:id` - Get assessment by ID
- `PATCH /api/sessions/:id` - Update assessment
- `DELETE /api/sessions/:id` - Delete assessment

### AI & Export
- `POST /api/respond` - AI guidance (OpenAI GPT-4)
- `GET /api/export/json` - Export as JSON
- `GET /api/export/excel` - Export as Excel (8 worksheets)
- `GET /api/export/pdf` - Export as PDF report

### CRM Integrations
- `POST /api/webhooks/kajabi` - Kajabi student enrollment webhook
- Background: GoHighLevel sync (automatic batch + immediate)

---

## 🎨 Frontend Structure

### Key Files
- `client/src/App.tsx` - Router + auth checks
- `client/src/hooks/useAuth.ts` - Auth hook for components
- `client/src/lib/queryClient.ts` - TanStack Query config

### Pages (client/src/pages/)
- `landing.tsx` - Public landing page (logged out users)
- `home.tsx` - Dashboard (logged in users)
- `intake.tsx` - Intake Wizard
- `belief-mapper.tsx` - Belief Mapper tool
- `triangle-shift.tsx` - Triangle Shift tool
- `six-fears.tsx` - Six Fears Assessment
- `feelings-dial.tsx` - Feelings Dial tool
- `hill-overlay.tsx` - Hill Overlay tool
- `daily-10.tsx` - Daily 10 practice

### Auth Hook Usage
```typescript
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;
  
  return <div>Welcome {user.firstName}!</div>;
}
```

---

## 🌍 Environment Variables

**Required Secrets:**
```bash
# Database (Neon PostgreSQL)
DATABASE_URL=postgres://...@ep-muddy-breeze-ae8zt97c.c-2.us-east-2.aws.neon.tech/...
PGHOST=ep-muddy-breeze-ae8zt97c.c-2.us-east-2.aws.neon.tech
PGUSER=...
PGPASSWORD=...
PGDATABASE=...
PGPORT=5432

# Application
APP_URL=https://miracleacademy.ai
SESSION_SECRET=...
NODE_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID=918677300222-...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...

# OpenAI (via Replit Integration)
# Auto-configured, no manual setup needed

# GoHighLevel CRM
GHL_API_KEY=...
GHL_LOCATION_ID=...

# Supabase (legacy, may not be used)
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

---

## 🚀 Running Locally

### Install Dependencies
```bash
npm install
```

### Database Migrations
```bash
# Push schema changes to database
npm run db:push

# Force push (if data loss warning)
npm run db:push --force
```

### Start Development Server
```bash
npm run dev
# Runs on http://localhost:5000
```

### Access Points
- Frontend: http://localhost:5000
- API: http://localhost:5000/api/*

---

## 🐛 Known Issues & Solutions

### Issue: "getaddrinfo EAI_AGAIN helium"
**Status:** ✅ FIXED  
**Solution:** New Neon database created, old sessions cleared

### Issue: Replit Auth intercepting Google OAuth
**Status:** ✅ FIXED  
**Solution:** Uninstalled `openid-client`, `memoizee` packages

### Issue: "Cannot set headers after they are sent"
**Status:** ✅ FIXED  
**Solution:** Added `return` in error handler when headers already sent

### Issue: Session data not persisting
**Status:** ✅ WORKING  
**Solution:** Using `connect-pg-simple` with PostgreSQL session store

---

## 📊 Data Export Features

### JSON Export
Returns all assessment data as JSON object

### Excel Export
8 worksheets:
1. User Profile
2. Intake Wizard
3. Belief Mapper
4. Triangle Shift
5. Six Fears
6. Feelings Dial
7. Hill Overlay
8. Daily 10

### PDF Export
Professional report with:
- Cover page
- Assessment summaries
- Visual formatting
- Page numbers

Implementation: `pdfkit` library (server/routes.ts ~line 200-400)

---

## 🤖 AI Integration

**Model:** GPT-4 via Replit OpenAI Integration  
**System Prompt:** Wealth consciousness coaching  
**Endpoint:** `POST /api/respond`

```typescript
// server/openai.ts
export const AI_MODEL = "gpt-4o";
export const WEALTH_CONSCIOUSNESS_SYSTEM_PROMPT = `...`;

// Usage in routes.ts
const response = await openai.chat.completions.create({
  model: AI_MODEL,
  messages: [
    { role: "system", content: WEALTH_CONSCIOUSNESS_SYSTEM_PROMPT },
    ...conversationHistory
  ]
});
```

---

## 🔗 CRM Integrations

### Kajabi Webhook
**Endpoint:** `POST /api/webhooks/kajabi`  
**Trigger:** Student enrolls in course  
**Action:** Creates user account if email matches OAuth

### GoHighLevel Sync
**Files:** `server/ghl.ts`  
**Features:**
- Immediate sync after assessment updates
- Batch sync of recent assessments
- Contact matching by email
- Custom field updates for all 8 tools

---

## 📝 Next Steps / TODO

1. **Test Google OAuth in browser** (hard refresh first!)
2. Add GitHub OAuth if needed (already configured in code)
3. Verify all 8 assessment tools save correctly
4. Test export features (JSON/Excel/PDF)
5. Test Kajabi webhook integration
6. Test GoHighLevel sync
7. Review AI chat responses
8. Add loading states to slow operations
9. Consider adding email/password auth as fallback
10. Setup production deployment

---

## 🔍 Debugging Tips

### Check if user is authenticated
```bash
curl -b cookie.txt http://localhost:5000/api/auth/user
```

### Check database connection
```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

### Check sessions
```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM sessions;"
```

### Test OAuth redirect
```bash
curl -I http://localhost:5000/api/auth/google
# Should redirect to accounts.google.com
```

### View logs
```bash
# Application logs
npm run dev

# Database logs (if needed)
tail -f data/sessions.json
```

---

## 📚 Key Dependencies

```json
{
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "passport-github2": "^0.1.12",
  "express-session": "^1.18.0",
  "connect-pg-simple": "^9.0.1",
  "@tanstack/react-query": "^5.0.0",
  "wouter": "^3.0.0",
  "drizzle-orm": "^0.33.0",
  "postgres": "^3.4.0",
  "openai": "^4.0.0",
  "pdfkit": "^0.15.0",
  "xlsx": "^0.18.5"
}
```

---

## ⚠️ Important Notes

1. **DATABASE_URL** points to NEW Neon database (Nov 16, 2025)
2. **No Replit Auth** - Uses standard Google OAuth only
3. **Sessions** stored in PostgreSQL, not file system
4. **User data** preserved in `userAssessments` table (JSONB columns)
5. **APP_URL** must be `https://miracleacademy.ai` for OAuth callbacks
6. **Hard refresh browser** after removing Replit Auth packages

---

## 🎓 Design System

**Theme:** "Science of Abundance"  
**Colors:** Earth tones (Terracotta, Sage, Teal, Amber)  
**Typography:** Helvetica Neue (ancient wisdom aesthetic)  
**Dark Mode:** Fully supported  
**Responsive:** Mobile-first design

See `design_guidelines.md` for complete design specifications.

---

**Questions?** Review the following files:
- `replit.md` - Project overview
- `server/auth.ts` - Authentication implementation
- `server/routes.ts` - All API endpoints
- `client/src/App.tsx` - Frontend routing
- `shared/schema.ts` - Database schema + types

**Last Updated:** November 16, 2025 03:37 AM UTC
