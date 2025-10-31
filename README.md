# Feel and Grow Rich

A comprehensive wealth consciousness platform featuring 8 transformative assessment tools, AI-powered insights, and progress tracking.

## 🌟 Features

- **8 Transformative Tools**
  - Intake Wizard - Comprehensive personal assessment
  - Belief Mapper - Visual tool for transforming limiting beliefs
  - Triangle Shift - Framework for abundance mindset
  - Six Fears Assessment - Identify fears blocking wealth
  - Feelings Dial - Emotional wealth awareness practice
  - Hill Overlay - Principle-based wealth actions
  - Daily 10 - Structured daily wealth consciousness practice
  - Export - JSON, Excel (8 worksheets), and PDF reports

- **AI-Powered Guidance** - OpenAI GPT-5 integration for personalized wealth insights
- **Data Export** - Export assessments as JSON, Excel, or professional PDF reports
- **CRM Integration**
  - Kajabi webhook for automatic user enrollment
  - GoHighLevel one-way sync for progress tracking

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Wouter, TanStack Query, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express, Passport.js (Google & GitHub OAuth)
- **Database**: PostgreSQL (Supabase), Drizzle ORM
- **AI**: OpenAI API
- **Styling**: Tailwind CSS with custom "Science of Abundance" design system

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)
- Google Cloud OAuth credentials
- GitHub OAuth app credentials

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd feel-and-grow-rich
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example env file:
   ```bash
   cp .env.example .env
   ```
   
   Fill in the required values in `.env`:
   
   ```env
   # Database (Supabase PostgreSQL)
   DATABASE_URL=postgresql://user:password@host:port/database
   
   # Session Secret (generate with: openssl rand -base64 32)
   SESSION_SECRET=your-generated-secret
   
   # Supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # GitHub OAuth
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   
   # Application URL
   APP_URL=http://localhost:5000
   
   # Optional: GoHighLevel
   GHL_API_KEY=your-ghl-api-key
   GHL_LOCATION_ID=your-location-id
   ```

4. **Set up OAuth Applications**

   **Google OAuth:**
   1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   2. Create a new OAuth 2.0 Client ID
   3. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
   4. Copy Client ID and Client Secret to `.env`

   **GitHub OAuth:**
   1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
   2. Create a new OAuth App
   3. Set callback URL: `http://localhost:5000/api/auth/github/callback`
   4. Copy Client ID and Client Secret to `.env`

5. **Set up the database**
   
   Create a PostgreSQL database on [Supabase](https://supabase.com) and copy the connection string.
   
   Push the schema to your database:
   ```bash
   npm run db:push
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5000`

## 📦 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (tools & views)
│   │   ├── lib/           # Utilities & contexts
│   │   └── hooks/         # Custom React hooks
├── server/                # Backend Express server
│   ├── auth.ts           # OAuth authentication setup
│   ├── routes.ts         # API route handlers
│   ├── storage.ts        # Database abstraction layer
│   ├── db/               # Drizzle ORM configuration
│   ├── ghl.ts            # GoHighLevel integration
│   └── openai.ts         # OpenAI API integration
├── shared/               # Shared types and schemas
│   └── schema.ts         # Zod schemas & TypeScript types
└── package.json
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set up environment variables**
   
   In Vercel dashboard, add all environment variables from `.env`:
   - Update `APP_URL` to your production URL
   - Update OAuth callback URLs in Google/GitHub to production URLs

4. **Configure custom domain** (optional)
   
   In Vercel dashboard:
   - Go to Settings → Domains
   - Add your custom domain (e.g., `miracleacademy.ai`)
   - Update DNS records as instructed

### Railway (Alternative)

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and initialize**
   ```bash
   railway login
   railway init
   ```

3. **Add environment variables**
   ```bash
   railway variables set DATABASE_URL="your-db-url"
   railway variables set SESSION_SECRET="your-secret"
   # ... add all other variables
   ```

4. **Deploy**
   ```bash
   railway up
   ```

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## 📊 Database Schema

The app uses PostgreSQL with the following main tables:

- `users` - User accounts (OAuth-linked)
- `userAssessments` - Assessment data (JSONB columns for each tool)
- `sessions` - Passport.js session storage

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Session encryption secret |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | Yes | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth client secret |
| `APP_URL` | Yes | Application base URL |
| `GHL_API_KEY` | No | GoHighLevel API key |
| `GHL_LOCATION_ID` | No | GoHighLevel location ID |
| `NODE_ENV` | Auto | Environment (development/production) |

## 🤝 Integrations

### Kajabi Webhook

Automatic user creation when students enroll in courses. Set webhook URL in Kajabi to:
```
https://your-domain.com/api/webhooks/kajabi
```

### GoHighLevel Sync

One-way sync of user assessment progress to GHL contacts. Syncs automatically on assessment updates.

## 📝 License

MIT

## 🙏 Support

For issues or questions, please open an issue on GitHub.
