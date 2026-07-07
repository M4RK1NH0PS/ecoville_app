import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function SecondaryButton({
  children,
  fullWidth,
  size = 'md',
  className = '',
  ...props
}: SecondaryButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl border-2 border-royal bg-white font-semibold text-royal transition-all hover:bg-royal/5 active:scale-[0.98] disabled:opacity-50 ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
