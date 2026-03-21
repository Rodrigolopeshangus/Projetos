import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, customer } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Already logged in
  if (customer) {
    navigate('/account', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/account')
    } catch (err) {
      setError(err.message || 'Email ou password incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 pt-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-2">Área Privada</p>
          <h1 className="font-serif text-3xl text-white">Entrar na conta</h1>
          <div className="gold-divider mx-auto mt-4" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-charcoal border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder="o.seu@email.com"
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-charcoal border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-gold w-full mt-2 disabled:opacity-50">
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <p className="text-white/30 text-sm text-center mt-6">
          Não tem conta?{' '}
          <a
            href="https://TUALOJA.myshopify.com/account/register"
            target="_blank"
            rel="noreferrer"
            className="text-gold hover:underline"
          >
            Registar no Shopify
          </a>
        </p>

        <p className="text-white/20 text-xs text-center mt-4">
          <a
            href="https://TUALOJA.myshopify.com/account/login#recover"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white/40 transition-colors"
          >
            Esqueceu a password?
          </a>
        </p>
      </div>
    </main>
  )
}
