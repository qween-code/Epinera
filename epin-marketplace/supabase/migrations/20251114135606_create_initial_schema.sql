-- Custom types
CREATE TYPE public.user_role AS ENUM ('buyer', 'seller', 'creator', 'admin');
CREATE TYPE public.kyc_status AS ENUM ('pending', 'verified', 'rejected');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT UNIQUE,
  role user_role NOT NULL DEFAULT 'buyer',
  kyc_status kyc_status NOT NULL DEFAULT 'pending',

  CONSTRAINT phone_length CHECK (
    phone IS NULL OR char_length(phone) >= 10
  )
);

-- Function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  metadata JSONB := COALESCE(new.raw_user_meta_data, '{}'::jsonb);
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, phone, role, kyc_status)
  VALUES (
    new.id,
    metadata->>'full_name',
    metadata->>'avatar_url',
    metadata->>'phone',
    CASE
      WHEN metadata ? 'role'
        AND metadata->>'role' = ANY (ARRAY['buyer', 'seller', 'creator', 'admin'])
      THEN (metadata->>'role')::public.user_role
      ELSE 'buyer'
    END,
    CASE
      WHEN metadata ? 'kyc_status'
        AND metadata->>'kyc_status' = ANY (ARRAY['pending', 'verified', 'rejected'])
      THEN (metadata->>'kyc_status')::public.kyc_status
      ELSE 'pending'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Set up Storage security policies for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar." ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar." ON storage.objects
  FOR UPDATE WITH CHECK (auth.uid() = owner);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );
