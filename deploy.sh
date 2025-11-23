#!/bin/bash
# ReviewRescue Deployment Script
# Run this script directly on the VPS to deploy auth system

set -e  # Exit on any error

echo "======================================"
echo "ReviewRescue Authentication Deployment"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Pull latest changes
echo -e "${YELLOW}Step 1: Pulling latest changes from git...${NC}"
git pull origin main
echo -e "${GREEN}✓ Git pull complete${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
npm install --legacy-peer-deps
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Generate Prisma client
echo -e "${YELLOW}Step 3: Generating Prisma client...${NC}"
npm run db:generate
echo -e "${GREEN}✓ Prisma client generated${NC}"
echo ""

# Step 4: Push database schema
echo -e "${YELLOW}Step 4: Updating database schema...${NC}"
echo "This will add User, Account, Session, and VerificationToken tables"
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    npm run db:push
    echo -e "${GREEN}✓ Database schema updated${NC}"
else
    echo -e "${RED}✗ Database update skipped${NC}"
    exit 1
fi
echo ""

# Step 5: Build application
echo -e "${YELLOW}Step 5: Building Next.js application...${NC}"
npm run build
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Step 6: Restart PM2
echo -e "${YELLOW}Step 6: Restarting application...${NC}"
pm2 restart all
echo -e "${GREEN}✓ Application restarted${NC}"
echo ""

# Step 7: Show status
echo -e "${YELLOW}Step 7: Checking application status...${NC}"
pm2 status
echo ""

echo -e "${GREEN}======================================"
echo "Deployment Complete!"
echo "======================================${NC}"
echo ""
echo "Next steps:"
echo "1. Visit http://review.bweb1.com.au/register to create your account"
echo "2. Login at http://review.bweb1.com.au/login"
echo "3. Access admin dashboard at http://review.bweb1.com.au/admin"
echo ""
echo "Your NextAuth secret is already configured in .env"
echo ""
