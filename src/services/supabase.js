import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const supabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);
export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true
      }
    })
  : null;

export const profileToUser = (profile) => ({
  id: profile.id,
  name: profile.full_name || profile.name || '',
  email: profile.email || '',
  phone: profile.phone || '',
  dob: profile.date_of_birth || '',
  avatar: profile.avatar_url || profile.avatar || '',
  address: profile.address || '',
  preferences: profile.preferences || {},
  role: profile.role || 'customer',
  isAuthenticated: true
});

export const getAuthenticatedProfile = async (authenticatedUser = null) => {
  if (!supabase) throw new Error('Supabase is not configured.');
  let user = authenticatedUser;
  if (!user) {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    user = data.user;
  }
  if (!user) throw new Error('No authenticated Supabase user was found.');

  const loadProfile = () => supabase
    .from('profiles')
    .select('id, email, full_name, phone, date_of_birth, avatar_url, address, preferences, role')
    .eq('id', user.id)
    .single();

  let profileResult = await loadProfile();
  if (profileResult.error?.code === 'PGRST116') {
    const { error: recoveryError } = await supabase.rpc('ensure_current_user_profile');
    if (recoveryError) {
      throw new Error(`Unable to repair your missing profile: ${recoveryError.message}. Apply the latest server/supabase/schema.sql to your Supabase project.`);
    }
    profileResult = await loadProfile();
  }

  const { data, error } = profileResult;
  if (error) {
    throw new Error(`Unable to load your profile: ${error.message}. Check that the Supabase profile schema and policies are installed.`);
  }
  return profileToUser(data);
};
