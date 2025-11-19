// verify-oauth-config.js
// Run this in your Replit Shell: node verify-oauth-config.js

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => {
    console.log('\n' + '='.repeat(60));
    console.log(colors.blue + msg + colors.reset);
    console.log('='.repeat(60));
  }
};

async function verifyOAuthSetup() {
  let criticalIssues = 0;
  let warnings = 0;

  log.section('🔍 OAuth Configuration Verification');

  // Step 1: Check Environment Variables
  log.section('📋 STEP 1: Environment Variables');
  
  const requiredVars = {
    critical: [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY'
    ],
    important: [
      'DATABASE_URL',
      'APP_URL',
      'SESSION_SECRET'
    ]
  };

  console.log('\n🔑 Critical Variables (Required for OAuth):');
  requiredVars.critical.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      log.error(`Missing: ${varName}`);
      criticalIssues++;
    } else {
      const preview = value.substring(0, 30) + '...';
      log.success(`Found: ${varName} = ${preview}`);
    }
  });

  console.log('\n🔑 Important Variables:');
  requiredVars.important.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      log.warning(`Missing: ${varName}`);
      warnings++;
    } else {
      const preview = value.substring(0, 30) + '...';
      log.success(`Found: ${varName} = ${preview}`);
    }
  });

  // Step 2: Validate URLs
  log.section('📋 STEP 2: URL Validation');
  
  const viteUrl = process.env.VITE_SUPABASE_URL;
  const serverUrl = process.env.SUPABASE_URL;
  const expectedUrl = 'https://itdlyrprkjeiwvkxaieg.supabase.co';

  if (viteUrl && serverUrl) {
    if (viteUrl === serverUrl) {
      log.success('Client and server URLs match');
    } else {
      log.error(`URL mismatch!\n  VITE_SUPABASE_URL: ${viteUrl}\n  SUPABASE_URL: ${serverUrl}`);
      criticalIssues++;
    }

    if (viteUrl === expectedUrl) {
      log.success('Using correct Supabase project URL');
    } else {
      log.error(`Wrong Supabase URL!\n  Expected: ${expectedUrl}\n  Got: ${viteUrl}`);
      criticalIssues++;
    }
  } else {
    log.error('Cannot validate URLs - missing variables');
    criticalIssues++;
  }

  // Step 3: Test Supabase Connection
  log.section('📋 STEP 3: Supabase Connection Test');

  if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.VITE_SUPABASE_ANON_KEY
      );

      log.info('Testing Supabase connection...');
      
      // Test health endpoint
      const healthResponse = await fetch(`${process.env.VITE_SUPABASE_URL}/auth/v1/health`);
      if (healthResponse.ok) {
        log.success('Supabase Auth API is reachable');
      } else {
        log.error(`Supabase Auth API returned: ${healthResponse.status}`);
        criticalIssues++;
      }

      // Test client initialization
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        // This is expected if no session exists
        log.info('No active session (this is normal)');
      } else {
        log.success('Supabase client initialized successfully');
      }

    } catch (error) {
      log.error(`Supabase connection failed: ${error.message}`);
      criticalIssues++;
    }
  } else {
    log.error('Cannot test Supabase - missing credentials');
    criticalIssues++;
  }

  // Step 4: Check OAuth Provider Configuration
  log.section('📋 STEP 4: OAuth Provider Configuration Check');
  
  console.log('\n⚠️  Manual verification required:');
  console.log('\n1️⃣  Supabase Dashboard - Auth Providers:');
  console.log('   → https://supabase.com/dashboard/project/itdlyrprkjeiwvkxaieg/auth/providers');
  console.log('   → Verify Google OAuth is enabled');
  console.log('   → Verify Client ID and Secret are configured');
  
  console.log('\n2️⃣  Supabase Dashboard - Redirect URLs:');
  console.log('   → https://supabase.com/dashboard/project/itdlyrprkjeiwvkxaieg/auth/url-configuration');
  console.log('   → Required redirect URLs:');
  console.log('      • https://miracleacademy.ai/auth/callback');
  console.log('      • https://mind-sculpt-sean6feel.replit.app/auth/callback');
  console.log('      • http://localhost:5000/auth/callback');
  
  console.log('\n3️⃣  Google Cloud Console - OAuth Credentials:');
  console.log('   → https://console.cloud.google.com/apis/credentials');
  console.log('   → Required authorized redirect URI:');
  console.log('      • https://itdlyrprkjeiwvkxaieg.supabase.co/auth/v1/callback');

  // Step 5: Summary
  log.section('📊 VERIFICATION SUMMARY');

  console.log('\nResults:');
  if (criticalIssues === 0 && warnings === 0) {
    log.success('All checks passed! ✨');
    console.log('\n🎯 Next Steps:');
    console.log('   1. Verify manual configurations above');
    console.log('   2. Test OAuth at: https://miracleacademy.ai');
    console.log('   3. Click "Continue with Google"');
    console.log('   4. Verify successful login');
  } else {
    if (criticalIssues > 0) {
      log.error(`Found ${criticalIssues} critical issue(s) - OAuth will NOT work!`);
    }
    if (warnings > 0) {
      log.warning(`Found ${warnings} warning(s) - may cause issues`);
    }
    
    console.log('\n🔧 Action Required:');
    console.log('   1. Fix missing environment variables in Replit Secrets');
    console.log('   2. Restart your application');
    console.log('   3. Run this script again');
  }

  // Step 6: Quick Test Commands
  log.section('🧪 QUICK TEST COMMANDS');
  
  console.log('\n📝 Test OAuth Flow:');
  console.log('   # In browser console (F12):');
  console.log('   console.log(import.meta.env.VITE_SUPABASE_URL)');
  console.log('   // Should show: "https://itdlyrprkjeiwvkxaieg.supabase.co"');
  console.log('   // NOT "http://127.0.0.1:54321" or "undefined"');
  
  console.log('\n📝 Test from command line:');
  console.log('   curl https://itdlyrprkjeiwvkxaieg.supabase.co/auth/v1/health');
  console.log('   // Should return 200 OK');

  console.log('\n' + '='.repeat(60));
  console.log('✅ Verification Complete');
  console.log('='.repeat(60) + '\n');

  process.exit(criticalIssues > 0 ? 1 : 0);
}

// Run verification
verifyOAuthSetup().catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
});