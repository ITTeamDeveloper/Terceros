import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/AuthContext'
import ProtectedRoute from './app/guards/ProtectedRoute'
import PublicRoute from './app/guards/PublicRoute'
import { MainLayout } from './app/layouts/MainLayout'
import MainDashboard from './features/dashboard/pages/mainDashboard'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import { PlaceholderPage } from './shared/pages/PlaceholderPage'
import { HistoricoDescargas } from './features/dashboard/pages/historicoDescargas'
import { EmpresaTerceras } from './features/dashboard/pages/empresasTerceras'

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
                path="/estudios"
                element={
                  <EmpresaTerceras/>
                }
              />
              <Route
                path="/archivos"
                element={
                  <PlaceholderPage
                    title="Repositorio de archivos"
                    description="Centraliza todos los documentos enviados a tus terceros con búsqueda y filtros avanzados."
                  />
                }
              />
              <Route
                path="/historicoDescargas"
                element={
                  <HistoricoDescargas/>
                }
              />
              <Route
                path="/aprobaciones"
                element={
                  <PlaceholderPage
                    title="Flujo de aprobaciones"
                    description="Revisa y autoriza los documentos pendientes con un flujo jerárquico y trazabilidad por usuario."
                  />
                }
              />
              <Route
                path="/configuracion"
                element={
                  <PlaceholderPage
                    title="Configuración"
                    description="Define usuarios, roles y permisos del flujo de cobranza con tus terceros."
                  />
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
