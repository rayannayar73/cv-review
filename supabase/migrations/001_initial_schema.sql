-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create cv_uploads table
create table public.cv_uploads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  file_name text not null,
  file_path text not null,
  original_text text not null,
  feedback jsonb,
  status text check (status in ('pending', 'processing', 'completed', 'failed')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.cv_uploads enable row level security;

-- Policies for profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and is_admin = true
    )
  );

-- Policies for cv_uploads
create policy "Users can view own uploads" on public.cv_uploads
  for select using (auth.uid() = user_id);

create policy "Users can insert own uploads" on public.cv_uploads
  for insert with check (auth.uid() = user_id);

create policy "Users can update own uploads" on public.cv_uploads
  for update using (auth.uid() = user_id);

create policy "Admins can view all uploads" on public.cv_uploads
  for select using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and is_admin = true
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.cv_uploads
  for each row execute procedure public.handle_updated_at();