'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import Chatbot from '@/components/chat/Chatbot'
import AuthModal from '@/components/auth/AuthModal'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Booking() {
  const t = useTranslations('booking')
  const [user, setUser] = useState<User | null>(null)
  const [authModal, setAuthModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <>
      <section id="booking" className="py-24 bg-nude-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-ginger mb-3 block">
              Online
            </span>
            <h2
              className="text-4xl sm:text-5xl font-light text-brown mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {t('title')}
            </h2>
            <p className="text-brown-mid/70 max-w-md mx-auto">{t('subtitle')}</p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {user ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Chatbot />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center py-16 bg-nude rounded-2xl border border-nude-mid"
              >
                <div className="w-16 h-16 rounded-full bg-ginger/10 flex items-center justify-center mx-auto mb-5">
                  <LogIn size={24} className="text-ginger" />
                </div>
                <h3 className="text-xl text-brown mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {t('loginRequired')}
                </h3>
                <p className="text-sm text-brown-mid/60 mb-6">
                  Precisamos do seu nome e WhatsApp para confirmar o agendamento.
                </p>
                <button
                  onClick={() => setAuthModal(true)}
                  className="bg-ginger hover:bg-ginger-dark text-white px-8 py-3 rounded-full text-sm tracking-wide transition-colors"
                >
                  {t('loginBtn')}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {authModal && <AuthModal initial="login" onClose={() => setAuthModal(false)} />}
    </>
  )
}
