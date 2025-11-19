# OAuth Quick Fix Guide

**Time to Complete:** ~15 minutes  
**Priority:** 🔴 CRITICAL

## ⚡ IMMEDIATE ACTIONS

### ✅ Step 1: Add Environment Variables to Replit (5 min)

1. Open Replit → Tools → Secrets
2. Add:

```bash
VITE_SUPABASE_URL
Value: https://itdlyrprkjeiwvkxaieg.supabase.co

VITE_SUPABASE_ANON_KEY
Value: [Get from Supabase Dashboard]
```

### ✅ Step 2: Get Anon Key from Supabase (2 min)

1. Go to: https://supabase.com/dashboard/project/itdlyrprkjeiwvkxaieg/settings/api
2. Copy "anon public" key
3. Paste into `VITE_SUPABASE_ANON_KEY` in Replit Secrets

### ✅ Step 3: Configure Supabase Redirect URLs (3 min)

1. Go to: https://supabase.com/dashboard/project/itdlyrprkjeiwvkxaieg/auth/url-configuration
2. Add ALL redirect URLs:
   - https://miracleacademy.ai/auth/callback
   - https://mind-sculpt-sean6feel.replit.app/auth/callback
   - http://localhost:5000/auth/callback
3. Set Site URL: `https://miracleacademy.ai`

### ✅ Step 4: Update Google Cloud Console (3 min)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Add to Authorized redirect URIs:
   - `https://itdlyrprkjeiwvkxaieg.supabase.co/auth/v1/callback`
3. Save changes

### ✅ Step 5: Restart & Test (2 min)

1. Replit auto-restarts after saving secrets
2. Open: https://miracleacademy.ai
3. Click "Continue with Google"
4. Should redirect and log you in ✅

## 🎯 Success Indicators

- ✅ Google OAuth popup appears
- ✅ Redirects to /auth/callback
- ✅ User logs in successfully
- ✅ Session persists on refresh

---

**For detailed verification, run:**
```bash
./verify-oauth-setup.sh
node verify-oauth-config.js
```