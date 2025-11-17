# Production Deployment Guide - miracleacademy.ai

**Last Updated:** November 17, 2025
**Production URL:** https://miracleacademy.ai
**Platform:** Replit (Autoscale)

---

## 📋 Pre-Deployment Checklist

### ✅ Local Development Complete
- [x] Database schema deployed (users, sessions, user_assessments)
- [x] Google OAuth configured and tested locally
- [x] Development server runs without errors
- [x] Environment variables properly loaded via dotenv
- [x] Backend fixes applied (drizzle config, port binding, dotenv)

### 🔧 Code Changes Made
1. **Fixed drizzle.config.ts** - Updated schema path to `./server/db/schema.ts`
2. **Added dotenv support** - Added `import "dotenv/config"` to server files
3. **Fixed server.listen()** - Removed unsupported `reusePort: true`
4. **Added Supabase CLI scripts** - npm run db:start/stop/status/reset
5. **Created start-dev.sh** - Convenient development startup script
6. **Installed dotenv package** - For environment variable loading

---

## 🌐 Production Environment Setup

### Step 1: Configure Replit Secrets

Access your Replit project and add these secrets:

```env
# Database (Production Neon PostgreSQL)
DATABASE_URL=postgres://...@ep-muddy-breeze-ae8zt97c.c-2.us-east-2.aws.neon.tech/...

# Session Secret (PRODUCTION - DO NOT REUSE DEV SECRET)
SESSION_SECRET=KygDHJvDI1tstSqh36qwgJlQ2PKTIOEEsbnq2ob1mOuUkDPZjC/harbNhXwrf2z2

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Application URL (Production)
APP_URL=https://miracleacademy.ai

# Environment
NODE_ENV=production

# Optional: GoHighLevel Integration
GHL_API_KEY=your-ghl-api-key
GHL_LOCATION_ID=your-ghl-location-id
```

**Important:** The `DATABASE_URL` above is from the DEVELOPMENT_HANDOFF.md. Verify this is still the correct production database URL in your Replit project.

---

### Step 2: Update Google OAuth Settings

**Add Production Redirect URI:**

