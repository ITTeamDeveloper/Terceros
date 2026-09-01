import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './features/auth/context/AuthContext'
import ProtectedRoute from './app/guards/ProtectedRoute'
import PublicRoute from './app/guards/PublicRoute'

const MainLayout = lazy(() =>
  import('./app/layouts/MainLayout').then((module) => ({ default: module.MainLayout })),
)
const MainDashboard = lazy(() => import('./features/dashboard/pages/mainDashboard'))
const Login = lazy(() => import('./features/auth/pages/Login'))
const HistoricoDescargas = lazy(() =>
  import('./features/dashboard/pages/historicoDescargas').then((module) => ({
    default: module.HistoricoDescargas,
  })),
)
const SoportePage = lazy(() =>
  import('./features/dashboard/pages/soportePage').then((module) => ({
    default: module.SoportePage,
  })),
)
const AsignacionesHistoricas = lazy(() =>
  import('./features/dashboard/pages/asignacionesHistoricas'),
)

function RouteFallback() {
  return (
    <div
      role="status"
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#F7F4FF',
        color: '#1D1D1D',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      Cargando...
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            {/* <Route path="/registro" element={<Register />} /> */}
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<MainDashboard />} />

              {/* Ruta momentánea: apunta al mismo componente que "/" */}
              <Route path="/asignaciones/aprobadas" element={<AsignacionesHistoricas />} />

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
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
