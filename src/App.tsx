import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/AuthContext'
import ProtectedRoute from './app/guards/ProtectedRoute'
import PublicRoute from './app/guards/PublicRoute'
import { MainLayout } from './app/layouts/MainLayout'
import MainDashboard from './features/dashboard/pages/mainDashboard'
import Login from './features/auth/pages/Login'
import { PlaceholderPage } from './shared/pages/PlaceholderPage'
import { HistoricoDescargas } from './features/dashboard/pages/historicoDescargas'

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
                element={
                  <PlaceholderPage
                    title="¿Necesitas ayuda?"
                    description="Contacta al equipo de Finanty para resolver cualquier duda sobre el módulo de Terceros."
                  />
                }
              />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
