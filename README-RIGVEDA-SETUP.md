# Rigveda Enterprises setup

## Internet/data usage
The source ZIP is much smaller than your original upload because it excludes `node_modules`, `.git`, and `dist`. Installing dependencies downloads packages once; expect roughly 100–250 MB for `npm install` depending on platform/cache. Since your daily data is 1 GB, do this only when you can spare the data; avoid repeatedly deleting `node_modules` or reinstalling. After install, local coding/testing usually uses little internet, except hosted fonts/assets and Supabase requests. Browser testing/redeploys use your usual site traffic.

## Setup
1. Extract ZIP, open folder in VS Code.
2. Copy `.env.example` to `.env.local`; enter your Supabase Project URL and publishable key. Never put a secret/service-role key in a Vite app.
3. Supabase Dashboard > SQL Editor > New query; run `supabase/schema.sql`.
4. Supabase > Authentication > Users; create/invite the two partner accounts. Do not enable public sign-up.
5. In VS Code terminal, run `npm install` once, then `npm run dev`. Open the local URL shown. Website is `/`; partner dashboard is `/dashboard`.
6. To deploy, add both `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel project Environment Variables, then redeploy.

## Included
- Existing public website and assets retained.
- Enquiry form integration to save submissions in Supabase.
- Partner login and dashboard views for enquiries/customers/projects.
- Enquiry status update and SQL with RLS policies.

## Limitations to know
This is a first integrated starter, not yet a full CRM: customer/project creation/edit/delete forms, follow-up reminders, file uploads and email notifications are not included yet. The dashboard can list records; status updates apply to records that have a `status` field. Run the SQL before testing and don't use real customer records until access policies are tested.
