-- Boutique Club Bayard — schéma initial
-- À appliquer avec `supabase db push` ou dans l'éditeur SQL du projet Supabase.
-- Les valeurs d'énumération reprennent les slugs utilisés côté application
-- (src/lib/boutique/types.ts) pour éviter toute table de correspondance.

create extension if not exists pgcrypto;

-- ------------------------------------------------------------------ enums

create type public.boutique_role as enum ('member', 'admin');

create type public.listing_status as enum (
  'brouillon', 'en-attente', 'publiee', 'reservee', 'vendue', 'expiree', 'refusee', 'retiree'
);

create type public.listing_condition as enum (
  'neuf-etiquette', 'tres-bon-etat', 'bon-etat', 'satisfaisant'
);

create type public.audience as enum (
  'cavalier-adulte', 'cavalier-enfant', 'cheval', 'poney', 'shetland'
);

create type public.discipline as enum (
  'cso', 'dressage', 'cce', 'hunter', 'pony-games', 'equifun', 'loisir'
);

create type public.team_slug as enum ('dressage', 'hunter', 'cce', 'pony-games', 'equifun');

create type public.goodies_category as enum (
  'textile', 'accessoires-cavalier', 'accessoires-cheval', 'tenue-equipe', 'divers'
);

create type public.reservation_status as enum (
  'demandee', 'confirmee', 'prete', 'retiree', 'annulee', 'expiree'
);

-- --------------------------------------------------------------- settings

-- Paramètres modifiables par le club sans redéploiement.
create table public.boutique_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.boutique_settings (key, value) values
  ('listing_lifetime_days', '60'),
  ('reservation_lifetime_days', '14'),
  ('moderation', '"a-priori"'),
  ('max_listings_per_member', '20'),
  ('contact_messages_per_hour', '10');

-- --------------------------------------------------------------- profiles

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  phone text,
  role public.boutique_role not null default 'member',
  suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_members (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  team public.team_slug not null,
  added_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (profile_id, team)
);

-- Vue publique : ce que tout le monde peut voir d'un vendeur.
create view public.public_profiles as
select
  p.id,
  trim(p.first_name || ' ' || case when p.last_name <> '' then left(p.last_name, 1) || '.' else '' end) as display_name,
  p.created_at as member_since,
  coalesce(array_agg(tm.team order by tm.team) filter (where tm.team is not null), '{}') as teams
from public.profiles p
left join public.team_members tm on tm.profile_id = p.id
where p.suspended = false
group by p.id;

-- --------------------------------------------------------------- listings

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null unique,
  title text not null check (char_length(title) between 3 and 80),
  category_slug text not null,
  sub_category_slug text not null,
  audience public.audience not null,
  size text,
  brand text,
  color text,
  condition public.listing_condition not null,
  price_cents integer not null check (price_cents >= 0),
  description text not null check (char_length(description) >= 20),
  images text[] not null default '{}' check (cardinality(images) between 0 and 6),
  discipline public.discipline,
  team public.team_slug,
  status public.listing_status not null default 'brouillon',
  rejection_reason text,
  published_at timestamptz,
  expires_at timestamptz,
  sold_at timestamptz,
  expiry_notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listings_status_published_idx on public.listings (status, published_at desc);
create index listings_seller_idx on public.listings (seller_id);
create index listings_team_idx on public.listings (team) where team is not null;
create index listings_search_idx on public.listings
  using gin (to_tsvector('french', coalesce(title, '') || ' ' || coalesce(brand, '') || ' ' || coalesce(description, '')));

create table public.listing_reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  reporter_id uuid references public.profiles (id) on delete set null,
  reason text not null,
  details text,
  handled_at timestamptz,
  handled_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);

create index contact_messages_sender_idx on public.contact_messages (sender_id, created_at desc);

-- --------------------------------------------------------------- goodies

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category public.goodies_category not null,
  description text not null,
  images text[] not null default '{}' check (cardinality(images) between 0 and 6),
  price_cents integer not null check (price_cents >= 0),
  team public.team_slug,
  team_only boolean not null default false,
  published boolean not null default false,
  size_note text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  label text not null,
  stock integer not null default 0 check (stock >= 0),
  on_order boolean not null default false,
  lead_time text,
  sort_order integer not null default 0,
  unique (product_id, label)
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  status public.reservation_status not null default 'demandee',
  note text,
  admin_note text,
  expires_at timestamptz,
  ready_at timestamptz,
  picked_up_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reservations_profile_idx on public.reservations (profile_id, created_at desc);
