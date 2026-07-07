export function AuthLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <div className="text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-royal/20 border-t-royal" />
        <p className="text-sm font-medium text-muted">Carregando...</p>
      </div>
    </div>
  )
}
