import type { Product } from '../types'

/** Metadados de busca por produto — complementam os dados do catálogo */
export const productSearchMeta: Record<string, Pick<Product, 'superficies' | 'sujeiras' | 'palavrasChave'>> = {
  '1': {
    superficies: ['plástico', 'cerâmica', 'vidro', 'inox', 'superfícies laváveis'],
    sujeiras: ['poeira', 'gordura leve', 'sujeira comum'],
    palavrasChave: [
      'limpeza geral',
      'limpar superfície',
      'produto multiuso',
      'limpar vidro com gordura',
      'superfície lavável',
    ],
  },
  '2': {
    superficies: ['inox', 'cerâmica', 'superfícies resistentes', 'alumínio'],
    sujeiras: ['gordura', 'óleo', 'gordura pesada', 'graxa'],
    palavrasChave: [
      'tirar gordura',
      'limpar fogão',
      'gordura de cozinha',
      'desengordurante',
      'vidro com gordura',
      'gordura pesada',
    ],
  },
  '3': {
    superficies: ['tecido'],
    sujeiras: ['sujeira de roupa', 'manchas leves', 'odor'],
    palavrasChave: [
      'lavar roupa de bebê',
      'roupa bebe',
      'lava roupas baby',
      'roupa delicada',
      'lavanderia bebê',
    ],
  },
  '4': {
    superficies: ['piso', 'cerâmica', 'porcelanato'],
    sujeiras: ['bactérias', 'odor', 'sujeira comum'],
    palavrasChave: [
      'limpar banheiro',
      'desinfetar banheiro',
      'perfumar ambiente',
      'cheiro de cachorro',
      'odor pet',
    ],
  },
  '5': {
    superficies: ['vidro', 'espelho'],
    sujeiras: ['gordura leve', 'marcas de dedo', 'poeira', 'manchas'],
    palavrasChave: [
      'limpar vidro',
      'vidro com gordura',
      'vidro engordurado',
      'box',
      'janela',
      'espelho',
      'produto para limpar vidro',
    ],
  },
  '6': {
    superficies: ['piso', 'cerâmica', 'área externa', 'concreto'],
    sujeiras: ['urina', 'odor', 'cheiro de cachorro', 'xixi', 'resíduos orgânicos'],
    palavrasChave: [
      'xixi de cachorro',
      'cheiro de cachorro',
      'odor pet',
      'limpar quintal',
      'canil',
      'tirar cheiro de cachorro',
      'urina de pet',
    ],
  },
  '7': {
    superficies: ['porcelanato', 'cerâmica', 'piso antiderrapante', 'pedra'],
    sujeiras: ['poeira', 'manchas', 'sujeira do dia a dia'],
    palavrasChave: ['limpar piso', 'porcelanato', 'cerâmica', 'piso de casa', 'chão'],
  },
  '8': {
    superficies: ['ambientes internos'],
    sujeiras: ['odor', 'mau cheiro'],
    palavrasChave: ['perfumar', 'aromatizar', 'cheiro ambiente', 'odor casa'],
  },
  '9': {
    superficies: ['box', 'azulejo', 'cerâmica', 'rejunte', 'porcelanato'],
    sujeiras: ['limo', 'mofo', 'calcificação', 'crosta', 'manchas'],
    palavrasChave: [
      'limpar banheiro com limo',
      'limo no box',
      'limpar box',
      'banheiro sujo',
      'limo banheiro',
    ],
  },
  '10': {
    superficies: ['azulejo', 'piso', 'cerâmica', 'vaso sanitário'],
    sujeiras: ['limo', 'bactérias', 'manchas', 'mofo leve'],
    palavrasChave: ['limpar banheiro', 'limo', 'desinfetar vaso', 'cloro banheiro'],
  },
  '11': {
    superficies: ['tecido'],
    sujeiras: ['odor', 'sujeira leve'],
    palavrasChave: [
      'lavar roupa de bebê',
      'amaciante bebê',
      'roupa baby',
      'amaciante delicado',
      'roupa de bebê',
    ],
  },
  '12': {
    superficies: ['água', 'piscina'],
    sujeiras: ['algas', 'lodo', 'limo'],
    palavrasChave: ['limpar piscina', 'algas piscina', 'tratar piscina'],
  },
  '13': {
    superficies: ['inox', 'piso industrial', 'cerâmica'],
    sujeiras: ['gordura pesada', 'graxa', 'crosta'],
    palavrasChave: ['cozinha industrial', 'gordura restaurante', 'desengordurante profissional'],
  },
  '14': {
    superficies: ['superfícies hospitalares', 'inox', 'piso'],
    sujeiras: ['bactérias', 'vírus', 'contaminação'],
    palavrasChave: ['limpeza hospitalar', 'clínica', 'desinfecção profissional'],
  },
  '15': {
    superficies: ['rejunte', 'silicone', 'parede', 'teto'],
    sujeiras: ['mofo', 'bolor', 'fungo'],
    palavrasChave: ['tirar mofo', 'mofo banheiro', 'bolor parede', 'mofo box'],
  },
}

export const SEARCH_SUGGESTION_CHIPS = [
  'Gordura',
  'Vidro',
  'Banheiro',
  'Mofo',
  'Limo',
  'Pet',
  'Roupa',
  'Piso',
  'Cozinha',
] as const

export function enrichProduct(product: Product): Product {
  const meta = productSearchMeta[product.id]
  if (!meta) return product
  return {
    ...product,
    superficies: meta.superficies ?? product.superficies,
    sujeiras: meta.sujeiras ?? product.sujeiras,
    palavrasChave: meta.palavrasChave ?? product.palavrasChave,
  }
}
