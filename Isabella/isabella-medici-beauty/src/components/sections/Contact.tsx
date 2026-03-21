'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Instagram, MapPin, Clock, Phone, Send, Loader2 } from 'lucide-react'

export default function Contact() {
  const t = useTranslations('contact')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    // Placeholder — integrar com email service futuramente
    await new Promise((r) => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
    setName(''); setEmail(''); setMessage('')
    setTimeout(() => setSent(false), 5000)
  }

  const inputClass = "w-full bg-nude-light border border-nude-mid rounded-xl px-4 py-3 text-sm text-brown placeholder-brown/40 focus:outline-none focus:border-ginger/60 transition-colors"

  return (
    <section id="contact" className="py-24 bg-nude">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-ginger mb-3 block">
            {t('follow')}
          </span>
          <h2
            className="text-4xl sm:text-5xl font-light text-brown mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {t('title')}
          </h2>
          <p className="text-brown-mid/70">{t('subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className={inputClass}
                type="text"
                placeholder={t('name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className={inputClass}
                type="email"
                placeholder={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <textarea
                className={`${inputClass} min-h-[140px] resize-none`}
                placeholder={t('message')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              {sent && (
                <p className="text-green-600 text-xs">{t('success')}</p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-ginger hover:bg-ginger-dark text-white py-3.5 rounded-xl text-sm tracking-wide transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                {sending ? t('sending') : t('send')}
              </button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <InfoItem icon={<Clock size={18} className="text-ginger" />} title={t('hours')}>
              <p className="text-sm text-brown-mid/70">{t('schedule')}</p>
            </InfoItem>

            <InfoItem icon={<MapPin size={18} className="text-ginger" />} title={t('address')}>
              <p className="text-sm text-brown-mid/70">
                Endereço a definir<br />
                São Paulo – SP
              </p>
            </InfoItem>

            <InfoItem icon={<Phone size={18} className="text-ginger" />} title="WhatsApp">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ginger hover:underline"
              >
                (11) 99999-9999
              </a>
            </InfoItem>

            <InfoItem icon={<Instagram size={18} className="text-ginger" />} title={t('follow')}>
              <a
                href="https://instagram.com/isabellamedicibeauty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ginger hover:underline"
              >
                @isabellamedicibeauty
              </a>
            </InfoItem>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function InfoItem({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-ginger/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs tracking-widest uppercase text-brown/60 mb-1">{title}</p>
        {children}
      </div>
    </div>
  )
}
