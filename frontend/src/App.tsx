import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import PavillionManagementPage from './pages/PavillionManagementPage'
import PoolManagementPage from './pages/PoolManagementPage'
import CourtManagementPage from './pages/CourtManagementPage'
import MaintenancePage from './pages/MaintenancePage'
import SettingsPage from './pages/SettingsPage'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppContent() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/pavillion" element={<PavillionManagementPage />} />
                  <Route path="/pool" element={<PoolManagementPage />} />
                  <Route path="/court" element={<CourtManagementPage />} />
                  <Route path="/maintenance" element={<MaintenancePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}
