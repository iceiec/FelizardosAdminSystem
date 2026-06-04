import { useState, useEffect } from 'react'
import { Plus, Droplets, Thermometer, Calendar } from 'lucide-react'
import { mockPoolData, type Event } from '@/services/mockData'
import { poolAPI, poolBookingAPI } from '@/services/api'
import { toast } from 'sonner'
import { PoolModal, type PoolFormData } from '@/components/PoolModal'
import EventModal from '@/components/EventModal'
import EventDetailsModal from '@/components/EventDetailsModal'
import CalendarView from '@/components/CalendarView'

interface Pool {
  id: string
  name: string
  size: string
  depth: string
  capacity: number
  status: string
  temperature: number
  lastCleaned: string
}

const mapBookingToEvent = (booking: any): Event => ({
  id: booking.id,
  facilityId: booking.poolId || booking.pool_id || '',
  facilityName: booking.poolName || booking.pool_name || booking.facilityName || '',
  eventName: booking.eventName || booking.event_name || '',
  clientName: booking.clientName || booking.client_name || '',
  clientContact: booking.clientContact || booking.client_contact || '',
  clientFacebook: booking.clientFacebook || booking.client_facebook || '',
  // Normalize to YYYY-MM-DD so CalendarView matches dates
  date: (() => {
    const d = booking.eventDate || booking.event_date || booking.date || ''
    return d ? String(d).slice(0, 10) : ''
  })(),
  capacity: Number(booking.capacity || 0),
  depositAmount: Number(booking.depositAmount || booking.deposit_amount || 0),
  totalAmount: Number(booking.totalAmount || booking.total_amount || 0),
  extras: Array.isArray(booking.extras) ? booking.extras : [],
  status: booking.status || 'pending',
  createdAt: booking.createdAt || booking.created_at || '',
})

