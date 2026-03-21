import { useTranslations } from 'next-intl'
import { Instagram, Heart } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="bg-brown text-nude-light">
      {/* Map */}
      <div className="w-full h-64 bg-brown-mid opacity-60 grayscale">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197528437985!2d-46.6541!3d-23.5632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzQ3LjUiUyA0NsKwMzknMTQuOCJX!5e0!3m2!1spt!2sbr!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'sepia(0.5) contrast(0.9)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização Isabella Médici Beauty"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <h3
              className="text-2xl font-light text-nude mb-2"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Isabella Médici
              <span className="block text-sm tracking-[0.3em] uppercase text-ginger">Beauty</span>
            </h3>
            <p className="text-xs text-nude-light/50 mt-3 leading-relaxed">
              {t('tagline')}
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-ginger mb-4">Menu</p>
            <div className="space-y-2">
              {[
                ['#about', 'Sobre Mim'],
                ['#services', 'Serviços'],
                ['#booking', 'Agendamento'],
                ['#contact', 'Contato'],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="block text-sm text-nude-light/60 hover:text-ginger transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Social & Contact */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-ginger mb-4">Social</p>
            <a
              href="https://instagram.com/isabellamedicibeauty"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-nude-light/60 hover:text-ginger transition-colors mb-2"
            >
              <Instagram size={15} />
              @isabellamedicibeauty
            </a>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-nude-light/60 hover:text-ginger transition-colors block"
            >
              WhatsApp: (11) 99999-9999
            </a>
          </div>
        </div>

        <div className="border-t border-nude-light/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-nude-light/30">
            © {new Date().getFullYear()} Isabella Médici Beauty. {t('rights')}
          </p>
          <p className="text-xs text-nude-light/20 flex items-center gap-1">
            Feito com <Heart size={10} className="text-ginger" /> por amor à beleza
          </p>
        </div>
      </div>
    </footer>
  )
}
