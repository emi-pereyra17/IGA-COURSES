import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-soft sticky top-0 z-50 border-b border-gray-100">
        <nav className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group transition-all hover:scale-105 flex-shrink-0" onClick={closeMobileMenu}>
              <div className="flex items-center gap-2 md:gap-3">
                <img 
                  src="/logo-6.png" 
                  alt="IGA Logo" 
                  className="w-10 h-10 md:w-14 md:h-14 object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-lg md:text-2xl font-heading font-bold text-gray-900 tracking-tight">
                    IGA <span className="gradient-text">Courses</span>
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-500 font-medium hidden sm:block">Academia Gastronómica</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/"
                className={`relative px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  isActive('/')
                    ? 'text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Cursos
                </span>
              </Link>
              
              <Link
                to="/my-courses"
                className={`relative px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  isActive('/my-courses')
                    ? 'text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Mis Cursos
                </span>
              </Link>
              
              {/* Solo mostrar Admin si es admin */}
              {isAdmin() && (
                <Link
                  to="/admin"
                  className={`relative px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                    isActive('/admin')
                      ? 'text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Admin
                  </span>
                </Link>
              )}

              {/* User Menu */}
              {user ? (
                <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden md:inline">Salir</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-2 px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Iniciar Sesión
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="py-4 space-y-2 border-t border-gray-100">
              {/* Mobile Navigation Links */}
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Cursos
                </span>
              </Link>

              <Link
                to="/my-courses"
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive('/my-courses')
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Mis Cursos
                </span>
              </Link>

              {/* Admin Link (Mobile) */}
              {isAdmin() && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-xl font-semibold transition-all ${
                    isActive('/admin')
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Admin
                  </span>
                </Link>
              )}

              {/* User Section (Mobile) */}
              {user ? (
                <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
                  <div className="px-4 py-2 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block mx-4 mt-3 px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Iniciar Sesión
                  </span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-12 animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 sm:py-12 mt-auto border-t border-gray-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L2c+PC9zdmc+')] opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo-6.png" 
                alt="IGA Logo" 
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
              <div className="text-center md:text-left">
                <p className="text-base sm:text-lg font-heading font-bold">IGA Courses</p>
                <p className="text-gray-400 text-xs sm:text-sm">Academia Gastronómica Profesional</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-300 font-medium text-sm sm:text-base">
                © 2026 IGA Courses. Todos los derechos reservados.
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Aprende de los mejores chefs del mundo
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
