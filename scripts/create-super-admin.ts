import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createSuperAdmin() {
  const email = 'aiob@huddler.io';
  const password = 'Huddler123?';

  try {
    console.log('Creating super admin user...');

    // Create the user with super_admin role in metadata
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'super_admin',
      },
    });

    if (error) {
      // Check if user already exists
      if (error.message.includes('already registered')) {
        console.log('User already exists. Updating to super_admin role...');

        // Get the user
        const { data: userData, error: getUserError } = await supabase.auth.admin.listUsers();

        if (getUserError) {
          throw getUserError;
        }

        const existingUser = userData.users.find(u => u.email === email);

        if (!existingUser) {
          throw new Error('User exists but could not be found');
        }

        // Update user metadata to super_admin
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          {
            user_metadata: {
              role: 'super_admin',
            },
          }
        );

        if (updateError) {
          throw updateError;
        }

        console.log('✅ Successfully updated user to super_admin role');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Successfully created super admin user');
      console.log('Email:', email);
      console.log('User ID:', data.user.id);
    }
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
    process.exit(1);
  }
}

createSuperAdmin();
