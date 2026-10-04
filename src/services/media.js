import { supabase, supabaseConfigured } from './supabase';

const MEDIA_BUCKET = 'salon-media';
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const EXTENSIONS_BY_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
};

export const uploadImage = async (file, folder = 'gallery') => {
  if (!supabaseConfigured || !supabase) {
    throw new Error('Configure Supabase to upload images. You can still use a direct image URL.');
  }
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Choose a JPEG, PNG, WebP, or GIF image.');
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Images must be 8 MB or smaller.');
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('Sign in before uploading images.');

  const storageFolder = folder === 'profile' ? `profiles/${user.id}` : folder;
  const objectPath = `${storageFolder}/${crypto.randomUUID()}.${EXTENSIONS_BY_TYPE[file.type]}`;
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(objectPath, file, { contentType: file.type, upsert: false });
  if (error) {
    if (error.message?.toLowerCase().includes('bucket not found')) {
      throw new Error(
        'The salon-media bucket is missing from this Supabase project. In Supabase, open Storage and create a public bucket named "salon-media" with an 8 MB limit and JPEG, PNG, WebP, and GIF allowed, or rerun the storage setup in server/supabase/schema.sql.'
      );
    }
    throw error;
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
};
