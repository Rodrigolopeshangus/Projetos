import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const { quantity, setIsOpen } = useCart()
  const { customer } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-serif text-2xl text-white tracking-widest hover:text-gold transition-colors">
            HANGUS
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[['/', 'Início'], ['/shop', 'Catálogo']].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `text-sm tracking-widest uppercase transition-colors ${
                    isActive ? 'text-gold' : 'text-white/70 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              to={customer ? '/account' : '/login'}
              className="text-white/70 hover:text-gold transition-colors hidden md:block"
              title={customer ? `Olá, ${customer.firstName}` : 'Entrar'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              className="relative text-white/70 hover:text-gold transition-colors"
              aria-label="Carrinho"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {quantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {quantity}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-white/70 hover:text-white"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-charcoal border-t border-white/10 px-4 py-4 flex flex-col gap-4">
            {[['/', 'Início'], ['/shop', 'Catálogo'], [customer ? '/account' : '/login', customer ? 'A minha conta' : 'Entrar']].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className="text-sm tracking-widest uppercase text-white/70 hover:text-gold transition-colors"
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  )
}
