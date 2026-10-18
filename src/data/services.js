import { groupLegacyServiceVariants } from '../utils/serviceOptions';

const serviceImages = {
  Hair: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  Skin: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  Nails: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
  Beauty: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'
};

const service = (id, name, category, price, duration = 'Ask for timing', shortDescription = name) => ({
  id: `hgs-${id}`,
  name,
  category,
  shortDescription,
  description: shortDescription,
  duration,
  durationMinutes: duration.includes('min') ? Number.parseInt(duration, 10) : 60,
  price,
  priceOnRequest: price == null,
  rating: null,
  reviewsCount: 0,
  isPopular: false,
  status: 'Active',
  image: serviceImages[category],
  benefits: [],
  included: [],
  staffIds: []
});

const legacyServiceEntries = [
  service('threading-eyebrow', 'Eyebrow Threading', 'Beauty', 39),
  service('threading-upper-lip', 'Upper Lip Threading', 'Beauty', 30),
  service('threading-chin', 'Chin Threading', 'Beauty', 30),
  service('threading-forehead', 'Forehead Threading', 'Beauty', 30),
  service('threading-side-locks', 'Side Locks Threading', 'Beauty', 40),
  service('threading-full-face', 'Full Face Threading', 'Beauty', 200),

  service('waxing-full-arms-honey', 'Full Arms Waxing — Honey', 'Beauty', 279),
  service('waxing-full-arms-rica', 'Full Arms Waxing — Rica', 'Beauty', 399),
  service('waxing-full-legs-honey', 'Full Legs Waxing — Honey', 'Beauty', 300),
  service('waxing-full-legs-rica', 'Full Legs Waxing — Rica', 'Beauty', 369),
  service('waxing-hands-honey', 'Hands Waxing — Honey', 'Beauty', 179),
  service('waxing-hands-rica', 'Hands Waxing — Rica', 'Beauty', 219),
  service('waxing-legs-honey', 'Legs Waxing — Honey', 'Beauty', 199),
  service('waxing-legs-rica', 'Legs Waxing — Rica', 'Beauty', 279),
  service('waxing-face-honey', 'Full Face Waxing — Honey', 'Beauty', 250),
  service('waxing-back-honey', 'Full Back Waxing — Honey', 'Beauty', 250),
  service('waxing-back-rica', 'Full Back Waxing — Rica', 'Beauty', 389),
  service('waxing-stomach-honey', 'Stomach Waxing — Honey', 'Beauty', 210),
  service('waxing-stomach-rica', 'Stomach Waxing — Rica', 'Beauty', 299),
  service('waxing-side-locks-honey', 'Side Locks Waxing — Honey', 'Beauty', 49),
  service('waxing-side-locks-rica', 'Side Locks Waxing — Rica', 'Beauty', 99),
  service('waxing-chin-honey', 'Chin Waxing — Honey', 'Beauty', 49),
  service('waxing-chin-rica', 'Chin Waxing — Rica', 'Beauty', 99),
  service('waxing-underarm-honey', 'Underarm Waxing — Honey', 'Beauty', 59),
  service('waxing-underarm-rica', 'Underarm Waxing — Rica', 'Beauty', 99),
  service('waxing-bikini-honey', 'Bikini Waxing — Honey', 'Beauty', 450),
  service('waxing-full-body-honey', 'Full Body Waxing — Honey', 'Beauty', 1549),
  service('waxing-full-body-rica', 'Full Body Waxing — Rica', 'Beauty', 1999),

  service('waxing-stripless-face', 'Full Face Stripless Waxing', 'Beauty', 549),
  service('waxing-stripless-bikini', 'Bikini Stripless Waxing', 'Beauty', 900),
  service('waxing-stripless-underarm', 'Underarm Stripless Waxing', 'Beauty', 80),

  service('massage-head-10', 'Head Massage — 10 minutes', 'Beauty', 99, '10 mins'),
  service('massage-head-15', 'Head Massage — 15 minutes', 'Beauty', 150, '15 mins'),
  service('massage-foot', 'Foot Massage — 15 minutes', 'Beauty', 200, '15 mins'),
  service('massage-shoulder', 'Shoulder Massage — 15 minutes', 'Beauty', 200, '15 mins'),
  service('massage-back', 'Back Massage — 15 minutes', 'Beauty', 200, '15 mins'),
  service('massage-face', 'Face Massage — 15 minutes', 'Beauty', 200, '15 mins'),

  service('pedicure-normal', 'Normal Pedicure', 'Nails', 499),
  service('pedicure-dtan', 'D-Tan Pedicure', 'Nails', 599),
  service('pedicure-spa', 'Spa Pedicure', 'Nails', null),
  service('manicure-normal', 'Normal Manicure', 'Nails', 449),
  service('manicure-dtan', 'D-Tan Manicure', 'Nails', 549),
  service('manicure-spa', 'Spa Manicure', 'Nails', null),

  service('bleach-normal-face', 'Normal Bleach — Face', 'Skin', 249),
  service('bleach-golden-face', 'Golden Bleach — Face', 'Skin', 299),
  service('bleach-hand', 'Bleach — Hand', 'Skin', 399),
  service('bleach-leg', 'Bleach — Leg', 'Skin', 479),
  service('bleach-underarm', 'Bleach — Underarm', 'Skin', 129),
  service('detan-face', 'D-Tan — Face', 'Skin', 249),
  service('detan-hand', 'D-Tan — Hand', 'Skin', 399),
  service('detan-leg', 'D-Tan — Leg', 'Skin', 478),
  service('detan-underarm', 'D-Tan — Underarm', 'Skin', 129),

  service('cleanup-fruit', 'Fruit Clean-Up', 'Skin', 349),
  service('cleanup-papaya', 'Papaya Clean-Up', 'Skin', 349),
  service('facial-fruit-papaya', 'Fruit & Papaya Facial', 'Skin', 459),
  service('facial-insta-glow', 'Insta Glow Facial', 'Skin', 489),
  service('facial-anti-dtan', 'Anti D-Tan Facial', 'Skin', 499),
  service('facial-skin-tightening', 'Skin Tightening Facial', 'Skin', 499),
  service('facial-skin-whitening', 'Skin Whitening Facial', 'Skin', 599),
  service('facial-diamond', 'Diamond Facial', 'Skin', 799),
  service('facial-gold', 'Gold Facial', 'Skin', 799),

  service('hair-colour-application', 'Hair Colour Application', 'Hair', null),
  service('henna-application', 'Henna Application', 'Hair', 250),
  service('hair-spa', 'Hair Spa', 'Hair', null),
  service('hair-spa-shoulder', 'Hair Spa — Shoulder Length', 'Hair', 699),
  service('hair-spa-above-shoulder', 'Hair Spa — Above Shoulder Length', 'Hair', 799),
  service('hair-spa-medium', 'Hair Spa — Medium Length', 'Hair', 849),
  service('hair-spa-waist', 'Hair Spa — Waist Length', 'Hair', 999)
];

export const initialServices = groupLegacyServiceVariants(legacyServiceEntries);
