-- Ensure the new enum value exists even if the migration was partially applied
DO $$
BEGIN
  ALTER TYPE public.kyc_status ADD VALUE 'not_started';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;

ALTER TABLE public.profiles
  ALTER COLUMN kyc_status SET DEFAULT 'not_started';

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
        AND metadata->>'kyc_status' = ANY (ARRAY['not_started', 'pending', 'verified', 'rejected'])
      THEN (metadata->>'kyc_status')::public.kyc_status
      ELSE 'not_started'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
