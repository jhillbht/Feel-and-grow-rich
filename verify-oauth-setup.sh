#!/bin/bash
# OAuth Configuration Verification Script
# Run this in your Replit Shell to verify all settings

echo "=================================="
echo "🔍 Feel and Grow Rich OAuth Setup Verification"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check_var() {
    local var_name=$1
    local var_value=$(printenv $var_name)
    
    if [ -z "$var_value" ]; then
        echo -e "${RED}❌ MISSING${NC}: $var_name"
        return 1
    else
        # Hide sensitive values
        local display_value="${var_value:0:20}..."
        echo -e "${GREEN}✅ FOUND${NC}: $var_name = $display_value"
        return 0
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 1: Environment Variables Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔑 Critical Client-Side Variables (VITE_):"
check_var "VITE_SUPABASE_URL"
VITE_URL_STATUS=$?
check_var "VITE_SUPABASE_ANON_KEY"
VITE_KEY_STATUS=$?
echo ""

echo "🔑 Server-Side Variables:"
check_var "SUPABASE_URL"
SUPABASE_URL_STATUS=$?
check_var "SUPABASE_ANON_KEY"
SUPABASE_KEY_STATUS=$?
check_var "DATABASE_URL"
DATABASE_STATUS=$?
check_var "SESSION_SECRET"
SESSION_STATUS=$?
check_var "APP_URL"
APP_URL_STATUS=$?
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 2: Supabase Configuration Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Supabase CLI is installed
if command -v supabase &> /dev/null; then
    echo -e "${GREEN}✅${NC} Supabase CLI is installed"
    echo ""
    
    # Check if project is linked
    if [ -f "supabase/.temp/project-ref" ]; then
        PROJECT_REF=$(cat supabase/.temp/project-ref)
        echo -e "${GREEN}✅${NC} Project linked: $PROJECT_REF"
    else
        echo -e "${YELLOW}⚠️${NC} Project not linked locally"
        echo "   Run: supabase link --project-ref itdlyrprkjeiwvkxaieg"
    fi
else
    echo -e "${YELLOW}⚠️${NC} Supabase CLI not installed"
    echo "   Install: npm install -g supabase"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 3: URL Configuration Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if URLs match
VITE_URL=$(printenv VITE_SUPABASE_URL)
SERVER_URL=$(printenv SUPABASE_URL)

if [ "$VITE_URL" = "$SERVER_URL" ]; then
    echo -e "${GREEN}✅${NC} Supabase URLs match"
    echo "   URL: $VITE_URL"
else
    echo -e "${RED}❌${NC} URL mismatch!"
    echo "   VITE_SUPABASE_URL: $VITE_URL"
    echo "   SUPABASE_URL: $SERVER_URL"
fi
echo ""

# Check if using correct production URL
if [[ "$VITE_URL" == *"itdlyrprkjeiwvkxaieg.supabase.co"* ]]; then
    echo -e "${GREEN}✅${NC} Using correct Supabase project"
else
    echo -e "${RED}❌${NC} Wrong Supabase URL!"
    echo "   Expected: https://itdlyrprkjeiwvkxaieg.supabase.co"
    echo "   Got: $VITE_URL"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 4: Application Status Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if app is running
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5000 | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅${NC} Application is running on port 5000"
else
    echo -e "${YELLOW}⚠️${NC} Application may not be running"
    echo "   Check: npm run dev"
fi
echo ""

# Check if Supabase is reachable
if [ ! -z "$VITE_URL" ]; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$VITE_URL/auth/v1/health" 2>/dev/null)
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅${NC} Supabase endpoint is reachable"
    else
        echo -e "${RED}❌${NC} Cannot reach Supabase (HTTP $HTTP_CODE)"
    fi
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 5: Critical Issues Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ISSUES_FOUND=0

if [ $VITE_URL_STATUS -ne 0 ]; then
    echo -e "${RED}🔴 CRITICAL${NC}: VITE_SUPABASE_URL is missing!"
    echo "   Add to Replit Secrets: https://itdlyrprkjeiwvkxaieg.supabase.co"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ $VITE_KEY_STATUS -ne 0 ]; then
    echo -e "${RED}🔴 CRITICAL${NC}: VITE_SUPABASE_ANON_KEY is missing!"
    echo "   Get from: https://supabase.com/dashboard/project/itdlyrprkjeiwvkxaieg/settings/api"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ $SUPABASE_URL_STATUS -ne 0 ]; then
    echo -e "${YELLOW}⚠️  WARNING${NC}: SUPABASE_URL is missing (server-side)"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ $SUPABASE_KEY_STATUS -ne 0 ]; then
    echo -e "${YELLOW}⚠️  WARNING${NC}: SUPABASE_ANON_KEY is missing (server-side)"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ $DATABASE_STATUS -ne 0 ]; then
    echo -e "${YELLOW}⚠️  WARNING${NC}: DATABASE_URL is missing"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ No critical issues found!${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎯 Next Steps:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Verify Supabase redirect URLs:"
    echo "   → https://supabase.com/dashboard/project/itdlyrprkjeiwvkxaieg/auth/url-configuration"
    echo ""
    echo "2. Verify Google OAuth callback:"
    echo "   → https://console.cloud.google.com/apis/credentials"
    echo "   → Add: https://itdlyrprkjeiwvkxaieg.supabase.co/auth/v1/callback"
    echo ""
    echo "3. Test OAuth flow:"
    echo "   → Open: https://miracleacademy.ai"
    echo "   → Click 'Continue with Google'"
    echo "   → Should redirect and log you in"
    echo ""
else
    echo ""
    echo -e "${RED}Found $ISSUES_FOUND issue(s) that need fixing!${NC}"
    echo ""
    echo "🔧 Fix these issues in Replit Secrets:"
    echo "   → Replit → Tools → Secrets"
    echo "   → Add missing variables"
    echo "   → Restart application"
fi

echo ""
echo "=================================="
echo "✅ Verification Complete"
echo "=================================="