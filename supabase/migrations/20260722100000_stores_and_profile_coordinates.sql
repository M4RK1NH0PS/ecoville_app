-- Tabela de lojas + coordenadas em profiles + trigger atualizado

-- 1. Lojas Ecoville
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  estado text,
  cidade text,
  bairro text,
  endereco text,
  numero text,
  complemento text,
  cep text,
  telefone text,
  whatsapp text,
  latitude double precision,
  longitude double precision,
  horario_funcionamento text,
  ativo boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.stores enable row level security;

drop policy if exists "Lojas ativas são públicas para leitura" on public.stores;
create policy "Lojas ativas são públicas para leitura"
  on public.stores for select
  using (ativo = true);

-- 2. Coordenadas e loja preferida no perfil
alter table public.profiles
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists loja_preferida_id uuid references public.stores (id);

-- 3. Trigger de cadastro com latitude/longitude
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_latitude double precision;
  user_longitude double precision;
begin
  user_latitude := nullif(new.raw_user_meta_data ->> 'latitude', '')::double precision;
  user_longitude := nullif(new.raw_user_meta_data ->> 'longitude', '')::double precision;

  insert into public.profiles (
    id,
    nome,
    telefone,
    tipo_cliente,
    pais,
    estado,
    cidade,
    bairro,
    cep,
    endereco,
    numero,
    complemento,
    latitude,
    longitude
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'nome',
    new.raw_user_meta_data ->> 'telefone',
    coalesce(new.raw_user_meta_data ->> 'tipo_cliente', 'pessoa_fisica'),
    new.raw_user_meta_data ->> 'pais',
    new.raw_user_meta_data ->> 'estado',
    new.raw_user_meta_data ->> 'cidade',
    new.raw_user_meta_data ->> 'bairro',
    new.raw_user_meta_data ->> 'cep',
    new.raw_user_meta_data ->> 'endereco',
    new.raw_user_meta_data ->> 'numero',
    new.raw_user_meta_data ->> 'complemento',
    user_latitude,
    user_longitude
  )
  on conflict (id) do update set
    nome = excluded.nome,
    telefone = excluded.telefone,
    tipo_cliente = excluded.tipo_cliente,
    pais = excluded.pais,
    estado = excluded.estado,
    cidade = excluded.cidade,
    bairro = excluded.bairro,
    cep = excluded.cep,
    endereco = excluded.endereco,
    numero = excluded.numero,
    complemento = excluded.complemento,
    latitude = excluded.latitude,
    longitude = excluded.longitude;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
