import { useState, useEffect } from 'react'
import { nestApi } from '../api'
import { useAuth } from '../contexts/AuthContext'

function PurchaseModal({ course, onClose }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    nombre: user?.name || '',
    email: user?.email || '',
    celular: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Actualizar formData cuando el usuario cambie
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nombre: user.name || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const purchaseData = {
        client_name: formData.nombre,
        client_email: formData.email,
        client_phone: formData.celular,
        course_id: course.id,
      }

      await nestApi.post('/purchases', purchaseData)
      setSuccess(true)

      // Limpiar formulario después de 2 segundos y cerrar modal
      setTimeout(() => {
        setFormData({ nombre: '', email: '', celular: '' })
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la compra. Por favor intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!course) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-scale-in mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-5 sm:p-6 md:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold text-white mb-2 sm:mb-3">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Inscripción
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-1">Finalizar Compra</h2>
              <p className="text-primary-100 text-sm sm:text-base">Completa tus datos para comenzar tu aprendizaje</p>
            </div>
            <button
              onClick={onClose}
              className="relative z-10 p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all hover:rotate-90 duration-300 flex-shrink-0"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 md:p-8">
          {/* Course Info */}
          {course && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2.5 sm:p-3 rounded-xl text-2xl sm:text-3xl shadow-lg flex-shrink-0">
                  👨‍🍳
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-lg sm:text-xl font-heading font-bold text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{course.description}</p>
                  {course.detail && (
                    <div className="mb-3 sm:mb-4 p-3 bg-white/60 rounded-xl border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Detalle del curso</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{course.detail}</p>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>8 semanas</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Certificado</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-xs text-gray-500 mb-0.5">Precio total</div>
                      <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">${course.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 border-2 border-secondary-200 rounded-2xl animate-scale-in">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-secondary-500 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-secondary-900 font-bold text-base sm:text-lg mb-1">¡Compra realizada exitosamente!</p>
                  <p className="text-secondary-700 text-xs sm:text-sm">Te hemos enviado los detalles por email</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-red-500 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-900 font-bold text-sm sm:text-base mb-1">Error al procesar</p>
                  <p className="text-red-700 text-xs sm:text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-5">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Ej: Juan Pérez García"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                    <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Automático</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="input-field bg-gray-50 cursor-not-allowed"
                    placeholder="tu@email.com"
                  />
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Este es el email de tu cuenta actual
                  </p>
                </div>

                <div>
                  <label htmlFor="celular" className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Teléfono / Celular
                  </label>
                  <input
                    type="tel"
                    id="celular"
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="p-3 sm:p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-start gap-2 sm:gap-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-xs sm:text-sm text-blue-800">
                    <p className="font-semibold mb-1">Acceso inmediato</p>
                    <p className="text-blue-700">Recibirás acceso al curso inmediatamente después de completar tu compra</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary flex-1 order-2 sm:order-1 text-sm sm:text-base"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmar Compra
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default PurchaseModal
