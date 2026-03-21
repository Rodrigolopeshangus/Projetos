import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/shopify'

export default function ProductCard({ product }) {
  const { handle, title, priceRange, featuredImage } = product
  const price = priceRange?.minVariantPrice

  return (
    <Link to={`/product/${handle}`} className="group card-hover block">
      <div className="aspect-square overflow-hidden bg-charcoal">
        {featuredImage?.url ? (
          <img
            src={featuredImage.url}
            alt={featuredImage.altText || title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        )}
      </div>

      <div className="pt-4 pb-2">
        <h3 className="text-white text-sm font-medium tracking-wide group-hover:text-gold transition-colors">
          {title}
        </h3>
        {price && (
          <p className="text-gold text-sm mt-1">
            {formatPrice(price.amount, price.currencyCode)}
          </p>
        )}
      </div>
    </Link>
  )
}
