#!/bin/bash

# Deploy to miracleacademy.ai - Replit Deployment Helper
# This script helps prepare and deploy code to Replit

set -e

echo "=================================================="
echo "  Feel and Grow Rich - Replit Deployment Helper"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Pre-Deployment Checklist${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
  exit 1
fi

echo -e "${GREEN}✓${NC} In correct directory"

# Check git status
if git diff-index --quiet HEAD --; then
  echo -e "${GREEN}✓${NC} No uncommitted changes"
else
  echo -e "${YELLOW}⚠${NC}  You have uncommitted changes"
fi

echo ""
echo -e "${YELLOW}🔐 Production Secrets Configuration${NC}"
echo ""
echo "Copy these values to Replit Secrets (Tools → Secrets):"
echo ""
echo "---------------------------------------------------"
cat <<'EOF'
DATABASE_URL=<Your Neon PostgreSQL URL>
  Example: postgres://...@ep-muddy-breeze-ae8zt97c.c-2.us-east-2.aws.neon.tech/...
  Note: Get this from your existing Replit project secrets

SESSION_SECRET=KygDHJvDI1tstSqh36qwgJlQ2PKTIOEEsbnq2ob1mOuUkDPZjC/harbNhXwrf2z2
  Note: PRODUCTION secret - DO NOT use dev secret

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
  Note: Get from Google Cloud Console

GOOGLE_CLIENT_SECRET=your-google-client-secret
  Note: Get from Google Cloud Console

APP_URL=https://miracleacademy.ai

NODE_ENV=production

PORT=5000
EOF
echo "---------------------------------------------------"
echo ""

# Check if Google OAuth redirect URI is updated
echo -e "${YELLOW}🔗 Google OAuth Configuration${NC}"
echo ""
echo "Ensure this redirect URI is added to Google OAuth:"
echo "  https://miracleacademy.ai/api/auth/google/callback"
echo ""
echo "Visit: https://console.cloud.google.com/apis/credentials"
echo ""

read -p "Have you configured Replit Secrets? (y/n): " secrets_done
if [ "$secrets_done" != "y" ]; then
  echo -e "${YELLOW}Please configure Replit Secrets first, then run this script again.${NC}"
  exit 0
fi

read -p "Have you updated Google OAuth redirect URI? (y/n): " oauth_done
if [ "$oauth_done" != "y" ]; then
  echo -e "${YELLOW}Please update Google OAuth settings first, then run this script again.${NC}"
  exit 0
fi

echo ""
echo -e "${GREEN}✓${NC} Configuration complete"
echo ""

# Commit changes
echo -e "${YELLOW}📦 Preparing code for deployment${NC}"
echo ""

echo "Changed files:"
git status --short

echo ""
read -p "Commit these changes? (y/n): " commit_changes

if [ "$commit_changes" = "y" ]; then
  git add drizzle.config.ts package.json package-lock.json server/db/index.ts server/index.ts DEPLOYMENT_GUIDE.md .env.production.example .gitignore deploy-to-replit.sh

  git commit -m "Fix backend configuration for production deployment

- Fixed Drizzle schema path for correct database operations
- Added dotenv support for environment variable loading
- Fixed server.listen() port binding issue
- Added Supabase CLI helper scripts
- Created deployment automation scripts

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

  echo -e "${GREEN}✓${NC} Changes committed"
else
  echo -e "${YELLOW}Skipping commit${NC}"
fi

echo ""
echo -e "${YELLOW}🚀 Deployment Options${NC}"
echo ""
echo "Choose how to deploy to Replit:"
echo ""
echo "1. Push to Replit via Git (Recommended)"
echo "2. Manual upload via Replit UI"
echo "3. Exit (deploy later)"
echo ""
read -p "Select option (1-3): " deploy_option

case $deploy_option in
  1)
    echo ""
    echo -e "${YELLOW}Git Push Deployment${NC}"
    echo ""

    # Check if replit remote exists
    if git remote | grep -q "^replit$"; then
      echo -e "${GREEN}✓${NC} Replit remote configured"
    else
      echo -e "${YELLOW}⚠${NC}  Replit remote not configured"
      echo ""
      echo "Get your Replit Git URL from:"
      echo "  1. Open your Replit project"
      echo "  2. Click on 'Version Control' tab"
      echo "  3. Copy the Git URL"
      echo ""
      read -p "Enter Replit Git URL: " replit_url

      if [ -n "$replit_url" ]; then
        git remote add replit "$replit_url"
        echo -e "${GREEN}✓${NC} Replit remote added"
      else
        echo -e "${RED}❌ No URL provided. Skipping push.${NC}"
        exit 1
      fi
    fi

    echo ""
    read -p "Push to Replit now? (y/n): " push_now

    if [ "$push_now" = "y" ]; then
      echo ""
      echo "Pushing to Replit..."
      git push replit main

      echo ""
      echo -e "${GREEN}✅ Deployment initiated!${NC}"
      echo ""
      echo "Replit will:"
      echo "  1. Run npm install"
      echo "  2. Run npm run build"
      echo "  3. Restart the server"
      echo "  4. Deploy to miracleacademy.ai"
      echo ""
      echo "Monitor progress in your Replit project console"
    fi
    ;;

  2)
    echo ""
    echo -e "${YELLOW}Manual Upload Instructions${NC}"
    echo ""
    echo "1. Open: https://replit.com"
    echo "2. Open your Feel and Grow Rich project"
    echo "3. Upload these files:"
    echo "   - drizzle.config.ts"
    echo "   - package.json"
    echo "   - package-lock.json"
    echo "   - server/db/index.ts"
    echo "   - server/index.ts"
    echo "4. Click 'Run' to redeploy"
    echo ""
    ;;

  3)
    echo ""
    echo "Deployment cancelled. Run this script again when ready."
    exit 0
    ;;

  *)
    echo -e "${RED}Invalid option${NC}"
    exit 1
    ;;
esac

echo ""
echo -e "${GREEN}=================================================="
echo "  Deployment Complete!"
echo "==================================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Wait for Replit build to complete (~2-3 minutes)"
echo "  2. Visit: https://miracleacademy.ai"
echo "  3. Test Google OAuth login"
echo "  4. Verify all 8 assessment tools work"
echo ""
echo "If issues occur:"
echo "  - Check Replit Console for build errors"
echo "  - Verify all secrets are configured"
echo "  - Review logs in Replit project"
echo ""
echo "Happy deploying! 🚀"
echo ""
