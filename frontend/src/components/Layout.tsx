import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Waves,
  BarChart3,
  Wrench,
  Menu,
  X,
  LogOut,
  Settings,
} from 'lucide-react'
import { Button } from './ui/button'
import { useAuth } from '@/contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/pavillion', label: 'Pavillion Management', icon: Building2 },
    { path: '/pool', label: 'Pool Management', icon: Waves },
    { path: '/court', label: 'Court Management', icon: BarChart3 },
    { path: '/maintenance', label: 'Maintenance', icon: Wrench },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f9fafb' }}>
      {/* Sidebar */}
      {(!isMobile || sidebarOpen) && (
        <div
          style={{
            width: isMobile ? '260px' : sidebarOpen ? '260px' : '80px',
            background: '#fff',
            borderRight: '1px solid #e5e7eb',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            position: isMobile ? 'fixed' : 'relative',
            height: isMobile ? '100vh' : 'auto',
            zIndex: isMobile ? 50 : 'auto',
            left: 0,
            top: 0,
            boxShadow: isMobile ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          {/* Header */}
          <div
            style={{
              height: '70px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '1rem',
              paddingRight: '0.5rem',
            }}
          >
            {sidebarOpen && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#fff',
                    fontSize: '1rem',
                  }}
                >
                  F
                </div>
                <h1 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  Felizardos
                </h1>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#6b7280')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav
            style={{
              flex: 1,
              overflowY: 'auto',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{ textDecoration: 'none' }}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      paddingLeft: '0.75rem',
                      paddingRight: '0.75rem',
                      paddingTop: '0.625rem',
                      paddingBottom: '0.625rem',
                      borderRadius: '10px',
                      background: isActive ? '#f0fdf4' : 'transparent',
                      color: isActive ? '#16a34a' : '#6b7280',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderLeft: isActive ? '3px solid #22c55e' : '3px solid transparent',
                      paddingLeft: isActive ? '0.5rem' : '0.75rem',
                    }}
                    onMouseEnter={(e) => !isActive && (e.currentTarget.style.background = '#f9fafb', e.currentTarget.style.color = '#4b5563')}
                    onMouseLeave={(e) => !isActive && (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = '#6b7280')}
                  >
                    <Icon size={20} style={{ flexShrink: 0 }} />
                    {sidebarOpen && <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item.label}</span>}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User Section & Logout */}
          <div
            style={{
              borderTop: '1px solid #e5e7eb',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {sidebarOpen && (
              <div>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0, marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: '600' }}>
                  Account
                </p>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: sidebarOpen ? '0.75rem' : '0.5rem',
                background: '#fff',
                border: '1px solid #e5e7eb',
                color: '#ef4444',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fef2f2'
                e.currentTarget.style.borderColor = '#fecaca'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              <LogOut size={16} />
              {sidebarOpen && 'Logout'}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
          }}
        />
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100%', minHeight: 0 }}>
        {/* Top Bar */}
        <div
          style={{
            height: isMobile ? '60px' : '70px',
            borderBottom: '1px solid #e5e7eb',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: isMobile ? '1rem' : '2rem',
            paddingRight: isMobile ? '1rem' : '2rem',
            justifyContent: 'space-between',
          }}
        >
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '0.5rem',
              }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <h2 style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0, flex: 1 }}>
            {navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
          </h2>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            background: '#f9fafb',
          }}
        >
          <div style={{ padding: isMobile ? '1rem' : '2rem' }}>{children}</div>
        </div>
      </div>
    </div>
  )
}