1. Visit: [Google Cloud Console - OAuth Credentials](https://console.cloud.google.com/apis/credentials)

2. Under **Authorized redirect URIs**, add:
   ```
   https://miracleacademy.ai/api/auth/google/callback
   ```

3. **Also keep the local development URIs:**
   ```
   http://localhost:5000/api/auth/google/callback
   http://localhost:5001/api/auth/google/callback
   ```

4. Click **Save**

---

### Step 3: Deploy Code Changes to Replit

#### Option A: Git Push to Replit (Recommended)

```bash
# 1. Navigate to project directory
cd "/Users/supabowl/Library/Mobile Documents/com~apple~CloudDocs/BHT Promo iCloud/Organized AI/Windsurf/Feel and Grow Rich/Feel-and-Grow-Rich"

# 2. Stage all changes
git add drizzle.config.ts package.json package-lock.json server/db/index.ts server/index.ts start-dev.sh

# 3. Commit changes
git commit -m "Fix backend configuration for production deployment

- Fixed Drizzle schema path (shared -> server/db)
- Added dotenv support for environment loading
- Fixed server.listen() port binding
- Added Supabase CLI helper scripts
- Installed dotenv package

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# 4. Add Replit remote (if not already added)
# Get this URL from your Replit project settings
git remote add replit https://github.com/YOUR_REPLIT_USERNAME/feel-and-grow-rich.git

# 5. Push to Replit
git push replit main

# Replit will automatically:
# - Detect changes
# - Run npm install
# - Run npm run build
# - Restart the server
# - Deploy to miracleacademy.ai
```

#### Option B: Manual Deployment via Replit UI

1. Open your Replit project at: https://replit.com/@YOUR_USERNAME/feel-and-grow-rich
2. Upload/replace these files:
   - `drizzle.config.ts`
   - `package.json`
   - `package-lock.json`
   - `server/db/index.ts`
   - `server/index.ts`
3. Click "Run" to restart the deployment
4. Replit will rebuild and deploy automatically

---

### Step 4: Verify Production Database Schema

**Check if production database has the correct schema:**

```bash
# Connect to production database
psql "YOUR_PRODUCTION_DATABASE_URL"

# List tables
\dt

# Expected output:
#  Schema |       Name       | Type  |  Owner
# --------+------------------+-------+----------
#  public | sessions         | table | postgres
#  public | user_assessments | table | postgres
#  public | users            | table | postgres

# If tables are missing or outdated, push schema:
DATABASE_URL="YOUR_PRODUCTION_DATABASE_URL" npm run db:push
```

---

## 🧪 Post-Deployment Testing

### Test 1: Verify Site Loads
```bash
curl -I https://miracleacademy.ai
# Expected: HTTP/2 200
```

### Test 2: Check OAuth Redirect
```bash
curl -I https://miracleacademy.ai/api/auth/google
# Expected: HTTP/2 302
# Location: https://accounts.google.com/o/oauth2/v2/auth...
```

### Test 3: Full Authentication Flow (Browser)

1. Open https://miracleacademy.ai
2. Click "Sign in with Google"
3. Authenticate with Google account
4. Verify redirect back to site (logged in)
5. Refresh page → Should stay logged in
6. Test an assessment tool (e.g., Intake Wizard)
7. Save data and verify it persists

### Test 4: Verify All 8 Tools Load

- [ ] Intake Wizard - https://miracleacademy.ai/intake
- [ ] Belief Mapper - https://miracleacademy.ai/belief-mapper
- [ ] Triangle Shift - https://miracleacademy.ai/triangle-shift
- [ ] Six Fears - https://miracleacademy.ai/six-fears
- [ ] Feelings Dial - https://miracleacademy.ai/feelings-dial
- [ ] Hill Overlay - https://miracleacademy.ai/hill-overlay
- [ ] Daily 10 - https://miracleacademy.ai/daily-10
- [ ] Export - https://miracleacademy.ai/export

---

## 🔍 Troubleshooting

### Issue: OAuth Fails with "redirect_uri_mismatch"
**Solution:** Ensure `https://miracleacademy.ai/api/auth/google/callback` is added to Google OAuth authorized redirect URIs

### Issue: Database Connection Error
**Solution:** Verify `DATABASE_URL` in Replit secrets matches production Neon database

### Issue: 500 Error on Startup
**Solution:** Check Replit logs for missing environment variables (SESSION_SECRET, DATABASE_URL, etc.)

### Issue: Changes Not Deployed
**Solution:**
1. Check Replit build logs
2. Verify git push succeeded
3. Try manual restart in Replit UI

---

## 📊 Deployment Comparison

| Aspect | Local Development | Production (Replit) |
|--------|------------------|---------------------|
| **URL** | http://localhost:5001 | https://miracleacademy.ai |
| **Database** | Supabase Local (127.0.0.1:54322) | Neon PostgreSQL (AWS) |
| **SSL** | None | Automatic (Replit) |
| **Port** | 5001 | 5000 → 80 (Replit handles) |
| **Session Secret** | Dev (P60L/BC6VRg...) | Production (KygDHJvDI1...) |
| **AI** | Via OpenAI API key | Replit AI integration |
| **Env Loading** | .env file + dotenv | Replit Secrets |
| **Sessions** | File + PostgreSQL | PostgreSQL only |

---

## 🚀 Quick Deploy Commands

```bash
# One-command deploy (after git remote setup)
cd "/Users/supabowl/Library/Mobile Documents/com~apple~CloudDocs/BHT Promo iCloud/Organized AI/Windsurf/Feel and Grow Rich/Feel-and-Grow-Rich" && \
git add -A && \
git commit -m "Deploy backend fixes to production" && \
git push replit main
```

---

## 📝 Notes

- **Replit Autoscale:** Automatically scales based on traffic
- **Database Backups:** Neon provides automatic backups
- **AI Integration:** Uses Replit's OpenAI integration (no manual API key needed)
- **Custom Domain:** Already configured (miracleacademy.ai → Replit)
- **Kajabi Integration:** Webhook endpoint at `/api/webhooks/kajabi`
- **GoHighLevel Sync:** One-way sync configured (optional)

---

## 🎯 Deployment Success Criteria

- [x] Code pushed to Replit
- [ ] Replit secrets configured
- [ ] Google OAuth redirect URI added
- [ ] Production database schema current
- [ ] Site loads at https://miracleacademy.ai
- [ ] Google OAuth login works
- [ ] Assessment tools load and save data
- [ ] No console errors in browser
- [ ] Session persists across page refreshes

---

**Need Help?**
- Replit Docs: https://docs.replit.com
- Check Replit project logs for deployment errors
- Verify all secrets are set correctly in Replit dashboard
