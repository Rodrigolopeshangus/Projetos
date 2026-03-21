import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductByHandle, formatPrice } from '../lib/shopify'
import { useCart } from '../context/CartContext'

export default function Product() {
  const { handle } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    setLoading(true)
    getProductByHandle(handle)
      .then((p) => {
        setProduct(p)
        setSelectedVariant(p?.variants?.edges?.[0]?.node ?? null)
      })
      .finally(() => setLoading(false))
  }, [handle])

  const images = product?.images?.edges?.map((e) => e.node) ?? []
  const variants = product?.variants?.edges?.map((e) => e.node) ?? []

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    setAdding(true)
    try {
      await addItem(selectedVariant.id)
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-charcoal animate-pulse" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => <div key={i} className="w-16 h-16 bg-charcoal animate-pulse" />)}
            </div>
          </div>
          <div className="space-y-4 py-8">
            <div className="h-8 bg-charcoal animate-pulse w-3/4" />
            <div className="h-6 bg-charcoal animate-pulse w-1/3" />
            <div className="h-20 bg-charcoal animate-pulse" />
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="flex-1 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">Produto não encontrado.</p>
          <Link to="/shop" className="btn-outline">Voltar ao catálogo</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 pt-16">
      {/* Breadcrumb */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-white/40">
          <Link to="/" className="hover:text-white transition-colors">Início</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white transition-colors">Catálogo</Link>
          <span>/</span>
          <span className="text-white/70">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden bg-charcoal">
            {images[activeImage]?.url ? (
              <img
                src={images[activeImage].url}
                alt={images[activeImage].altText || product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">
                Sem imagem
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-colors ${
                    activeImage === i ? 'border-gold' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="animate-fade-in">
          {product.tags?.length > 0 && (
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">
              {product.tags.slice(0, 2).join(' · ')}
            </p>
          )}

          <h1 className="font-serif text-3xl md:text-4xl text-white mb-4">{product.title}</h1>

          {selectedVariant && (
            <p className="text-2xl text-gold font-light mb-6">
              {formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
              <span className="text-white/30 text-sm ml-2">/ unidade</span>
            </p>
          )}

          {/* Variants */}
          {variants.length > 1 && (
            <div className="mb-6">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
                {variants[0].selectedOptions?.[0]?.name || 'Variante'}
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={!v.availableForSale}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      selectedVariant?.id === v.id
                        ? 'border-gold bg-gold text-black'
                        : v.availableForSale
                        ? 'border-white/20 text-white hover:border-white'
                        : 'border-white/10 text-white/20 cursor-not-allowed line-through'
                    }`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={adding || !selectedVariant?.availableForSale}
              className="btn-gold flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? 'A adicionar...' : selectedVariant?.availableForSale ? 'Adicionar ao Carrinho' : 'Esgotado'}
            </button>
          </div>

          {/* Trust badges */}
          <div className="border-t border-white/10 pt-6 space-y-3">
            {[
              ['❄️', 'Entregue em embalagem isotérmica'],
              ['✅', 'Selecionado por especialistas'],
              ['🔒', 'Pagamento 100% seguro via Shopify'],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3 text-white/50 text-sm">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          {product.descriptionHtml && (
            <div
              className="mt-8 prose prose-invert prose-sm text-white/60 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
        </div>
      </div>
    </main>
  )
}
