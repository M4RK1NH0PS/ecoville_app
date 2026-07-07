import { splitHighlight } from '../utils/searchProducts'

interface HighlightTextProps {
  text: string
  terms: string[]
  className?: string
}

export default function HighlightText({ text, terms, className = '' }: HighlightTextProps) {
  const parts = splitHighlight(text, terms)

  return (
    <span className={className}>
      {parts.map((part, i) =>
        typeof part === 'string' ? (
          <span key={i}>{part}</span>
        ) : (
          <mark
            key={i}
            className="rounded bg-yellow/40 px-0.5 font-semibold text-dark not-italic"
          >
            {part.highlight}
          </mark>
        ),
      )}
    </span>
  )
}
