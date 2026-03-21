import { createContext, useContext, useState, useEffect } from 'react'
import { customerLogin, customerLogout, getCustomer } from '../lib/shopify'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('hangus_token'))
  const [loading, setLoading] = useState(!!localStorage.getItem('hangus_token'))

  useEffect(() => {
    if (!token) { setLoading(false); return }
    getCustomer(token)
      .then(setCustomer)
      .catch(() => {
        localStorage.removeItem('hangus_token')
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const login = async (email, password) => {
    const accessToken = await customerLogin(email, password)
    localStorage.setItem('hangus_token', accessToken.accessToken)
    setToken(accessToken.accessToken)
    const cust = await getCustomer(accessToken.accessToken)
    setCustomer(cust)
  }

  const logout = async () => {
    if (token) await customerLogout(token)
    localStorage.removeItem('hangus_token')
    setToken(null)
    setCustomer(null)
  }

  return (
    <AuthContext.Provider value={{ customer, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
