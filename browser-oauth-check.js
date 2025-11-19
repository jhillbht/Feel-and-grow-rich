// Browser Console OAuth Verification Script
// Run this in your browser console (F12) on https://miracleacademy.ai

console.log('%c🔍 Feel and Grow Rich - OAuth Client-Side Verification', 'font-size: 16px; font-weight: bold; color: #4F46E5;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #9CA3AF;');

const results = {
  critical: [],
  warnings: [],
  success: []
};

// Check 1: Environment Variables
console.log('\n%c📋 Step 1: Environment Variables Check', 'font-size: 14px; font-weight: bold; color: #2563EB;');

const viteUrl = import.meta.env.VITE_SUPABASE_URL;
const viteKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const expectedUrl = 'https://itdlyrprkjeiwvkxaieg.supabase.co';

if (!viteUrl) {
  console.log('%c❌ CRITICAL: VITE_SUPABASE_URL is undefined!', 'color: #DC2626; font-weight: bold;');
  results.critical.push('VITE_SUPABASE_URL is missing');
} else if (viteUrl.includes('127.0.0.1') || viteUrl.includes('localhost')) {
  console.log('%c❌ CRITICAL: VITE_SUPABASE_URL is pointing to localhost!', 'color: #DC2626; font-weight: bold;');
  console.log(`   Current: ${viteUrl}`);
  console.log(`   Expected: ${expectedUrl}`);
  results.critical.push('VITE_SUPABASE_URL is localhost (should be production)');
} else if (viteUrl !== expectedUrl) {
  console.log('%c⚠️  WARNING: VITE_SUPABASE_URL is set but may be wrong', 'color: #F59E0B; font-weight: bold;');
  console.log(`   Current: ${viteUrl}`);
  console.log(`   Expected: ${expectedUrl}`);
  results.warnings.push('VITE_SUPABASE_URL may be incorrect');
} else {
  console.log('%c✅ VITE_SUPABASE_URL is correct:', 'color: #10B981; font-weight: bold;');
  console.log(`   ${viteUrl}`);
  results.success.push('VITE_SUPABASE_URL configured correctly');
}

if (!viteKey) {
  console.log('%c❌ CRITICAL: VITE_SUPABASE_ANON_KEY is undefined!', 'color: #DC2626; font-weight: bold;');
  results.critical.push('VITE_SUPABASE_ANON_KEY is missing');
} else if (viteKey.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1v')) {
  console.log('%c⚠️  WARNING: Using local development key!', 'color: #F59E0B; font-weight: bold;');
  results.warnings.push('Using local development anon key');
} else if (viteKey.startsWith('eyJ')) {
  console.log('%c✅ VITE_SUPABASE_ANON_KEY is set:', 'color: #10B981; font-weight: bold;');
  console.log(`   ${viteKey.substring(0, 50)}...`);
  results.success.push('VITE_SUPABASE_ANON_KEY configured');
} else {
  console.log('%c❌ CRITICAL: VITE_SUPABASE_ANON_KEY has invalid format!', 'color: #DC2626; font-weight: bold;');
  results.critical.push('VITE_SUPABASE_ANON_KEY has invalid format');
}

// Check 2: Supabase Client
console.log('\n%c📋 Step 2: Supabase Client Check', 'font-size: 14px; font-weight: bold; color: #2563EB;');

if (typeof createClient === 'undefined') {
  console.log('%c⚠️  Note: Run this after importing Supabase client', 'color: #F59E0B;');
  console.log('   Try: import("@supabase/supabase-js").then(m => window.supabaseModule = m)');
} else {
  try {
    const testClient = createClient(viteUrl, viteKey);
    console.log('%c✅ Supabase client can be initialized', 'color: #10B981; font-weight: bold;');
    results.success.push('Supabase client initializes successfully');
  } catch (error) {
    console.log('%c❌ CRITICAL: Cannot initialize Supabase client!', 'color: #DC2626; font-weight: bold;');
    console.error('   Error:', error.message);
    results.critical.push('Supabase client initialization failed');
  }
}

// Check 3: Test Supabase Connection
console.log('\n%c📋 Step 3: Supabase Connection Test', 'font-size: 14px; font-weight: bold; color: #2563EB;');

