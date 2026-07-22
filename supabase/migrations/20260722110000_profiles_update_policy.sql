-- Permite que usuários atualizem a própria localização no perfil

drop policy if exists "Usuários atualizam o próprio perfil" on public.profiles;

create policy "Usuários atualizam o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Usuários leem o próprio perfil" on public.profiles;

create policy "Usuários leem o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);
