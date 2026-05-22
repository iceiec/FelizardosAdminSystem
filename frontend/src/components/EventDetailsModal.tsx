import React from 'react'
import { X, Phone, Facebook, Users, DollarSign, Printer } from 'lucide-react'
import type { Event } from '../services/mockData'

interface EventDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
  events: Event[]
  selectedDate: string
}

export default function EventDetailsModal({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  events,
  selectedDate,
}: EventDetailsModalProps) {
  if (!isOpen) return null

  const dayEvents = events.filter((e) => e.date === selectedDate)

  const handlePrint = (event: Event) => {
    const receiptContent = `
<html>
<head>
<title>Receipt - ${event.eventName}</title>
<style>
  body { font-family: Arial, sans-serif; margin: 20px; }
  .header { text-align: center; margin-bottom: 20px; }
  .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
  .subtitle { font-size: 14px; color: #666; }
  .divider { border-top: 1px solid #ccc; margin: 15px 0; }
  .details { margin-bottom: 20px; }
  .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .label { font-weight: bold; }
  .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: bold; font-size: 16px; }
  .section-title { font-weight: bold; margin-top: 15px; margin-bottom: 8px; }
  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
</style>
</head>
<body>
<div class="header">
  <div class="title">Receipt</div>
  <div class="subtitle">Event Management System</div>
</div>

<div class="details">
  <div class="section-title">Event Information</div>
  <div class="detail-row">
    <span class="label">Event Name:</span>
    <span>${event.eventName}</span>
  </div>
  <div class="detail-row">
    <span class="label">Date:</span>
    <span>${new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
  </div>
  <div class="detail-row">
    <span class="label">Guest Capacity:</span>
    <span>${event.capacity} people</span>
  </div>
</div>

<div class="divider"></div>

<div class="details">
  <div class="section-title">Client Information</div>
  <div class="detail-row">
    <span class="label">Client Name:</span>
    <span>${event.clientName}</span>
  </div>
  <div class="detail-row">
    <span class="label">Contact:</span>
    <span>${event.clientContact}</span>
  </div>
  ${event.clientFacebook ? `
  <div class="detail-row">
    <span class="label">Facebook:</span>
    <span>${event.clientFacebook}</span>
  </div>
  ` : ''}
</div>

<div class="divider"></div>

<div class="details">
  <div class="section-title">Payment Summary</div>
  <div class="detail-row">
    <span class="label">Deposit Amount:</span>
    <span>₱${event.depositAmount.toLocaleString()}</span>
  </div>
  <div class="detail-row">
    <span class="label">Total Amount:</span>
    <span>₱${event.totalAmount.toLocaleString()}</span>
  </div>
  <div class="detail-row">
    <span class="label">Remaining Balance:</span>
    <span>₱${(event.totalAmount - event.depositAmount).toLocaleString()}</span>
  </div>
</div>

${event.extras && event.extras.length > 0 ? `
<div class="divider"></div>

<div class="details">
  <div class="section-title">Extras</div>
  <div class="detail-row">
    <span>${event.extras.join(', ')}</span>
  </div>
</div>
` : ''}

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
            Events on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
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
          {dayEvents.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem', color: '#9ca3af' }}>
              <p style={{ fontSize: '0.9375rem', margin: 0 }}>No events scheduled for this date</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    padding: '1rem',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                  }}
                >
                  {/* Event Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#1f2937', margin: 0, marginBottom: '0.25rem' }}>
                        {event.eventName}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{event.clientName}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          onEdit(event)
                          onClose()
                        }}
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
                        onClick={() => handlePrint(event)}
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
                          if (confirm('Are you sure you want to delete this event?')) {
                            onDelete(event.id)
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
                      {event.clientContact}
                    </div>
                    {event.clientFacebook && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Facebook size={16} style={{ color: '#22c55e' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.clientFacebook}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                      <Users size={16} style={{ color: '#22c55e' }} />
                      {event.capacity} people
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                      <DollarSign size={16} style={{ color: '#22c55e' }} />
                      ₱{event.totalAmount.toLocaleString()}
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0, marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600' }}>
                      Payment Details
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#6b7280' }}>Deposit:</span>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>₱{event.depositAmount.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#6b7280' }}>Total:</span>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>₱{event.totalAmount.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#6b7280' }}>Remaining:</span>
                      <span style={{ fontWeight: '600', color: '#f59e0b' }}>₱{(event.totalAmount - event.depositAmount).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Extras */}
                  {event.extras && event.extras.length > 0 && (
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0, marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600' }}>
                        Extras
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {event.extras.map((extra) => (
                          <span
                            key={extra}
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem',
                              background: '#dbeafe',
                              color: '#1e40af',
                              borderRadius: '6px',
                              fontSize: '0.8125rem',
                              fontWeight: '500',
                            }}
                          >
                            {extra}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
