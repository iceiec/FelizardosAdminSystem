import { useState, useEffect } from 'react'
import { Plus, Droplets, Thermometer, Calendar } from 'lucide-react'
import { mockPoolData, mockEventsData, type Event } from '@/services/mockData'
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

export default function PoolManagementPage() {
  const [pool, setPool] = useState<Pool | null>(null)
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
        await new Promise((resolve) => setTimeout(resolve, 500))
        const poolData = mockPoolData[0]
        if (poolData) {
          setPool({
            ...poolData,
            capacity: Number(poolData.capacity) || 0,
            temperature: Number(poolData.temperature) || 28,
          })
        }
        setAllEvents(mockEventsData)
      } catch (error) {
        toast.error('Failed to load pool data')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleAddEvent = () => {
    setEditingEvent(null)
    setSelectedDate('')
    setIsEventModalOpen(true)
  }

  const handleViewEvents = () => {
    setIsDetailsModalOpen(true)
  }

  const handleSaveEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    if (editingEvent) {
      setAllEvents(
        allEvents.map((e) =>
          e.id === editingEvent.id ? { ...e, ...eventData } : e,
        ),
      )
      toast.success('Event updated successfully')
    } else {
      const newEvent: Event = {
        id: `evt-${Date.now()}`,
        ...eventData,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setAllEvents([...allEvents, newEvent])
      toast.success('Event created successfully')
    }
    setIsEventModalOpen(false)
    setEditingEvent(null)
  }

  const handleDeleteEvent = (eventId: string) => {
    setAllEvents(allEvents.filter((e) => e.id !== eventId))
    toast.success('Event deleted successfully')
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
                <button onClick={() => setIsPoolModalOpen(true)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Edit Pool
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
                      ₦{Number(event.totalAmount || 0).toLocaleString()}
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
      />

      {/* Pool Modal */}
      <PoolModal
        isOpen={isPoolModalOpen}
        onClose={() => setIsPoolModalOpen(false)}
        onSubmit={(data: PoolFormData) => {
          if (pool) {
            setPool({
              ...pool,
              name: data.name,
              size: data.size,
              depth: data.depth,
              capacity: parseInt(data.capacity),
              status: data.status,
              temperature: parseInt(data.temperature) || pool.temperature,
            })
            toast.success('Pool updated successfully')
          }
          setIsPoolModalOpen(false)
        }}
        initialData={pool ? {
          name: pool.name,
          size: pool.size,
          depth: pool.depth,
          capacity: pool.capacity.toString(),
          status: pool.status,
          temperature: pool.temperature.toString(),
        } : undefined}
      />
    </div>
  )
}
