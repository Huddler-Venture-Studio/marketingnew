import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function checkUserRole() {
  const email = 'aiob@huddler.io';

  try {
    console.log('Checking user role for:', email);
    console.log('');

    const { data: userData, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      throw listError;
    }

    const user = userData.users.find(u => u.email === email);

    if (!user) {
      console.error('❌ User not found');
      process.exit(1);
    }

    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('');
    console.log('User Metadata (raw_user_meta_data):');
    console.log(JSON.stringify(user.user_metadata, null, 2));
    console.log('');
    console.log('Current Role:', user.user_metadata?.role || 'No role set');
    console.log('');

    if (user.user_metadata?.role === 'super_admin') {
      console.log('✅ User has super_admin role');
    } else {
      console.log('⚠️  User does NOT have super_admin role');
      console.log('');
      console.log('To fix, run this SQL in Supabase SQL Editor:');
      console.log('');
      console.log(`UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"super_admin"') WHERE id = '${user.id}';`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUserRole();
