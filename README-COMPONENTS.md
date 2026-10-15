# Rigveda Enterprises — componentized React project

The original website has been split into small, focused JSX components. The existing styling is preserved in `src/App.css`.

## Component structure
- `src/App.jsx` — page composition only
- `src/components/Header.jsx` — logo, navbar and mobile menu
- `src/components/Hero.jsx` — hero section
- `src/components/Stats.jsx` — service summary strip
- `src/components/About.jsx` — about section
- `src/components/Services.jsx` — service cards and data
- `src/components/Why.jsx` — why Rigveda section
- `src/components/Projects.jsx` — projects section
- `src/components/CallToAction.jsx` — quote CTA section
- `src/components/Contact.jsx` — contact details and enquiry form
- `src/components/Footer.jsx` — footer
- `src/dashboard/` — dashboard starter
- `src/lib/supabase.js` — Supabase client configuration
- `supabase/schema.sql` — database setup SQL

## Run locally
1. Open this folder in VS Code.
2. Create `.env` in the project root using `.env.example` as a template.
3. Add your Supabase Project URL and publishable key to `.env`. Never put a secret/service-role key in frontend code.
4. Run `npm install`, then `npm run dev`.

This refactor focuses on splitting the existing website into components. The dashboard/CRM should be tested and completed before production use.
