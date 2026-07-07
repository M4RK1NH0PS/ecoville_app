import type { ProductTag } from '../types'

const tagStyles: Record<ProductTag, string> = {
  'Mais vendido': 'bg-royal text-white',
  Novo: 'bg-green text-white',
  Promoção: 'bg-yellow text-dark',
  Essencial: 'bg-sky text-white',
  Pet: 'bg-orange-500 text-white',
  Baby: 'bg-pink-500 text-white',
  Importado: 'bg-gray-600 text-white',
}

interface BadgeProps {
  tag: ProductTag | string
  small?: boolean
}

export default function Badge({ tag, small }: BadgeProps) {
  const style = tagStyles[tag as ProductTag] ?? 'bg-gray-200 text-dark'

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${style} ${
        small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {tag}
    </span>
  )
}
