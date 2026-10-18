# Her Glow Home Salon — Services & Appointment Booking

A responsive **Home Salon Services & Appointment Booking Website** built with **React**, **Vite**, **JavaScript**, and **Tailwind CSS**.

The public site uses the Her Glow logo and salon service prices. Menu items without a listed price are shown as “On request.” The supplied map location is Plus Code `2J7C+VPR Bengaluru, Karnataka`; a phone number has not yet been provided.

The Her Glow logo is served from `public/images/her-glow-logo.jpeg`.

---

## 💎 Visual & Brand Identity
- **Design Philosophy**: Minimal, modern, warm, trustworthy, and sophisticated luxury.
- **Color Palette**:
  - **Warm Ivory / Cream**: `#FDFBF7`, `#FAF6F0`, `#F5EFEB`
  - **Soft Beige**: `#FAF7F2`, `#F5EBE1`, `#EBD9CC`, `#DFC2AE`
  - **Rose / Muted Pink**: `#FCF7F7`, `#F9EAEA`, `#E5ADB0`, `#C86D73`
  - **Dark Charcoal**: `#1A1A1A`, `#262626`, `#111111`
  - **Gold Accents**: `#C5A059`, `#DFB76C`, `#EEDDAF`
- **Typography**: Editorial serif (*Cormorant Garamond*) paired with modern geometric sans (*Plus Jakarta Sans*).

---

## 🏛️ Project Structure & Architecture

```text
├── index.html                   # HTML entry point with luxury branding and Google Fonts
├── package.json                 # React, Vite, React Router DOM, Tailwind CSS dependencies
├── vite.config.js               # Vite 5 bundler configuration
├── tailwind.config.js           # Custom luxury color extensions, font families, and shadows
├── postcss.config.js            # PostCSS with Tailwind & Autoprefixer
├── src/
│   ├── main.jsx                 # React root mount
│   ├── App.jsx                  # Master Router with Public, Customer, and Admin hierarchies
│   ├── index.css                # Global CSS directives, custom scrollbar, animations
│   │
│   ├── components/              # Reusable UI components
│   │   ├── icons.jsx            # Sleek Lucide-compatible SVG icon system
│   │   ├── Navbar.jsx           # Luxury navigation bar with mobile drawer & auth status
│   │   ├── Footer.jsx           # Editorial footer with hours, contact, services, newsletter
│   │   ├── Button.jsx           # Gold, primary, outline, secondary, loading states
│   │   ├── Badge.jsx            # Status badges (Confirmed, Pending, Completed, Cancelled)
│   │   ├── Modal.jsx            # Accessible backdrop-blurred dialogs
│   │   ├── DemoBar.jsx          # Local-development demo role switcher
│   │   ├── ServiceCard.jsx      # Image, price, duration, rating, favorites, booking trigger
│   │   ├── StaffCard.jsx        # Stylist avatar, bio, specialization, rating, booking button
│   │   ├── OfferCard.jsx        # Package discount badge, inclusions checklist, book package
│   │   ├── ReviewCard.jsx       # 5-star rating, customer avatar, verified tag, quote
│   │   ├── AppointmentCard.jsx  # Customer appointment summary with details & cancellation modal
│   │   ├── Loading.jsx          # Golden spinner & skeleton state
│   │   └── EmptyState.jsx       # Elegant blank state placeholder with call-to-action
│   │
│   ├── context/                 # Application state providers
│   │   ├── AuthContext.jsx      # Supabase authentication and local demo roles
│   │   ├── ToastContext.jsx     # Floating toast notification system
│   │   └── FavoritesContext.jsx # Wishlist persistence engine
│   │
│   ├── data/                    # Development-only demo data; not used on hosted production builds
│   │   ├── services.js          # 15 services across Hair, Skin, Nails, Makeup, Beauty
│   │   ├── staff.js             # Priya, Anitha, Meena, Divya with bios & working hours
│   │   ├── offers.js            # Bridal Beauty, Glow Facial, Hair Care, Mani-Pedi bundles
│   │   ├── reviews.js           # Empty by default; customer reviews are database-backed
│   │   ├── gallery.js           # Portfolio photos across 6 categories
│   │   ├── customers.js         # Customer profiles with beauty preferences & history
│   │   └── appointments.js      # Initial bookings (Confirmed, Pending, Completed, Cancelled)
│   │
│   ├── services/
│   │   └── api.js               # Supabase data access with local-only demo fallback
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx     # Top DemoBar, Navbar, Outlet, Footer
│   │   ├── CustomerLayout.jsx   # Member lounge header, navigation tabs, Outlet
│   │   └── AdminLayout.jsx      # Charcoal sidebar, top operational bar, Outlet
│   │
│   └── pages/                   # Application Pages (27 Total)
│       ├── Home.jsx             # Hero, popular services, why choose us, offers, team, reviews
│       ├── Services.jsx         # Full catalogue with search, tabs, price filter, sorting
│       ├── ServiceDetails.jsx   # Hero photo, benefits, inclusions, staff, instant book
│       ├── About.jsx            # Salon heritage, philosophy, hospital-grade sanitation
│       ├── Team.jsx             # Complete staff profiles with booking links
│       ├── Gallery.jsx          # Masonry grid with category filter & lightbox modal
│       ├── Offers.jsx           # Promotional package cards with breakdown & direct booking
│       ├── Contact.jsx          # Info, hours, interactive map placeholder, contact form
│       ├── Login.jsx            # Customer login with Google sign-in
│       ├── Register.jsx         # Account creation with validation and Terms agreement
│       ├── ForgotPassword.jsx   # Password recovery flow
│       ├── BookAppointment.jsx  # 6-step booking wizard with calendar & slot picker
│       │
│       ├── customer/
│       │   ├── Dashboard.jsx    # Customer account dashboard
│       │   ├── Profile.jsx      # Profile picture, contact info, beauty preferences, password
│       │   ├── Appointments.jsx # Upcoming, Completed, and Cancelled tabs
│       │   ├── AppointmentDetails.jsx # Detailed receipt view, cancellation modal, print
│       │   ├── Favorites.jsx    # Saved treatments with quick booking
│       │   └── Reviews.jsx      # Client feedback and "Write Review" star rating modal
│       │
│       └── admin/
│           ├── AdminLogin.jsx   # Executive sign-in with 1-click bypass
│           ├── Dashboard.jsx    # Metrics, weekly bar chart, revenue chart, today's appointments
│           ├── Services.jsx     # Full CRUD (Add, Edit, Delete, Search, Category filter)
│           ├── Staff.jsx        # Talent CRUD, schedule viewer, availability toggles
│           ├── Appointments.jsx # Master appointments table (Confirm, Complete, Cancel, Walk-in)
│           ├── Customers.jsx    # Guest directory, spending metrics, client dossier modal
│           ├── Offers.jsx       # Promotion manager with discount calculations
│           ├── Gallery.jsx      # Media asset management and category tags
│           └── Reports.jsx      # Database-backed appointment analytics and CSV export
```

