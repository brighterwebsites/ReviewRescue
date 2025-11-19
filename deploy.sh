#!/bin/bash
# ReviewRescue Deploy Script for Main Branch
# Location: /home/review.bweb1.com.au/public_html/ReviewRescue/deploy.sh

set -e

echo "🚀 Deploying ReviewRescue from main branch..."
echo "================================================"

cd /home/review.bweb1.com.au/public_html/ReviewRescue

# Pull latest from main
echo "⬇️  Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push schema
echo "🗄️  Pushing schema..."
npx prisma db push --accept-data-loss

# Build
echo "🏗️  Building..."
npm run build

# Restart
echo "♻️  Restarting..."
pm2 restart reviewrescue

# Show logs
echo "📋 Recent logs:"
pm2 logs reviewrescue --lines 20 --nostream

echo ""
echo "✅ Deployment complete!"
echo "🌐 https://review.bweb1.com.au"
