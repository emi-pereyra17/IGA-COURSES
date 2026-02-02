import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { nestApi } from '../api'
import { useAuth } from '../contexts/AuthContext'

// Función para obtener la imagen del curso según su nombre
const getCourseImage = (courseName) => {
  const name = courseName?.toLowerCase() || ''
  
  if (name.includes('italia') || name.includes('italiano')) {
    return '/italia.jpg'
  } else if (name.includes('francia') || name.includes('francés') || name.includes('frances')) {
    return '/francia.webp'
  } else if (name.includes('perú') || name.includes('peru') || name.includes('peruano')) {
    return '/peru.avif'
  }
  
  // Imagen por defecto si no coincide con ninguna
  return '/italia.jpg'
}

function MyCourses() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Redirigir al login si no está autenticado
    if (!user) {
      navigate('/login')
      return
    }
    
    fetchMyCourses()
  }, [user, navigate])

  const fetchMyCourses = async () => {
    if (!user?.email) return

    setLoading(true)
    setError(null)

    try {
      const response = await nestApi.get(`/purchases/${user.email}`)
      setPurchases(response.data.data || response.data)
    } catch (err) {
      // Si el error es 404 (no encontrado), significa que no tiene compras
      // En ese caso, no mostramos error, solo dejamos el array vacío
      if (err.response?.status === 404) {
        setPurchases([])
      } else {
        // Para otros errores (500, etc), sí mostramos el mensaje de error
        setError(err.response?.data?.message || 'Error al cargar tus cursos.')
        console.error('Error fetching purchases:', err)
        setPurchases([])
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString('es-ES', options)
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Cargando tus cursos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header con información del usuario */}
      <div className="mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 sm:p-4 rounded-2xl shadow-lg">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-1">
                Mi Biblioteca de Cursos
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Bienvenido, <span className="font-semibold text-gray-900">{user.name}</span>
              </p>
            </div>
          </div>

          {/* Botón de actualizar */}
          <button
            onClick={fetchMyCourses}
            className="btn-secondary flex items-center gap-2 self-start md:self-auto"
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="card p-5 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-blue-600 text-xs font-medium uppercase tracking-wider">Cursos</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-900">{purchases.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-5 sm:p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 border-2 border-secondary-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-secondary-500 p-2 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-secondary-600 text-xs font-medium uppercase tracking-wider">Completados</p>
                <p className="text-2xl sm:text-3xl font-bold text-secondary-900">0</p>
              </div>
            </div>
          </div>

          <div className="card p-5 sm:p-6 bg-gradient-to-br from-accent-50 to-accent-100 border-2 border-accent-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-accent-500 p-2 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-accent-600 text-xs font-medium uppercase tracking-wider">En Progreso</p>
                <p className="text-2xl sm:text-3xl font-bold text-accent-900">{purchases.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 animate-scale-in">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-red-500 p-2 rounded-full flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-red-900 font-bold mb-1 text-sm sm:text-base">Error al cargar cursos</p>
              <p className="text-red-700 text-sm sm:text-base">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State - Sin cursos */}
      {!loading && !error && purchases.length === 0 && (
        <div className="card p-12 sm:p-16 md:p-20 text-center shadow-soft">
          <div className="max-w-md mx-auto">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
              <div className="relative text-7xl sm:text-8xl">📚</div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-4">
              Aún no tienes cursos
            </h3>
            <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
              Comienza tu viaje de aprendizaje explorando nuestra colección de cursos profesionales de gastronomía
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary text-base sm:text-lg inline-flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explorar Cursos
            </button>
          </div>
        </div>
      )}

      {/* Lista de cursos */}
      {purchases.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-gray-900">
              Mis Cursos Activos
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {purchases.map((purchase) => (
              <div 
                key={purchase.id} 
                className="card group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-scale-in overflow-hidden"
              >
                {/* Course Header con imagen */}
                <div className="relative h-32 sm:h-40 bg-gray-900 overflow-hidden">
                  <img
                    src={getCourseImage(purchase.course?.name)}
                    alt={purchase.course?.name || 'Curso'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/italia.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <span className="badge-success text-xs sm:text-sm px-3 py-1.5 shadow-lg">
                      <svg className="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Activo
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {purchase.course?.name || 'Curso no disponible'}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm sm:text-base">
                    {purchase.course?.description || 'Sin descripción'}
                  </p>
                  {purchase.course?.detail && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Detalle del curso</p>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{purchase.course.detail}</p>
                    </div>
                  )}

                  {/* Course Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">Adquirido: {new Date(purchase.purchase_date || purchase.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">Progreso del curso</span>
                      <span className="text-xs sm:text-sm font-bold text-primary-600">0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-500" style={{width: '0%'}}></div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Inversión</div>
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                        ${purchase.course?.price || '0'}
                      </div>
                    </div>
                    <button className="btn-primary text-sm sm:text-base py-2 px-4 sm:py-2.5 sm:px-5 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="hidden sm:inline">Continuar</span>
                      <span className="sm:hidden">Ver</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyCourses
