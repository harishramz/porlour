# AURA LUXE — Haute Beauty Parlour & Appointment Booking Platform

A modern, production-quality, fully responsive **Beauty Parlour Management & Appointment Booking Website** built with **React**, **Vite**, **JavaScript**, and **Tailwind CSS**. 

Designed with a high-end luxury aesthetic for premium salons, featuring complete separation between **Public Client Experience**, **Customer Member Lounge**, and **Admin Operational Control**.

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
│   │   ├── DemoBar.jsx          # Live 1-click role switcher (Guest / Harish / Admin)
│   │   ├── ServiceCard.jsx      # Image, price, duration, rating, favorites, booking trigger
│   │   ├── StaffCard.jsx        # Stylist avatar, bio, specialization, rating, booking button
│   │   ├── OfferCard.jsx        # Package discount badge, inclusions checklist, book package
│   │   ├── ReviewCard.jsx       # 5-star rating, customer avatar, verified tag, quote
│   │   ├── AppointmentCard.jsx  # Customer appointment summary with details & cancellation modal
│   │   ├── Loading.jsx          # Golden spinner & skeleton state
│   │   └── EmptyState.jsx       # Elegant blank state placeholder with call-to-action
│   │
│   ├── context/                 # Application state providers
│   │   ├── AuthContext.jsx      # Multi-role auth (Guest, Customer Harish, Super Admin)
│   │   ├── ToastContext.jsx     # Floating toast notification system
│   │   └── FavoritesContext.jsx # Wishlist persistence engine
│   │
│   ├── data/                    # Realistic mock datasets
│   │   ├── services.js          # 15 services across Hair, Skin, Nails, Makeup, Beauty
│   │   ├── staff.js             # Priya, Anitha, Meena, Divya with bios & working hours
│   │   ├── offers.js            # Bridal Beauty, Glow Facial, Hair Care, Mani-Pedi bundles
│   │   ├── reviews.js           # Verified customer reviews with 5-star ratings
│   │   ├── gallery.js           # Portfolio photos across 6 categories
│   │   ├── customers.js         # Customer profiles with beauty preferences & history
│   │   └── appointments.js      # Initial bookings (Confirmed, Pending, Completed, Cancelled)
│   │
│   ├── services/
│   │   └── api.js               # Future-proof Mock API layer using LocalStorage & Promises
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
│       ├── Login.jsx            # Split-screen luxury login with Google & demo buttons
│       ├── Register.jsx         # Account creation with validation and Terms agreement
│       ├── ForgotPassword.jsx   # Password recovery flow with mock notification
│       ├── BookAppointment.jsx  # 6-step booking wizard with calendar & slot picker
│       │
│       ├── customer/
│       │   ├── Dashboard.jsx    # "Welcome, Harish", metrics, next appointment spotlight
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
│           └── Reports.jsx      # Financial ledger, monthly trends, staff ranking, CSV export
```

---

## 🌟 Key Application Features

### 1. Multi-Step Appointment Booking Engine (6 Steps)
- **Step 1 — Select Service**: Visual cards across Hair, Skin, Nails, Makeup, Beauty. Supports URL pre-selection.
- **Step 2 — Select Specialist**: Choose "Any Available Professional", or specific artists: Priya, Anitha, Meena, Divya.
- **Step 3 — Select Date**: Interactive calendar with past-date prevention and quick date pills.
- **Step 4 — Select Time**: Real-time slot availability (10:00 AM, 11:00 AM, 12:00 PM, 02:00 PM, 03:00 PM, 04:00 PM, 05:00 PM). Booked slots appear disabled.
- **Step 5 — Guest Information**: Name, Email, Phone, and Special Notes / Allergies.
- **Step 6 — Review & Confirmation**: Full summary breakdown (Service, Staff, Date, Time, Duration, Price, Consumables) and instant booking confirmation.
- **Success Receipt**: Generates a unique reference (e.g. `#apt-7821`), links to My Appointments, and supports printing.

### 2. LocalStorage Persistence Layer (`src/services/api.js`)
All mock actions interact with `localStorage`. If you:
- Book an appointment in the customer flow → it appears immediately in Customer Appointments AND Admin Appointments.
- Confirm or Complete an appointment in Admin → status updates in real-time in the Customer Lounge.
- Add or edit a service in Admin → it immediately becomes visible in the Public Services catalogue.

