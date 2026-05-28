import { createContext, useContext, useState, ReactNode } from 'react'
import { authAPI } from '@/services/api'

interface User {
  id: string
  email: string
  fullName?: string
  full_name?: string
  name?: string
  role?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function normalizeUser(raw: any): User {
  return {
    ...raw,
    fullName: raw?.fullName || raw?.full_name || raw?.name || '',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('auth_token'),
  )

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email: string, password: string) => {
    const data = await authAPI.login(email, password)
    const normalizedUser = normalizeUser(data.user)

    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('user', JSON.stringify(normalizedUser))
    setIsAuthenticated(true)
    setUser(normalizedUser)
  }

  const register = async (email: string, password: string, fullName: string) => {
    const data = await authAPI.register(email, password, fullName)
    const normalizedUser = normalizeUser(data.user)

    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('user', JSON.stringify(normalizedUser))
    setIsAuthenticated(true)
    setUser(normalizedUser)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}