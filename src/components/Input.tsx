import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-dark">{label}</label>
      )}
      <input
        className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-dark placeholder:text-gray-400 outline-none transition-colors focus:border-royal focus:ring-2 focus:ring-royal/20 ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
