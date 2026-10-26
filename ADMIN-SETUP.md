# Integral custom workspace

## Release notes - 26 October 2026

The active CMS is `src/admin/`, served at `/admin`. The `cms/` directory is an
abandoned Payload prototype and is excluded from the website deployment.
Production requires VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY at build time.
Never deploy with missing configuration: that enables the local-only demo.

Articles are connected to published Supabase records. Careers, training and people
have management screens, but their public pages still use local website content.
The main Contact and Autos forms now save inquiries to Supabase. The Farms academy
form still opens email. Inquiries, calendar and notifications are admin-only.
Notifications are in-app inquiry alerts, refreshed every minute; replies use mailto,
not a transactional email service. Intake has database validation and basic rate
limits, but a CAPTCHA and stronger abuse protection remain recommended.

Existing staff accounts have been created. Do not rerun bootstrap instructions
below against this connected project. The historical setup checklist is retained
for reference; it does not describe all completed work.

Verified: production build, demo CMS workflows, calendar create/edit, inquiry
read/status/notes, notification read state and mobile overflow. Database tests
verify anonymous submission and denial of private reads; admin operations were
tested in rolled-back transactions. The security advisor still reports existing
rls_auto_enable function exposure and disabled leaked-password protection.

## Local preview

Run `npm run dev -- --host 127.0.0.1 --port 8780`, then open
http://127.0.0.1:8780/admin. With `.env.local` configured, sign in with a
Supabase Auth account that has an active `cms_staff` profile. Without Supabase
configuration, **Explore local demo** is available.

This is the custom React dashboard, NOT the earlier Payload experiment in `cms/`.
Demo records live only in this browser's localStorage. Do not enter real applicant
or learner information in demo mode. Publishing in demo does not change the website.

## Implemented

- Articles, jobs and training programmes: create, edit, draft, publish, schedule,
  archive, search, filtering and pagination.
- Rich text, cover images, accessibility text, categories, authors, SEO fields.
- Revision snapshots and restore-as-draft, optimistic concurrency checks.
- Staff-entered applications and enrolments with stages, notes, consent and retention dates.
- Media upload integration with Supabase Storage, private document download integration.
- Supabase sign-in, logout, password recovery and password update integration.
- Admin/editor/recruiter/trainer access rules in the interface and SQL policies.

## Connected backend

The local dashboard is connected to Supabase project `evjmupqqsebyeazrntys`.
The initial SQL schema was applied on 2026-10-24 through the SQL Editor after
confirming the project had no application tables or storage buckets. Do not rerun
the initial migration on this project. It was not applied through CLI migration history.
The ignored `.env.local` contains only the project URL and publishable key.

Anonymous API checks passed: published-content endpoint accessible; staff,
submissions, revisions and media metadata denied. A temporary draft created in a
rolled-back transaction was invisible to the anonymous role.

## Remaining connection steps

1. Complete role-specific integration tests against the connected project.
2. Disable public staff sign-ups. Invite the first administrator through Supabase
   Auth, then insert their UUID, name and admin role into `cms_staff` as the owner.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`.
   Never put a service-role or secret key in any VITE variable.
4. Configure Supabase Auth site/redirect URLs and transactional email.
5. Test policies using anonymous, editor, recruiter, trainer and admin sessions.
   Verify private files and submissions cannot be fetched by unauthorized roles.
6. Connect the public blog, careers and academy views to published CMS records.

## Pending before production

Public website integration; public application/enrolment intake with validation,
spam protection and private document upload; invitations within the custom UI;
automated retention deletion; notification emails; database policy integration tests.
The current workspace lists at most 1,000 records per collection; replace this with
server-side pagination before large-scale use.

Existing dependency audit flags remain in the site's legacy packages (including
Swiper and React Router). Review and upgrade before production deployment.
Vercel Hobby is for personal/non-commercial use, not Integral production hosting.
The existing Supabase project now contains the CMS schema and storage buckets.
No paid resources or website deployments were created for this connection.

## Verification

`npm run build` and targeted ESLint checks pass. With the local server running,
run `node scripts/test-admin.mjs` (uses installed Google Chrome) for the browser
workflow check in demo mode (without backend environment variables). Anonymous
database access tests passed; authenticated role and login tests remain pending
the first staff account.