---

## 🌟 Key Application Features

### 1. Multi-Step Appointment Booking Engine (6 Steps)
- **Step 1 — Select Service**: Visual cards across Hair, Skin, Nails, Makeup, Beauty. Supports URL pre-selection.
- **Step 2 — Select Specialist**: Choose any available professional or a staff member currently listed in the database.
- **Step 3 — Select Date**: Interactive calendar with past-date prevention and quick date pills.
- **Step 4 — Select Time**: Real-time slot availability (10:00 AM, 11:00 AM, 12:00 PM, 02:00 PM, 03:00 PM, 04:00 PM, 05:00 PM). Booked slots appear disabled.
- **Step 5 — Guest Information**: Name, Email, Phone, and Special Notes / Allergies.
- **Step 6 — Review & Confirmation**: Full summary breakdown (Service, Staff, Date, Time, Duration, Price, Consumables) and instant booking confirmation.
- **Success Receipt**: Generates a unique reference (e.g. `#apt-7821`), links to My Appointments, and supports printing.

### 2. Local development demo mode (`src/services/api.js`)
When running locally without Supabase, demo actions interact with `localStorage`. This mode is for development only and is blocked in production builds. In the connected application:
- Book an appointment in the customer flow → it appears immediately in Customer Appointments AND Admin Appointments.
- Confirm or Complete an appointment in Admin → status updates in real-time in the Customer Lounge.
- Add or edit a service in Admin → it is stored in Supabase and appears in the Public Services catalogue.

### 3. Quick Role Switcher (`DemoBar.jsx`)
A local-development-only top bar enables quick demo testing:
- **Harish (Customer)**: Instantly logs in as Harish Varma to view the customer portal.
- **Admin Portal**: Instantly switches to the Super Admin management system.
- **Guest**: Simulates a logged-out visitor.

---

## Supabase Data Architecture

