-- BAD PRINTER — Print Queue Schema
-- Run this in your Supabase SQL Editor or via supabase db push

-- ============================================================
-- orders table — internal print-queue tracking
-- Populated by the admin page via BASE API sync (upsert)
-- ============================================================
create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  base_order_id    text not null unique,           -- BASE order_id
  item_title       text not null,                  -- Product name
  size             text,                           -- e.g. "M"
  color            text,                           -- e.g. "Black"
  design_asset_url text,                           -- link to high-res design file (populated manually or via webhook)
  status           text not null default 'pending'
                     check (status in ('pending', 'printed')),
  created_at       timestamptz not null default now()
);

-- Index for fast status filtering
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_at_idx on orders(created_at desc);

-- ============================================================
-- Row Level Security — admin-only access
-- ============================================================
alter table orders enable row level security;

-- Only authenticated users (admins logged in via Supabase Auth) can access
create policy "admin_select" on orders
  for select
  using (auth.role() = 'authenticated');

create policy "admin_insert" on orders
  for insert
  with check (auth.role() = 'authenticated');

create policy "admin_update" on orders
  for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- (No delete policy — orders are append-only for auditability)

-- ============================================================
-- Usage notes:
-- 1. Create an admin user via Supabase Auth Dashboard
--    or: supabase auth add-user --email admin@badprinter.jp
-- 2. The design_asset_url field is nullable — populate it
--    manually via the Supabase table editor or a future webhook.
-- ============================================================
