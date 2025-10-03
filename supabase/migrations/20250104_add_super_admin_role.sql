-- Add super_admin support to user metadata
-- This migration allows tracking super admin users via raw_user_meta_data

-- Note: In Supabase, user roles are typically stored in raw_user_meta_data
-- This is a convention - the actual storage is handled by Supabase Auth

-- Create a function to check if a user is a super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT (raw_user_meta_data->>'role') = 'super_admin'
    FROM auth.users
    WHERE id = user_id
  );
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION is_super_admin IS 'Check if a user has super_admin role in their metadata';
