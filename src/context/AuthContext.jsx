import React, { createContext, useState, useCallback, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('inaestudio_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = useCallback((usuario, clave) => {
    if (usuario === 'ADMIN' && clave === '1549') {
      const adminUser = { rol: 'admin', usuario: 'ADMIN' }
      setUser(adminUser)
      localStorage.setItem('inaestudio_user', JSON.stringify(adminUser))
      return { success: true, user: adminUser }
    }
    return { success: false, error: 'Credenciales inválidas' }
  }, [])

  const loginProfesional = useCallback((usuario, clave) => {
    if (clave === '1234') {
      const profesionalUser = { rol: 'profesional', usuario, nombre: usuario.replace(/\d+$/, '') }
      setUser(profesionalUser)
      localStorage.setItem('inaestudio_user', JSON.stringify(profesionalUser))
      return { success: true, user: profesionalUser }
    }
    return { success: false, error: 'Clave incorrecta' }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('inaestudio_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, loginProfesional, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
