import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import Header from '../components/Header'
import SelectOptionCard from '../components/SelectOptionCard'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import RecommendationCard, { RecommendationInfo } from '../components/RecommendationCard'
import {
  ambientes,
  superficies,
  tiposSujeira,
  niveisLimpeza,
  getRecommendation,
  openWhatsApp,
} from '../data/mockData'
import { useCart } from '../context/CartContext'

const ambienteIcons: Record<string, string> = {
  Banheiro: '🚿', Cozinha: '🍳', Lavanderia: '👕', Piscina: '🏊',
  Sala: '🛋️', Quintal: '🌿', Empresa: '🏢', Restaurante: '🍽️',
  Hotel: '🏨', Clínica: '🏥',
}

const superficieIcons: Record<string, string> = {
  Porcelanato: '⬜', Cerâmica: '🔲', Vidro: '🪟', Inox: '🔩',
  Tecido: '🧵', Alumínio: '⚙️', Plástico: '🔵', Pedra: '🪨',
  'Piso antiderrapante': '🟫',
}

const sujeiraIcons: Record<string, string> = {
  Gordura: '🛢️', Mofo: '🍄', Limo: '🟢', Crosta: '🪨',
  Odor: '💨', 'Urina de pet': '🐾', Encardido: '🟤',
  Calcificação: '💎', Poeira: '🌫️', Graxa: '⚫',
}

const steps = ['Ambiente', 'Superfície', 'Sujeira', 'Nível', 'Resultado']

export default function ResolveStain() {
  const [step, setStep] = useState(0)
  const [ambiente, setAmbiente] = useState('')
  const [superficie, setSuperficie] = useState('')
  const [sujeira, setSujeira] = useState('')
  const [nivel, setNivel] = useState('')
  const { addToCart } = useCart()

  const recommendation =
    step === 4 ? getRecommendation(sujeira, nivel, ambiente) : null

  const canNext =
    (step === 0 && ambiente) ||
    (step === 1 && superficie) ||
    (step === 2 && sujeira) ||
    (step === 3 && nivel)

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 0 && step < 4) setStep(step - 1)
    else if (step === 4) setStep(3)
  }

  const handleWhatsApp = () => {
    if (!recommendation) return
    openWhatsApp(
      `Olá! Preciso de ajuda com ${sujeira} em ${ambiente}. Produto recomendado: ${recommendation.principal.nome}`,
    )
  }

  return (
    <div className="animate-fade-in pb-6">
      <Header
        title="Resolva minha sujeira"
        showBack={step > 0 && step < 4}
        onBack={handleBack}
      />

      {step < 4 && (
        <div className="px-4 mb-4">
          <div className="flex items-center gap-1">
            {steps.slice(0, 4).map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-1">
                <div
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i <= step ? 'bg-royal' : 'bg-gray-200'
                  }`}
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Etapa {step + 1} de 4 — {steps[step]}
          </p>
        </div>
      )}

      <div className="px-4 space-y-4">
        {step === 0 && (
          <>
            <h2 className="text-lg font-bold text-dark">Qual ambiente?</h2>
            <div className="grid grid-cols-3 gap-2">
              {ambientes.map((a) => (
                <SelectOptionCard
                  key={a}
                  label={a}
                  icon={ambienteIcons[a]}
                  selected={ambiente === a}
                  onClick={() => setAmbiente(a)}
                />
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-lg font-bold text-dark">Qual superfície?</h2>
            <div className="grid grid-cols-3 gap-2">
              {superficies.map((s) => (
                <SelectOptionCard
                  key={s}
                  label={s}
                  icon={superficieIcons[s]}
                  selected={superficie === s}
                  onClick={() => setSuperficie(s)}
                />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-bold text-dark">Qual sujeira?</h2>
            <div className="grid grid-cols-3 gap-2">
              {tiposSujeira.map((t) => (
                <SelectOptionCard
                  key={t}
                  label={t}
                  icon={sujeiraIcons[t]}
                  selected={sujeira === t}
                  onClick={() => setSujeira(t)}
                />
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-bold text-dark">Nível da limpeza</h2>
            <div className="grid grid-cols-3 gap-3">
              {niveisLimpeza.map((n) => (
                <SelectOptionCard
                  key={n}
                  label={n}
                  selected={nivel === n}
                  onClick={() => setNivel(n)}
                />
              ))}
            </div>
          </>
        )}

        {step === 4 && recommendation && (
          <div className="space-y-4 animate-fade-in">
            <div className="rounded-2xl bg-gradient-to-r from-royal to-sky p-4 text-white">
              <p className="text-sm text-white/70">Recomendação para</p>
              <p className="font-bold">{sujeira} · {ambiente} · {superficie}</p>
              <p className="text-sm text-white/80 mt-1">Nível: {nivel}</p>
            </div>

            <RecommendationCard
              product={recommendation.principal}
              label="Produto recomendado"
              highlight
              onAdd={() => addToCart(recommendation.principal)}
            />
            <RecommendationCard
              product={recommendation.alternativo}
              label="Produto alternativo"
              onAdd={() => addToCart(recommendation.alternativo)}
            />
            <RecommendationCard
              product={recommendation.economico}
              label="Produto mais econômico"
              onAdd={() => addToCart(recommendation.economico)}
            />

            <RecommendationInfo
              comoUsar={recommendation.comoUsar}
              tempoAcao={recommendation.tempoAcao}
              cuidados={recommendation.cuidados}
            />

            <div className="space-y-2 pt-2">
              <PrimaryButton fullWidth onClick={() => addToCart(recommendation.principal)}>
                Adicionar ao pedido
              </PrimaryButton>
              <SecondaryButton fullWidth onClick={handleWhatsApp}>
                <MessageCircle size={18} />
                Enviar pedido no WhatsApp
              </SecondaryButton>
              <SecondaryButton fullWidth onClick={handleBack}>
                Voltar e ajustar
              </SecondaryButton>
            </div>
          </div>
        )}

        {step < 4 && (
          <div className="pt-4">
            <PrimaryButton fullWidth disabled={!canNext} onClick={handleNext}>
              {step === 3 ? 'Ver recomendação' : 'Continuar'}
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  )
}
