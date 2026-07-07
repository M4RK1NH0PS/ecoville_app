import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function PrimaryButton({
  children,
  fullWidth,
  size = 'md',
  className = '',
  ...props
}: PrimaryButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-royal font-semibold text-white shadow-md shadow-royal/20 transition-all hover:bg-royal/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
