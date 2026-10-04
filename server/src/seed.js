import { initialServices } from '../../src/data/services.js';
import { initialStaff } from '../../src/data/staff.js';
import { initialOffers } from '../../src/data/offers.js';
import { initialReviews } from '../../src/data/reviews.js';
import { initialGallery } from '../../src/data/gallery.js';
import { supabase } from './lib/supabase.js';

const seedTables = [
  ['salon_services', initialServices],
  ['staff_members', initialStaff],
  ['salon_offers', initialOffers],
  ['salon_reviews', initialReviews],
  ['gallery_items', initialGallery]
];

const seed = async () => {
  if (!supabase) {
    throw new Error('Set SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, and SUPABASE_SECRET_KEY in server/.env before seeding.');
  }

  for (const [table, entries] of seedTables) {
    const rows = entries.map((entry) => ({
      id: entry.id,
      data: entry,
      is_active: entry.status?.toLowerCase() !== 'inactive'
    }));
    const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
    if (error) throw error;
    console.log(`Seeded ${rows.length} rows into ${table}.`);
  }

  const { error } = await supabase
    .from('salon_catalog_state')
    .update({ initialized: true })
    .eq('id', 'primary');
  if (error) throw error;
  console.log('Marked the salon catalog as initialized.');
};

seed().catch((error) => {
  console.error('Supabase seed failed:', error.message);
  process.exitCode = 1;
});