The frontend reads and writes salon catalog data, appointments, customer profiles, and reviews through the configured Supabase project with row-level security. The Express API is required for privileged account management and other server-only operations; it validates Supabase access tokens and keeps the secret key on the server. The database schema and its review rules are in `server/supabase/schema.sql`.

---

## 💻 Running the Application

### Deploying to Vercel

Deploy this repository as two Vercel projects so the frontend and the Express API can have separate environment variables and deployment settings:

1. Create the **frontend** Vercel project from this repository with the repository root as its Root Directory. Use `npm run build` as the Build Command and `dist` as the Output Directory.
2. Add these frontend environment variables in Vercel for Preview and Production:
   - `VITE_SUPABASE_URL` — the Supabase project URL.
   - `VITE_SUPABASE_PUBLISHABLE_KEY` — the Supabase publishable key only.
   - `VITE_API_BASE_URL` — the full API URL ending in `/api`, for example `https://your-api-project.vercel.app/api`.
3. Create a second Vercel project from the same repository and set its Root Directory to `server`. Deploy it as a Node.js/Express project. Do not add frontend `VITE_` variables to this project.
4. Add these server environment variables to the API project for Preview and Production: `PORT`, `CLIENT_ORIGINS` (the exact frontend HTTPS URL), `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWKS_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_CURRENCY=INR`.
5. Run `server/supabase/schema.sql` in the same Supabase project before accepting registrations, appointments, uploads, or payments. Provision the first administrator from a protected local environment with `npm run server:admin-setup`, then remove `ADMIN_PASSWORD` from the server environment.
6. Verify `https://your-api-project.vercel.app/api/health`, sign-in, admin authorization, appointment creation, and Razorpay Test Mode before switching to live payment credentials.

Never put `SUPABASE_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, database passwords, or `ADMIN_PASSWORD` in frontend Vercel variables, `VITE_` variables, public files, or GitHub. See [SECURITY.md](./SECURITY.md) for the complete deployment policy.

### Option 1: Development Server (Vite)
```bash
# In an environment with internet access:
npm install
npm run dev
# Server starts on http://localhost:3000
```

### Option 2: Production Build
```bash
npm run build
npm run preview
```

### Option 3: Instant Browser Preview (No Build Required)
A standalone legacy preview is provided in `preview.html`; it is a mockup and is not connected to the salon database. Do not use it to host the live customer site. To host the real application, deploy the production build after configuring its Supabase environment variables.
```bash
python3 -m http.server 3000
# Navigate to http://localhost:3000/preview.html
```

## Node.js + Express API

The optional API lives in `server/` and uses `@supabase/server` for Supabase JWT verification and server-side database access. It reads each user's role from `profiles` and restricts administrative mutations to users whose database profile has the `admin` role. `SUPABASE_SECRET_KEY` bypasses RLS and must stay server-only; never add it to a `VITE_` variable or frontend code.

The hosted production build requires the Supabase URL and publishable key and does not fall back to demo accounts or bundled catalog data. Catalog pages, appointments, customer accounts, reviews, and reports read from Supabase. Appointment creation uses the Express API so it can securely send admin booking alerts; deploy and configure that API for production bookings. The production catalog is not auto-seeded: add only verified salon details through the admin portal. The SQL schema removes the known bundled sample staff, offers, gallery items, services, and reviews when applied. Customer reviews can only be submitted for the signed-in customer's completed appointments.

Business reports are calculated from database appointments. The displayed money values are completed appointment values, not confirmed payments; no payment ledger is currently stored. Demo/sample totals, projections, ratings, and growth claims are not used.

Admins can book walk-in or phone appointments without creating a customer login. Those appointment records retain the supplied guest contact details and have no linked customer account. Run the updated `server/supabase/schema.sql` to allow these unlinked appointments in an existing database.

Admin users can update their own name and profile photo, request an email change (verified by Supabase), and set a new password from **My Profile**. **Admin Access** sends invitations to new administrators and can remove another admin's account; invited admins set their own passwords. Existing passwords are never displayed or retrievable. These account-management actions require the configured Express API and server-only Supabase secret key.

Appointment bookings are saved in Supabase for manual review in **Admin Portal → Appointments**. The admin appointments page checks for new bookings every 15 seconds, shows an in-app alert, and can use free browser notifications when **Enable Browser Alerts** is selected. Browser alerts require the admin portal to remain open or in the background; they cannot notify a completely closed browser.

Admin invitation and password-setup links redirect to `/forgot-password?mode=reset&returnTo=%2Fadmin%2Flogin&setup=admin`. Add the application URL (for example, `http://localhost:3000/forgot-password` and the production equivalent) to Supabase Authentication → URL Configuration → Redirect URLs. Admin Access can resend a password-setup link for invitations that were sent before this redirect was configured.

