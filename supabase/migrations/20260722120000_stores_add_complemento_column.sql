-- Adiciona a coluna complemento na tabela stores (faltava em relacao a migration anterior)

alter table public.stores
  add column if not exists complemento text;
