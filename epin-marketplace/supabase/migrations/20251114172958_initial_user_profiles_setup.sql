-- Create custom types for user roles and kyc status
create type public.user_role as enum ('buyer', 'seller', 'creator', 'admin');
create type public.kyc_status as enum ('not_started', 'pending', 'verified', 'rejected');

-- Create the profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  phone text unique,
  role user_role default 'buyer' not null,
  kyc_status kyc_status default 'not_started' not null,

  constraint phone_length check (char_length(phone) >= 10)
);

-- Set up Row Level Security (RLS)
alter table public.profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry for new users.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, kyc_status)
  values (new.id, 'buyer', 'not_started');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage security policies for user avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Users can update their own avatar." on storage.objects
  for update with check (auth.uid() = owner);
