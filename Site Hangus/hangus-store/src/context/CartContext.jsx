import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createCart, addToCart, getCart, removeFromCart } from '../lib/shopify'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [cartId, setCartId] = useState(() => localStorage.getItem('hangus_cart_id'))
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Load existing cart on mount
  useEffect(() => {
    if (cartId) {
      getCart(cartId)
        .then(setCart)
        .catch(() => {
          localStorage.removeItem('hangus_cart_id')
          setCartId(null)
        })
    }
  }, [cartId])

  const ensureCart = useCallback(async () => {
    if (cartId) return cartId
    const newCart = await createCart()
    localStorage.setItem('hangus_cart_id', newCart.id)
    setCartId(newCart.id)
    return newCart.id
  }, [cartId])

  const addItem = useCallback(async (merchandiseId, quantity = 1) => {
    setLoading(true)
    try {
      const id = await ensureCart()
      const updated = await addToCart(id, merchandiseId, quantity)
      setCart(updated)
      setIsOpen(true)
    } finally {
      setLoading(false)
    }
  }, [ensureCart])

  const removeItem = useCallback(async (lineId) => {
    if (!cartId) return
    setLoading(true)
    try {
      const updated = await removeFromCart(cartId, lineId)
      setCart(updated)
    } finally {
      setLoading(false)
    }
  }, [cartId])

  const lines = cart?.lines?.edges?.map((e) => e.node) ?? []
  const quantity = cart?.totalQuantity ?? 0
  const total = cart?.cost?.totalAmount

  return (
    <CartContext.Provider value={{ cart, lines, quantity, total, loading, isOpen, setIsOpen, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
