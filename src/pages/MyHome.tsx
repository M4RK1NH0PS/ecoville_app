import { useState } from 'react'
import { Home, CheckCircle2 } from 'lucide-react'
import Header from '../components/Header'
import Input from '../components/Input'
import PrimaryButton from '../components/PrimaryButton'
import ProductCard from '../components/ProductCard'
import { homeKitProducts } from '../data/mockData'
import { useCart } from '../context/CartContext'

export default function MyHome() {
  const [showResult, setShowResult] = useState(false)
  const [form, setForm] = useState({
    banheiros: '2',
    pet: false,
    crianca: true,
    piscina: false,
    tipoPiso: 'Porcelanato',
    frequencia: 'Semanal',
  })
  const { addToCart } = useCart()

  const handleGenerate = () => setShowResult(true)

  const handleAddAll = () => {
    homeKitProducts.forEach((p) => addToCart(p))
  }

  return (
    <div className="animate-fade-in pb-6">
      <Header title="Minha Casa" showBack />

      <div className="px-4 space-y-5">
        {!showResult ? (
          <>
            <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sky/10 to-royal/10 p-4">
              <Home size={28} className="text-royal" />
              <div>
                <h2 className="font-bold text-dark">Perfil doméstico</h2>
                <p className="text-sm text-gray-500">Monte seu kit ideal de limpeza</p>
              </div>
            </div>

            <Input
              label="Quantidade de banheiros"
              type="number"
              min={1}
              value={form.banheiros}
              onChange={(e) => setForm({ ...form, banheiros: e.target.value })}
            />

            <ToggleField
              label="Tem pet?"
              value={form.pet}
              onChange={(v) => setForm({ ...form, pet: v })}
            />
            <ToggleField
              label="Tem criança?"
              value={form.crianca}
              onChange={(v) => setForm({ ...form, crianca: v })}
            />
            <ToggleField
              label="Tem piscina?"
              value={form.piscina}
              onChange={(v) => setForm({ ...form, piscina: v })}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-dark">Tipo de piso</label>
              <select
                value={form.tipoPiso}
                onChange={(e) => setForm({ ...form, tipoPiso: e.target.value })}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-royal"
              >
                {['Porcelanato', 'Cerâmica', 'Madeira', 'Laminado', 'Pedra'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-dark">Frequência de limpeza</label>
              <select
                value={form.frequencia}
                onChange={(e) => setForm({ ...form, frequencia: e.target.value })}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-royal"
              >
                {['Diária', 'Semanal', 'Quinzenal', 'Mensal'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <PrimaryButton fullWidth onClick={handleGenerate}>
              Gerar kit ideal da casa
            </PrimaryButton>
          </>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="rounded-2xl bg-gradient-to-r from-green/10 to-sky/10 p-5 text-center">
              <CheckCircle2 size={40} className="mx-auto text-green mb-2" />
              <h2 className="text-xl font-extrabold text-dark">Kit Casa Essencial</h2>
              <p className="text-sm text-gray-500 mt-1">
                {form.banheiros} banheiro(s) · {form.tipoPiso} · Limpeza {form.frequencia.toLowerCase()}
                {form.pet && ' · Com pet'}
                {form.crianca && ' · Com criança'}
              </p>
            </div>

            <div className="space-y-3">
              {homeKitProducts.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
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

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
      <span className="text-sm font-semibold text-dark">{label}</span>
      <div className="flex gap-2">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            onClick={() => onChange(v)}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
              value === v
                ? 'bg-royal text-white'
                : 'bg-bg text-gray-500 hover:bg-gray-200'
            }`}
          >
            {v ? 'Sim' : 'Não'}
          </button>
        ))}
      </div>
    </div>
  )
}
