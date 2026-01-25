-- Create Purchases Table
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  semester_id uuid references public.semesters(id) not null,
  status text check (status in ('pending', 'completed', 'failed')) default 'pending',
  payment_id text,
  amount numeric,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.purchases enable row level security;

-- Policies
create policy "Users can view own purchases"
on public.purchases for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own purchases"
on public.purchases for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Admins can view all purchases"
on public.purchases for select
to authenticated
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