Admin forms for gallery images, service images, offer banners, and staff profile photos, along with the customer profile photo form, accept either a direct image URL or a local image upload. Local uploads are saved in the public `salon-media` Supabase Storage bucket (JPEG, PNG, WebP, or GIF, up to 8 MB); the resulting public URL is saved with the catalog/profile record. The schema creates the bucket and policies: anyone may view published media, admins may manage salon media, and signed-in customers may upload into their own profile folder. If uploads say “Bucket not found,” rerun the complete `server/supabase/schema.sql` in the SQL Editor for the same Supabase project configured in `.env.local`, or create a public Storage bucket named `salon-media` with an 8 MB limit and the supported image MIME types. For a URL, provide a publicly accessible direct image URL rather than a Google search-results page.

### Setup

1. Create a Supabase project and run `server/supabase/schema.sql` in its SQL Editor. It backfills profiles for existing Auth users, installs secure login-time recovery, removes known bundled sample content, and adds database-verified review submission. Review the listed sample IDs in the SQL before applying it to a database containing manually created records that reuse those IDs.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` using the project's URL and publishable key.
3. For immediate email/password signup without verification emails, open **Authentication → Sign In / Providers → Email** in the Supabase dashboard and turn off **Confirm email**. Save the change. New accounts can then sign in immediately after signup. Accounts created earlier while confirmation was required may need to be manually confirmed once under **Authentication → Users**. Keep email confirmation enabled if verified email ownership is required for your application.
4. The Express API needs `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, and `SUPABASE_JWKS_URL` in `server/.env`. Keep the secret only in `server/.env`; never put it in a `VITE_` variable or commit it. The direct Supabase flows described above do not require the Express API secret.
5. To enable online payments, create Razorpay **Test Mode** keys first and add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_CURRENCY=INR` to `server/.env`. The key secret stays on the server; only the key ID is returned to the browser. Run the updated `server/supabase/schema.sql` so captured Razorpay payment IDs cannot be reused for multiple appointments. Test the complete order, checkout, signature, captured-status, and appointment flow before switching to Live Mode keys.
6. To create or reset the admin Auth account and set its profile role together, add the following values to the ignored `server/.env` file:

```dotenv
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose-a-strong-password
```

Then run this one-time command from the repository root:

```bash
npm run server:admin-setup
```

The script uses `SUPABASE_SECRET_KEY` only on the server to create the Auth user if needed (or reset its password if it exists), confirm its email, and set `profiles.role` to `admin`. It never sends the admin password to the browser. Remove `ADMIN_PASSWORD` from `server/.env` after provisioning if you do not need to reset it again.

7. Start the frontend:

```bash
npm run dev
```

This starts both the Vite frontend and the Express API server. The terminal prints the frontend URL (`http://localhost:3000`), backend URL (`http://localhost:4000`), and API health URL. API requests are proxied to the backend. The backend loads the configured Supabase database from `server/.env`.

To start the API separately when needed:

```bash
npm run server:dev
```

The API listens on `http://localhost:4000`. Vite proxies `/api` requests to it. `GET /api/health` works before credentials are configured; Supabase-backed API routes return `503` until the server environment is set. Restart Vite after editing `.env.local`.

### API routes

- `GET /api/auth/me` returns the authenticated user and profile.
- `GET /api/customers/me` and `PATCH /api/customers/me` read and update the current user's profile.
- `/api/services`, `/api/staff`, `/api/offers`, `/api/reviews`, and `/api/gallery` provide catalog reads and admin-managed mutations.
- `/api/appointments` lists a customer's own bookings or all bookings for an admin; supports booking, details, cancellation, and admin status updates.
- `GET /api/appointments/availability/slots?date=YYYY-MM-DD&staffId=staff-id` checks booked times.
- `POST /api/payments/orders` creates a server-priced Razorpay order for an authenticated customer.
- `POST /api/payments/verify` verifies the Razorpay signature and captured payment status.

For local development without Supabase, the app can run in demo mode. A production build without the Supabase URL and publishable key shows a setup error instead of exposing demo users or sample business data. Configure both values in the hosting provider's build environment before deployment. Never expose the server-only Supabase secret in frontend variables.
