# Contact enquiry forwarding

POST /api/inquiries validates and saves enquiries in cms_inquiries using the public Supabase key and existing rate-limit trigger. After saving, it forwards a plain-text notification to support@integralholdings.co. The visitor is Reply-To, never the sender or destination. SMTP failures leave the enquiry available in the dashboard and log only an error code.

Set these server-only Production environment variables in Vercel mainfile:
- SMTP_HOST: server listed by the owning Zoho mailbox
- SMTP_PORT: 587 (STARTTLS) or 465 (TLS)
- SMTP_USER: owning mailbox's full email address
- SMTP_PASS: that mailbox's application-specific password

The support alias must be an authorized sender for that mailbox. Existing VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY remain required. Never prefix SMTP secrets with VITE_. Redeploy after changing environment variables.

Run node --test tests/inquiries.test.js and npm run build. Vite alone does not serve this API; use Vercel development or a deployed environment for end-to-end form checks. SMTP failures are not automatically retried; dashboard inbox is the fallback.
