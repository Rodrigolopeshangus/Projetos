'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, Globe, User, LogOut, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import AuthModal from './auth/AuthModal'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const localeNames: Record<string, string> = { pt: 'PT', en: 'EN', es: 'ES' }
const locales = ['pt', 'en', 'es']

export default function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<{ name: string } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchProfile(data.user.id)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single()
    if (data) setProfile(data)
  }

  function switchLocale(next: string) {
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
    setLangOpen(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUserMenuOpen(false)
  }

  const navLinks = [
    { href: '#about', label: t('about') },
    { href: '#services', label: t('services') },
    { href: '#booking', label: t('booking') },
    { href: '#contact', label: t('contact') },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-nude-light/95 backdrop-blur-md shadow-sm border-b border-nude-mid'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex flex-col leading-tight group">
            <span
              className="text-xl font-bold text-brown tracking-wide"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Isabella Médici
            </span>
            <span className="text-[10px] tracking-[0.25em] text-ginger uppercase">
              Beauty
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-brown-mid hover:text-ginger transition-colors tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-xs text-brown-mid hover:text-ginger transition-colors px-2 py-1"
              >
                <Globe size={14} />
                {localeNames[locale]}
                <ChevronDown size={12} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-8 bg-nude-light border border-nude-mid rounded-lg shadow-lg overflow-hidden min-w-[80px]">
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLocale(l)}
                      className={cn(
                        'w-full text-left px-4 py-2 text-xs hover:bg-nude-mid transition-colors',
                        l === locale ? 'text-ginger font-semibold' : 'text-brown-mid'
                      )}
                    >
                      {localeNames[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-nude-mid hover:bg-ginger hover:text-white text-brown-mid transition-all px-3 py-1.5 rounded-full text-xs"
                >
                  <User size={14} />
                  {profile?.name?.split(' ')[0] ?? 'Perfil'}
                  <ChevronDown size={12} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-10 bg-nude-light border border-nude-mid rounded-lg shadow-lg overflow-hidden min-w-[140px]">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-xs text-brown-mid hover:bg-nude-mid flex items-center gap-2"
                    >
                      <LogOut size={13} />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModal('login')}
                className="bg-ginger hover:bg-ginger-dark text-white text-xs px-4 py-2 rounded-full transition-colors tracking-wide"
              >
                {t('login')}
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-brown-mid"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden bg-nude-light border-t border-nude-mid px-4 py-4 flex flex-col gap-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-brown-mid hover:text-ginger transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Auth modal */}
      {authModal && (
        <AuthModal
          initial={authModal}
          onClose={() => setAuthModal(null)}
        />
      )}
    </>
  )
}
