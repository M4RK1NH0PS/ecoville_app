import type { Product, SearchResult } from '../types'
import { enrichProduct } from '../data/productSearchMeta'

export const sinonimos: Record<string, string[]> = {
  gordura: ['oleo', 'óleo', 'engordurado', 'graxa', 'cozinha', 'fogao', 'fogão'],
  vidro: ['janela', 'espelho', 'box', 'blindex', 'vidros'],
  banheiro: ['vaso', 'pia', 'azulejo', 'box', 'wc'],
  pet: ['cachorro', 'gato', 'urina', 'xixi', 'canil', 'odor', 'quintal', 'animal'],
  roupa: ['lavanderia', 'lavar roupa', 'tecido', 'bebe', 'bebê', 'baby'],
  mofo: ['bolor', 'fungo', 'mofo'],
  limo: ['lodo', 'sujeira verde', 'limo'],
  piso: ['chao', 'chão', 'porcelanato', 'ceramica', 'cerâmica', 'pedra'],
  cozinha: ['fogao', 'fogão', 'bancada', 'coifa', 'fogão'],
  limpar: ['limpeza', 'tirar', 'remover', 'higienizar'],
  produto: ['produtos', 'qual', 'preciso', 'indicado'],
}

const MOTIVO_TEMPLATES: Record<string, string> = {
  vidro: 'Indicado para vidro, espelhos e janelas.',
  gordura: 'Indicado para gordura, principalmente em cozinha e superfícies resistentes.',
  pet: 'Indicado para odor de pet, quintal e área externa.',
  urina: 'Indicado para urina e odores de animais.',
  banheiro: 'Indicado para limpeza de banheiro.',
  limo: 'Indicado para limo e sujeira em banheiro.',
  mofo: 'Indicado para mofo e fungos.',
  roupa: 'Indicado para roupas delicadas e lavanderia.',
  bebe: 'Indicado para roupas de bebê e peles sensíveis.',
  piso: 'Indicado para pisos e superfícies do chão.',
  cozinha: 'Indicado para limpeza de cozinha.',
  multiuso: 'Auxilia na limpeza geral de superfícies laváveis.',
  desinfetante: 'Auxilia na limpeza e perfumação do ambiente.',
  odor: 'Auxilia no controle de odores do ambiente.',
}

const STOP_WORDS = new Set([
  'para', 'com', 'uma', 'um', 'de', 'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas',
  'em', 'ao', 'aos', 'que', 'qual', 'como', 'meu', 'minha', 'seu', 'sua', 'preciso',
  'quero', 'produto', 'produtos', 'limpar', 'limpeza', 'tirar', 'remover',
])

export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function expandirTermos(busca: string): string[] {
  const normalizado = normalizarTexto(busca)
  const palavras = normalizado.split(/\s+/).filter((p) => p.length > 1)
  const termos = new Set<string>(palavras)

  for (const palavra of palavras) {
    for (const [chave, lista] of Object.entries(sinonimos)) {
      const chaveNorm = normalizarTexto(chave)
      const listaNorm = lista.map(normalizarTexto)
      if (
        palavra === chaveNorm ||
        listaNorm.includes(palavra) ||
        palavra.includes(chaveNorm) ||
        chaveNorm.includes(palavra)
      ) {
        termos.add(chaveNorm)
        listaNorm.forEach((s) => termos.add(s))
      }
    }
  }

  return Array.from(termos).filter((t) => !STOP_WORDS.has(t) && t.length > 2)
}

function getTextoProduto(produto: Product): string {
  const enriched = enrichProduct(produto)
  return normalizarTexto(
    [
      enriched.nome,
      enriched.categoria,
      enriched.descricao,
      enriched.tag,
      enriched.origem ?? '',
      ...(enriched.aplicacoes ?? []),
      ...(enriched.superficies ?? []),
      ...(enriched.sujeiras ?? []),
      ...(enriched.palavrasChave ?? []),
    ].join(' '),
  )
}

function detectarTermosCorrespondentes(
  textoProduto: string,
  termos: string[],
  buscaCompleta: string,
): string[] {
  const matched = new Set<string>()

  if (buscaCompleta.length > 3 && textoProduto.includes(buscaCompleta)) {
    matched.add(buscaCompleta)
  }

  for (const termo of termos) {
    if (textoProduto.includes(termo)) {
      matched.add(termo)
    }
  }

  return Array.from(matched)
}

