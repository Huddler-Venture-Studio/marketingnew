# Super Admin Setup

This guide explains how to set up and use the super admin role in the application.

## Overview

The super admin role provides exclusive access to the `/admin` route. Only users with the `super_admin` role in their user metadata can access admin pages.

## Prerequisites

Before setting up the super admin, ensure you have:

1. **SUPABASE_SERVICE_ROLE_KEY** in your `.env.local` file
2. **NEXT_PUBLIC_SUPABASE_URL** in your `.env.local` file

## Setup Steps

### 1. Apply Database Migration

First, apply the database migration to add super admin support:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in supabase/migrations/20250104_add_super_admin_role.sql
# in your Supabase SQL Editor
```

### 2. Create Super Admin User

Run the setup script to create the super admin user:

```bash
npm run setup:super-admin
```

This will create (or update) the user:
- **Email**: `aiob@huddler.io`
- **Password**: `Huddler123?`
- **Role**: `super_admin`

### 3. Verify Access

1. Sign in with the super admin credentials
2. Navigate to `/admin` - you should have access
3. Other users will be redirected to `/portal` if they try to access `/admin`

## Access Control

### Route Protection

The middleware (`src/lib/supabase/middleware.ts`) protects the `/admin` route:

- Users not logged in → redirected to `/sign-in`
- Users without `super_admin` role → redirected to `/portal`
- Users with `super_admin` role → granted access

### Helper Functions

Use the auth helper functions in your server components/API routes:

```typescript
import { requireSuperAdmin, isSuperAdmin } from '@/lib/supabase/auth-helpers';

// Require super admin access (throws error if not super admin)
const user = await requireSuperAdmin(supabase);

// Check if user is super admin (returns boolean)
if (isSuperAdmin(user)) {
  // Super admin logic
}
```

## Role Hierarchy

- **super_admin**: Full access to everything, including `/admin` routes
- **admin**: Access to admin features but NOT `/admin` routes
- **investor**: Standard user access

## Security Notes

1. The super admin credentials are hardcoded in the setup script for simplicity
2. In production, consider:
   - Using environment variables for credentials
   - Implementing 2FA for super admin accounts
   - Regularly rotating super admin passwords
   - Auditing super admin actions

## Troubleshooting

### "Missing required environment variables" error

Ensure your `.env.local` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### User already exists but not super admin

The script will automatically update existing users to super admin role.

### Cannot access /admin after login

1. Verify the user has `role: 'super_admin'` in user metadata
2. Check browser console for any middleware errors
3. Ensure you're signed in with the correct account
