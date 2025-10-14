# Kajabi Integration Setup Guide

## 🎯 Automatic Account Creation for Course Students

This guide shows you how to automatically create accounts in your "Feel and Grow Rich" app when students enroll in your Kajabi course.

---

## 📋 What Happens Automatically

1. Student purchases/enrolls in your Kajabi course
2. Kajabi sends webhook notification to your app
3. Your app automatically creates an account with their email
4. Student can log in immediately (credentials sent via email - see Step 4 below)

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

Your app uses this to automatically create an account.

---

### Step 4: Email Setup (Important!)

**Current Status:** When an account is created, a temporary password is generated but NOT emailed yet.

**To complete the integration, you need to:**

1. **Add an email service** (Resend, SendGrid, AWS SES, etc.)
2. **Update the webhook code** to send welcome emails with login credentials

#### Temporary Workaround (Manual)

For now, when students enroll:
1. Check your app logs for: `Temporary password for [email]: [password]`
2. Manually email students their login credentials
3. Direct them to: `https://YOUR-APP-URL.replit.app/auth`

#### Recommended: Password Reset Flow (No Email Needed!)

Better option - let students set their own password:

1. When account is created, don't set a password
2. Email student: "Your account is ready! Click here to set your password"
3. Link to password reset page
4. Student creates their own password

---

### Step 5: Test the Integration

1. **Make a test purchase** in Kajabi (use test mode if available)
2. **Check your app logs** to see:
   ```
   Kajabi webhook received for: test@example.com
   Auto-created account for Kajabi student: test@example.com
   Temporary password for test@example.com: abc123XYZ
   ```
3. **Verify account creation:**
   - Try logging in at `/auth` with the email and temp password
   - Account should exist and work!

---

## 🔒 Security Notes

1. **HTTPS Required:** Kajabi webhooks only work with HTTPS URLs (Replit provides this automatically)
2. **Duplicate Prevention:** The webhook checks if user already exists - no duplicate accounts
3. **Email Validation:** Emails are normalized (lowercase, trimmed) before account creation
4. **Password Security:** Temporary passwords are bcrypt hashed (never stored in plain text)

---

## 📊 Monitoring

### View Webhook Logs in Kajabi

1. Go to your webhook settings in Kajabi
2. Click **View Logs**
3. See: ID, Status, Request UUID, Parameters, Errors, Timestamps

### View App Logs in Replit

Check your console for:
- `Kajabi webhook received for: [email]`
- `Auto-created account for Kajabi student: [email]`
- `User already exists: [email]` (if duplicate)

---

## 🎓 Student Login Instructions

Once set up, tell your students:

1. **Check your email** for login credentials
2. **Go to:** `https://YOUR-APP-URL.replit.app/auth`
3. **Sign in** with your email and password
4. **Start your journey** with the 8 transformative wealth consciousness tools!

---

## 🚨 Troubleshooting

### Webhook Not Firing
- ✅ Verify HTTPS URL (not HTTP)
- ✅ Check Kajabi webhook logs for errors
- ✅ Ensure your app is deployed (not just in dev mode)

### Duplicate Account Errors
- ✅ This is normal - webhook returns "User already has access"
- ✅ Student can still log in with existing credentials

### Students Can't Log In
- ✅ Verify email was sent with correct credentials
- ✅ Check app logs for the generated password
- ✅ Try password reset flow instead

---

## 📧 Next Steps: Add Email Notifications

To fully automate this, integrate an email service:

### Recommended: Resend (Easy + Free Tier)
1. Sign up at https://resend.com
2. Get API key
3. Update webhook code to send welcome email
4. Template: "Welcome! Your login: email@example.com, password: [temp]"

### Example Email Template

**Subject:** Welcome to Feel and Grow Rich - Your Account is Ready! 

**Body:**
```
Hi [Name],

Welcome to your wealth consciousness journey!

Your account has been created:
📧 Email: [email]
🔑 Password: [temporary-password]

Login here: https://YOUR-APP-URL.replit.app/auth

Once logged in, you'll have access to:
✨ 8 transformative assessment tools
🤖 AI-powered abundance insights
📊 PDF, Excel, and JSON exports

We recommend changing your password after first login.

To your abundance,
The Science of Abundance Team
```

---

## ✅ You're All Set!

Once configured, every Kajabi course enrollment automatically creates an account in your app. Students get immediate access to all wealth consciousness tools!

Need help? Check the Kajabi webhook logs or your Replit console for debugging.
