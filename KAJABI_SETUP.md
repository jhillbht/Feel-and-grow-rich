# Kajabi Integration Setup Guide

## 🎯 Automatic Account Creation with OAuth (No Passwords!)

This guide shows you how to automatically create accounts in your "Feel and Grow Rich" app when students enroll in your Kajabi course. With OAuth, students can sign in securely using Google, GitHub, or other providers—no password management needed!

---

## 📋 What Happens Automatically

1. ✅ Student purchases/enrolls in your Kajabi course
2. ✅ Kajabi sends webhook notification to your app
3. ✅ Your app creates a placeholder account with their email
4. ✅ Student clicks "Sign in with Google" (or GitHub, Apple, etc.)
5. ✅ Account automatically linked—they're in! 🎉

**No passwords. No welcome emails. Just seamless OAuth authentication.**

---

## 🔧 Setup Instructions

### Step 1: Get Your Webhook URL

Your webhook endpoint is:
```
https://YOUR-APP-URL.replit.app/api/webhooks/kajabi
```

Replace `YOUR-APP-URL` with your actual deployed Replit app URL.

**Example:**
```
https://feel-and-grow-rich-abc123.replit.app/api/webhooks/kajabi
```

---

### Step 2: Configure Kajabi Webhook

#### Option A: Purchase Webhook (Recommended)
Use this if you want accounts created when someone **purchases** your course.

1. Log into your **Kajabi Dashboard**
2. Go to **Settings** → **Checkout Settings**
3. Find **Purchase Webhook URL** section
4. Enter your webhook URL: `https://YOUR-APP-URL.replit.app/api/webhooks/kajabi`
5. Click **Save**

#### Option B: Per-Offer Webhook
Use this for a specific course/offer only.

1. Go to **Sales** → **Offers**
2. Select your course offer
3. Click **More Actions** dropdown
4. Click **Purchase Webhook**
5. Enter your webhook URL
6. Click **Save**

#### Option C: Payment Succeeded Webhook
Use this to capture ALL successful payments (purchases, subscriptions, payment plans).

1. Go to **Settings** → **Third Party Integrations and Webhooks**
2. Click **Webhooks** tab
3. Click **+ Create Webhook**
4. Select **Payment Succeeded** event
5. Enter your webhook URL
6. Click **Save**

---

### Step 3: What Data Kajabi Sends

When someone enrolls, Kajabi sends this data to your app:

```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "external_user_id": "student@example.com"
}
```

Your app uses this to automatically create a placeholder account that will be linked when they sign in via OAuth.

---

### Step 4: Send Welcome Instructions to Students

**Email Template for Your Students:**

```
Subject: Welcome to Feel and Grow Rich! 🌟

Hi [Student Name],

Your account for the Feel and Grow Rich platform is ready!

🔗 ACCESS YOUR ACCOUNT:
https://YOUR-APP-URL.replit.app

🚀 HOW TO SIGN IN:
1. Click "Sign in with Google" (or GitHub, Apple, etc.)
2. Use the email address: [their-enrollment-email]
3. That's it! No password needed.

✨ WHAT'S INSIDE:
• 8 transformative wealth consciousness tools
• AI-powered abundance insights (powered by OpenAI)
• PDF, Excel, and JSON exports of your progress
• Personalized daily practices for growth

📧 IMPORTANT: 
Please sign in using the same email you enrolled with: [their-enrollment-email]

Your account will be automatically activated on first login.

To your abundance,
The Science of Abundance Team
```

**Key Points to Include:**
- ✅ Direct link to your app
- ✅ Their enrollment email address (must match!)
- ✅ OAuth provider options (Google, GitHub, Apple, etc.)
- ✅ No password needed
- ✅ What they'll get access to

---

### Step 5: Test the Integration

1. **Make a test purchase** in Kajabi (use test mode if available)
2. **Check your app logs** to see:
   ```
   Kajabi webhook: Created placeholder user for test@example.com
   ```
3. **Test OAuth login:**
   - Go to your app URL
   - Click "Sign in with Google" (or another provider)
   - Use the test enrollment email
   - Account should link automatically and you're in! ✅

---

## 🔒 Security & Privacy

