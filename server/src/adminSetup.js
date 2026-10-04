import { createClient } from '@supabase/supabase-js';
import { config } from './config.js';

const email = process.env.ADMIN_EMAIL?.trim();
const password = process.env.ADMIN_PASSWORD;

if (!config.supabaseUrl || !config.supabaseSecretKey) {
  throw new Error('Set SUPABASE_URL and SUPABASE_SECRET_KEY in server/.env before provisioning the admin account.');
}
if (!email || !password) {
  throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env before provisioning the admin account.');
}
if (password.length < 8) {
  throw new Error('ADMIN_PASSWORD must be at least 8 characters long.');
}

const supabase = createClient(config.supabaseUrl, config.supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const findAuthUserByEmail = async () => {
  const perPage = 1000;
  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email.toLowerCase());
    if (user) return user;
    if (data.users.length < perPage) return null;
  }
};

const provisionAdmin = async () => {
  let user = await findAuthUserByEmail();

  if (user) {
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      app_metadata: { ...user.app_metadata, role: 'admin' }
    });
    if (error) throw error;
    user = data.user;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Salon Administrator' },
      app_metadata: { role: 'admin' }
    });
    if (error) throw error;
    user = data.user;
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email || email,
    full_name: user.user_metadata?.full_name || 'Salon Administrator',
    role: 'admin'
  }, { onConflict: 'id' });
  if (profileError) throw profileError;

  console.log(`Admin account provisioned for ${email}. Sign in at /admin/login.`);
};

provisionAdmin().catch((error) => {
  console.error('Admin account provisioning failed:', error.message);
  process.exitCode = 1;
});
