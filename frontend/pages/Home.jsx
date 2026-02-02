import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { nestApi } from '../api'
import { useAuth } from '../contexts/AuthContext'
import PurchaseModal from '../components/PurchaseModal'

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

function Home() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await nestApi.get('/courses')
      setCourses(response.data.data)
    } catch (err) {
      setError('Error al cargar los cursos. Verifica que el servidor esté activo.')
      console.error('Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBuyClick = (course) => {
    // Verificar si el usuario está logueado
    if (!user) {
      // Redirigir a login si no está autenticado
      navigate('/login')
      return
    }
    setSelectedCourse(course)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCourse(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Cargando cursos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button onClick={fetchCourses} className="btn-primary mt-6">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-6 sm:p-10 md:p-12 lg:p-16 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Nuevos cursos disponibles
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 sm:mb-6 animate-slide-up">
            Domina el Arte de la
            <span className="block text-accent-200">Gastronomía Profesional</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-50 leading-relaxed mb-6 sm:mb-8 animate-slide-up">
            Aprende técnicas culinarias de chefs expertos y transforma tu pasión en una carrera profesional
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="font-medium">Certificación Profesional</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Acceso de por vida</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <span className="font-medium">Comunidad activa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
              Explora Nuestros Cursos
            </h2>
            <p className="text-sm sm:text-base text-gray-600">Selecciona el curso perfecto para tu nivel y objetivos</p>
          </div>
          <div className="badge bg-primary-100 text-primary-700 text-base sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2">
            {courses.length} cursos
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="card p-8 sm:p-12 md:p-16 text-center">
            <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">📚</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
              No hay cursos disponibles
            </h3>
            <p className="text-gray-600 text-base sm:text-lg">
              Estamos preparando nuevos cursos increíbles. Vuelve pronto.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {courses.map((course) => (
              <div key={course.id} className="card group cursor-pointer animate-scale-in">
                {/* Course Image */}
                <div className="relative h-48 sm:h-56 bg-gray-900 overflow-hidden">
                  <img 
                    src={getCourseImage(course.name)} 
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/italia.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <span className="badge bg-white/90 text-gray-900 font-semibold shadow-lg text-xs sm:text-sm backdrop-blur-sm">
                      Trending
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-4 sm:p-5 md:p-6">
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors">
                    {course.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed text-sm sm:text-base">
                    {course.description}
                  </p>
                  {course.detail && (
                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Detalle del curso</p>
                      <p className="text-gray-600 line-clamp-2 leading-relaxed text-sm">{course.detail}</p>
                    </div>
                  )}

                  {/* Course Details */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{course.duration || '8 semanas'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="font-medium">{course.level || 'Intermedio'}</span>
                    </div>
                  </div>

                  {/* Price & Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-3 sm:pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">Precio total</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                          ${course.price}
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">USD</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBuyClick(course)}
                      className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6"
                      title={!user ? 'Debes iniciar sesión para comprar' : 'Comprar curso'}
                    >
                      {!user ? (
                        <>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          <span className="hidden sm:inline">Iniciar sesión</span>
                          <span className="sm:hidden">Login</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Comprar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {isModalOpen && selectedCourse && (
        <PurchaseModal
          course={selectedCourse}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default Home
