import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/AuthContext'
import ProtectedRoute from './app/guards/ProtectedRoute'
import PublicRoute from './app/guards/PublicRoute'
import { MainLayout } from './app/layouts/MainLayout'
import MainDashboard from './features/dashboard/pages/mainDashboard'
import Login from './features/auth/pages/Login'
import { HistoricoDescargas } from './features/dashboard/pages/historicoDescargas'
import { SoportePage } from './features/dashboard/pages/soportePage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            {/* <Route path="/registro" element={<Register />} /> */}
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<MainDashboard />} />

              <Route
                path="/historico"
                element={
                  <HistoricoDescargas/>
                }
              />
              <Route
                path="/soporte"
                element={<SoportePage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
