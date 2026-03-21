import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCollections } from '../lib/shopify'
import ProductCard from '../components/ProductCard'

function HeroBanner() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

      {/* Decorative lines */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-px h-32 bg-gold/30 hidden lg:block" />
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-px h-32 bg-gold/30 hidden lg:block" />

      <div className="relative z-10 text-center px-4 animate-fade-in">
        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-6">Qualidade Excepcional</p>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-white leading-tight mb-6">
          Carne Premium,<br />
          <span className="text-gold">Entregue em Casa</span>
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Seleção rigorosa das melhores peças, do pasto à sua mesa. Qualidade de talho especializado.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shop" className="btn-gold">
            Ver Catálogo
          </Link>
          <Link to="/shop?q=destaque" className="btn-outline">
            Destaques do Chef
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  )
}

function CategoryCard({ collection }) {
  return (
    <Link to={`/shop?collection=${collection.handle}`} className="group relative overflow-hidden aspect-[4/3] bg-charcoal card-hover">
      {collection.image?.url ? (
        <img
          src={collection.image.url}
          alt={collection.image.altText || collection.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full bg-charcoal" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="font-serif text-xl text-white mb-1">{collection.title}</h3>
        <span className="text-gold text-xs tracking-widest uppercase">Explorar →</span>
      </div>
    </Link>
  )
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getProducts({ first: 4, query: 'tag:destaque' })
        .then((data) => setFeaturedProducts(data.edges.map((e) => e.node)))
        .catch(() => getProducts({ first: 4 }).then((data) => setFeaturedProducts(data.edges.map((e) => e.node)))),
      getCollections().then(setCollections),
    ]).finally(() => setLoading(false))
  }, [])

  return (
    <main className="flex-1">
      <HeroBanner />

      {/* Values strip */}
      <section className="border-y border-white/10 bg-charcoal">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ['🥩', 'Seleção Rigorosa'],
            ['❄️', 'Frio até à porta'],
            ['⭐', 'Qualidade Premium'],
            ['🚚', 'Entrega Rápida'],
          ].map(([icon, label]) => (
            <div key={label}>
              <span className="text-2xl block mb-1">{icon}</span>
              <p className="text-white/60 text-xs tracking-widest uppercase">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {collections.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="section-title">Categorias</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.slice(0, 3).map((c) => <CategoryCard key={c.id} collection={c} />)}
          </div>
        </section>
      )}

      {/* Chef's picks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-2">Seleção Especial</p>
          <h2 className="section-title">Destaques do Chef</h2>
          <div className="gold-divider mx-auto" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-charcoal animate-pulse" />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-white/30 text-center text-sm">Configure o seu Shopify para ver produtos aqui.</p>
        )}

        <div className="text-center mt-12">
          <Link to="/shop" className="btn-outline">
            Ver todos os produtos
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gold/10 border-y border-gold/20 py-16 text-center px-4">
        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Experiência Única</p>
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Pronto para elevar a sua mesa?</h2>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          Descubra a diferença de uma carne verdadeiramente premium, selecionada por especialistas.
        </p>
        <Link to="/shop" className="btn-gold">
          Comprar Agora
        </Link>
      </section>
    </main>
  )
}
