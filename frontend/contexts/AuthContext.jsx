import { createContext, useContext, useState, useEffect } from 'react'
import { nestApi } from '../api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  // Cargar usuario y token del localStorage al iniciar y validar
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        try {
          // Configurar token y validar
          nestApi.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
          const response = await nestApi.get('/auth/validate')
          
          if (response.data.success && response.data.valid) {
            setToken(storedToken)
            setUser(response.data.user)
          } else {
            // Token inválido
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            delete nestApi.defaults.headers.common['Authorization']
          }
        } catch (error) {
          // Error al validar, limpiar
          console.error('Error validating token:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          delete nestApi.defaults.headers.common['Authorization']
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      // Llamar a la API de NestJS para autenticación
      const response = await nestApi.post('/auth/login', {
        email,
        password
      })

      if (response.data.success) {
        const { access_token, user: userData } = response.data.data
        
        // Guardar token y usuario
        setToken(access_token)
        setUser(userData)
        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify(userData))
        
        // Configurar el token en axios para futuras peticiones
        nestApi.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        
        return { success: true }
      }
    } catch (error) {
      console.error('Error en login:', error)
      const errorMessage = error.response?.data?.message || 'Credenciales inválidas'
      return { success: false, error: errorMessage }
    }
  }

  const register = async (email, password, name) => {
    try {
      const response = await nestApi.post('/auth/register', {
        email,
        password,
        name
      })

      if (response.data.success) {
        const { access_token, user: userData } = response.data.data
        
        setToken(access_token)
        setUser(userData)
        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify(userData))
        nestApi.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        
        return { success: true }
      }
    } catch (error) {
      console.error('Error en registro:', error)
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario'
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    delete nestApi.defaults.headers.common['Authorization']
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAdmin,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
