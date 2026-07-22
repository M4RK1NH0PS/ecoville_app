-- Campos de localização em public.profiles + trigger de cadastro
-- Execute no SQL Editor do Supabase ou via CLI: supabase db push

-- 1. Garantir colunas de localização na tabela profiles
alter table public.profiles
  add column if not exists pais text,
  add column if not exists estado text,
  add column if not exists cidade text,
  add column if not exists bairro text,
  add column if not exists cep text,
  add column if not exists endereco text,
  add column if not exists numero text,
  add column if not exists complemento text;

-- Se a tabela ainda não existir, crie com este bloco (descomente se necessário):
-- create table if not exists public.profiles (
--   id uuid primary key references auth.users (id) on delete cascade,
--   nome text,
--   telefone text,
--   tipo_cliente text default 'pessoa_fisica',
--   pais text,
--   estado text,
--   cidade text,
--   bairro text,
--   cep text,
--   endereco text,
--   numero text,
--   complemento text,
--   created_at timestamptz default now(),
--   updated_at timestamptz default now()
-- );

-- 2. RLS básica (ajuste conforme suas políticas existentes)
alter table public.profiles enable row level security;

-- 3. Função que grava perfil ao criar usuário no Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
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
    complemento
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
    new.raw_user_meta_data ->> 'complemento'
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
    complemento = excluded.complemento;

  return new;
end;
$$;

-- 4. Trigger no auth.users
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