function gerarMotivo(produto: Product, termos: string[], buscaOriginal: string): string {
  const busca = normalizarTexto(buscaOriginal)
  const texto = getTextoProduto(produto)
  const nome = produto.nome.toLowerCase()

  if (nome.includes('vidro') || termos.some((t) => ['vidro', 'janela', 'espelho', 'box'].includes(t))) {
    if (texto.includes('vidro') || nome.includes('vidro')) {
      return MOTIVO_TEMPLATES.vidro
    }
  }

  if (termos.some((t) => ['gordura', 'oleo', 'graxa', 'engordurado'].includes(t)) || busca.includes('gordura')) {
    if (nome.includes('desengordurante') || texto.includes('gordura')) {
      return MOTIVO_TEMPLATES.gordura
    }
  }

  if (termos.some((t) => ['pet', 'cachorro', 'gato', 'urina', 'xixi', 'canil', 'quintal'].includes(t))) {
    if (nome.includes('canil') || produto.categoria === 'Pet' || texto.includes('pet')) {
      return MOTIVO_TEMPLATES.pet
    }
  }

  if (termos.some((t) => ['banheiro', 'limo', 'box', 'vaso'].includes(t)) || busca.includes('banheiro')) {
    if (produto.categoria === 'Banheiro' || texto.includes('banheiro') || texto.includes('limo')) {
      if (texto.includes('limo')) return MOTIVO_TEMPLATES.limo
      return MOTIVO_TEMPLATES.banheiro
    }
  }

  if (termos.some((t) => ['mofo', 'bolor', 'fungo'].includes(t))) {
    if (texto.includes('mofo') || nome.includes('mofo')) {
      return MOTIVO_TEMPLATES.mofo
    }
  }

  if (termos.some((t) => ['bebe', 'baby', 'roupa', 'lavanderia', 'tecido'].includes(t)) || busca.includes('bebe')) {
    if (nome.includes('baby') || produto.tag === 'Baby') {
      return MOTIVO_TEMPLATES.bebe
    }
    if (produto.categoria === 'Lavanderia') {
      return MOTIVO_TEMPLATES.roupa
    }
  }

  if (termos.some((t) => ['piso', 'porcelanato', 'ceramica', 'chao'].includes(t))) {
    if (produto.categoria === 'Pisos' || texto.includes('piso')) {
      return MOTIVO_TEMPLATES.piso
    }
  }

  if (nome.includes('multiuso') || produto.categoria === 'Multiuso') {
    return MOTIVO_TEMPLATES.multiuso
  }

  if (nome.includes('desinfetante')) {
    return MOTIVO_TEMPLATES.desinfetante
  }

  if (texto.includes('odor') || termos.includes('odor')) {
    return MOTIVO_TEMPLATES.odor
  }

  if (produto.categoria === 'Cozinha') {
    return MOTIVO_TEMPLATES.cozinha
  }

  const primeiroTermo = termos.find((t) => texto.includes(t))
  if (primeiroTermo) {
    return `Relacionado à sua busca por "${primeiroTermo}".`
  }

  return 'Produto compatível com sua necessidade de limpeza.'
}

export function buscarProdutos(termo: string, produtos: Product[]): SearchResult[] {
  const busca = normalizarTexto(termo)

  if (!busca.trim()) return []

  const termosExpandidos = expandirTermos(termo)
  const palavrasBusca = busca.split(/\s+/).filter((p) => p.length > 2 && !STOP_WORDS.has(p))
  const todosTermos = Array.from(new Set([...palavrasBusca, ...termosExpandidos]))

  return produtos
    .map((raw) => {
      const produto = enrichProduct(raw)
      const textoProduto = getTextoProduto(produto)
      let score = 0

      for (const palavra of todosTermos) {
        if (textoProduto.includes(palavra)) {
          score += palavra.length > 4 ? 2 : 1
        }
      }

      for (const palavra of (produto.palavrasChave ?? []).map(normalizarTexto)) {
        if (busca.includes(palavra) || palavra.includes(busca)) {
          score += 4
        }
        for (const t of todosTermos) {
          if (palavra.includes(t)) score += 2
        }
      }

      if (textoProduto.includes(busca)) {
        score += 8
      }

      if (normalizarTexto(produto.nome).includes(busca)) {
        score += 6
      }

      const termosCorrespondentes = detectarTermosCorrespondentes(textoProduto, todosTermos, busca)

      return {
        ...produto,
        score,
        motivo: gerarMotivo(produto, todosTermos, termo),
        termosCorrespondentes,
      }
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
}

export type HighlightPart = string | { highlight: string }

export function splitHighlight(text: string, terms: string[]): HighlightPart[] {
  if (!terms.length) return [text]

  const normalizedTerms = terms
    .map(normalizarTexto)
    .filter((t) => t.length > 2)
    .sort((a, b) => b.length - a.length)

  if (!normalizedTerms.length) return [text]

  const pattern = normalizedTerms
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')

  const regex = new RegExp(`(${pattern})`, 'gi')
  const parts = text.split(regex).filter(Boolean)

  return parts.map((part) => {
    const isMatch = normalizedTerms.some((t) => normalizarTexto(part).includes(t))
    return isMatch ? { highlight: part } : part
  })
}
