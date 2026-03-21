'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Send, Loader2, Bot, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

type Message = {
  id: string
  role: 'assistant' | 'user'
  content: string
}

export default function Chatbot() {
  const t = useTranslations('chat')
  const locale = useLocale()
  const supabase = createClient()
  const bottomRef = useRef<HTMLDivElement>(null)

  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<{ name: string; phone: string } | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user
      setUser(u)
      if (u) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('name, phone')
          .eq('id', u.id)
          .single()
        setProfile(prof)
        const firstName = prof?.name?.split(' ')[0] ?? 'você'
        setMessages([{
          id: '0',
          role: 'assistant',
          content: t('welcome', { name: firstName }),
        }])
      } else {
        setMessages([{ id: '0', role: 'assistant', content: t('welcomeGuest') }])
      }
      setInitialized(true)
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading || !user) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          locale,
          userName: profile?.name,
          userPhone: profile?.phone,
        }),
      })

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + 'a', role: 'assistant', content: data.reply },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + 'e', role: 'assistant', content: 'Desculpe, ocorreu um erro. Tente novamente.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[520px] bg-nude-light border border-nude-mid rounded-2xl overflow-hidden shadow-sm">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-nude border-b border-nude-mid">
        <div className="w-8 h-8 rounded-full bg-ginger flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-brown">{t('title')}</p>
          <p className="text-[10px] text-brown-mid/50">Isabella Médici Beauty</p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-green-400" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'assistant' ? 'bg-ginger/10' : 'bg-nude-mid'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <Bot size={14} className="text-ginger" />
                ) : (
                  <User size={14} className="text-brown-mid" />
                )}
              </div>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-nude text-brown-mid rounded-tl-none'
                    : 'bg-ginger text-white rounded-tr-none'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-ginger/10 flex items-center justify-center">
              <Bot size={14} className="text-ginger" />
            </div>
            <div className="bg-nude px-4 py-3 rounded-2xl rounded-tl-none">
              <Loader2 size={14} className="animate-spin text-ginger" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-3 px-4 py-4 border-t border-nude-mid bg-nude">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={user ? t('placeholder') : 'Faça login para agendar'}
          disabled={!user || loading}
          className="flex-1 bg-nude-light border border-nude-mid rounded-xl px-4 py-2.5 text-sm text-brown placeholder-brown/30 focus:outline-none focus:border-ginger/50 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!user || loading || !input.trim()}
          className="bg-ginger hover:bg-ginger-dark text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