create index reservations_status_idx on public.reservations (status, created_at desc);

create table public.reservation_items (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations (id) on delete cascade,
  product_id uuid not null references public.products (id),
  variant_id uuid not null references public.product_variants (id),
  quantity integer not null check (quantity between 1 and 10),
  unit_price_cents integer not null,
  -- true when stock was decremented at reservation time (false for "sur commande")
  stocked boolean not null default true
);

-- ---------------------------------------------------------------- helpers

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and suspended = false
  );
$$;

create or replace function public.setting_int(p_key text, p_default integer)
returns integer
language sql
stable
set search_path = public
as $$
  select coalesce((select (value #>> '{}')::integer from public.boutique_settings where key = p_key), p_default);
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger listings_updated_at before update on public.listings
  for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create trigger reservations_updated_at before update on public.reservations
  for each row execute function public.set_updated_at();

-- Création automatique du profil à l'inscription.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row execute function public.handle_user_email_change();

-- Dates de publication / expiration gérées en base.
create or replace function public.handle_listing_status()
returns trigger
language plpgsql
as $$
declare
  lifetime integer := public.setting_int('listing_lifetime_days', 60);
begin
  if new.status = 'publiee' and (tg_op = 'INSERT' or old.status is distinct from 'publiee') then
    new.published_at = now();
    new.expires_at = now() + make_interval(days => lifetime);
    new.expiry_notified_at = null;
    new.rejection_reason = null;
  end if;
  if new.status = 'vendue' and (tg_op = 'INSERT' or old.status is distinct from 'vendue') then
    new.sold_at = now();
  end if;
  return new;
end;
$$;

create trigger listings_status before insert or update on public.listings
  for each row execute function public.handle_listing_status();

-- ---------------------------------------------------------------- RPCs

-- Réservation atomique : verrouille les déclinaisons, vérifie le stock et
-- l'appartenance à l'équipe, décrémente, crée la réservation.
-- p_items : [{"variant_id": "...", "quantity": 2}, ...]
create or replace function public.create_reservation(p_items jsonb, p_note text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_item jsonb;
  v_variant public.product_variants%rowtype;
  v_product public.products%rowtype;
  v_qty integer;
  v_reservation uuid;
  v_lifetime integer := public.setting_int('reservation_lifetime_days', 14);
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;
  if exists (select 1 from public.profiles where id = v_user and suspended) then
    raise exception 'SUSPENDED';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY';
  end if;

  insert into public.reservations (profile_id, note, expires_at)
  values (v_user, p_note, now() + make_interval(days => v_lifetime))
  returning id into v_reservation;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := coalesce((v_item ->> 'quantity')::integer, 1);
    if v_qty < 1 or v_qty > 10 then
      raise exception 'BAD_QUANTITY';
    end if;

    select * into v_variant from public.product_variants
      where id = (v_item ->> 'variant_id')::uuid for update;
    if not found then
      raise exception 'VARIANT_NOT_FOUND';
    end if;

    select * into v_product from public.products where id = v_variant.product_id;
    if not v_product.published then
      raise exception 'PRODUCT_UNAVAILABLE';
    end if;
    if v_product.team_only and not exists (
      select 1 from public.team_members where profile_id = v_user and team = v_product.team
    ) then
      raise exception 'TEAM_ONLY';
    end if;

    if v_variant.stock >= v_qty then
      update public.product_variants set stock = stock - v_qty where id = v_variant.id;
      insert into public.reservation_items (reservation_id, product_id, variant_id, quantity, unit_price_cents, stocked)
      values (v_reservation, v_product.id, v_variant.id, v_qty, v_product.price_cents, true);
    elsif v_variant.on_order then
      insert into public.reservation_items (reservation_id, product_id, variant_id, quantity, unit_price_cents, stocked)
      values (v_reservation, v_product.id, v_variant.id, v_qty, v_product.price_cents, false);
    else
      raise exception 'OUT_OF_STOCK';
    end if;
  end loop;

  return v_reservation;
end;
$$;

-- Remise en stock des lignes d'une réservation (annulation / expiration).
create or replace function public.restock_reservation(p_reservation uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.product_variants v
  set stock = v.stock + i.quantity
  from public.reservation_items i
  where i.reservation_id = p_reservation and i.variant_id = v.id and i.stocked;
end;
$$;

revoke execute on function public.restock_reservation(uuid) from public, anon, authenticated;

-- Le membre annule tant que la réservation n'est pas « prête ».
create or replace function public.cancel_reservation(p_reservation uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_res public.reservations%rowtype;
begin
  select * into v_res from public.reservations where id = p_reservation for update;
  if not found then
    raise exception 'NOT_FOUND';
  end if;
  if v_res.profile_id <> auth.uid() and not public.is_admin() then
    raise exception 'FORBIDDEN';
  end if;
  if v_res.status not in ('demandee', 'confirmee') and not public.is_admin() then
    raise exception 'NOT_CANCELLABLE';
  end if;
  if v_res.status in ('annulee', 'expiree', 'retiree') then
    return;
  end if;
  perform public.restock_reservation(p_reservation);
  update public.reservations set status = 'annulee' where id = p_reservation;
end;
$$;

-- Changement de statut par un administrateur.
create or replace function public.set_reservation_status(p_reservation uuid, p_status public.reservation_status, p_admin_note text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_res public.reservations%rowtype;
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN';
  end if;
  select * into v_res from public.reservations where id = p_reservation for update;
  if not found then
    raise exception 'NOT_FOUND';
  end if;
  if p_status in ('annulee', 'expiree') and v_res.status not in ('annulee', 'expiree', 'retiree') then
    perform public.restock_reservation(p_reservation);
  end if;
  update public.reservations
  set status = p_status,
      admin_note = coalesce(p_admin_note, admin_note),
      ready_at = case when p_status = 'prete' then now() else ready_at end,
      picked_up_at = case when p_status = 'retiree' then now() else picked_up_at end
  where id = p_reservation;
end;
$$;

-- Expirations automatiques (appelée par le cron avec la clé service).
create or replace function public.expire_stale()
returns table (expired_listings integer, expired_reservations integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_listings integer;
  v_reservations integer := 0;
  v_id uuid;
begin
  update public.listings
  set status = 'expiree'
  where status = 'publiee' and expires_at is not null and expires_at < now();
  get diagnostics v_listings = row_count;

  for v_id in
    select id from public.reservations
    where status in ('demandee', 'confirmee', 'prete') and expires_at is not null and expires_at < now()
  loop
    perform public.restock_reservation(v_id);
    update public.reservations set status = 'expiree' where id = v_id;
    v_reservations := v_reservations + 1;
  end loop;

  return query select v_listings, v_reservations;
end;
$$;

revoke execute on function public.expire_stale() from public, anon, authenticated;

-- Limite anti-spam des messages de contact.
create or replace function public.contact_quota_exceeded()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select (
    select count(*) from public.contact_messages
    where sender_id = auth.uid() and created_at > now() - interval '1 hour'
  ) >= public.setting_int('contact_messages_per_hour', 10);
$$;

-- ---------------------------------------------------------------- RLS

alter table public.boutique_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.team_members enable row level security;
alter table public.listings enable row level security;
alter table public.listing_reports enable row level security;
alter table public.contact_messages enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.reservations enable row level security;
alter table public.reservation_items enable row level security;

-- settings : lecture publique, écriture admin
create policy "settings read" on public.boutique_settings for select using (true);
create policy "settings admin write" on public.boutique_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- profiles : soi-même ou admin
create policy "profiles self read" on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy "profiles self update" on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (
    (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()) and suspended = (select suspended from public.profiles where id = auth.uid()))
    or public.is_admin()
  );

-- team_members : lecture pour tout utilisateur connecté (vérification des articles d'équipe), écriture admin
create policy "team members read" on public.team_members for select
  using (auth.uid() is not null);
create policy "team members admin write" on public.team_members for all
  using (public.is_admin()) with check (public.is_admin());

-- listings
create policy "listings public read" on public.listings for select
  using (
    status in ('publiee', 'reservee', 'vendue')
    or seller_id = auth.uid()
    or public.is_admin()
  );
create policy "listings seller insert" on public.listings for insert
  with check (
    seller_id = auth.uid()
    and status in ('brouillon', 'en-attente')
    and not exists (select 1 from public.profiles where id = auth.uid() and suspended)
    and (select count(*) from public.listings l where l.seller_id = auth.uid() and l.status in ('brouillon', 'en-attente', 'publiee', 'reservee'))
        < public.setting_int('max_listings_per_member', 20)
  );
create policy "listings seller update" on public.listings for update
  using (seller_id = auth.uid() or public.is_admin())
  with check (
    public.is_admin()
    or (
      seller_id = auth.uid()
      -- un vendeur ne publie pas lui-même : il soumet, réserve, vend, retire ou repasse en attente
      and status in ('brouillon', 'en-attente', 'reservee', 'vendue', 'retiree')
    )
    or (
      -- retour en ligne par le vendeur sans repasser par la modération :
      -- annonce réservée, déjà publiée (modification) ou expirée (remise en ligne en un clic)
      seller_id = auth.uid() and status = 'publiee'
      and (select l.status from public.listings l where l.id = listings.id) in ('reservee', 'publiee', 'expiree')
    )
  );
create policy "listings seller delete" on public.listings for delete
  using (seller_id = auth.uid() or public.is_admin());

-- reports
create policy "reports insert" on public.listing_reports for insert
  with check (auth.uid() is not null and (reporter_id = auth.uid() or reporter_id is null));
create policy "reports admin" on public.listing_reports for select using (public.is_admin());
create policy "reports admin update" on public.listing_reports for update
  using (public.is_admin()) with check (public.is_admin());

-- contact messages
create policy "contact insert" on public.contact_messages for insert
  with check (
    sender_id = auth.uid()
    and not public.contact_quota_exceeded()
    and exists (select 1 from public.listings l where l.id = listing_id and l.status = 'publiee' and l.seller_id <> auth.uid())
  );
create policy "contact read" on public.contact_messages for select
  using (sender_id = auth.uid() or public.is_admin());

-- products & variants
create policy "products public read" on public.products for select
  using (published or public.is_admin());
create policy "products admin write" on public.products for all
  using (public.is_admin()) with check (public.is_admin());
create policy "variants public read" on public.product_variants for select
  using (exists (select 1 from public.products p where p.id = product_id and (p.published or public.is_admin())));
create policy "variants admin write" on public.product_variants for all
  using (public.is_admin()) with check (public.is_admin());

-- reservations : création via create_reservation() uniquement
create policy "reservations read" on public.reservations for select
  using (profile_id = auth.uid() or public.is_admin());
create policy "reservation items read" on public.reservation_items for select
  using (exists (select 1 from public.reservations r where r.id = reservation_id and (r.profile_id = auth.uid() or public.is_admin())));

-- ---------------------------------------------------------------- storage

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('listing-photos', 'listing-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('product-photos', 'product-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "listing photos public read" on storage.objects for select
  using (bucket_id in ('listing-photos', 'product-photos'));

create policy "listing photos owner write" on storage.objects for insert
  with check (
    bucket_id = 'listing-photos'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "listing photos owner delete" on storage.objects for delete
  using (
    bucket_id = 'listing-photos'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
create policy "product photos admin write" on storage.objects for insert
  with check (bucket_id = 'product-photos' and public.is_admin());
create policy "product photos admin delete" on storage.objects for delete
  using (bucket_id = 'product-photos' and public.is_admin());

-- ---------------------------------------------------------------- admin stats

create or replace function public.boutique_stats()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'listings_active', (select count(*) from public.listings where status in ('publiee', 'reservee')),
    'listings_pending', (select count(*) from public.listings where status = 'en-attente'),
    'listings_sold', (select count(*) from public.listings where status = 'vendue'),
    'reports_open', (select count(*) from public.listing_reports where handled_at is null),
    'reservations_open', (select count(*) from public.reservations where status in ('demandee', 'confirmee', 'prete')),
    'reservations_done', (select count(*) from public.reservations where status = 'retiree'),
    'members', (select count(*) from public.profiles),
    'top_products', (
      select coalesce(jsonb_agg(jsonb_build_object('name', p.name, 'quantity', s.qty) order by s.qty desc), '[]')
      from (
        select product_id, sum(quantity) as qty
        from public.reservation_items i
        join public.reservations r on r.id = i.reservation_id
        where r.status <> 'annulee'
        group by product_id
        order by qty desc
        limit 5
      ) s
      join public.products p on p.id = s.product_id
    )
  )
  where public.is_admin();
$$;