### 3. Quick Role Switcher (`DemoBar.jsx`)
A sleek, non-intrusive top bar enables effortless reviewer testing:
- **Harish (Customer)**: Instantly logs in as Harish Varma to view the customer portal.
- **Admin Portal**: Instantly switches to the Super Admin management system.
- **Guest**: Simulates a logged-out visitor.

---

## 🚀 Future Backend Integration Map

The frontend architecture in `src/services/api.js` is built with async Promises and parameters that map 1-to-1 to a RESTful Node.js + Express + Prisma backend:

| Frontend Function | HTTP Method | Target Backend Route | Notes |
| :--- | :--- | :--- | :--- |
| `getServices()` | `GET` | `/api/services` | Fetches active salon services |
| `getServiceById(id)` | `GET` | `/api/services/:id` | Returns single service with staff relations |
| `createService(data)` | `POST` | `/api/services` | Admin only with validation |
| `updateService(id, data)` | `PUT` | `/api/services/:id` | Admin update |
| `deleteService(id)` | `DELETE` | `/api/services/:id` | Soft delete or archive |
| `getStaff()` | `GET` | `/api/staff` | Stylists and working schedules |
| `getAvailableSlots(date, staffId)` | `GET` | `/api/slots?date=&staffId=` | Computes real availability |
| `getAppointments(customerId)` | `GET` | `/api/appointments` | Filtered by customer or all for admin |
| `createAppointment(data)` | `POST` | `/api/appointments` | Creates appointment and triggers notifications |
| `cancelAppointment(id, reason)` | `DELETE` / `PATCH` | `/api/appointments/:id/cancel` | Updates status to Cancelled |
| `updateAppointmentStatus(id, status)`| `PATCH` | `/api/appointments/:id/status` | Confirm, Complete, or Cancel |
| `loginUser(credentials)` | `POST` | `/api/auth/login` | Issues JWT token |
| `registerUser(formData)` | `POST` | `/api/auth/register` | Creates customer and session |
| `getCustomerProfile(id)` | `GET` | `/api/customers/:id` | Retrieves profile and preferences |
| `updateCustomerProfile(id, data)` | `PUT` | `/api/customers/:id` | Saves skin/hair preferences |

---

## 💻 Running the Application

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
A standalone preview runner is provided in `preview.html`. You can serve it immediately via any HTTP server:
```bash
python3 -m http.server 3000
# Navigate to http://localhost:3000/preview.html
```

## Node.js + Express API

The API lives in `server/` and uses Supabase Auth for identity and Supabase Postgres for salon data. The Express server verifies Supabase access tokens, reads each user's role from `profiles`, and restricts administrative mutations to users whose database profile has the `admin` role. The Supabase service-role key is server-only; never add it to a `VITE_` variable or frontend code.

### Setup

1. Create a Supabase project and run `server/supabase/schema.sql` in its SQL Editor.
2. Copy `server/.env.example` to `server/.env`, then set the project URL, anon key, and service-role key from Supabase project settings.
3. Install and start the API from the repository root:

```bash
npm --prefix server install
npm run server:dev
```

The API listens on `http://localhost:4000`. Vite proxies `/api` requests to it. `GET /api/health` works before credentials are configured; Supabase-backed routes return `503` until the server environment is set.

After registering your first account through Supabase Auth, grant admin access to that profile from the SQL Editor:

```sql
update public.profiles p
set role = 'admin'
from auth.users u
where p.id = u.id and u.email = 'admin@example.com';
```

### API routes

- `GET /api/auth/me` returns the authenticated user and profile.
- `GET /api/customers/me` and `PATCH /api/customers/me` read and update the current user's profile.
- `/api/services`, `/api/staff`, `/api/offers`, `/api/reviews`, and `/api/gallery` provide catalog reads and admin-managed mutations.
- `/api/appointments` lists a customer's own bookings or all bookings for an admin; supports booking, details, cancellation, and admin status updates.
- `GET /api/appointments/availability/slots?date=YYYY-MM-DD&staffId=staff-id` checks booked times.

Protected API requests must include `Authorization: Bearer <supabase-access-token>`. The current React login and data functions remain demo/localStorage implementations; this API scaffold does not switch those UI flows to Supabase automatically. The public Supabase client and auth calls still need to be wired into the frontend before real user sign-in uses this API.
