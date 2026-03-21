'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import { services } from '@/lib/data/services'
import { cn } from '@/lib/utils'

type Category = 'all' | 'cilios' | 'sobrancelhas'

export default function Services() {
  const t = useTranslations('services')
  const locale = useLocale() as 'pt' | 'en' | 'es'
  const [active, setActive] = useState<Category>('all')

  const filtered = active === 'all' ? services : services.filter((s) => s.category === active)

  const tabs: { key: Category; label: string }[] = [
    { key: 'all', label: t('all') },
    { key: 'cilios', label: t('lashes') },
    { key: 'sobrancelhas', label: t('brows') },
  ]

  return (
    <section id="services" className="py-24 bg-nude">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-ginger mb-3 block">Menu</span>
          <h2
            className="text-4xl sm:text-5xl font-light text-brown mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {t('title')}
          </h2>
          <p className="text-brown-mid/70 max-w-md mx-auto">{t('subtitle')}</p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={cn(
                'px-6 py-2 rounded-full text-sm tracking-wide transition-all duration-300',
                active === tab.key
                  ? 'bg-ginger text-white shadow-md'
                  : 'bg-nude-light text-brown-mid hover:bg-nude-mid border border-nude-mid'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="bg-nude-light rounded-2xl overflow-hidden border border-nude-mid hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 bg-nude-mid overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name[locale]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-nude-light/90 backdrop-blur-sm text-ginger text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">
                    {service.category === 'cilios' ? t('lashes') : t('brows')}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3
                    className="text-lg font-medium text-brown mb-1"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {service.name[locale]}
                  </h3>
                  <p className="text-xs text-brown-mid/70 mb-4 leading-relaxed">
                    {service.description[locale]}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-brown-mid/60 text-xs">
                      <Clock size={12} />
                      {service.duration} {t('duration')}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-ginger/70 block">{t('from')}</span>
                      <span className="text-lg font-semibold text-ginger" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        R$ {service.price}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