export default function PoolManagementPage() {
  const [pool, setPool] = useState<Pool | null>(null)
  const [poolRecordId, setPoolRecordId] = useState<string | null>(null)
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isPoolModalOpen, setIsPoolModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const pools = await poolAPI.getAll().catch(() => [])
        const poolData = pools?.[0] || mockPoolData[0]
        if (poolData) {
          // apply name override from settings if available
          let nameOverride = poolData.name
          try {
            const raw = localStorage.getItem('facilities')
            if (raw) {
              const facs = JSON.parse(raw) as any[]
              const found = facs.find((f) => f.id === poolData.id)
              if (found && found.name) nameOverride = found.name
            }
          } catch (e) {}
          setPool({
            id: poolData.id,
            name: nameOverride,
            size: poolData.size,
            depth: poolData.depth,
            capacity: Number(poolData.capacity) || 0,
            status: poolData.status || 'open',
            temperature: Number(poolData.temperature) || 28,
            lastCleaned: poolData.lastCleaned || poolData.last_cleaned || '',
          })
          setPoolRecordId(pools?.[0]?.id || null)
        }

        if (poolData?.id) {
          try {
            const bookings = await poolBookingAPI.getByPool(poolData.id)
            setAllEvents(bookings.length ? bookings.map((b: any) => ({ ...mapBookingToEvent(b), facilityName: poolData.name })) : [])
          } catch {
            setAllEvents([])
          }
        }
      } catch (error) {
        toast.error('Failed to load pool data')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
    const onSettings = () => {
      try {
        const raw = localStorage.getItem('facilities')
        if (raw && pool) {
          const facs = JSON.parse(raw) as any[]
          // Match by type 'pool' since IDs may not match between settings and database
          const found = facs.find((f) => f.type === 'pool')
          if (found && found.name) setPool((p) => p ? { ...p, name: found.name } : p)
        }
      } catch (e) {}
    }
    window.addEventListener('settings:updated', onSettings)
    return () => window.removeEventListener('settings:updated', onSettings)
  }, [])

  const handleAddEvent = () => {
    setEditingEvent(null)
    setSelectedDate('')
    setIsEventModalOpen(true)
  }

  const handleViewEvents = () => {
    setIsDetailsModalOpen(true)
  }

  const handleSaveEvent = async (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const payload = {
      poolId: pool?.id || eventData.facilityId,
      eventName: eventData.eventName,
      clientName: eventData.clientName,
      clientContact: eventData.clientContact,
      clientFacebook: eventData.clientFacebook || null,
      eventDate: eventData.date,
      capacity: eventData.capacity,
      depositAmount: eventData.depositAmount,
      totalAmount: eventData.totalAmount,
      extras: eventData.extras,
      status: (eventData as any).status || 'pending',
    }

    try {
      if (editingEvent) {
        const updated = await poolBookingAPI.update(editingEvent.id, payload)
        const mapped = mapBookingToEvent(updated)
        setAllEvents((current) => current.map((e) => (e.id === editingEvent.id ? mapped : e)))
        toast.success('Booking updated successfully')
      } else if (pool) {
        const created = await poolBookingAPI.create(payload)
        setAllEvents((current) => [...current, mapBookingToEvent(created)])
        toast.success('Booking created successfully')
      } else {
        const newEvent: Event = {
          id: `evt-${Date.now()}`,
          ...eventData,
          createdAt: new Date().toISOString().split('T')[0],
        }
        setAllEvents((current) => [...current, newEvent])
        toast.success('Event created successfully')
      }
    } catch (error) {
      if (editingEvent) {
        setAllEvents((current) =>
          current.map((e) => (e.id === editingEvent.id ? { ...e, ...eventData } : e)),
        )
        toast.success('Event updated locally')
      } else {
        const newEvent: Event = {
          id: `evt-${Date.now()}`,
          ...eventData,
          createdAt: new Date().toISOString().split('T')[0],
        }
        setAllEvents((current) => [...current, newEvent])
        toast.success('Event created locally')
      }
    }
    setIsEventModalOpen(false)
    setEditingEvent(null)
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await poolBookingAPI.delete(eventId)
      setAllEvents((current) => current.filter((e) => e.id !== eventId))
      toast.success('Booking deleted successfully')
    } catch (error) {
      setAllEvents((current) => current.filter((e) => e.id !== eventId))
      toast.success('Event deleted locally')
    }
  }

  const normalizePoolStatus = (status: string) => {
    if (status === 'operational') return 'open'
    return status || 'open'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return { bg: '#f0fdf4', text: '#15803d', border: '#dcfce7' }
      case 'maintenance':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' }
      case 'closed':
        return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }
      default:
        return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' }
    }
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '3rem', color: '#9ca3af' }}>
        Loading pool...
      </div>
    )
  }

  if (!pool) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '3rem', color: '#9ca3af' }}>
        No pool found
      </div>
    )
  }

  const poolEvents = allEvents.filter((e) => e.facilityId === pool.id)
  const statusColor = getStatusColor(pool.status)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header with Add Event Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
            Pool Management
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#6b7280', margin: 0 }}>
            Manage pool events and bookings
          </p>
        </div>
        <button onClick={handleAddEvent} className="btn btn-primary">
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: isMobile ? '1.5rem' : '2rem' }}>
        {/* Facility Details and Events List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Pool Card */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <div style={{ height: '4px', background: '#3b82f6' }} />
            <div style={{ padding: '2rem' }}>
              {/* Title and Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  {pool.name}
                </h2>
                <div
                  style={{
                    background: statusColor.bg,
                    color: statusColor.text,
                    border: `1px solid ${statusColor.border}`,
                    padding: '0.375rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: '600',
                  }}
                >
                  {pool.status}
                </div>
              </div>

              {/* Pool Dimensions */}
              <div style={{ marginBottom: '2rem', color: '#6b7280', fontSize: '0.9375rem' }}>
                {pool.size} × {pool.depth}
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                    <Droplets size={16} />
                    Capacity
                  </div>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                    {pool.capacity}
                  </p>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                    <Calendar size={16} />
                    Events
                  </div>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                    {poolEvents.length}
                  </p>
                </div>
              </div>

              {/* Temperature */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.9375rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
                <Thermometer size={18} />
                Temperature: {pool.temperature}°C
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleAddEvent} className="btn btn-primary" style={{ flex: 1 }}>
                  <Plus size={16} />
                  Add Event
                </button>
                <button onClick={handleViewEvents} className="btn btn-secondary" style={{ flex: 1 }}>
                  <Calendar size={16} />
                  View Events
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>
              Upcoming Events ({poolEvents.length})
            </h3>
            {poolEvents.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '0.9375rem', margin: 0 }}>No events scheduled</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {poolEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    style={{
                      padding: '1rem',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '0.25rem' }}>
                        {event.eventName}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
                        {event.date} • {event.clientName}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                      ₱{Number(event.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Calendar View */}
        <div>
          <CalendarView
            events={poolEvents}
            facilityId={pool.id}
            onDateClick={(date) => {
              setSelectedDate(date)
              setIsDetailsModalOpen(true)
            }}
            onAddEvent={handleAddEvent}
          />
        </div>
      </div>

      {/* Event Modals */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false)
          setEditingEvent(null)
          setSelectedDate('')
        }}
        onSave={handleSaveEvent}
        facilityId={pool.id}
        initialEvent={editingEvent}
        selectedDate={selectedDate}
      />

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={(event) => {
          setEditingEvent(event)
          setIsEventModalOpen(true)
        }}
        onDelete={handleDeleteEvent}
        events={poolEvents}
        selectedDate={selectedDate}
        facilityName={pool?.name || "Felizardos Event's Place"}
        receiptPrefix="Pool"
      />

      {/* Pool Modal */}
      <PoolModal
        isOpen={isPoolModalOpen}
        onClose={() => setIsPoolModalOpen(false)}
        onSubmit={async (data: PoolFormData) => {
          const payload = {
            name: data.name,
            size: data.size,
            depth: data.depth,
            capacity: parseInt(data.capacity, 10),
            status: normalizePoolStatus(data.status),
            temperature: data.temperature ? parseInt(data.temperature, 10) : null,
          }

          try {
            if (poolRecordId) {
              const updated = await poolAPI.update(poolRecordId, payload)
              setPool({
                id: updated.id,
                name: updated.name,
                size: updated.size,
                depth: updated.depth,
                capacity: Number(updated.capacity) || 0,
                status: updated.status || 'open',
                temperature: Number(updated.temperature) || 28,
                lastCleaned: updated.lastCleaned || updated.last_cleaned || '',
              })
              toast.success('Pool updated successfully')
            } else {
              const created = await poolAPI.create(payload)
              setPoolRecordId(created.id)
              setPool({
                id: created.id,
                name: created.name,
                size: created.size,
                depth: created.depth,
                capacity: Number(created.capacity) || 0,
                status: created.status || 'open',
                temperature: Number(created.temperature) || 28,
                lastCleaned: created.lastCleaned || created.last_cleaned || '',
              })
              toast.success('Pool created successfully')
            }
          } catch (error) {
            if (pool) {
              setPool({
                ...pool,
                name: data.name,
                size: data.size,
                depth: data.depth,
                capacity: parseInt(data.capacity, 10),
                status: normalizePoolStatus(data.status),
                temperature: parseInt(data.temperature, 10) || pool.temperature,
              })
            }
            toast.success('Pool updated locally')
          }
          setIsPoolModalOpen(false)
        }}
        initialData={pool ? {
          name: pool.name,
          size: pool.size,
          depth: pool.depth,
          capacity: pool.capacity.toString(),
          status: normalizePoolStatus(pool.status),
          temperature: pool.temperature.toString(),
        } : undefined}
      />
    </div>
  )
}