1. **HTTPS Required:** Kajabi webhooks only work with HTTPS URLs (Replit provides this automatically)
2. **Duplicate Prevention:** The webhook checks if user already exists—no duplicate accounts
3. **Email Validation:** Emails are normalized (lowercase, trimmed) before account creation
4. **OAuth Security:** 
   - No passwords stored in database
   - Uses OAuth subject claims for secure authentication
   - Automatic account linking by email match
5. **Data Privacy:** Only name and email collected from Kajabi—no payment info

---

## 🔄 How Account Linking Works (Technical)

Behind the scenes, here's what happens:

1. **Kajabi Webhook Creates User:**
   ```sql
   INSERT INTO users (email, firstName, lastName, oauth_sub)
   VALUES ('student@example.com', 'John', 'Doe', NULL)
   ```

2. **Student Signs In via OAuth:**
   - App checks for existing user by email
   - Finds the placeholder account
   - Updates `oauth_sub` with OAuth provider's subject claim
   
3. **Future Logins:**
   - OAuth provider sends subject claim
   - App finds user by `oauth_sub`
   - Instant authentication ✅

**Result:** Seamless account linking, no duplicates, secure authentication!

---

## 📊 Monitoring

### View Webhook Logs in Kajabi

1. Go to your webhook settings in Kajabi
2. Click **View Logs**
3. See: ID, Status, Request UUID, Parameters, Errors, Timestamps

### View App Logs in Replit

Check your console for:
- `Kajabi webhook: Created placeholder user for [email]`
- `Kajabi webhook: User [email] already exists`
- OAuth login events

---

## 🎓 Student Login Instructions

Share these simple steps with your students:

### Quick Start Guide for Students

**Welcome! Here's how to access your account:**

1. **Go to:** `https://YOUR-APP-URL.replit.app`
2. **Click:** "Sign in with Google" (or GitHub, Apple, etc.)
3. **Use:** The email you enrolled with
4. **That's it!** Your account is automatically activated

**No password needed. Just use your Google/GitHub/Apple account to sign in securely.**

---

## 🚨 Troubleshooting

### Webhook Not Firing
- ✅ Verify HTTPS URL (not HTTP)
- ✅ Check Kajabi webhook logs for errors
- ✅ Ensure your app is deployed and running

### Student Can't Sign In
- ✅ **Check email match:** OAuth email MUST match enrollment email
- ✅ **Try different provider:** If Google fails, try GitHub or Apple
- ✅ **Check app logs:** Look for OAuth errors or account creation issues

### "User Not Found" Error
- ✅ Verify webhook fired (check Kajabi logs)
- ✅ Verify email normalization (lowercase, trimmed)
- ✅ Check database for user record

### Duplicate Account Prevention
- ✅ Webhook checks email before creating account
- ✅ Returns "User already exists" if duplicate attempt
- ✅ Student can still log in with existing account

---

## 🌟 Advanced: Custom Email Automation

Want to automatically email students after enrollment? You can:

### Option 1: Kajabi Email Sequence
1. Create email sequence in Kajabi
2. Trigger on course enrollment
3. Send welcome email with login link

### Option 2: Third-Party Email Service
Integrate Resend, SendGrid, or similar:

1. Add API key to your app
2. Update webhook to send email on account creation
3. Use template from Step 4 above

### Option 3: Zapier/Make.com
1. Connect Kajabi webhook → Zapier → Email service
2. No code needed
3. Visual automation builder

---

## 📈 What's Next?

After setup, every Kajabi enrollment automatically creates an account. Students get immediate access via OAuth (no password management!).

**Recommended Workflow:**
1. ✅ Configure Kajabi webhook (Steps 1-2)
2. ✅ Create welcome email template (Step 4)
3. ✅ Test with your own enrollment (Step 5)
4. ✅ Monitor logs for first few enrollments
5. ✅ Automate welcome emails (optional)

---

## ✅ You're All Set!

**Benefits of OAuth Integration:**
- 🔒 More secure (no passwords to manage)
- 📧 No welcome email with credentials needed
- 🚀 Faster student onboarding
- ✨ Better user experience
- 🔄 Automatic account linking

Your students will love the seamless sign-in experience!

---

## 📞 Need Help?

**Debugging Steps:**
1. Check Kajabi webhook logs
2. Check Replit console logs
3. Verify email addresses match exactly
4. Test OAuth providers (Google, GitHub, etc.)

**Common Issues:**
- Email mismatch → Student uses different email for OAuth
- Webhook not configured → No account created
- OAuth provider blocked → Try different provider

Happy automating! 🎉
