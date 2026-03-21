'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function About() {
  const t = useTranslations('about')

  return (
    <section id="about" className="py-24 bg-nude-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-nude-mid">
              <Image
                src="https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80"
                alt="Isabella Médici"
                fill
                className="object-cover"
              />
              {/* Overlay accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3"
                style={{ background: 'linear-gradient(to top, rgba(44,26,14,0.3), transparent)' }}
              />
            </div>
            {/* Decorative border */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-ginger/30 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-20 h-20 border-2 border-nude-mid rounded-2xl -z-10" />
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-ginger mb-3 block">
              Isabella Médici Beauty
            </span>
            <h2
              className="text-4xl sm:text-5xl font-light text-brown mb-8 leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {t('title')}
            </h2>

            <div className="space-y-4 text-brown-mid/80 leading-relaxed">
              <p>{t('p1')}</p>
              <p>{t('p2')}</p>
              <p>{t('p3')}</p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mt-10">
              {[t('badge1'), t('badge2'), t('badge3')].map((badge) => (
                <span
                  key={badge}
                  className="text-xs tracking-wide text-ginger bg-ginger/10 border border-ginger/20 px-4 py-2 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
