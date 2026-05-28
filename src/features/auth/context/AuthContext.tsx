import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { JwtPayload } from '../../../services/interfaces'

interface AuthContextType {
  token: string | null
  payload: JwtPayload | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'authToken'

function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64 = token.split('.')[1]
    if (!base64) return null
    const binary = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    const json = new TextDecoder('utf-8').decode(bytes)
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const navigate = useNavigate()

  const payload = useMemo<JwtPayload | null>(() => {
    if (!token) return null
    return decodeJwt(token)
  }, [token])

  const login = (newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
    navigate('/', { replace: true })
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    navigate('/login', { replace: true })
  }

  return (
    <AuthContext.Provider value={{ token, payload, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
