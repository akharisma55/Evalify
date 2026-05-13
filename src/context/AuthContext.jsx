import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for saved user session
    const savedUser = localStorage.getItem('evalify_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    const userObj = {
      id: 1,
      fullName: userData.fullName || 'Alex Johnson',
      username: userData.username,
      email: userData.email || `${userData.username}@example.com`,
      avatar: null,
      role: 'Job Seeker',
    }
    setUser(userObj)
    localStorage.setItem('evalify_user', JSON.stringify(userObj))
  }

  const register = (userData) => {
    const userObj = {
      id: 1,
      fullName: userData.fullName,
      username: userData.username,
      email: userData.email,
      avatar: null,
      role: 'Job Seeker',
    }
    setUser(userObj)
    localStorage.setItem('evalify_user', JSON.stringify(userObj))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('evalify_user')
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('evalify_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
