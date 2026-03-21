import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/shopify'

export default function CartDrawer() {
  const { isOpen, setIsOpen, lines, total, loading, removeItem, cart } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={() => setIsOpen(false)} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-charcoal flex flex-col animate-slide-in shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="font-serif text-xl text-white">Carrinho</h2>
          <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {lines.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-12">O seu carrinho está vazio.</p>
          ) : (
            lines.map((line) => (
              <div key={line.id} className="flex gap-4">
                {line.merchandise?.product?.featuredImage?.url && (
                  <img
                    src={line.merchandise.product.featuredImage.url}
                    alt={line.merchandise.product.title}
                    className="w-16 h-16 object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{line.merchandise?.product?.title}</p>
                  <p className="text-white/50 text-xs mt-0.5">{line.merchandise?.title}</p>
                  <p className="text-gold text-sm mt-1">
                    {formatPrice(line.merchandise?.price?.amount, line.merchandise?.price?.currencyCode)} × {line.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(line.id)}
                  disabled={loading}
                  className="text-white/30 hover:text-red-400 transition-colors self-start mt-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className="px-6 py-5 border-t border-white/10 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/60 uppercase tracking-wider">Total</span>
              <span className="text-white font-semibold">
                {total ? formatPrice(total.amount, total.currencyCode) : '—'}
              </span>
            </div>
            <a
              href={cart?.checkoutUrl}
              className="btn-gold w-full text-center block"
              target="_blank"
              rel="noreferrer"
            >
              Finalizar Compra
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white text-sm w-full text-center transition-colors"
            >
              Continuar a comprar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
