'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type View = 'login' | 'register' | 'forgot'

export default function AuthModal({
  initial,
  onClose,
}: {
  initial: 'login' | 'register'
  onClose: () => void
}) {
  const t = useTranslations('auth')
  const [view, setView] = useState<View>(initial)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  function reset() {
    setError('')
    setSuccess('')
    setLoading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    reset()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    onClose()
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    reset()
    if (password !== confirm) { setError('As senhas não coincidem.'); return }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name,
        phone,
        email,
      })
    }
    onClose()
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    reset()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(t('emailSent'))
    setLoading(false)
  }

  const inputClass = "w-full bg-nude border border-nude-mid rounded-xl px-4 py-3 text-sm text-brown placeholder-brown/40 focus:outline-none focus:border-ginger/60 transition-colors"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brown/30 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-nude-light rounded-2xl shadow-xl w-full max-w-md p-8 z-10"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brown-mid/50 hover:text-brown transition-colors"
        >
          <X size={18} />
        </button>

        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Title label={t('loginTitle')} sub={t('loginSubtitle')} />
              <form onSubmit={handleLogin} className="space-y-4">
                <input className={inputClass} type="email" placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)} required />
                <div className="relative">
                  <input className={inputClass} type={showPass ? 'text' : 'password'} placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-brown-mid/40 hover:text-brown-mid">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button type="button" onClick={() => { setView('forgot'); reset() }} className="text-xs text-ginger hover:underline">
                  {t('forgotPassword')}
                </button>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <SubmitBtn loading={loading} label={t('login')} loadingLabel={t('logging')} />
              </form>
              <p className="text-center text-xs text-brown-mid/60 mt-5">
                {t('noAccount')}{' '}
                <button onClick={() => { setView('register'); reset() }} className="text-ginger hover:underline">
                  {t('register')}
                </button>
              </p>
            </motion.div>
          )}

          {view === 'register' && (
            <motion.div key="register" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Title label={t('registerTitle')} sub={t('registerSubtitle')} />
              <form onSubmit={handleRegister} className="space-y-4">
                <input className={inputClass} type="text" placeholder={t('name')} value={name} onChange={e => setName(e.target.value)} required />
                <input className={inputClass} type="email" placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)} required />
                <input className={inputClass} type="tel" placeholder={t('phone')} value={phone} onChange={e => setPhone(e.target.value)} required />
                <div className="relative">
                  <input className={inputClass} type={showPass ? 'text' : 'password'} placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-brown-mid/40 hover:text-brown-mid">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <input className={inputClass} type={showPass ? 'text' : 'password'} placeholder={t('confirmPassword')} value={confirm} onChange={e => setConfirm(e.target.value)} required />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <SubmitBtn loading={loading} label={t('register')} loadingLabel={t('registering')} />
              </form>
              <p className="text-center text-xs text-brown-mid/60 mt-5">
                {t('hasAccount')}{' '}
                <button onClick={() => { setView('login'); reset() }} className="text-ginger hover:underline">
                  {t('login')}
                </button>
              </p>
            </motion.div>
          )}

          {view === 'forgot' && (
            <motion.div key="forgot" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Title label={t('forgotTitle')} sub={t('forgotSubtitle')} />
              <form onSubmit={handleForgot} className="space-y-4">
                <input className={inputClass} type="email" placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)} required />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                {success && <p className="text-green-600 text-xs">{success}</p>}
                <SubmitBtn loading={loading} label={t('sendLink')} loadingLabel="Enviando..." />
              </form>
              <p className="text-center text-xs text-brown-mid/60 mt-5">
                <button onClick={() => { setView('login'); reset() }} className="text-ginger hover:underline">
                  {t('backToLogin')}
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function Title({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="mb-7">
      <h2 className="text-2xl font-light text-brown mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        {label}
      </h2>
      <p className="text-xs text-brown-mid/60">{sub}</p>
    </div>
  )
}

function SubmitBtn({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-ginger hover:bg-ginger-dark text-white py-3 rounded-xl text-sm tracking-wide transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {loading ? loadingLabel : label}
    </button>
  )
}
