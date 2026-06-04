import { useState, useEffect } from 'react'
import { Plus, Calendar } from 'lucide-react'
import { mockCourtData, mockScheduleData, type Schedule } from '@/services/mockData'
import { courtAPI, courtScheduleAPI } from '@/services/api'
import { toast } from 'sonner'
import { CourtModal, type CourtFormData } from '@/components/CourtModal'
import ScheduleModal, { type ScheduleFormData } from '@/components/ScheduleModal'
import ScheduleDetailsModal from '@/components/ScheduleDetailsModal'
import CalendarView from '@/components/CalendarView'

const mapSchedule = (schedule: any): Schedule => ({
  id: schedule.id,
  courtId: schedule.courtId || schedule.court_id || '',
  date: schedule.date || schedule.event_date || '',
  timeSlot: schedule.timeSlot || schedule.time_slot || '',
  clientName: schedule.clientName || schedule.client_name || '',
  clientContact: schedule.clientContact || schedule.client_contact || '',
  depositAmount: Number(schedule.depositAmount || schedule.deposit_amount || 0),
  totalAmount: Number(schedule.totalAmount || schedule.total_amount || 0),
  createdAt: schedule.createdAt || schedule.created_at || '',
})

export default function CourtManagementPage() {
  const [courts, setCourts] = useState<any[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false)
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null)
  const [editingCourtId, setEditingCourtId] = useState<string | null>(null)
  const [selectedCourtId, setSelectedCourtId] = useState<string>('')
  const [scheduleInitialCourtId, setScheduleInitialCourtId] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState('')
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
        const apiCourts = await courtAPI.getAll().catch(() => [])
        if (apiCourts?.length) {
          setCourts(apiCourts.map((court: any) => ({
            id: court.id,
            name: court.name,
            surface: court.surface,
            status: court.status || 'available',
            nextBooking: court.nextBooking || court.next_booking || '',
          })))
        } else {
          setCourts(mockCourtData)
        }
        setSelectedCourtId('')

        const sourceCourts = apiCourts?.length ? apiCourts : mockCourtData
        const scheduleGroups = await Promise.all(
          sourceCourts.map(async (court: any) => {
            try {
              const rows = await courtScheduleAPI.getByCourt(court.id)
              return rows.length ? rows.map(mapSchedule) : mockScheduleData.filter((schedule) => schedule.courtId === court.id)
            } catch {
              return mockScheduleData.filter((schedule) => schedule.courtId === court.id)
            }
          }),
        )
        setSchedules(scheduleGroups.flat())
      } catch (error) {
        toast.error('Failed to load court data')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
    const onSettings = () => {
      try {
        const raw = localStorage.getItem('facilities')
        if (raw) {
          const facs = JSON.parse(raw) as any[]
          setCourts((current) => current.map((c) => ({ ...c, name: (facs.find((f) => f.id === c.id)?.name) || c.name })))
        }
      } catch (e) {}
    }
    window.addEventListener('settings:updated', onSettings)
    return () => window.removeEventListener('settings:updated', onSettings)
  }, [])

  const handleAddSchedule = () => {
    setEditingScheduleId(null)
    setSelectedDate('')
    setIsScheduleModalOpen(true)
  }

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingScheduleId(schedule.id)
    setIsScheduleModalOpen(true)
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return

    try {
      await courtScheduleAPI.delete(scheduleId)
      setSchedules((current) => current.filter((schedule) => schedule.id !== scheduleId))
      toast.success('Schedule deleted successfully')
    } catch {
      setSchedules((current) => current.filter((schedule) => schedule.id !== scheduleId))
      toast.success('Schedule deleted locally')
    }
  }

  const handleSaveSchedule = async (data: ScheduleFormData) => {
    const payload = {
      courtId: data.courtId,
      date: data.date,
      timeSlot: data.timeSlot,
      clientName: data.clientName,
      clientContact: data.clientContact,
      depositAmount: data.depositAmount,
      totalAmount: data.totalAmount,
      status: (data as any).status || 'pending',
    }

    try {
      if (editingScheduleId) {
        const updated = await courtScheduleAPI.update(editingScheduleId, payload)
        setSchedules((current) => current.map((schedule) => (schedule.id === editingScheduleId ? mapSchedule(updated) : schedule)))
        toast.success('Schedule updated successfully')
      } else {
        const created = await courtScheduleAPI.create(payload)
        setSchedules((current) => [...current, mapSchedule(created)])
        toast.success('Schedule added successfully')
      }
    } catch {
      if (editingScheduleId) {
        setSchedules((current) =>
          current.map((schedule) =>
            schedule.id === editingScheduleId
              ? { ...schedule, ...data }
              : schedule,
          ),
        )
        toast.success('Schedule updated locally')
      } else {
        const newSchedule: Schedule = {
          id: `sch-${Date.now()}`,
          ...data,
          createdAt: new Date().toISOString().split('T')[0],
        }
        setSchedules((current) => [...current, newSchedule])
        toast.success('Schedule added locally')
      }
    }
    setIsScheduleModalOpen(false)
    setEditingScheduleId(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return { bg: '#f0fdf4', text: '#15803d', border: '#dcfce7' }
      case 'booked':
        return { bg: '#dbeafe', text: '#0c4a6e', border: '#bae6fd' }
      case 'maintenance':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' }
      default:
        return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' }
    }
  }

  const courtEvents = schedules.map((schedule) => ({
    id: schedule.id,
    facilityId: schedule.courtId,
    eventName: `${schedule.timeSlot} - ${schedule.clientName}`,
    clientName: schedule.clientName,
    clientContact: schedule.clientContact,
    clientFacebook: '',
    date: schedule.date ? String(schedule.date).slice(0, 10) : '',
    capacity: 0,
    depositAmount: schedule.depositAmount,
    totalAmount: schedule.totalAmount,
    extras: [],
    status: (schedule as any).status || 'pending',
    createdAt: schedule.createdAt,
    courtName: courts.find((c) => c.id === schedule.courtId)?.name || '',
  }))

  const selectedCourtSchedules = selectedCourtId
    ? schedules.filter((schedule) => schedule.courtId === selectedCourtId)
    : schedules

  const selectedCourtName = selectedCourtId
    ? (courts.find((court) => court.id === selectedCourtId)?.name || '')
    : ''

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '3rem', color: '#9ca3af' }}>
        Loading courts...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
            Court Management
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#6b7280', margin: 0 }}>
            Manage court schedules and bookings
          </p>
        </div>
        <button onClick={handleAddSchedule} className="btn btn-primary">
          <Plus size={18} />
          Add Schedule
        </button>
      </div>

      {/* Courts with Calendars */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1.5rem' : '2rem' }}>
        {courts.map((court) => {
          const courtSchedules = schedules.filter((s) => s.courtId === court.id)
          const statusColor = getStatusColor(court.status)

          // Convert schedules to events format for calendar
          const courtEvents = courtSchedules.map((s) => ({
            id: s.id,
            facilityId: court.id,
            eventName: `${s.timeSlot} - ${s.clientName}`,
            clientName: s.clientName,
            clientContact: s.clientContact,
            clientFacebook: '',
            // Normalize date to YYYY-MM-DD so calendar comparisons match
            date: (() => {
              const d = s.date || (s as any).event_date || ''
              return d ? String(d).slice(0, 10) : ''
            })(),
            capacity: 0,
            depositAmount: s.depositAmount,
            totalAmount: s.totalAmount,
            extras: [],
            status: (s as any).status || 'pending',
            createdAt: s.createdAt,
            courtName: court.name,
          }))

          return (
            <div key={court.id} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Court Card */}
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <div style={{ height: '4px', background: court.id === '1' ? '#8b5cf6' : '#f59e0b' }} />
                <div style={{ padding: '1.5rem' }}>
                  {/* Title and Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                      {court.name}
                    </h3>
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
                      {court.status}
                    </div>
                  </div>

                  {/* Surface */}
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, marginBottom: '1rem' }}>
                    Surface: {court.surface}
                  </p>

                  {/* Stats */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      paddingBottom: '1.5rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8125rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                        Next Booking
                      </div>
                      <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        {court.nextBooking}
                      </p>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8125rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                        Schedules
                      </div>
                      <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        {courtSchedules.length}
                      </p>
                    </div>
                  </div>

                  {/* Add Schedule Button */}
                  <button
                    onClick={() => { setSelectedDate(''); setEditingScheduleId(null); setIsScheduleModalOpen(true); setScheduleInitialCourtId(court.id) }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      marginTop: '1rem',
                      background: '#3b82f6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.9375rem',
                    }}
                  >
                    <Plus size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Add Schedule for {court.name}
                  </button>
                  <button
                    onClick={() => {
                      setEditingCourtId(court.id)
                      setIsCourtModalOpen(true)
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      marginTop: '0.5rem',
                      background: '#6b7280',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.9375rem',
                    }}
                  >
                    Edit Court
                  </button>
                </div>
              </div>

              {/* Schedules List */}
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.5rem',
                }}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937', margin: 0, marginBottom: '1rem' }}>
                  Upcoming Schedules
                </h4>
                {courtSchedules.length === 0 ? (
                  <p style={{ color: '#9ca3af', fontSize: '0.9375rem', margin: 0 }}>
                    No schedules yet
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {courtSchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        style={{
                          padding: '0.75rem',
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '0.25rem' }}>
                            {schedule.timeSlot}
                          </p>
                          <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
                            {schedule.clientName} • {schedule.date}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEditSchedule(schedule)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: '#e0e7ff',
                              color: '#3730a3',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8125rem',
                              fontWeight: '600',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: '#fee2e2',
                              color: '#991b1b',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8125rem',
                              fontWeight: '600',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Shared Calendar */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>Court Calendar</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
              Shows Juliet and Andoy schedules on one calendar
            </p>
          </div>
          <select
            value={selectedCourtId || 'all'}
            onChange={(e) => {
              const value = e.target.value
              setSelectedCourtId(value === 'all' ? '' : value)
            }}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#fff',
              fontSize: '0.9375rem',
              color: '#1f2937',
            }}
          >
            <option value="all">All Courts</option>
            {courts.map((court) => (
              <option key={court.id} value={court.id}>
                {court.name}
              </option>
            ))}
          </select>
        </div>

        <CalendarView
          events={courtEvents}
          facilityId={selectedCourtId}
          onDateClick={(date) => {
            setSelectedDate(date)
            setIsDetailsModalOpen(true)
          }}
          onAddEvent={handleAddSchedule}
        />
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false)
          setEditingScheduleId(null)
        }}
        onSave={handleSaveSchedule}
        courts={courts}
        initialSchedule={
          editingScheduleId
            ? schedules.find((s) => s.id === editingScheduleId)
            : undefined
        }
        initialCourtId={scheduleInitialCourtId}
      />

      {/* Schedule Details Modal */}
      <ScheduleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedDate('')
        }}
        onEdit={handleEditSchedule}
        onDelete={handleDeleteSchedule}
        schedules={selectedCourtSchedules}
        selectedDate={selectedDate}
        courtName={selectedCourtName}
        courts={courts}
      />

      {/* Court Modal */}
      <CourtModal
        isOpen={isCourtModalOpen}
        onClose={() => {
          setIsCourtModalOpen(false)
          setEditingCourtId(null)
        }}
        onSubmit={async (data: CourtFormData) => {
          const payload = {
            name: data.name,
            surface: data.surface,
            status: data.status,
            nextBooking: data.nextBooking || null,
          }

          if (editingCourtId) {
            try {
              const updated = await courtAPI.update(editingCourtId, payload)
              setCourts((current) => current.map((c) =>
                c.id === editingCourtId
                  ? {
                      id: updated.id,
                      name: updated.name,
                      surface: updated.surface,
                      status: updated.status || 'available',
                      nextBooking: updated.nextBooking || updated.next_booking || '',
                    }
                  : c,
              ))
              toast.success('Court updated successfully')
            } catch (error) {
              try {
                const created = await courtAPI.create(payload)
                setCourts((current) => current.map((c) =>
                  c.id === editingCourtId
                    ? {
                        id: created.id,
                        name: created.name,
                        surface: created.surface,
                        status: created.status || 'available',
                        nextBooking: created.nextBooking || created.next_booking || '',
                      }
                    : c,
                ))
                toast.success('Court created successfully')
              } catch (fallbackError) {
                setCourts((current) => current.map((c) =>
                  c.id === editingCourtId
                    ? {
                        ...c,
                        name: data.name,
                        surface: data.surface,
                        status: data.status,
                        nextBooking: data.nextBooking,
                      }
                    : c,
                ))
                toast.success('Court updated locally')
              }
            } finally {
              setEditingCourtId(null)
            }
          }
          setIsCourtModalOpen(false)
        }}
        initialData={
          editingCourtId && courts.find((c) => c.id === editingCourtId)
            ? {
                name: courts.find((c) => c.id === editingCourtId)?.name,
                surface: courts.find((c) => c.id === editingCourtId)?.surface,
                status: courts.find((c) => c.id === editingCourtId)?.status,
                nextBooking: courts.find((c) => c.id === editingCourtId)?.nextBooking,
              }
            : undefined
        }
      />
    </div>
  )
}
