#!/bin/bash

# Feel and Grow Rich - Development Startup Script
# This script starts the local development environment

echo "🚀 Starting Feel and Grow Rich Development Environment..."
echo ""

# Export environment variables
export DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
export SESSION_SECRET="P60L/BC6VRg3kG8sYJv8yi7D7KSCgEpY3pSYRf7BRdw="
export PORT=5001

# Check if Supabase is running
if ! curl -s http://127.0.0.1:54321/health > /dev/null 2>&1; then
  echo "⚠️  Supabase is not running. Starting Supabase..."
  npm run db:start
  echo ""
fi

echo "✅ Supabase is running"
echo "📊 Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres"
echo "🌐 API URL: http://127.0.0.1:54321"
echo "🎨 Studio: http://127.0.0.1:54323"
echo ""
echo "🔧 Starting Express server on port 5001..."
echo "   Frontend: http://localhost:5001"
echo "   API: http://localhost:5001/api/*"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev
