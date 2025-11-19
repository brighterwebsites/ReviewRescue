#!/bin/bash
# ReviewRescue Diagnostic Script
# Run this to check for deployment issues

echo "🔍 ReviewRescue Diagnostic Report"
echo "================================================"
echo ""

cd /home/review.bweb1.com.au/public_html/ReviewRescue

# 1. Check Git Status
echo "📌 Git Status:"
git branch | grep '*'
git log --oneline -1
echo ""

# 2. Check if Prisma Client exists
echo "📦 Prisma Client:"
if [ -d "node_modules/.prisma" ]; then
  echo "✅ Prisma client exists"
  ls -la node_modules/.prisma/client/ | head -5
else
  echo "❌ Prisma client NOT FOUND - Run: npx prisma generate"
fi
echo ""

# 3. Check if database is accessible
echo "🗄️  Database Connection:"
npx prisma db execute --stdin <<< "SELECT 1;" 2>&1 | head -5
echo ""

# 4. Check if build exists
echo "🏗️  Build Status:"
if [ -d ".next" ]; then
  echo "✅ Build exists"
  ls -lah .next/ | head -3
else
  echo "❌ Build NOT FOUND - Run: npm run build"
fi
echo ""

# 5. Check PM2 status
echo "♻️  PM2 Status:"
pm2 describe reviewrescue | grep -E "status|restart|uptime"
echo ""

# 6. Test health endpoint
echo "🏥 Health Check:"
curl -s http://localhost:3000/api/health | jq . || echo "API not responding"
echo ""

# 7. Test business API
echo "🏢 Business API Test:"
curl -s http://localhost:3000/api/business | head -100
echo ""

# 8. Check recent logs
echo "📋 Recent Logs (last 10 lines):"
pm2 logs reviewrescue --lines 10 --nostream
echo ""

echo "================================================"
echo "🔧 Quick Fixes:"
echo "   If Prisma missing: npx prisma generate"
echo "   If Build missing: npm run build"
echo "   Then restart: pm2 restart reviewrescue"
