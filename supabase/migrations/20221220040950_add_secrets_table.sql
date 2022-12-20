create table if not exists secrets (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);