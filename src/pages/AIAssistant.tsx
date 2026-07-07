import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'
import Header from '../components/Header'
import { initialChatMessages } from '../data/mockData'
import type { ChatMessage } from '../types'

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages)
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }
    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content:
        'Obrigado pela sua dúvida! Em modo demonstração, recomendo usar "Resolva minha sujeira" para obter recomendações personalizadas. A integração com IA será feita em uma próxima etapa.',
    }
    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput('')
  }

  return (
    <div className="flex flex-col animate-fade-in" style={{ minHeight: 'calc(100dvh - 5rem)' }}>
      <Header title="Assistente Ecoville IA" showBack />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                msg.role === 'user' ? 'bg-royal text-white' : 'bg-green text-white'
              }`}
            >
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-royal text-white rounded-tr-sm'
                  : 'bg-white text-dark shadow-sm rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-20 border-t border-gray-200 bg-white px-4 py-3">
        <p className="mb-2 text-center text-[10px] text-gray-400">
          Assistente em modo demonstração. Integração com IA será feita em uma próxima etapa.
        </p>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua dúvida de limpeza..."
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/20"
          />
          <button
            onClick={handleSend}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-royal text-white transition-transform active:scale-95"
            aria-label="Enviar"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
