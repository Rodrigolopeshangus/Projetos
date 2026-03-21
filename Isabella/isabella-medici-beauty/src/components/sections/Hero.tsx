'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF4EE 0%, #F5EDE3 50%, #E8D5C4 100%)' }}
    >
      {/* Decorative circles */}
      <div
        className="absolute top-20 right-10 w-80 h-80 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #B5541A, transparent)' }}
      />
      <div
        className="absolute bottom-20 left-10 w-60 h-60 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #2C1A0E, transparent)' }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          {/* Badge */}
          <span
            className="inline-block text-xs tracking-[0.3em] uppercase text-ginger border border-ginger/40 px-4 py-1.5 rounded-full mb-6"
          >
            {t('subtitle')}
          </span>

          {/* Title */}
          <h1
            className="text-5xl sm:text-7xl font-light text-brown mb-4 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Isabella
            <br />
            <span className="italic text-ginger">Médici</span> Beauty
          </h1>

          {/* Tagline */}
          <p className="text-lg text-brown-mid/70 tracking-wide mb-10 max-w-md mx-auto">
            {t('tagline')}
          </p>

          {/* CTA */}
          <a
            href="#booking"
            className="inline-block bg-ginger hover:bg-ginger-dark text-white text-sm tracking-widest uppercase px-10 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            {t('cta')}
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-px h-12 bg-ginger/40" />
        </motion.div>
      </div>
    </section>
  )
}
