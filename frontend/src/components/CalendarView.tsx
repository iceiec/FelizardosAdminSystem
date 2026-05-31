import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Event } from '../services/mockData'

interface CalendarViewProps {
  events: Event[]
  facilityId: string
  onDateClick: (date: string) => void
  onAddEvent: () => void
}

export default function CalendarView({ events, facilityId, onDateClick, onAddEvent }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(new Date().getFullYear(), 4, 1))

  const getFacilityEvents = (dateStr: string) => {
    if (!facilityId) {
      return events.filter((e) => e.date === dateStr)
    }
    return events.filter((e) => e.facilityId === facilityId && e.date === dateStr)
  }

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  
  const handleMonthChange = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1))
  }
  
  const handleYearChange = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1))
  }
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const currentYear = currentDate.getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const renderCalendarDay = (day: number | null) => {
    if (day === null)
      return (
        <div
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            background: 'transparent',
          }}
          key={`empty-${Math.random()}`}
        />
      )

    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayEvents = getFacilityEvents(dateStr)
    const hasEvents = dayEvents.length > 0

    return (
      <div
        key={day}
        onClick={() => {
          onDateClick(dateStr)
        }}
        style={{
          padding: window.innerWidth < 640 ? '0.5rem' : '0.75rem',
          border: hasEvents ? '2px solid #ef4444' : '1px solid #e5e7eb',
          borderRadius: '8px',
          cursor: 'pointer',
          background: hasEvents ? '#fef2f2' : '#fff',
          transition: 'all 0.2s ease',
          minHeight: window.innerWidth < 640 ? '60px' : '80px',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = hasEvents ? '#fee2e2' : '#f9fafb'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = hasEvents ? '#fef2f2' : '#fff'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div
          style={{
            fontWeight: '700',
            fontSize: window.innerWidth < 640 ? '0.875rem' : '1.125rem',
            marginBottom: '0.5rem',
            color: hasEvents ? '#dc2626' : '#1f2937',
          }}
        >
          {day}
        </div>
        {hasEvents && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.125rem',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '999px', background: event.status === 'cancelled' ? '#ef4444' : event.status === 'confirmed' ? '#15803d' : event.status === 'completed' ? '#2563eb' : '#f59e0b' }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.eventName}</span>
                </div>
                {((event as any).courtName || (event as any).facilityName) && (
                  <div style={{ fontSize: '0.65rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {(event as any).courtName || (event as any).facilityName}
                  </div>
                )}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div style={{ fontSize: '0.65rem', color: '#991b1b', fontWeight: '600' }}>
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: window.innerWidth < 640 ? '1rem' : '1.5rem',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      {/* Header with Month/Year Selectors and Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: window.innerWidth < 640 ? '0.5rem' : '1rem', flexWrap: 'wrap' }}>
        {/* Month and Year Display */}
        <div style={{ display: 'flex', gap: window.innerWidth < 640 ? '0.5rem' : '1rem', alignItems: 'center', flex: window.innerWidth < 640 ? '1 1 100%' : 1, minWidth: 0 }}>
          {/* Month Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
              Month
            </label>
            <select
              value={currentDate.getMonth()}
              onChange={(e) => handleMonthChange(parseInt(e.target.value))}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: '#fff',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: '#1f2937',
                cursor: 'pointer',
                minWidth: window.innerWidth < 640 ? 'auto' : '120px',
                flex: window.innerWidth < 640 ? 1 : 'none',
              }}
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
              Year
            </label>
            <select
              value={currentYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: '#fff',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: '#1f2937',
                cursor: 'pointer',
                minWidth: window.innerWidth < 640 ? 'auto' : '100px',
                flex: window.innerWidth < 640 ? 1 : 'none',
              }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={previousMonth}
            title="Previous month"
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2rem',
              height: '2rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <ChevronLeft size={18} color="#6b7280" />
          </button>
          <button
            onClick={nextMonth}
            title="Next month"
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2rem',
              height: '2rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <ChevronRight size={18} color="#6b7280" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: window.innerWidth < 640 ? '0.25rem' : '0.5rem', marginBottom: '1rem' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: window.innerWidth < 640 ? '0.7rem' : '0.875rem',
              color: '#6b7280',
              padding: window.innerWidth < 640 ? '0.25rem' : '0.5rem',
            }}
          >
            {window.innerWidth < 640 ? day.charAt(0) : day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: window.innerWidth < 640 ? '0.25rem' : '0.5rem', marginBottom: '1.5rem' }}>
        {days.map((day) => renderCalendarDay(day))}
      </div>

      {/* Add Event Button */}
      <button
        onClick={onAddEvent}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '0.9375rem',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        Add Event
      </button>

      {/* Legend */}
      <div
        style={{
          padding: '0.75rem',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          fontSize: '0.8125rem',
        }}
      >
        <p style={{ color: '#991b1b', margin: 0 }}>
          <span style={{ color: '#dc2626', fontWeight: '600' }}>Red dates</span> indicate days with booked events
        </p>
      </div>
    </div>
  )
}