if (viteUrl && viteKey) {
  console.log('Testing connection to Supabase...');
  
  fetch(`${viteUrl}/auth/v1/health`)
    .then(response => {
      if (response.ok) {
        console.log('%c✅ Supabase Auth API is reachable', 'color: #10B981; font-weight: bold;');
        results.success.push('Supabase API is reachable');
      } else {
        console.log(`%c❌ CRITICAL: Supabase returned ${response.status}`, 'color: #DC2626; font-weight: bold;');
        results.critical.push(`Supabase API returned ${response.status}`);
      }
    })
    .catch(error => {
      console.log('%c❌ CRITICAL: Cannot reach Supabase!', 'color: #DC2626; font-weight: bold;');
      console.error('   Error:', error.message);
      results.critical.push('Cannot reach Supabase (network error)');
    });
} else {
  console.log('%c❌ Skipped: Missing credentials', 'color: #DC2626;');
}

// Check 4: Current Session
console.log('\n%c📋 Step 4: Session Check', 'font-size: 14px; font-weight: bold; color: #2563EB;');

// This requires the app's supabase instance
if (typeof supabase !== 'undefined') {
  supabase.auth.getSession().then(({ data: { session }, error }) => {
    if (error) {
      console.log('%c⚠️  Session check error:', 'color: #F59E0B; font-weight: bold;');
      console.error('   ', error);
    } else if (session) {
      console.log('%c✅ Active session found:', 'color: #10B981; font-weight: bold;');
      console.log('   User:', session.user.email);
      console.log('   ID:', session.user.id);
      console.log('   Expires:', new Date(session.expires_at * 1000));
      results.success.push('User is authenticated');
    } else {
      console.log('%cℹ️  No active session (not logged in)', 'color: #3B82F6;');
    }
  });
} else {
  console.log('%c⚠️  Cannot check session - supabase client not in global scope', 'color: #F59E0B;');
  console.log('   This is normal - session is managed internally');
}

// Check 5: OAuth Configuration
console.log('\n%c📋 Step 5: OAuth Configuration', 'font-size: 14px; font-weight: bold; color: #2563EB;');

const currentUrl = window.location.origin;
console.log('Current domain:', currentUrl);

const requiredRedirects = [
  'https://miracleacademy.ai/auth/callback',
  'https://mind-sculpt-sean6feel.replit.app/auth/callback',
  'http://localhost:5000/auth/callback'
];

console.log('\n%cRequired redirect URLs in Supabase Dashboard:', 'font-weight: bold;');
requiredRedirects.forEach(url => {
  console.log(`   • ${url}`);
});

console.log('\n%cVerify these are configured at:', 'font-weight: bold;');
console.log('   → https://supabase.com/dashboard/project/itdlyrprkjeiwvkxaieg/auth/url-configuration');

// Summary
console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #9CA3AF;');
console.log('%c📊 VERIFICATION SUMMARY', 'font-size: 16px; font-weight: bold; color: #4F46E5;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #9CA3AF;');

if (results.critical.length > 0) {
  console.log('\n%c🔴 CRITICAL ISSUES (OAuth will NOT work):', 'color: #DC2626; font-size: 14px; font-weight: bold;');
  results.critical.forEach((issue, i) => {
    console.log(`   ${i + 1}. ${issue}`);
  });
  
  console.log('\n%c🔧 FIX REQUIRED:', 'color: #DC2626; font-weight: bold;');
  console.log('   1. Add missing VITE_ variables to Replit Secrets');
  console.log('   2. Restart your Replit application');
  console.log('   3. Hard refresh this page (Cmd+Shift+R / Ctrl+Shift+R)');
  console.log('   4. Run this script again');
}

if (results.warnings.length > 0) {
  console.log('\n%c⚠️  WARNINGS:', 'color: #F59E0B; font-size: 14px; font-weight: bold;');
  results.warnings.forEach((warning, i) => {
    console.log(`   ${i + 1}. ${warning}`);
  });
}

if (results.success.length > 0) {
  console.log('\n%c✅ SUCCESSFUL CHECKS:', 'color: #10B981; font-size: 14px; font-weight: bold;');
  results.success.forEach((success, i) => {
    console.log(`   ${i + 1}. ${success}`);
  });
}

if (results.critical.length === 0 && results.warnings.length === 0) {
  console.log('\n%c🎉 ALL CHECKS PASSED!', 'color: #10B981; font-size: 16px; font-weight: bold;');
  console.log('\n%c🧪 Test OAuth Flow:', 'font-size: 14px; font-weight: bold; color: #2563EB;');
  console.log('   1. Click "Continue with Google"');
  console.log('   2. Complete Google authentication');
  console.log('   3. You should be redirected back and logged in');
  console.log('   4. Run this script again to verify session');
}

console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #9CA3AF;');

// Return results object for programmatic access
window.oauthVerificationResults = {
  critical: results.critical,
  warnings: results.warnings,
  success: results.success,
  isPassing: results.critical.length === 0
};

console.log('\n%cResults saved to: window.oauthVerificationResults', 'color: #6B7280; font-style: italic;');