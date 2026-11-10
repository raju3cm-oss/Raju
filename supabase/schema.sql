-- Avora Zone Phase 2 schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  level text not null default 'Beginner' check (level in ('Beginner','Intermediate','Advanced')),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(student_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_key text not null,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique(student_id, course_id, lesson_key)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  quiz_key text not null,
  score integer not null check (score >= 0),
  total integer not null check (total > 0 and score <= total),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;

drop policy if exists "profile read own or admin" on public.profiles;
create policy "profile read own or admin" on public.profiles
for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profile update own" on public.profiles;
create policy "profile update own" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid() and role = 'student');

drop policy if exists "published courses visible" on public.courses;
create policy "published courses visible" on public.courses
for select using (is_published = true or public.is_admin());

drop policy if exists "admins manage courses" on public.courses;
create policy "admins manage courses" on public.courses
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "students read own enrollments" on public.enrollments;
create policy "students read own enrollments" on public.enrollments
for select using (student_id = auth.uid() or public.is_admin());

drop policy if exists "students enroll themselves" on public.enrollments;
create policy "students enroll themselves" on public.enrollments
for insert with check (student_id = auth.uid());

drop policy if exists "students manage own progress" on public.lesson_progress;
create policy "students manage own progress" on public.lesson_progress
for all using (student_id = auth.uid() or public.is_admin())
with check (student_id = auth.uid() or public.is_admin());

drop policy if exists "students read own quiz attempts" on public.quiz_attempts;
create policy "students read own quiz attempts" on public.quiz_attempts
for select using (student_id = auth.uid() or public.is_admin());

drop policy if exists "students save own quiz attempts" on public.quiz_attempts;
create policy "students save own quiz attempts" on public.quiz_attempts
for insert with check (student_id = auth.uid());
