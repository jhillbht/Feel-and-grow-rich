# Custom Domain Setup Guide

## 🌐 Setting Up miracleacademy.ai & www.miracleacademy.ai

This guide shows you how to properly configure both your root domain (`miracleacademy.ai`) and www subdomain (`www.miracleacademy.ai`) with Replit.

---

## 📋 Prerequisites

- Your app must be **published** on Replit
- You must have access to your domain registrar's DNS settings
- Your domains must be added to `REPLIT_DOMAINS` secret for OAuth to work

---

## Part 1: Add Both Domains to REPLIT_DOMAINS

### Step 1: Update REPLIT_DOMAINS Secret

1. Go to **Tools** → **Secrets** in Replit
2. Find `REPLIT_DOMAINS` secret
3. Update to include **all 4 domains**:
   ```
   18535e95-4e4b-4772-bf1c-82d06e2a0b83-00-1j25jiwk2djoe.picard.replit.dev,mind-sculpt-sean6feel.replit.app,miracleacademy.ai,www.miracleacademy.ai
   ```

4. **Save** - app will restart automatically

### Why This Is Critical

- ✅ Enables OAuth on `miracleacademy.ai`
- ✅ Enables OAuth on `www.miracleacademy.ai`
- ✅ Fixes DNS errors
- ✅ Users can sign in from any domain

---

## Part 2: Configure DNS for Both Domains

### Step 2a: Link Root Domain (miracleacademy.ai)

1. **In Replit:**
   - Go to **Deployments** tab
   - Click **Settings**
   - Click **Link a domain** (or "Manually connect from another registrar")
   - Enter: `miracleacademy.ai`
   - Replit will show you DNS records to add

2. **You'll get records like this:**
   ```
   Type: A
   Host: @ (or miracleacademy.ai)
   Value: [IP address from Replit]

   Type: TXT
   Host: @ (or miracleacademy.ai)
   Value: [verification code from Replit]
   ```

3. **In Your Domain Registrar (e.g., GoDaddy, Namecheap, Cloudflare):**
   - Go to DNS settings
   - Add the **A record**
   - Add the **TXT record**
   - Save changes

### Step 2b: Link www Subdomain (www.miracleacademy.ai)

1. **In Replit:**
   - Still in Deployments → Settings
   - Click **Link a domain** again
   - Enter: `www.miracleacademy.ai`
   - Replit will show you DNS records

2. **You'll get records like this:**
   ```
   Type: A
   Host: www
   Value: [same IP as root domain]

   Type: TXT
   Host: www
   Value: [verification code from Replit]
   ```

3. **In Your Domain Registrar:**
   - Add the **A record** for `www` subdomain
   - Add the **TXT record** for `www` subdomain
   - Save changes

### DNS Configuration Example

Your final DNS setup should look like this:

| Type | Host/Name | Value |
|------|-----------|-------|
| A | @ | [Replit IP] |
| TXT | @ | [Replit verification] |
| A | www | [Replit IP] |
| TXT | www | [Replit verification] |

---

## Part 3: Wait for DNS Propagation

DNS changes can take:
- **Minimum:** 5-10 minutes
- **Maximum:** 48 hours
- **Typical:** 1-2 hours

### Check Verification Status

1. Go to Replit **Deployments** → **Settings**
2. Domain tab should show **"Verified"** when ready
3. Both `miracleacademy.ai` and `www.miracleacademy.ai` should be verified

---

## Part 4: Test Both Domains

Once verified, test OAuth on both domains:

### Test miracleacademy.ai
1. Visit `https://miracleacademy.ai`
2. Click "Get Started"
3. Sign in with OAuth
4. Should work! ✅

### Test www.miracleacademy.ai
1. Visit `https://www.miracleacademy.ai`
2. Click "Get Started"
3. Sign in with OAuth
4. Should work! ✅

---

## 🚨 Important Notes

### About www Redirect

**Option 1: Both domains work independently (Recommended)**
- Both `miracleacademy.ai` and `www.miracleacademy.ai` work
- Users can access either URL
- No redirect needed
- Sessions work on both

**Option 2: Redirect www to root (Advanced)**
If you want `www.miracleacademy.ai` to automatically redirect to `miracleacademy.ai`:

1. **Use your domain registrar's redirect feature:**
   - Many registrars (GoDaddy, Namecheap) offer URL forwarding
   - Set `www.miracleacademy.ai` → `https://miracleacademy.ai`
   - Use 301 permanent redirect

2. **OR use Cloudflare (if applicable):**
   - Add both domains to Cloudflare
   - Create Page Rule for www redirect
   - Forward to root domain

### SSL/HTTPS Certificates

- ✅ Replit automatically handles SSL certificates
- ✅ Both domains get HTTPS
- ✅ No manual certificate setup needed

### Cloudflare Users

⚠️ **Important:** If using Cloudflare:
- **Disable proxy** (orange cloud) for DNS records
- Use **DNS only** (gray cloud)
- Replit doesn't support Cloudflare proxied records for cert renewal

---

## ✅ Verification Checklist

- [ ] Updated `REPLIT_DOMAINS` with all 4 domains
- [ ] App restarted after secret update
- [ ] Added A record for root domain (@)
- [ ] Added TXT record for root domain (@)
- [ ] Added A record for www subdomain
- [ ] Added TXT record for www subdomain
- [ ] DNS propagated (both domains verified in Replit)
- [ ] OAuth works on `miracleacademy.ai`
- [ ] OAuth works on `www.miracleacademy.ai`
- [ ] OAuth works on production domain
- [ ] No DNS errors in browser

---

## 🔍 Troubleshooting

### DNS Error Still Showing

1. ✅ **Verify REPLIT_DOMAINS updated:**
   - Must include `miracleacademy.ai` AND `www.miracleacademy.ai`
   - Comma-separated, no spaces
   - App restarted after update

2. ✅ **Check DNS propagation:**
   - Use tool: https://dnschecker.org
   - Enter your domain
   - Check if A records are live globally

3. ✅ **Verify domain in Replit:**
   - Deployments → Settings
   - Should show "Verified" status
   - Both domains linked

### OAuth Works on One Domain, Not the Other

- Check that **both** domains are in `REPLIT_DOMAINS` secret
- Ensure both have DNS records configured
- Both must be verified in Replit

### www Domain Not Working

- Verify you added **separate** DNS records for `www` subdomain
- TXT record must be for `www` host (not just @)
- Check that `www.miracleacademy.ai` is in `REPLIT_DOMAINS`

---

## 📞 Need Help?

If issues persist:

1. Check Replit console for OAuth errors
2. Verify DNS records in registrar
3. Use DNS checker to confirm propagation
4. Ensure all 4 domains in REPLIT_DOMAINS
5. Check browser console for specific errors

---

## ✨ Final Result

Once complete, users can access your app via:
- ✅ `https://miracleacademy.ai`
- ✅ `https://www.miracleacademy.ai`
- ✅ `https://mind-sculpt-sean6feel.replit.app`
- ✅ Development domain

**All with working OAuth authentication!** 🚀
