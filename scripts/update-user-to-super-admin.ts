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

async function updateUserToSuperAdmin() {
  const email = 'aiob@huddler.io';

  try {
    console.log('Searching for user:', email);

    // Get the user by email
    const { data: userData, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      throw listError;
    }

    const user = userData.users.find(u => u.email === email);

    if (!user) {
      console.error('❌ User not found. Please create the user first in Supabase dashboard:');
      console.error('   1. Go to Authentication > Users in Supabase dashboard');
      console.error('   2. Click "Add user" > "Create new user"');
      console.error('   3. Email: aiob@huddler.io');
      console.error('   4. Password: Huddler123?');
      console.error('   5. Auto Confirm User: Yes');
      console.error('   6. Then run this script again');
      process.exit(1);
    }

    console.log('Found user:', user.id);
    console.log('Updating to super_admin role...');

    // Update user metadata to super_admin
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
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
    console.log('Email:', email);
    console.log('User ID:', user.id);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateUserToSuperAdmin();
