import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // Si no hay usuario, redirigir al login
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin()) {
    // Si requiere admin pero no lo es, redirigir a home
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="card p-12 max-w-md text-center shadow-soft">
          <div className="text-8xl mb-6">🚫</div>
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-3">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            No tienes permisos para acceder a esta sección. Solo los administradores pueden ver esta página.
          </p>
          <a href="/" className="btn-primary inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
