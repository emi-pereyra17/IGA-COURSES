import { useEffect, useState } from 'react'
import { phpApi } from '../api'

function Admin() {
  const [salesReport, setSalesReport] = useState([])
  const [salesByCourse, setSalesByCourse] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalCourses: 0
  })

  useEffect(() => {
    fetchSalesReport()
  }, [])

  const fetchSalesReport = async () => {
    try {
      setLoading(true)
      setError(null)
      const ventasRes = await phpApi.get('/api/reportes/ventas')
      const data = ventasRes.data.data || ventasRes.data
      setSalesReport(data)
      calculateStats(data)

      try {
        const ventasPorCursoRes = await phpApi.get('/api/reportes/ventas-por-curso')
        const resumen = ventasPorCursoRes.data?.data
        const cursos = resumen?.cursos ?? []
        setSalesByCourse(cursos)
      } catch (_) {
        setSalesByCourse([])
      }
    } catch (err) {
      setError('Error al cargar el reporte de ventas. Verifica que el servidor PHP esté activo.')
      console.error('Error fetching sales report:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data) => {
    const totalSales = data.length
    const totalRevenue = data.reduce((sum, sale) => sum + parseFloat(sale.precio || 0), 0)
    const uniqueCourses = new Set(data.map(sale => sale.curso_id)).size
    
    setStats({
      totalSales,
      totalRevenue,
      totalCourses: uniqueCourses
    })
  }

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString('es-ES', options)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Cargando reporte...</p>
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
          <button onClick={fetchSalesReport} className="btn-primary mt-6">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-2xl shadow-lg">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-1">
              Dashboard Administrativo
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Análisis y estadísticas de ventas en tiempo real
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 md:mb-10">
        {/* Total Ventas */}
        <div className="card p-5 sm:p-7 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-2xl group">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="bg-white/20 p-2 sm:p-3 rounded-xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="badge bg-white/20 text-white text-xs">Total</span>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-blue-100 mb-1 sm:mb-2">Ventas Realizadas</p>
            <p className="text-4xl sm:text-5xl font-bold tracking-tight">{stats.totalSales}</p>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 sm:mt-2">compras completadas</p>
          </div>
        </div>

        {/* Ingresos Totales */}
        <div className="card p-5 sm:p-7 bg-gradient-to-br from-secondary-500 to-secondary-600 text-white shadow-lg hover:shadow-2xl group">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="bg-white/20 p-2 sm:p-3 rounded-xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="badge bg-white/20 text-white text-xs">USD</span>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-secondary-100 mb-1 sm:mb-2">Ingresos Totales</p>
            <p className="text-3xl sm:text-5xl font-bold tracking-tight break-words">
              {formatCurrency(stats.totalRevenue)}
            </p>
            <p className="text-xs sm:text-sm text-secondary-100 mt-1 sm:mt-2">en ventas generadas</p>
          </div>
        </div>

        {/* Cursos Vendidos */}
        <div className="card p-5 sm:p-7 bg-gradient-to-br from-accent-500 to-accent-600 text-white shadow-lg hover:shadow-2xl group sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="bg-white/20 p-2 sm:p-3 rounded-xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="badge bg-white/20 text-white text-xs">Únicos</span>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-accent-100 mb-1 sm:mb-2">Cursos Vendidos</p>
            <p className="text-4xl sm:text-5xl font-bold tracking-tight">{stats.totalCourses}</p>
            <p className="text-xs sm:text-sm text-accent-100 mt-1 sm:mt-2">cursos diferentes</p>
          </div>
        </div>
      </div>

      {/* Ventas por curso - Cantidad de veces comprado cada curso */}
      <div className="card shadow-soft mb-8 md:mb-10">
        <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-1">Ventas por curso</h2>
            <p className="text-sm sm:text-base text-gray-600">Cada curso comprado y la cantidad de veces que se ha comprado</p>
          </div>
        </div>
        {salesByCourse.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <p className="text-gray-500">No hay datos de ventas por curso aún.</p>
          </div>
        ) : (
          <>
            <div className="block md:hidden p-4 space-y-3">
              {salesByCourse.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">{item.curso}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(item.total_ingresos || 0)} en total</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-primary-100 text-primary-700">
                      {item.ventas} {item.ventas === 1 ? 'vez' : 'veces'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Curso</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Veces comprado</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ingresos totales</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {salesByCourse.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-all">
                      <td className="px-4 lg:px-6 py-4">
                        <p className="font-medium text-gray-900">{item.curso}</p>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className="badge bg-primary-100 text-primary-700 font-bold">
                          {item.ventas} {item.ventas === 1 ? 'vez' : 'veces'}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap font-semibold text-secondary-600">
                        {formatCurrency(item.total_ingresos || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Sales Table */}
      <div className="card shadow-soft">
        <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-1">Historial de Ventas</h2>
            <p className="text-sm sm:text-base text-gray-600">Detalle completo de todas las transacciones</p>
          </div>
        </div>
        
        {salesReport.length === 0 ? (
          <div className="p-8 sm:p-16 text-center">
            <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">📋</div>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2 sm:mb-3">
              No hay ventas registradas
            </h3>
            <p className="text-gray-600 text-base sm:text-lg">
              Las ventas aparecerán aquí una vez que los clientes realicen compras.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (< md) */}
            <div className="block md:hidden space-y-4 p-4">
              {salesReport.map((sale, index) => (
                <div key={sale.id || index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                        {sale.nombre?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{sale.nombre}</p>
                        <p className="text-xs text-gray-500">ID: #{sale.id}</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-secondary-600">
                      {formatCurrency(sale.precio)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{sale.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="font-medium text-gray-900">{sale.curso_nombre || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{sale.celular}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-xs pt-2 border-t border-gray-100">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(sale.fecha || sale.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Curso
                    </th>
                    <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Contacto
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {salesReport.map((sale, index) => (
                    <tr key={sale.id || index} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="badge bg-gray-100 text-gray-700 font-mono text-xs">
                            #{sale.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {sale.nombre?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {sale.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {sale.email}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-gray-900 truncate">{sale.curso_nombre || 'N/A'}</p>
                          <p className="text-xs text-gray-500 truncate">{sale.curso_descripcion}</p>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                        <span className="text-base lg:text-lg font-bold text-secondary-600">
                          {formatCurrency(sale.precio)}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(sale.fecha || sale.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {sale.celular}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Footer con total */}
        {salesReport.length > 0 && (
          <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
              <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                Mostrando <span className="font-semibold">{salesReport.length}</span> ventas totales
              </p>
              <button 
                onClick={fetchSalesReport} 
                className="btn-secondary text-xs sm:text-sm w-full sm:w-auto"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualizar
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
