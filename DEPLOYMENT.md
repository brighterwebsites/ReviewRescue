# Authentication Deployment Guide

This guide explains how to deploy the new multi-tenant authentication system to ReviewRescue.

## What's New

- **User Authentication**: Login/register pages with NextAuth.js
- **Multi-tenant System**: One user can manage multiple businesses
- **Role-based Access**: ADMIN users see all businesses, BUSINESS_OWNER users see only their businesses
- **Protected Routes**: /admin routes now require authentication

## Prerequisites

Before deploying, ensure you have:
- Database access (PostgreSQL)
- Environment variables configured
- Backup of existing data (recommended)

## Deployment Steps

### 1. Update Environment Variables

Add the following to your `.env` file:

```bash
# NextAuth Configuration
NEXTAUTH_URL="https://your-domain.com"  # or http://localhost:3000 for dev
NEXTAUTH_SECRET="your-secret-here"      # Generate with: openssl rand -base64 32

# Optional: Default admin credentials for migration
DEFAULT_ADMIN_EMAIL="admin@yourdomain.com"
DEFAULT_ADMIN_PASSWORD="YourSecurePassword123!"
```

**Important**: Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

Note: We use `--legacy-peer-deps` because NextAuth has an optional peer dependency on nodemailer v7, but we're using v6 (which is compatible).

### 3. Update Database Schema

Push the new schema to your database:

```bash
npm run db:generate
npm run db:push
```

This will add:
- `User` table (email, password, name, role)
- `Account` table (OAuth support)
- `Session` table (session management)
- `VerificationToken` table (email verification)
- `userId` field to `Business` table

### 4. Migrate Existing Businesses

Run the migration script to assign existing businesses to a default admin user:

```bash
npm run migrate:businesses
```

This script will:
- Create a default admin user (using `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD` from .env)
- Assign all existing businesses to this admin user
- Print the admin credentials (make sure to change the password after first login!)

**IMPORTANT**: Save the admin credentials that are printed. You'll need them to log in.

### 5. Build and Deploy

```bash
npm run build
pm2 restart all  # or your deployment command
```

### 6. First Login

1. Navigate to `/login`
2. Use the admin credentials from step 4
3. **IMMEDIATELY** change the admin password (feature coming soon)
4. Verify all your businesses are visible in the admin dashboard

## Verification Checklist

After deployment, verify:

- [ ] Can access login page at `/login`
- [ ] Can log in with admin credentials
- [ ] Admin dashboard shows all existing businesses
- [ ] Can create new businesses (assigned to logged-in user)
- [ ] Logout works correctly
- [ ] Non-authenticated users are redirected to login when accessing `/admin`
- [ ] Public review pages still work without authentication

## Rollback Plan

If something goes wrong:

1. Revert the database schema:
   ```bash
   # Manually remove userId foreign key and auth tables
   ```

2. Revert the code changes:
   ```bash
   git revert <commit-hash>
   ```

3. Restart the application:
   ```bash
   pm2 restart all
   ```

## New User Workflow

### Creating Additional Users

1. Navigate to `/register`
2. Fill in name, email, password
3. User is automatically logged in
4. User can create businesses (up to 3 by default, unlimited for ADMIN)

### Creating Admin Users

Currently, admin users must be created directly in the database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'user@example.com';
```

## Security Notes

- Passwords are hashed with bcryptjs (12 rounds)
- NextAuth uses secure JWT sessions
- CSRF protection is built-in
- All admin routes are protected with middleware

## Troubleshooting

### "Invalid credentials" error
- Check database connection
- Verify user exists in database
- Ensure password is correct

### Redirect loop on /admin
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain
- Clear browser cookies

### Can't see businesses after login
- Verify businesses have `userId` set (run migration script)
- Check user role in database
- Look at server logs for errors

## Support

For issues, check:
1. Server logs: `pm2 logs`
2. Database: `npm run db:studio`
3. Environment variables are set correctly
