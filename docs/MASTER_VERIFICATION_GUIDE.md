# OAuth Verification - Master Guide

**Project:** Feel and Grow Rich / Miracle Academy  
**Date:** November 19, 2025

## 📦 Verification Package Contents

### 1. verify-oauth-setup.sh (Bash Script)
   - Checks environment variables in Replit
   - Validates URLs and configuration
   - Tests Supabase connectivity

### 2. verify-oauth-config.js (Node Script)
   - Tests Supabase client initialization
   - Validates server-side configuration
   - Checks API connectivity

### 3. browser-oauth-check.js (Browser Script)
   - Verifies client-side environment variables
   - Tests browser Supabase connection
   - Checks active sessions

## 🚀 Quick Verification (5 Minutes)

### Step 1: Run Bash Script
```bash
chmod +x verify-oauth-setup.sh
./verify-oauth-setup.sh
```

### Step 2: Run Node Script
```bash
node verify-oauth-config.js
```

### Step 3: Test in Browser
1. Open https://miracleacademy.ai
2. Press F12 to open console
3. Copy/paste contents of `browser-oauth-check.js`
4. Press Enter

## 🎯 What Each Script Checks

### verify-oauth-setup.sh
- ✓ VITE_SUPABASE_URL exists
- ✓ VITE_SUPABASE_ANON_KEY exists
- ✓ URLs match between VITE_ and server versions
- ✓ Using correct Supabase project
- ✓ Application is running
- ✓ Supabase endpoint is reachable

### verify-oauth-config.js
- ✓ Environment variables loaded
- ✓ URLs match expected values
- ✓ Supabase client can initialize
- ✓ Auth API is reachable
- ✓ No connection errors

### browser-oauth-check.js
- ✓ Client has access to VITE_ variables
- ✓ Variables are NOT localhost/undefined
- ✓ Supabase client works in browser
- ✓ Can connect to Supabase API

## 🔴 Common Issues & Fixes

See OAUTH_QUICK_FIX.md for step-by-step solutions.

## 📋 Complete Verification Workflow

### Phase 1: Replit Environment (5 min)
1. Run `verify-oauth-setup.sh`
2. Fix any critical issues
3. Restart Replit
4. Run `verify-oauth-config.js`

### Phase 2: Supabase Dashboard (5 min)
1. Check Auth Providers
2. Check Redirect URLs
3. Check API Settings

### Phase 3: Google Cloud Console (3 min)
1. Check Authorized Redirect URIs
2. Add Supabase callback URL

### Phase 4: Browser Testing (5 min)
1. Run browser verification script
2. Test OAuth flow

## ✅ Success Criteria

All verification scripts should show:
- ✅ 0 critical issues
- ✅ 0 warnings
- ✅ All checks passed
- ✅ OAuth login works

---

**For detailed instructions, see VERIFICATION_CHECKLIST.md**