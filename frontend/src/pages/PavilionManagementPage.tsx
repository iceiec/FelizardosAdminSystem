import { useState, useEffect } from 'react'
import { Plus, Users, MapPin, Calendar } from 'lucide-react'
import { mockPavilionData, mockEventsData, type Event } from '@/services/mockData'
import { toast } from 'sonner'
import { PavilionModal, type PavilionFormData } from '@/components/PavilionModal'
import EventModal from '@/components/EventModal'
import EventDetailsModal from '@/components/EventDetailsModal'
import CalendarView from '@/components/CalendarView'

interface Pavilion {
  id: string
  name: string
  capacity: number
  location: string
  status: string
  events: number
  lastEvent: string
}

export default function PavilionManagementPage() {
  const [pavilion, setPavilion] = useState<Pavilion | null>(null)
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isPavilionModalOpen, setIsPavilionModalOpen] = useState(false)
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
        const pavilionData = mockPavilionData[0]
        if (pavilionData) {
          setPavilion({ ...pavilionData, capacity: Number(pavilionData.capacity) || 0 })
        }
        setAllEvents(mockEventsData)
      } catch (error) {
        toast.error('Failed to load pavilion data')
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
    // Set to today's date if no date is selected
    const today = new Date().toISOString().split('T')[0]
    setSelectedDate(today)
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
      case 'active':
        return { bg: '#f0fdf4', text: '#15803d', border: '#dcfce7' }
      case 'maintenance':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' }
      default:
        return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' }
    }
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '3rem', color: '#9ca3af' }}>
        Loading pavilion...
      </div>
    )
  }

  if (!pavilion) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '3rem', color: '#9ca3af' }}>
        No pavilion found
      </div>
    )
  }

  const pavilionEvents = allEvents.filter((e) => e.facilityId === pavilion.id)
  const statusColor = getStatusColor(pavilion.status)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header with Add Event Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
            Pavilion Management
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#6b7280', margin: 0 }}>
            Manage pavilion events and bookings
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
          {/* Pavilion Card */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <div style={{ height: '4px', background: '#22c55e' }} />
            <div style={{ padding: '2rem' }}>
              {/* Title and Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  {pavilion.name}
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
                  {pavilion.status}
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: '#6b7280', fontSize: '0.9375rem' }}>
                <MapPin size={18} />
                {pavilion.location}
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                    <Users size={16} />
                    Capacity
                  </div>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                    {pavilion.capacity}
                  </p>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                    <Calendar size={16} />
                    Events
                  </div>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                    {pavilionEvents.length}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                <button onClick={handleAddEvent} className="btn btn-primary" style={{ flex: 1 }}>
                  <Plus size={16} />
                  Add Event
                </button>
                <button onClick={handleViewEvents} className="btn btn-secondary" style={{ flex: 1 }}>
                  <Calendar size={16} />
                  View Events
                </button>
                <button onClick={() => setIsPavilionModalOpen(true)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Edit Pavilion
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
              Upcoming Events ({pavilionEvents.length})
            </h3>
            {pavilionEvents.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '0.9375rem', margin: 0 }}>No events scheduled</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pavilionEvents.slice(0, 5).map((event) => (
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
            events={pavilionEvents}
            facilityId={pavilion.id}
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
        facilityId={pavilion.id}
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
        events={pavilionEvents}
        selectedDate={selectedDate}
      />

      {/* Pavilion Modal */}
      <PavilionModal
        isOpen={isPavilionModalOpen}
        onClose={() => setIsPavilionModalOpen(false)}
        onSubmit={(data: PavilionFormData) => {
          if (pavilion) {
            setPavilion({
              ...pavilion,
              name: data.name,
              capacity: parseInt(data.capacity),
              location: data.location,
              status: data.status,
            })
            toast.success('Pavilion updated successfully')
          }
          setIsPavilionModalOpen(false)
        }}
        initialData={pavilion ? {
          name: pavilion.name,
          capacity: pavilion.capacity.toString(),
          location: pavilion.location,
          status: pavilion.status,
        } : undefined}
      />
    </div>
  )
}
