import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Waves, BarChart3, Wrench, ArrowRight } from 'lucide-react'

interface ModuleCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  path: string
  bgColor: string
  count: number
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    pavilions: 0,
    pools: 0,
    courts: 0,
    maintenance: 0,
  })
  const [statusCounts, setStatusCounts] = useState({
    pavilion: { pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
    pool: { pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
    court: { pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const pavilionModule = await (await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/pavilion')).json().catch(() => [])
        const pavs = Array.isArray(pavilionModule) ? pavilionModule : []
        const pavilionCounts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
        await Promise.all(pavs.map(async (p: any) => {
          try {
            const rows = await (await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + `/pavilion/bookings?pavilionId=${encodeURIComponent(p.id)}`, { headers: { 'Content-Type': 'application/json' } })).json()
            ;(rows || []).forEach((r: any) => { pavilionCounts[r.status || 'pending'] = (pavilionCounts[r.status || 'pending'] || 0) + 1 })
          } catch (e) {}
        }))

        const poolModule = await (await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/pool')).json().catch(() => [])
        const pools = Array.isArray(poolModule) ? poolModule : []
        const poolCounts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
        await Promise.all(pools.map(async (p: any) => {
          try {
            const rows = await (await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + `/pool/bookings?poolId=${encodeURIComponent(p.id)}`, { headers: { 'Content-Type': 'application/json' } })).json()
            ;(rows || []).forEach((r: any) => { poolCounts[r.status || 'pending'] = (poolCounts[r.status || 'pending'] || 0) + 1 })
          } catch (e) {}
        }))

        const courtModule = await (await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/court')).json().catch(() => [])
        const courts = Array.isArray(courtModule) ? courtModule : []
        const courtCounts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
        await Promise.all(courts.map(async (c: any) => {
          try {
            const rows = await (await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + `/court/schedules?courtId=${encodeURIComponent(c.id)}`, { headers: { 'Content-Type': 'application/json' } })).json()
            ;(rows || []).forEach((r: any) => { courtCounts[r.status || 'pending'] = (courtCounts[r.status || 'pending'] || 0) + 1 })
          } catch (e) {}
        }))

        const maintenanceModule = await (await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/maintenance')).json().catch(() => [])
        const maintenanceTasks = Array.isArray(maintenanceModule) ? maintenanceModule : []
        const pendingMaintenanceCount = maintenanceTasks.filter((t: any) => t.status === 'pending').length

        setStatusCounts({ pavilion: pavilionCounts, pool: poolCounts, court: courtCounts })
        setStats({
          pavilions: pavs.length,
          pools: pools.length,
          courts: courts.length,
          maintenance: pendingMaintenanceCount,
        })
      } catch (e) {
        // ignore
      }
    }
    fetchDashboardData()
  }, [])

  const modules: ModuleCard[] = [
    {
      id: 'pavilion',
      title: 'Pavilion Management',
      description: 'Manage pavilion bookings, events, and client information',
      icon: <Building2 size={32} />,
      path: '/pavilion',
      bgColor: '#1e40af',
      count: stats.pavilions,
    },
    {
      id: 'pool',
      title: 'Pool Management',
      description: 'Track pool maintenance, schedules, and operations',
      icon: <Waves size={32} />,
      path: '/pool',
      bgColor: '#0891b2',
      count: stats.pools,
    },
    {
      id: 'court',
      title: 'Court Management',
      description: 'Manage basketball court bookings and schedules',
      icon: <BarChart3 size={32} />,
      path: '/court',
      bgColor: '#059669',
      count: stats.courts,
    },
    {
      id: 'maintenance',
      title: 'Maintenance',
      description: 'Track maintenance tasks, repairs, and inspections',
      icon: <Wrench size={32} />,
      path: '/maintenance',
      bgColor: '#ea580c',
      count: stats.maintenance,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header Section */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
          Welcome to Felizardos
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#6b7280', margin: 0 }}>
          Manage all your facility operations from one centralized dashboard
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div
          style={{
            padding: '1.75rem',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#22c55e'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: 0, marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase' }}>
                Total Pavilions
              </p>
              <p style={{ fontSize: '2.25rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                {stats.pavilions}
              </p>
            </div>
            <div
              style={{
                width: '56px',
                height: '56px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22c55e',
              }}
            >
              <Building2 size={28} />
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '1.75rem',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#22c55e'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: 0, marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase' }}>
                Active Pools
              </p>
              <p style={{ fontSize: '2.25rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                {stats.pools}
              </p>
            </div>
            <div
              style={{
                width: '56px',
                height: '56px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22c55e',
              }}
            >
              <Waves size={28} />
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '1.75rem',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#22c55e'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: 0, marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase' }}>
                Courts
              </p>
              <p style={{ fontSize: '2.25rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                {stats.courts}
              </p>
            </div>
            <div
              style={{
                width: '56px',
                height: '56px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22c55e',
              }}
            >
              <BarChart3 size={28} />
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '1.75rem',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#22c55e'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: 0, marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase' }}>
                Tasks Pending
              </p>
              <p style={{ fontSize: '2.25rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                {stats.maintenance}
              </p>
            </div>
            <div
              style={{
                width: '56px',
                height: '56px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22c55e',
              }}
            >
              <Wrench size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {modules.map((module) => (
          <div
            key={module.id}
            onClick={() => navigate(module.path)}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#22c55e'
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(34, 197, 94, 0.12)'
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ height: '4px', background: '#22c55e' }} />
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#22c55e',
                  }}
                >
                  {module.icon}
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ecfdf5' }}>
                  {module.count}
                </span>
              </div>

              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
                {module.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0, marginBottom: '1.5rem', lineHeight: '1.5' }}>
                {module.description}
              </p>

              <button
                onClick={() => navigate(module.path)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(34, 197, 94, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Access Module
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Status Summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
          <h4 style={{ margin: 0, marginBottom: '0.75rem' }}>Pavilion Booking Status</h4>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1 }}>Pending: <strong>{statusCounts.pavilion.pending}</strong></div>
            <div style={{ flex: 1 }}>Confirmed: <strong>{statusCounts.pavilion.confirmed}</strong></div>
            <div style={{ flex: 1 }}>Completed: <strong>{statusCounts.pavilion.completed}</strong></div>
            <div style={{ flex: 1 }}>Cancelled: <strong>{statusCounts.pavilion.cancelled}</strong></div>
          </div>
        </div>

        <div style={{ padding: '1rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
          <h4 style={{ margin: 0, marginBottom: '0.75rem' }}>Pool Booking Status</h4>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1 }}>Pending: <strong>{statusCounts.pool.pending}</strong></div>
            <div style={{ flex: 1 }}>Confirmed: <strong>{statusCounts.pool.confirmed}</strong></div>
            <div style={{ flex: 1 }}>Completed: <strong>{statusCounts.pool.completed}</strong></div>
            <div style={{ flex: 1 }}>Cancelled: <strong>{statusCounts.pool.cancelled}</strong></div>
          </div>
        </div>

        <div style={{ padding: '1rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
          <h4 style={{ margin: 0, marginBottom: '0.75rem' }}>Court Schedule Status</h4>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1 }}>Pending: <strong>{statusCounts.court.pending}</strong></div>
            <div style={{ flex: 1 }}>Confirmed: <strong>{statusCounts.court.confirmed}</strong></div>
            <div style={{ flex: 1 }}>Completed: <strong>{statusCounts.court.completed}</strong></div>
            <div style={{ flex: 1 }}>Cancelled: <strong>{statusCounts.court.cancelled}</strong></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          padding: '2rem',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          <button
            style={{
              padding: '0.875rem',
              background: '#fff',
              border: '1px solid #e5e7eb',
              color: '#22c55e',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f0fdf4'
              e.currentTarget.style.borderColor = '#22c55e'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <Building2 size={18} />
            New Pavilion
          </button>
          <button
            style={{
              padding: '0.875rem',
              background: '#fff',
              border: '1px solid #e5e7eb',
              color: '#22c55e',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f0fdf4'
              e.currentTarget.style.borderColor = '#22c55e'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <Waves size={18} />
            New Pool Event
          </button>
          <button
            style={{
              padding: '0.875rem',
              background: '#fff',
              border: '1px solid #e5e7eb',
              color: '#22c55e',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f0fdf4'
              e.currentTarget.style.borderColor = '#22c55e'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <BarChart3 size={18} />
            Book Court
          </button>
          <button
            style={{
              padding: '0.875rem',
              background: '#fff',
              border: '1px solid #e5e7eb',
              color: '#22c55e',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f0fdf4'
              e.currentTarget.style.borderColor = '#22c55e'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <Wrench size={18} />
            Report Issue
          </button>
        </div>
      </div>
    </div>
  )
}
