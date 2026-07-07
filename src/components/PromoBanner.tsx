import { Package } from 'lucide-react'

interface PromoBannerProps {
  onClick?: () => void
}

const productPlaceholders = [
  { color: '#0057D9', label: 'MU' },
  { color: '#22C55E', label: 'LV' },
  { color: '#FFD400', label: 'DS' },
]

export default function PromoBanner({ onClick }: PromoBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-[18px] bg-royal px-5 py-5 min-h-[120px] shadow-card">
      <div className="relative z-10 max-w-[58%]">
        <p className="text-[13px] font-medium leading-snug text-white/95">
          Soluções que limpam, protegem e facilitam sua rotina.
        </p>
        <button
          type="button"
          onClick={onClick}
          className="mt-3 rounded-xl bg-yellow px-5 py-2.5 text-[13px] font-bold text-dark transition-transform active:scale-95 hover:bg-yellow/90"
        >
          Ver produtos
        </button>
      </div>

      <div className="absolute -right-1 bottom-0 top-0 flex items-end justify-end gap-1.5 pr-3 pb-3 pt-4">
        {productPlaceholders.map((p, i) => (
          <div
            key={p.label}
            className="flex flex-col items-center justify-end"
            style={{ transform: `translateY(${i * 4}px) rotate(${i * -6 + 3}deg)` }}
          >
            <div
              className="flex h-16 w-12 items-center justify-center rounded-xl shadow-lg"
              style={{
                background: `linear-gradient(160deg, ${p.color}, ${p.color}cc)`,
              }}
            >
              <Package size={20} className="text-white/80" />
            </div>
            <span className="mt-1 text-[8px] font-bold text-white/60">{p.label}</span>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
    </div>
  )
}
