export function getAuthErrorMessage(message: string): string {
  const msg = message.toLowerCase()

  if (msg.includes('invalid login credentials')) {
    return 'E-mail ou senha inválidos.'
  }

  if (msg.includes('user already registered')) {
    return 'Este e-mail já está cadastrado.'
  }

  if (msg.includes('password') && (msg.includes('6') || msg.includes('short'))) {
    return 'A senha precisa ter pelo menos 6 caracteres.'
  }

  if (msg.includes('email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar.'
  }

  if (msg.includes('invalid email')) {
    return 'E-mail inválido.'
  }

  return message || 'Ocorreu um erro. Tente novamente.'
}
