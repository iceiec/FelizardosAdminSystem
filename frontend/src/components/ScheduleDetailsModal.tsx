import React from 'react'
import { X, Phone, DollarSign, Printer, Clock } from 'lucide-react'
import type { Schedule } from '../services/mockData'
import { downloadReceiptPdf, formatReceiptAmount, formatReceiptDate } from '@/lib/receiptPdf'

interface ScheduleDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (schedule: Schedule) => void
  onDelete: (scheduleId: string) => void
  schedules: Schedule[]
  selectedDate: string
  courtName: string
  courts: Array<{ id: string; name: string }>
}

export default function ScheduleDetailsModal({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  schedules,
  selectedDate,
  courtName,
  courts,
}: ScheduleDetailsModalProps) {
  if (!isOpen) return null

  const normalizeDate = (value: string) => (value ? String(value).slice(0, 10) : '')

  const daySchedules = schedules.filter((s) => normalizeDate(s.date) === normalizeDate(selectedDate))

  const resolveCourtName = (schedule: Schedule) => {
    return courts.find((court) => court.id === schedule.courtId)?.name || courtName || 'Court'
  }

  const handlePrint = (schedule: Schedule) => {
    const courtLabel = resolveCourtName(schedule)
    const scheduleDate = formatReceiptDate(schedule.date)
    const remainingBalance = Number(schedule.totalAmount || 0) - Number(schedule.depositAmount || 0)
    downloadReceiptPdf({
      facilityName: 'FJA Basketball',
      documentTitle: 'Court Booking Receipt',
      fileName: `${courtLabel}_${schedule.timeSlot || 'time'}_${schedule.clientName || 'client'}_${scheduleDate}`,
      summaryRows: [
        { label: 'Court', value: courtLabel },
        { label: 'Date', value: scheduleDate },
        { label: 'Time Slot', value: schedule.timeSlot },
      ],
      sections: [
        {
          title: 'Client Information',
          rows: [
            { label: 'Client Name', value: schedule.clientName },
            { label: 'Contact', value: schedule.clientContact },
          ],
        },
        {
          title: 'Payment Summary',
          rows: [
            { label: 'Deposit Amount', value: formatReceiptAmount(schedule.depositAmount) },
            { label: 'Total Amount', value: formatReceiptAmount(schedule.totalAmount) },
            { label: 'Remaining Balance', value: formatReceiptAmount(remainingBalance) },
          ],
        },
      ],
    })
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '85vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
              Schedules on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </h2>
            {courtName && (
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                Court: {courtName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
          {daySchedules.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem', color: '#9ca3af' }}>
              <p style={{ fontSize: '0.9375rem', margin: 0 }}>No schedules booked for this date</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {daySchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  style={{
                    padding: '1rem',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                  }}
                >
                  {/* Schedule Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <Clock size={18} style={{ color: '#3b82f6' }} />
                        <h3 style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                          {schedule.timeSlot}
                        </h3>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{schedule.clientName}</p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
                        {resolveCourtName(schedule) !== 'Court' && (
                          <>Court: {resolveCourtName(schedule)}</>
                        )}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => onEdit(schedule)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          background: '#3b82f6',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#2563eb')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#3b82f6')}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handlePrint(schedule)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          background: '#10b981',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#059669')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#10b981')}
                        title="Print receipt"
                      >
                        <Printer size={14} />
                        Print
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this schedule?')) {
                            onDelete(schedule.id)
                          }
                        }}
                        style={{
                          padding: '0.5rem 0.75rem',
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#dc2626')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#ef4444')}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                      <Phone size={16} style={{ color: '#22c55e' }} />
                      {schedule.clientContact}
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0, marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600' }}>
                      Payment Details
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#6b7280' }}>Deposit:</span>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>₱{schedule.depositAmount.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#6b7280' }}>Total:</span>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>₱{schedule.totalAmount.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#6b7280' }}>Remaining:</span>
                      <span style={{ fontWeight: '600', color: '#f59e0b' }}>₱{(schedule.totalAmount - schedule.depositAmount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
