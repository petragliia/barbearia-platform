-- FIX DATABASE PERMISSIONS AND SCHEMA
-- Run this entire script in the Supabase SQL Editor

-- 1. Fix Missing 'colors' Column
-- We add it as JSONB to be flexible
ALTER TABLE barbershops 
ADD COLUMN IF NOT EXISTS colors JSONB DEFAULT '{"primary": "#0f172a", "secondary": "#64748b"}'::jsonb;

-- 2. Verify other columns needed for setup (just to be safe)
ALTER TABLE barbershops 
ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS max_barbers INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS contact JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS products JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb;

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE barbershops ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES FOR 'profiles'
-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Allow users to insert their own profile (on signup)
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- 5. POLICIES FOR 'barbershops'

-- Allow Auth Users to Create a Barbershop
-- We check if the owner_id matches their UID
CREATE POLICY "Users can create their own barbershop" 
ON barbershops FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- Allow Owner to View their Barbershop
CREATE POLICY "Owners can view their own barbershop" 
ON barbershops FOR SELECT 
USING (auth.uid() = owner_id);

-- Allow Public to View PUBLISHED Barbershops (for the site pages)
-- Note: Setup page checks for slug uniqueness, which implies we might need to search regardless of publish status?
-- Ideally checking slug availability shouldn't expose data. 
-- For the slug check step (barbershopService.ts), we need to read slugs.
-- Let's allow authenticated users to read ANY barbershop's SLUG (minimal exposure) or just handle the error gracefully.
-- But usually, "Owners can view their own" + "Public can view published" covers most cases.
-- To fix "Slug check error: permission denied", the user needs to be able to SELECT to see if slug exists.
-- A simple way is to allow "Authenticated users can select all barbershops" (read-only), 
-- OR stricter: Allow selecting if (owner_id = uid) OR (is_published = true).
-- BUT the check slug query usually runs before creation.
-- Let's create a policy for "Slug Uniqueness Check" which allows anyone to see just IDs/Slugs? RLS doesn't support column-level filtering easily in Policies.

-- Pragmatic approach for SaaS MVP:
-- Allow Authenticated users to read all barbershops (so they can check slugs/visit other shops).
CREATE POLICY "Authenticated users can read all barbershops" 
ON barbershops FOR SELECT 
TO authenticated 
USING (true);

-- Allow public (anon) to read only PUBLISHED barbershops
CREATE POLICY "Public can read published barbershops" 
ON barbershops FOR SELECT 
TO anon 
USING (is_published = true);

-- Allow Owner to Update their Barbershop
CREATE POLICY "Owners can update their own barbershop" 
ON barbershops FOR UPDATE 
USING (auth.uid() = owner_id);

-- Permissions grant (Standard Supabase setup usually handles this, but ensuring)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
