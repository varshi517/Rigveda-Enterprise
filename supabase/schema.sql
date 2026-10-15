
-- 1. Enquiries submitted by website visitors
CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  service text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'closed')),created_at timestamptz NOT NULL DEFAULT now());

-- 2. Customers
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  company text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  customer_name text,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'closed')),
  start_date date,
  due_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Follow-ups
CREATE TABLE IF NOT EXISTS public.follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text,
  notes text NOT NULL,
  due_date timestamptz,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;

-- Public visitors may submit enquiries only
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries;
CREATE POLICY "Public can submit enquiries"
ON public.enquiries
FOR INSERT TO anon, authenticated
WITH CHECK (
  length(trim(customer_name)) BETWEEN 1 AND 150
  AND length(trim(phone)) BETWEEN 5 AND 40
  AND length(trim(email)) BETWEEN 3 AND 254
  AND length(trim(service)) BETWEEN 1 AND 100
  AND length(trim(message)) BETWEEN 1 AND 5000
);

-- Authenticated partners can manage enquiries
DROP POLICY IF EXISTS "Partners can read enquiries" ON public.enquiries;
CREATE POLICY "Partners can read enquiries"
ON public.enquiries FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Partners can update enquiries" ON public.enquiries;
CREATE POLICY "Partners can update enquiries"
ON public.enquiries FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Partners can delete enquiries" ON public.enquiries;
CREATE POLICY "Partners can delete enquiries"
ON public.enquiries FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);

-- Authenticated partners can manage customers
DROP POLICY IF EXISTS "Partners can manage customers" ON public.customers;
CREATE POLICY "Partners can manage customers"
ON public.customers FOR ALL TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated partners can manage projects
DROP POLICY IF EXISTS "Partners can manage projects" ON public.projects;
CREATE POLICY "Partners can manage projects"
ON public.projects FOR ALL TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated partners can manage follow-ups
DROP POLICY IF EXISTS "Partners can manage follow-ups" ON public.follow_ups;
CREATE POLICY "Partners can manage follow-ups"
ON public.follow_ups FOR ALL TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow the app roles to access the tables;
-- RLS policies above determine which rows they can access.
GRANT SELECT, INSERT, UPDATE, DELETE
ON public.enquiries, public.customers, public.projects, public.follow_ups
TO authenticated;

GRANT INSERT ON public.enquiries TO anon;

