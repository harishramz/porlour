export const DEFAULT_PROFILE_IMAGE = '/images/profile.jpg';

const LEGACY_CUSTOMER_PROFILE_IMAGES = new Set([
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
]);

const isLegacyCustomerImage = (avatar) =>
  LEGACY_CUSTOMER_PROFILE_IMAGES.has(avatar) ||
  [
    'photo-1507003211169-0a1dd7228f2d',
    'photo-1534528741775-53994a69daeb',
    'photo-1544005313-94ddf0286df2',
    'photo-1517841905240-472988babdf9',
    'photo-1524504388940-b1c1722653e1'
  ].some((imageId) => avatar?.includes(imageId));

export const getCustomerProfileImage = (avatar) =>
  !avatar || isLegacyCustomerImage(avatar) ? DEFAULT_PROFILE_IMAGE : avatar;

export const getCustomerAvatar = (avatar) =>
  isLegacyCustomerImage(avatar) ? '' : avatar || '';
