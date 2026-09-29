-- SQL Schema for Taki Boys Alumni Association Portal (Supabase)
-- Instructions:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/mxuiikbyhwuzaljajbjo/sql/new
-- 2. Paste this entire script into the SQL Editor.
-- 3. Click "RUN" at the bottom right.

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    batch_year INTEGER,
    phone TEXT UNIQUE,
    occupation TEXT,
    location TEXT,
    membership_status TEXT DEFAULT 'NOT_MEMBER',
    membership_tier TEXT DEFAULT 'ANNUAL',
    membership_expiry TEXT,
    roll_number TEXT UNIQUE,
    avatar_url TEXT,
    password TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY,
    sender_name TEXT,
    sender_email TEXT,
    sender_batch INTEGER,
    text TEXT,
    timestamp TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Notices Table
CREATE TABLE IF NOT EXISTS public.notices (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT,
    category TEXT,
    posted_by JSONB,
    posted_at TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Renewals Table (Stores all billing & transaction details for admin verification)
CREATE TABLE IF NOT EXISTS public.renewals (
    id TEXT PRIMARY KEY,
    receipt_number TEXT,
    user_name TEXT,
    email TEXT,
    roll_number TEXT,
    phone TEXT,
    tier TEXT,
    plan_name TEXT,
    amount NUMERIC,
    transaction_id TEXT,
    utr_number TEXT,
    status TEXT DEFAULT 'pending',
    submitted_at TEXT,
    billing_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security (RLS) Setup
-- If you want to enable RLS and remove the "UNRESTRICTED" warning in Supabase while allowing full app operation:

CREATE TABLE IF NOT EXISTS public.admins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    role TEXT DEFAULT 'admin',
    auth_user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure auth_user_id column exists if table was created previously
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

-- Delete old non-auth admin entries (optional)
DELETE FROM public.admins WHERE email != 'takialumni@gmail.com';

-- Insert or update the authorized administrator linked to Supabase Auth
INSERT INTO public.admins (id, name, email, role, auth_user_id)
VALUES (
    'admin_taki_master',
    'Portal Administrator',
    'takialumni@gmail.com',
    'admin',
    'edb11c19-36c9-4e1c-adcc-76fdd3f172c5'
)
ON CONFLICT (email) 
DO UPDATE SET 
    auth_user_id = 'edb11c19-36c9-4e1c-adcc-76fdd3f172c5',
    role = 'admin',
    name = 'Portal Administrator';

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.renewals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow anon access users" ON public.users;
DROP POLICY IF EXISTS "Allow anon access chat" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow anon access notices" ON public.notices;
DROP POLICY IF EXISTS "Allow anon access renewals" ON public.renewals;
DROP POLICY IF EXISTS "Allow anon access admins" ON public.admins;

-- Grant public API access policies
CREATE POLICY "Allow anon access users" ON public.users FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon access chat" ON public.chat_messages FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon access notices" ON public.notices FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon access renewals" ON public.renewals FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon access admins" ON public.admins FOR ALL TO public USING (true) WITH CHECK (true);
