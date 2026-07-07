import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFParse } from 'pdf-parse'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const catalogFiles = [
  'CATALOGO ECOVILLE BARUERI.pdf',
  'CATALOGO PSCINA - ECOVILLE BARUERI.pdf',
]

const catalogDir = path.join(__dirname, '../public/catalogos')
const outputPath = path.join(__dirname, '../src/data/catalogProducts.json')

async function readPdf(filePath) {
  const buffer = fs.readFileSync(filePath)
  const parser = new PDFParse({ data: buffer })
  const result = await parser.getText()
  await parser.destroy()
  return result.text
}

function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function cleanProductName(name) {
  return name
    .replace(/R\$\s?\d{1,3}(?:\.\d{3})*,\d{2}/g, '')
    .replace(/\d{1,3}(?:\.\d{3})*,\d{2}/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^[-–—\s]+|[-–—\s]+$/g, '')
    .trim()
}

function detectarCategoria(nome, origem) {
  const text = normalizeText(`${nome} ${origem}`)

  if (
    text.includes('piscina') ||
    text.includes('cloro') ||
    text.includes('algicida') ||
    text.includes('clarificante')
  ) {
    return 'Piscina'
  }

  if (text.includes('vidro')) return 'Vidros'

  if (
    text.includes('desengordurante') ||
    text.includes('grill') ||
    text.includes('gordura')
  ) {
    return 'Cozinha'
  }

  if (
    text.includes('lava roupas') ||
    text.includes('amaciante') ||
    text.includes('alvejante') ||
    text.includes('sabao')
  ) {
    return 'Lavanderia'
  }

  if (text.includes('desinfetante')) return 'Banheiro'

  if (text.includes('porcelanato') || text.includes('piso') || text.includes('pedra')) {
    return 'Pisos'
  }

  if (text.includes('canil') || text.includes('pet')) return 'Pet'

  if (
    text.includes('odorizante') ||
    text.includes('aromatizador') ||
    text.includes('difusor') ||
    text.includes('aroma')
  ) {
    return 'Aromas'
  }

  if (text.includes('detergente')) return 'Cozinha'

  if (text.includes('multiuso')) return 'Multiuso'

  return 'Outros'
}

function gerarPalavrasChave(nome, categoria) {
  const text = normalizeText(`${nome} ${categoria}`)
  const words = new Set()

  text.split(/\s+/).forEach((word) => {
    if (word.length > 2) words.add(word)
  })

  if (text.includes('vidro')) {
    ;['vidro', 'janela', 'espelho', 'box', 'blindex', 'limpar vidro'].forEach((w) =>
      words.add(w),
    )
  }

  if (text.includes('gordura') || text.includes('desengordurante') || text.includes('grill')) {
    ;['gordura', 'cozinha', 'fogao', 'chapa', 'coifa', 'tirar gordura'].forEach((w) =>
      words.add(w),
    )
  }

  if (text.includes('canil') || text.includes('pet')) {
    ;['pet', 'cachorro', 'xixi', 'urina', 'odor', 'quintal'].forEach((w) => words.add(w))
  }

  if (text.includes('lava roupas') || text.includes('amaciante')) {
    ;['roupa', 'lavanderia', 'tecido', 'lavar roupa', 'roupa de bebe'].forEach((w) =>
      words.add(w),
    )
  }

  if (text.includes('piscina') || text.includes('cloro')) {
    ;['piscina', 'agua', 'algas', 'tratamento de piscina'].forEach((w) => words.add(w))
  }

  return Array.from(words)
}

function parseProductsFromText(text, origemArquivo) {
  const lines = text
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const products = []
  const priceRegex = /(R\$\s?)?(\d{1,3}(?:\.\d{3})*,\d{2})/

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(priceRegex)

    if (!match) continue

    const precoTexto = match[2]
    const preco = Number(precoTexto.replace(/\./g, '').replace(',', '.'))

    let nome = line.replace(match[0], '').trim()

    if (!nome || nome.length < 4) {
      nome = lines[i - 1] || ''
    }

    nome = cleanProductName(nome)

    if (!nome || nome.length < 4) continue

    const categoria = detectarCategoria(nome, origemArquivo)

    products.push({
      id: `${normalizeText(nome).replace(/[^a-z0-9]+/g, '-')}-${products.length + 1}`,
      nome,
      categoria,
      preco,
      descricao: 'Produto importado automaticamente do catálogo Ecoville.',
      aplicacoes: [],
      superficies: [],
      sujeiras: [],
      palavrasChave: gerarPalavrasChave(nome, categoria),
      tag: 'Importado',
      origem: origemArquivo,
      imagem: null,
    })
  }

  return products
}

function removeDuplicates(products) {
  const map = new Map()

  for (const product of products) {
    const key = normalizeText(product.nome)

    if (!map.has(key)) {
      map.set(key, product)
    } else {
      const existing = map.get(key)
      map.set(key, {
        ...existing,
        ...product,
        id: existing.id,
      })
    }
  }

  return Array.from(map.values())
}

async function main() {
  let allProducts = []

  for (const fileName of catalogFiles) {
    const filePath = path.join(catalogDir, fileName)

    if (!fs.existsSync(filePath)) {
      console.warn(`Arquivo não encontrado: ${filePath}`)
      continue
    }

    console.log(`Lendo PDF: ${fileName}`)

    const text = await readPdf(filePath)
    const products = parseProductsFromText(text, fileName)

    console.log(`${products.length} produtos encontrados em ${fileName}`)

    allProducts = [...allProducts, ...products]
  }

  allProducts = removeDuplicates(allProducts)

  if (allProducts.length === 0) {
    console.warn('')
    console.warn('⚠ Nenhum produto extraído dos PDFs.')
    console.warn('  Os arquivos podem ser PDFs escaneados (somente imagem, sem texto selecionável).')
    console.warn('  Nesta fase não há OCR. Use PDFs com texto selecionável ou aguarde a Fase 2.')
    console.warn('  O app usará o catálogo padrão (defaultProducts) como fallback.')
    console.warn('')
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2), 'utf-8')

  console.log(`Catálogo gerado com ${allProducts.length} produtos.`)
  console.log(`Arquivo salvo em: ${outputPath}`)
}

main().catch((error) => {
  console.error('Erro ao gerar catálogo:', error)
  process.exit(1)
})
