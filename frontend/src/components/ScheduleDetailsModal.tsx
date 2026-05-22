import React from 'react'
import { X, Phone, DollarSign, Printer, Clock } from 'lucide-react'
import type { Schedule } from '../services/mockData'

interface ScheduleDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (schedule: Schedule) => void
  onDelete: (scheduleId: string) => void
  schedules: Schedule[]
  selectedDate: string
  courtName: string
}

export default function ScheduleDetailsModal({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  schedules,
  selectedDate,
  courtName,
}: ScheduleDetailsModalProps) {
  if (!isOpen) return null

  const daySchedules = schedules.filter((s) => s.date === selectedDate)

  const handlePrint = (schedule: Schedule) => {
    const receiptContent = `
<html>
<head>
<title>Receipt - ${courtName} Booking</title>
<style>
  body { font-family: Arial, sans-serif; margin: 20px; }
  .header { text-align: center; margin-bottom: 20px; }
  .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
  .subtitle { font-size: 14px; color: #666; }
  .divider { border-top: 1px solid #ccc; margin: 15px 0; }
  .details { margin-bottom: 20px; }
  .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .label { font-weight: bold; }
  .section-title { font-weight: bold; margin-top: 15px; margin-bottom: 8px; }
  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
</style>
</head>
<body>
<div class="header">
  <div class="title">Court Booking Receipt</div>
  <div class="subtitle">Event Management System</div>
</div>

<div class="details">
  <div class="section-title">Booking Information</div>
  <div class="detail-row">
    <span class="label">Court:</span>
    <span>${courtName}</span>
  </div>
  <div class="detail-row">
    <span class="label">Date:</span>
    <span>${new Date(schedule.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
  </div>
  <div class="detail-row">
    <span class="label">Time Slot:</span>
    <span>${schedule.timeSlot}</span>
  </div>
</div>

<div class="divider"></div>

<div class="details">
  <div class="section-title">Client Information</div>
  <div class="detail-row">
    <span class="label">Client Name:</span>
    <span>${schedule.clientName}</span>
  </div>
  <div class="detail-row">
    <span class="label">Contact:</span>
    <span>${schedule.clientContact}</span>
  </div>
</div>

<div class="divider"></div>

<div class="details">
  <div class="section-title">Payment Summary</div>
  <div class="detail-row">
    <span class="label">Deposit Amount:</span>
    <span>₱${schedule.depositAmount.toLocaleString()}</span>
  </div>
  <div class="detail-row">
    <span class="label">Total Amount:</span>
    <span>₱${schedule.totalAmount.toLocaleString()}</span>
  </div>
  <div class="detail-row">
    <span class="label">Remaining Balance:</span>
    <span>₱${(schedule.totalAmount - schedule.depositAmount).toLocaleString()}</span>
  </div>
</div>

<div class="divider"></div>

<div class="footer">
  <p>This receipt was generated on ${new Date().toLocaleString()}</p>
  <p>Please keep this receipt for your records.</p>
</div>
</body>
</html>
    `
    const printWindow = window.open('', '', 'height=600,width=800')
    if (printWindow) {
      printWindow.document.write(receiptContent)
      printWindow.document.close()
      printWindow.print()
    }
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
            Schedules on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </h2>
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
