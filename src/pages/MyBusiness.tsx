import { useState } from 'react'
import { Building2, Package } from 'lucide-react'
import Header from '../components/Header'
import Input from '../components/Input'
import PrimaryButton from '../components/PrimaryButton'
import ProductCard from '../components/ProductCard'
import { businessKits, formatPrice } from '../data/mockData'
import { useCart } from '../context/CartContext'

export default function MyBusiness() {
  const [showResult, setShowResult] = useState(false)
  const [selectedKit, setSelectedKit] = useState(0)
  const [form, setForm] = useState({
    cnpj: '12.345.678/0001-90',
    segmento: 'Restaurante',
    funcionarios: '25',
    banheiros: '3',
    area: '200',
    frequencia: 'Diária',
    tipoLimpeza: 'Pesada',
  })
  const { addToCart } = useCart()

  const kit = businessKits[selectedKit]

  const handleGenerate = () => {
    const segmentIndex = businessKits.findIndex((k) =>
      k.nome.toLowerCase().includes(form.segmento.toLowerCase()),
    )
    setSelectedKit(segmentIndex >= 0 ? segmentIndex : 0)
    setShowResult(true)
  }

  const handleAddAll = () => {
    kit.produtos.forEach((p) => addToCart(p))
  }

  return (
    <div className="animate-fade-in pb-6">
      <Header title="Minha Empresa" showBack />

      <div className="px-4 space-y-5">
        {!showResult ? (
          <>
            <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-royal/10 to-yellow/10 p-4">
              <Building2 size={28} className="text-royal" />
              <div>
                <h2 className="font-bold text-dark">Perfil empresarial</h2>
                <p className="text-sm text-gray-500">Sugestão de compra mensal</p>
              </div>
            </div>

            <Input
              label="CNPJ"
              value={form.cnpj}
              onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-dark">Segmento</label>
              <select
                value={form.segmento}
                onChange={(e) => setForm({ ...form, segmento: e.target.value })}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-royal"
              >
                {['Restaurante', 'Escritório', 'Hotel', 'Clínica', 'Indústria'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nº funcionários"
                type="number"
                value={form.funcionarios}
                onChange={(e) => setForm({ ...form, funcionarios: e.target.value })}
              />
              <Input
                label="Nº banheiros"
                type="number"
                value={form.banheiros}
                onChange={(e) => setForm({ ...form, banheiros: e.target.value })}
              />
            </div>

            <Input
              label="Área aproximada (m²)"
              type="number"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-dark">Frequência de limpeza</label>
              <select
                value={form.frequencia}
                onChange={(e) => setForm({ ...form, frequencia: e.target.value })}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-royal"
              >
                {['Diária', 'Semanal', 'Quinzenal'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-dark">Tipo de limpeza</label>
              <div className="grid grid-cols-3 gap-2">
                {['Leve', 'Média', 'Pesada'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, tipoLimpeza: t })}
                    className={`rounded-xl py-3 text-sm font-semibold transition-colors ${
                      form.tipoLimpeza === t
                        ? 'bg-royal text-white'
                        : 'bg-white border border-gray-200 text-dark'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <PrimaryButton fullWidth onClick={handleGenerate}>
              Gerar sugestão de compra mensal
            </PrimaryButton>
          </>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
              {businessKits.map((k, i) => (
                <button
                  key={k.nome}
                  onClick={() => setSelectedKit(i)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                    selectedKit === i
                      ? 'bg-royal text-white'
                      : 'bg-white border border-gray-200 text-dark'
                  }`}
                >
                  {k.nome}
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-royal to-sky p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Package size={20} />
                <h2 className="text-lg font-extrabold">{kit.nome}</h2>
              </div>
              <p className="text-3xl font-extrabold">{formatPrice(kit.custoMensal)}</p>
              <p className="text-sm text-white/70 mt-1">Custo mensal estimado</p>
            </div>

            <section>
              <h3 className="mb-3 font-bold text-dark">Produtos recomendados</h3>
              <div className="space-y-3">
                {kit.produtos.map((p) => (
                  <ProductCard key={p.id} product={p} compact />
                ))}
              </div>
            </section>

            <div className="rounded-2xl bg-yellow/10 p-4">
              <h3 className="font-bold text-dark text-sm mb-1">Sugestão de recompra</h3>
              <p className="text-sm text-gray-600">
                Com base no seu consumo estimado, recomendamos recompra automática a cada 30 dias.
              </p>
            </div>

            <PrimaryButton fullWidth onClick={handleAddAll}>
              Adicionar kit ao carrinho
            </PrimaryButton>
            <button
              onClick={() => setShowResult(false)}
              className="w-full py-2 text-sm font-semibold text-gray-500"
            >
              Ajustar perfil
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
