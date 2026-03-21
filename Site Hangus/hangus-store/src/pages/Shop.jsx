import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../lib/shopify'
import ProductCard from '../components/ProductCard'

const CATEGORIES = [
  { label: 'Todos', query: '' },
  { label: 'Novilho', query: 'tag:novilho' },
  { label: 'Wagyu', query: 'tag:wagyu' },
  { label: 'Dry Aged', query: 'tag:dry-aged' },
  { label: 'Borrego', query: 'tag:borrego' },
  { label: 'Porco', query: 'tag:porco' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [pageInfo, setPageInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [search, setSearch] = useState('')

  const activeQuery = searchParams.get('q') || ''

  const load = useCallback(async (query = '', after = null, append = false) => {
    if (append) setLoadingMore(true); else setLoading(true)
    try {
      const data = await getProducts({ first: 12, after, query })
      const newProducts = data.edges.map((e) => e.node)
      setProducts((prev) => append ? [...prev, ...newProducts] : newProducts)
      setPageInfo(data.pageInfo)
    } finally {
      if (append) setLoadingMore(false); else setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(activeQuery)
  }, [activeQuery, load])

  const handleFilter = (query) => {
    setSearchParams(query ? { q: query } : {})
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams(search ? { q: `title:${search}*` } : {})
  }

  return (
    <main className="flex-1 pt-16">
      {/* Header */}
      <div className="border-b border-white/10 bg-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-2">Seleção Completa</p>
          <h1 className="font-serif text-4xl text-white">Catálogo</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar produto..."
              className="bg-charcoal border border-white/20 text-white placeholder-white/30 px-4 py-2 text-sm focus:outline-none focus:border-gold transition-colors w-56"
            />
            <button type="submit" className="btn-gold py-2 px-4 text-xs">
              Pesquisar
            </button>
          </form>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 md:ml-auto">
            {CATEGORIES.map(({ label, query }) => (
              <button
                key={label}
                onClick={() => handleFilter(query)}
                className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
                  activeQuery === query
                    ? 'border-gold bg-gold text-black'
                    : 'border-white/20 text-white/60 hover:border-white hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-charcoal animate-pulse" />
                <div className="h-3 bg-charcoal animate-pulse w-3/4" />
                <div className="h-3 bg-charcoal animate-pulse w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-white/30 text-sm">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>

            {pageInfo?.hasNextPage && (
              <div className="text-center mt-12">
                <button
                  onClick={() => load(activeQuery, pageInfo.endCursor, true)}
                  disabled={loadingMore}
                  className="btn-outline"
                >
                  {loadingMore ? 'A carregar...' : 'Carregar mais'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
