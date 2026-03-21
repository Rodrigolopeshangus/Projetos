import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../lib/shopify'

const STATUS_MAP = {
  PAID: { label: 'Pago', color: 'text-green-400' },
  PENDING: { label: 'Pendente', color: 'text-yellow-400' },
  REFUNDED: { label: 'Reembolsado', color: 'text-red-400' },
  PARTIALLY_REFUNDED: { label: 'Parcialmente Reembolsado', color: 'text-orange-400' },
}

const FULFIL_MAP = {
  FULFILLED: { label: 'Enviado', color: 'text-green-400' },
  UNFULFILLED: { label: 'A preparar', color: 'text-yellow-400' },
  PARTIALLY_FULFILLED: { label: 'Parcialmente enviado', color: 'text-orange-400' },
  IN_PROGRESS: { label: 'Em trânsito', color: 'text-blue-400' },
}

export default function Account() {
  const { customer, loading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !customer) navigate('/login', { replace: true })
  }, [customer, loading, navigate])

  if (loading) {
    return (
      <main className="flex-1 pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (!customer) return null

  const orders = customer.orders?.edges?.map((e) => e.node) ?? []

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <main className="flex-1 pt-16">
      {/* Header */}
      <div className="border-b border-white/10 bg-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-1">Bem-vindo</p>
            <h1 className="font-serif text-3xl text-white">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-white/40 text-sm mt-1">{customer.email}</p>
          </div>
          <button onClick={handleLogout} className="btn-outline self-start sm:self-auto">
            Sair
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-serif text-2xl text-white mb-2">Histórico de Encomendas</h2>
        <div className="gold-divider mb-8" />

        {orders.length === 0 ? (
          <div className="text-center py-16 border border-white/10">
            <p className="text-white/30 text-sm mb-6">Ainda não fez nenhuma encomenda.</p>
            <Link to="/shop" className="btn-outline">Explorar catálogo</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const fin = STATUS_MAP[order.financialStatus] || { label: order.financialStatus, color: 'text-white/50' }
              const ful = FULFIL_MAP[order.fulfillmentStatus] || { label: order.fulfillmentStatus, color: 'text-white/50' }
              const items = order.lineItems?.edges?.map((e) => e.node) ?? []

              return (
                <details key={order.id} className="group border border-white/10 hover:border-white/20 transition-colors">
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-white font-medium text-sm">Encomenda #{order.orderNumber}</p>
                        <p className="text-white/40 text-xs mt-0.5">
                          {new Date(order.processedAt).toLocaleDateString('pt-PT', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-4">
                        <span className={`text-xs font-medium ${fin.color}`}>{fin.label}</span>
                        <span className="text-white/20">·</span>
                        <span className={`text-xs font-medium ${ful.color}`}>{ful.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gold font-medium">
                        {formatPrice(order.currentTotalPrice.amount, order.currentTotalPrice.currencyCode)}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-white/40 group-open:rotate-180 transition-transform"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>

                  {/* Order lines */}
                  <div className="border-t border-white/10 px-6 py-4 space-y-3">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        {item.variant?.image?.url && (
                          <img src={item.variant.image.url} alt={item.title} className="w-12 h-12 object-cover" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{item.title}</p>
                          <p className="text-white/40 text-xs">Qty: {item.quantity}</p>
                        </div>
                        {item.variant?.price && (
                          <p className="text-white/60 text-sm">
                            {formatPrice(item.variant.price.amount, item.variant.price.currencyCode)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
