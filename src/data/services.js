export const initialServices = [
  {
    id: 'srv-1',
    name: 'Precision Signature Haircut',
    category: 'Hair',
    shortDescription: 'Bespoke haircut consultation, nourishing hair wash, and signature blowout.',
    description: 'Our senior hair artists craft a personalized cut that complements your facial contours, hair texture, and lifestyle. Includes deep cleansing shampoo, scalp relaxation massage, conditioning, and luxury heat styling.',
    duration: '45 mins',
    durationMinutes: 45,
    price: 1200,
    rating: 4.9,
    reviewsCount: 128,
    isPopular: true,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Tailored face-framing silhouette',
      'Removes split ends and restores healthy movement',
      'Relaxing organic botanical scalp cleanse',
      'Professional blow-dry and long-lasting styling'
    ],
    included: [
      'Personalized consultation with master stylist',
      'Aromatherapy scalp massage (10 mins)',
      'Keratin-infused shampoo & deep condition',
      'Precision shears haircut & texturizing',
      'Luxury blowout finish with heat protectant'
    ],
    staffIds: ['staff-1', 'staff-2', 'staff-4']
  },
  {
    id: 'srv-2',
    name: 'Couture Hair Styling & Blowout',
    category: 'Hair',
    shortDescription: 'Glamorous waves, sleek glass hair, or intricate high-fashion updos for any occasion.',
    description: 'Transform your look with an editorial blowout or red-carpet styling. We use thermal protection, Moroccan argan elixir, and Dyson supersonic technology to ensure brilliant shine without heat damage.',
    duration: '60 mins',
    durationMinutes: 60,
    price: 1800,
    rating: 4.8,
    reviewsCount: 94,
    isPopular: true,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Voluminous, salon-grade bounce lasting up to 3 days',
      'Humidity-resistant anti-frizz seal',
      'Instant mirror-like gloss and softness',
      'Customized wave pattern (loose beach, Hollywood, or sleek)'
    ],
    included: [
      'Volumizing wash & treatment mask',
      'Thermal defense prep spray',
      'Custom blowout styling',
      'Flexible hold finishing mist'
    ],
    staffIds: ['staff-1', 'staff-3']
  },
  {
    id: 'srv-3',
    name: 'Balayage & Dimensional Hair Color',
    category: 'Hair',
    shortDescription: 'Hand-painted sun-kissed balayage, caramel highlights, or rich bespoke shades.',
    description: 'Expert dimensional coloring using ammonia-free Italian dyes enriched with bond multipliers. Creates seamless gradients with natural regrowth maintenance.',
    duration: '150 mins',
    durationMinutes: 150,
    price: 5500,
    rating: 4.9,
    reviewsCount: 110,
    isPopular: true,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Ammonia-free formulas gentle on hair fibers',
      'Olaplex bond builder included for zero breakage',
      'Seamless multi-dimensional tones',
      'Long-lasting vibrancy with UV protectants'
    ],
    included: [
      'Color matching and skin-undertone assessment',
      'Balayage / Highlight application',
      'Olaplex No. 1 & No. 2 bond treatment',
      'Gloss toner & acidifying rinse',
      'Blowout & styling'
    ],
    staffIds: ['staff-1']
  },
  {
    id: 'srv-4',
    name: 'Botanical Keratin Spa Treatment',
    category: 'Hair',
    shortDescription: 'Deep protein reconstruction, frizz elimination, and velvety smooth hair.',
    description: 'An intensive smoothing infusion that repairs damaged hair cuticles. Formulated with hydrolyzed silk and plant keratin to tame stubborn frizz while preserving natural bounce.',
    duration: '90 mins',
    durationMinutes: 90,
    price: 3200,
    rating: 4.8,
    reviewsCount: 76,
    isPopular: false,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Up to 90% reduction in frizz and styling time',
      'Infuses keratin protein into weakened hair cortex',
      'Protects against environmental pollution & humidity',
      'Silky touch and radiant shine for up to 12 weeks'
    ],
    included: [
      'Clarifying detox wash',
      'Micro-mist warm steam activation',
      'Keratin serum deep infusion',
      'Cryo-cold seal rinse & blowout'
    ],
    staffIds: ['staff-1', 'staff-2']
  },
  {
    id: 'srv-5',
    name: '24K Gold Luxury Radiance Facial',
    category: 'Skin',
    shortDescription: 'Pure gold leaf infusion, lymphatic drainage massage, and instant collagen boost.',
    description: 'Our most sought-after royal skincare therapy. Utilizes 24-karat bio-available gold leaves, hyaluronic acid, and jade stone massage to stimulate cell regeneration, reverse dullness, and leave skin breathtakingly radiant.',
    duration: '75 mins',
    durationMinutes: 75,
    price: 3500,
    rating: 5.0,
    reviewsCount: 165,
    isPopular: true,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Instant glass-skin luminosity and firmness',
      'Promotes cellular turnover and collagen synthesis',
      'Reduces appearance of fine lines and pore size',
      'Deep lymphatic detox relieves facial puffiness'
    ],
    included: [
      'Double cleansing with chamomile milk',
      'Enzymatic papaya gentle peel exfoliation',
      'Ultrasonic pore deep extraction',
      '24K Gold colloidal serum infusion with Cryo-wand',
      'Acupressure face, neck, and decollete massage',
      'Gold foil rubberizing peel-off mask'
    ],
    staffIds: ['staff-2', 'staff-4']
  },
  {
    id: 'srv-6',
    name: 'Hydra-Dew Skin Cleanup',
    category: 'Skin',
    shortDescription: 'Gentle blackhead removal, fruit peel, and soothing cucumber rose hydration.',
    description: 'A refreshing quick refresh for congested skin. Gentle pore cleansing followed by botanical steaming, painless extractions, and a cooling rosewater hydrogel mask.',
    duration: '45 mins',
    durationMinutes: 45,
    price: 1500,
    rating: 4.7,
    reviewsCount: 82,
    isPopular: false,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1512290900672-1f55b9a896d8?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Clears clogged pores and blackheads',
      'Soothes irritated or sun-exposed skin',
      'Restores skin moisture barrier',
      'Leaves complexion clean, fresh, and matte'
    ],
    included: [
      'Mild foaming herbal wash',
      'Ozone steam & gentle exfoliation',
      'Vacuum suction pore cleanse',
      'Rosewater toning & cooling mask'
    ],
    staffIds: ['staff-2']
  },
  {
    id: 'srv-7',
    name: 'Advanced De-Tan & Brightening Therapy',
    category: 'Skin',
    shortDescription: 'Reverses hyperpigmentation, uneven skin tone, and harsh UV sun damage.',
    description: 'A targeted brightening treatment using kojic acid, vitamin C, and milk enzymes to gently lift surface sun tanning and even out skin complexion across face and neck.',
    duration: '50 mins',
    durationMinutes: 50,
    price: 1900,
    rating: 4.8,
    reviewsCount: 91,
    isPopular: false,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Noticeably fades stubborn sun tan in one session',
      'Reduces dark spots and blemishes',
      'Deeply nourishes with vitamins C and E',
      'Imparts an even, translucent glow'
    ],
    included: [
      'Lactic brightening scrub',
      'Kojic & licorice active de-tan pack',
      'Cooling aloe vera mist soothing session',
      'Broad-spectrum SPF 50 sunscreen finish'
    ],
    staffIds: ['staff-2', 'staff-4']
  },
  {
    id: 'srv-8',
    name: 'Luxe Rose Petal Spa Manicure',
    category: 'Nails',
    shortDescription: 'Warm rose petal milk soak, apricot cuticle buff, massage, and gel enamel finish.',
    description: 'Indulge your hands with our signature pampering ritual. Features botanical exfoliation, warm shea butter massage gloves, precise nail shaping, cuticle nourishment, and chip-resistant gel polish.',
    duration: '45 mins',
    durationMinutes: 45,
    price: 1100,
    rating: 4.9,
    reviewsCount: 140,
    isPopular: true,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Deeply softens rough dry hands and cuticles',
      'Strengthens brittle nails with calcium boost',
      'Long-lasting chip-free gel wear (up to 3 weeks)',
      'Relieves wrist and hand tension'
    ],
    included: [
      'Rose petal & essential oil hand bath',
      'Exfoliating brown sugar scrub',
      'Nail shaping, buffing & cuticle trimming',
      'Heated candle wax hand massage',
      'Premium OPI / Gel polish of choice'
    ],
    staffIds: ['staff-4']
  },
  {
    id: 'srv-9',
    name: 'Aromatherapy Foot Spa Pedicure',
    category: 'Nails',
    shortDescription: 'Epsom salt foot soak, pumice callus removal, peppermint scrub, and reflexology.',
    description: 'An ultra-soothing treatment for tired feet. Softens calluses, hydrates cracked heels, relieves tension through acupressure massage, and gives toenails an immaculate salon finish.',
    duration: '60 mins',
    durationMinutes: 60,
    price: 1400,
    rating: 4.9,
    reviewsCount: 153,
    isPopular: true,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1519014816548-bf7805b6e88e?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Eliminates hard calluses and dry cracked heels',
      'Improves blood circulation in feet and legs',
      'Peppermint cooling sensation eases foot fatigue',
      'Flawlessly shaped and polished toenails'
    ],
    included: [
      'Dead Sea mineral hydrotherapy foot bath',
      'Volcanic pumice stone callus smoothing',
      'Peppermint & eucalyptus buffing cream',
      'Hot towel compress & 15-min calf reflexology',
      'Color or matte finish coat'
    ],
    staffIds: ['staff-4']
  },
  {
    id: 'srv-10',
    name: 'Haute Nail Art & Gel Extensions',
    category: 'Nails',
    shortDescription: 'Custom acrylic / soft gel extensions, chrome finishes, 3D accents, and French tips.',
    description: 'Express your style with bespoke nail art created by our specialized nail artist. From minimalist French ombré to opulent bridal stones and chrome glazes.',
    duration: '90 mins',
    durationMinutes: 90,
    price: 2400,
    rating: 4.8,
    reviewsCount: 88,
    isPopular: false,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Custom length, shape (almond, coffin, square, stiletto)',
      'High durability with zero chipping for 4+ weeks',
      'Hypoallergenic, odor-free builder gels',
      'One-of-a-kind hand-painted artistic designs'
    ],
    included: [
      'Nail bed preparation & dehydrator',
      'Soft gel extension tips application',
      'Custom nail shaping & structure builder',
      'Choice of 2-finger accent nail art or full French glaze',
      'Nourishing jojoba cuticle oil'
    ],
    staffIds: ['staff-4']
  },
  {
    id: 'srv-11',
    name: 'Royal Bridal HD Makeup & Draping',
    category: 'Makeup',
    shortDescription: 'Flawless camera-ready bridal makeup, hairstyling, saree/lehenga draping, and jewelry setting.',
    description: 'Our master bridal artists create a timeless, breathtaking bride. Features airbrush or high-definition silicon-based cosmetics that withstand humidity, tears, and 16+ hours of wedding celebrations.',
    duration: '180 mins',
    durationMinutes: 180,
    price: 14500,
    rating: 5.0,
    reviewsCount: 220,
    isPopular: true,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Waterproof, sweat-proof, 18-hour HD foundation',
      'Custom contouring suited for wedding photo & 4K video',
      'Mink lightweight lash extensions',
      'Complete pre-bridal skin prep and setting'
    ],
    included: [
      'Comprehensive pre-bridal skin consultation',
      'Hydrating collagen sheet mask prep',
      'Full face High Definition / Airbrush makeup',
      'Elaborate bridal hair updo with real fresh flowers / accessories',
      'Designer saree / lehenga draping with safety pinning',
      'Jewelry and dupatta pin placement'
    ],
    staffIds: ['staff-3', 'staff-1']
  },
  {
    id: 'srv-12',
    name: 'Evening Glam & Party Makeup',
    category: 'Makeup',
    shortDescription: 'Smokey eyes or dewy glow, sculpted cheekbones, and high-fashion evening lips.',
    description: 'Look show-stopping at cocktail parties, sangeet, or galas. Tailored to match your evening attire and mood, ensuring camera-ready confidence all night long.',
    duration: '75 mins',
    durationMinutes: 75,
    price: 3500,
    rating: 4.9,
    reviewsCount: 112,
    isPopular: true,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Long-wearing non-creasing makeup for up to 12 hours',
      'Customized eye styling (smokey, winged cat-eye, or shimmer halo)',
      'Includes premium faux mink eyelashes',
      'Dewy glass or velvet matte finish'
    ],
    included: [
      'Skin prep with primer & eye depuff serum',
      'Foundation matching & custom concealment',
      'Dramatic eye makeup with shimmer pigment',
      'Faux mink false lash application',
      'Transfer-proof lip lacquer application'
    ],
    staffIds: ['staff-3']
  },
  {
    id: 'srv-13',
    name: 'Silk Threading & Brow Architecture',
    category: 'Beauty',
    shortDescription: 'Precision eyebrow mapping, organic thread shaping, and upper lip hair removal.',
    description: 'Pain-minimized threading technique using 100% antibacterial organic Egyptian cotton thread. Features golden ratio brow mapping for symmetrical arch enhancement.',
    duration: '25 mins',
    durationMinutes: 25,
    price: 350,
    rating: 4.9,
    reviewsCount: 310,
    isPopular: false,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1522337094346-290f269a9415?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Super clean lines without skin irritation',
      'Uses organic cotton thread with zero chemicals',
      'Golden ratio facial symmetry alignment',
      'Soothing aloe finish prevents redness'
    ],
    included: [
      'Brow assessment & contour pencil outline',
      'Precision threading for brows and upper lip',
      'Fine trimming of rogue hairs',
      'Soothing tea tree and pure aloe massage'
    ],
    staffIds: ['staff-2', 'staff-4']
  },
  {
    id: 'srv-14',
    name: 'Organic Honey Waxing (Full Body)',
    category: 'Beauty',
    shortDescription: 'Gentle low-temperature stripless wax for arms, legs, and underarms.',
    description: 'Enjoy baby-soft, hair-free skin with our organic aloe-honey liposoluble wax. Designed specifically for sensitive skin to pull hair from roots with 70% less discomfort.',
    duration: '60 mins',
    durationMinutes: 60,
    price: 2200,
    rating: 4.8,
    reviewsCount: 95,
    isPopular: false,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Low temperature formula prevents skin burn or darkening',
      'Results last 3 to 4 weeks with finer regrowth',
      'Natural gentle exfoliation of dead skin cells',
      'No sticky residue'
    ],
    included: [
      'Sanitizing pre-wax chamomile lotion',
      'Warm organic liposoluble wax application',
      'Full arms, underarms, and full legs waxing',
      'Post-wax tea tree cooling oil & ingrown prevention serum'
    ],
    staffIds: ['staff-2', 'staff-4']
  },
  {
    id: 'srv-15',
    name: 'Featherlight Lash Extensions & Tint',
    category: 'Beauty',
    shortDescription: 'Natural volume Russian lash extensions paired with lash keratin tint.',
    description: 'Wake up with effortlessly mesmerizing eyes. Individual ultra-light silk lash fibers are bonded to each natural lash, giving luscious fullness without heavy mascara.',
    duration: '90 mins',
    durationMinutes: 90,
    price: 3000,
    rating: 4.9,
    reviewsCount: 78,
    isPopular: false,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Zero weight sensation on eyelids',
      'Eliminates the daily need for mascara or lash curlers',
      'Custom curl types (C-Curl, D-Curl) and length options',
      'Ophthalmologically tested medical-grade adhesive'
    ],
    included: [
      'Lash bath & degreasing cleanse',
      'Hydrating under-eye hydrogel pads',
      'Single/Hybrid lash extension application (approx 90 lashes/eye)',
      'Protective sealant coat & take-home spoolie brush'
    ],
    staffIds: ['staff-3', 'staff-4']
  }
];
