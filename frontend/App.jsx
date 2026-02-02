import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './pages/Layout'
import Home from './pages/Home'
import MyCourses from './pages/MyCourses'
import Admin from './pages/Admin'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta de Login sin Layout */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas con Layout */}
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Layout>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
