# OAuth Domain Configuration Fix

## 🔴 Critical Issue: OAuth Fails on Production & Custom Domains

### The Problem

OAuth authentication fails with `getaddrinfo EAI_AGAIN helium` DNS error when accessing the app through:
- ❌ Production domain: `mind-sculpt-sean6feel.replit.app`
- ❌ Custom domain: `miracleacademy.ai`

OAuth **only works** on:
- ✅ Dev domain: `18535e95-4e4b-4772-bf1c-82d06e2a0b83-00-1j25jiwk2djoe.picard.replit.dev`

### Why This Happens

The `REPLIT_DOMAINS` environment variable only contains the dev domain. The OAuth system creates a separate authentication strategy for **each domain** in this list. When you access via a domain that's **not in the list**, the OAuth callback fails.

**Current REPLIT_DOMAINS:**
```
18535e95-4e4b-4772-bf1c-82d06e2a0b83-00-1j25jiwk2djoe.picard.replit.dev
```

**Missing domains:**
- `mind-sculpt-sean6feel.replit.app` (production)
- `miracleacademy.ai` (custom domain)

---

## ✅ How to Fix It

### Step 1: Update REPLIT_DOMAINS Secret

1. **Open Replit Secrets:**
   - Click **Tools** in left sidebar
   - Click **Secrets**

2. **Find `REPLIT_DOMAINS` secret**

3. **Update the value to include ALL THREE domains (comma-separated):**
   ```
   18535e95-4e4b-4772-bf1c-82d06e2a0b83-00-1j25jiwk2djoe.picard.replit.dev,mind-sculpt-sean6feel.replit.app,miracleacademy.ai
   ```

4. **Click "Save"**

### Step 2: Restart the Application

After updating the secret, the app needs to restart to load the new configuration.

**Option A: Automatic Restart (Recommended)**
- Replit will automatically restart the app when you save the secret

**Option B: Manual Restart**
- Stop the workflow
- Start it again

### Step 3: Test OAuth on All Domains

Test OAuth login on each domain:

1. **Dev Domain:**
   ```
   https://18535e95-4e4b-4772-bf1c-82d06e2a0b83-00-1j25jiwk2djoe.picard.replit.dev
   ```

2. **Production Domain:**
   ```
   https://mind-sculpt-sean6feel.replit.app
   ```

3. **Custom Domain:**
   ```
   https://miracleacademy.ai
   ```

**For each domain:**
- Click "Get Started"
- Choose OAuth provider (Google, GitHub, etc.)
- Should redirect successfully ✅

---

## 🔍 Technical Details

### How OAuth Multi-Domain Works

The authentication setup creates a separate Passport.js strategy for each domain:

```typescript
// From server/replitAuth.ts
for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
  const strategy = new Strategy(
    {
      name: `replitauth:${domain}`,
      config,
      scope: "openid email profile offline_access",
      callbackURL: `https://${domain}/api/callback`,
    },
    verify
  );
  passport.use(strategy);
}
```

When you access `/api/login`, it uses `req.hostname` to select the correct strategy:

```typescript
app.get("/api/login", (req, res, next) => {
  passport.authenticate(`replitauth:${req.hostname}`, {
    prompt: "login consent",
    scope: ["openid", "email", "profile", "offline_access"],
  })(req, res, next);
});
```

**If the hostname isn't in REPLIT_DOMAINS:**
- No strategy exists for that domain
- OAuth callback fails with DNS error
- Users can't log in ❌

---

## 📋 Verification Checklist

After updating `REPLIT_DOMAINS`:

- [ ] Secret updated with all 3 domains (comma-separated)
- [ ] App restarted successfully
- [ ] OAuth works on dev domain
- [ ] OAuth works on production domain (`mind-sculpt-sean6feel.replit.app`)
- [ ] OAuth works on custom domain (`miracleacademy.ai`)
- [ ] No DNS errors in console
- [ ] Users can complete full login flow

---

## 🚨 Troubleshooting

### Still Getting DNS Errors?

1. **Verify the secret was saved correctly:**
   - Check Secrets panel
   - Ensure no extra spaces or formatting issues

2. **Verify the app restarted:**
   - Check console for "serving on port 5000"
   - Should see fresh startup logs

3. **Check the domain spelling:**
   - Must match exactly (case-sensitive)
   - No https:// prefix
   - No trailing slashes

### OAuth Works on One Domain, Not Others?

- Verify all domains are in the comma-separated list
- No spaces between domains in the secret value
- Each domain separated by single comma only

### Need to Add More Domains Later?

Just update `REPLIT_DOMAINS` again with the new domain added to the comma-separated list.

---

## ✨ After the Fix

Once configured, users will be able to:
- ✅ Access the app via **any configured domain**
- ✅ Sign in with OAuth (Google, GitHub, Apple, etc.)
- ✅ No more DNS errors
- ✅ Seamless authentication experience

**All domains will share the same user database and sessions!**

---

## 📞 Need Help?

If OAuth still doesn't work after following these steps:

1. Check Replit console logs for errors
2. Verify secret value has no typos
3. Ensure app has restarted
4. Test with different OAuth providers
5. Check browser console for additional errors

The fix is simple: **Add your domains to REPLIT_DOMAINS secret!** 🚀
