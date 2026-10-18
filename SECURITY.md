# Security and deployment policy

## Never commit secrets

The following values must exist only in the hosting provider's server environment or local ignored files:

- `SUPABASE_SECRET_KEY`
- `RAZORPAY_KEY_SECRET`
- `ADMIN_PASSWORD`
- database passwords, private keys, access tokens, webhook secrets, and SMTP credentials

The frontend may contain a Supabase project URL and publishable key, because those are designed for browser use and must be protected by Supabase Row Level Security. A Razorpay key ID may also be sent to the browser; the Razorpay key secret must remain server-only.

If a secret is ever committed, printed in logs, pasted into an issue, or shared publicly, rotate it immediately in the relevant provider and remove it from the repository history. Deleting the file alone does not make an exposed secret safe.

## Production requirements

- Set production environment variables in the hosting provider dashboard, never in frontend source code.
- Set `CLIENT_ORIGINS` to the exact HTTPS frontend origin(s); do not use `*`.
- Use HTTPS for both the frontend and API.
- Apply `server/supabase/schema.sql` and verify Supabase Row Level Security policies before accepting real users.
- Use Razorpay live credentials only on the server after testing payment order creation, signature verification, captured status, and duplicate-payment protection.
- Remove `ADMIN_PASSWORD` after the initial admin provisioning flow unless a controlled reset process needs it.
- Keep dependencies updated and review `npm audit` results before deployment.

## Public information

It is normal for browser users to inspect frontend JavaScript. Do not put private business data, admin credentials, server secrets, database passwords, or payment secrets in frontend code, HTML, public assets, or `VITE_` variables. Public policy and customer-facing payment terms belong in the site; credentials and internal operational details do not.
