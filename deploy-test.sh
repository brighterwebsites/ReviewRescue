#!/bin/bash
# ReviewRescue Quick Deploy Script for Testing Claude's Branch
# Location: /home/review.bweb1.com.au/public_html/ReviewRescue/deploy-test.sh

set -e  # Exit on any error

echo "🚀 Starting ReviewRescue Test Deployment..."
echo "================================================"

cd /home/review.bweb1.com.au/public_html/ReviewRescue

# Check current branch
echo "📍 Current branch:"
git branch | grep '*'

# Stash any local changes
echo "💾 Stashing local changes..."
git stash

# Fetch all branches
echo "🔄 Fetching latest from origin..."
git fetch origin

# Checkout Claude's feature branch
echo "🔀 Switching to feature branch..."
git checkout claude/review-redirect-system-01EV3pk7WYf5s8fY86woJnok

# Pull latest changes
echo "⬇️  Pulling latest changes..."
git pull origin claude/review-redirect-system-01EV3pk7WYf5s8fY86woJnok

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "🗄️  Pushing schema to PostgreSQL..."
npx prisma db push --accept-data-loss

# Build the app
echo "🏗️  Building application..."
npm run build

# Restart PM2
echo "♻️  Restarting PM2..."
pm2 restart reviewrescue

# Show logs
echo "📋 Showing recent logs..."
pm2 logs reviewrescue --lines 20 --nostream

echo ""
echo "✅ Deployment complete!"
echo "🌐 Check: https://review.bweb1.com.au"
echo "📊 Logs: pm2 logs reviewrescue"
echo "================================================"
