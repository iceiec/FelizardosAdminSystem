import React from 'react'
import { X, Phone, Facebook, Users, DollarSign, Printer } from 'lucide-react'
import type { Event } from '../services/mockData'
import { downloadReceiptPdf, formatReceiptAmount, formatReceiptDate } from '@/lib/receiptPdf'

interface EventDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
  events: Event[]
  selectedDate: string
  receiptPrefix: string
  facilityName?: string
}

export default function EventDetailsModal({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  events,
  selectedDate,
  receiptPrefix,
}: EventDetailsModalProps) {
  if (!isOpen) return null

  const dayEvents = events.filter((e) => e.date === selectedDate)

  const handlePrint = (event: Event) => {
    const eventDate = formatReceiptDate(event.date)
    const remainingBalance = Number(event.totalAmount || 0) - Number(event.depositAmount || 0)
    downloadReceiptPdf({
      facilityName: facilityName || 'Felizardos Event\'s Place',
      documentTitle: 'Event Receipt',
      fileName: `${receiptPrefix || 'Pavilion'}_${event.eventName || 'event'}_${event.clientName || 'client'}_${eventDate}`,
      summaryRows: [
        { label: 'Event Name', value: event.eventName },
        { label: 'Date', value: eventDate },
        { label: 'Guest Capacity', value: `${event.capacity} people` },
      ],
      sections: [
        {
          title: 'Client Information',
          rows: [
            { label: 'Client Name', value: event.clientName },
            { label: 'Contact', value: event.clientContact },
            ...(event.clientFacebook ? [{ label: 'Facebook', value: event.clientFacebook }] : []),
          ],
        },
        {
          title: 'Payment Summary',
          rows: [
            { label: 'Deposit Amount', value: formatReceiptAmount(event.depositAmount) },
            { label: 'Total Amount', value: formatReceiptAmount(event.totalAmount) },
            { label: 'Remaining Balance', value: formatReceiptAmount(remainingBalance) },
          ],
        },
        ...(event.extras && event.extras.length > 0
          ? [{ title: 'Extras', rows: [{ label: 'Items', value: event.extras.join(', ') }] }]
          : []),
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
                      {facilityName && (
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, marginBottom: '0.25rem' }}>
                          Venue: {facilityName}
                        </p>
                      )}
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#1f2937', margin: 0, marginBottom: '0.25rem' }}>
                        {event.eventName}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{event.clientName}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '0.5rem' }}>
                          <span style={{ textTransform: 'capitalize', fontSize: '0.8125rem', padding: '0.25rem 0.5rem', borderRadius: '6px', background: event.status === 'cancelled' ? '#fee2e2' : event.status === 'confirmed' ? '#ecfdf5' : event.status === 'pending' ? '#fffbeb' : '#eef2ff', color: event.status === 'cancelled' ? '#991b1b' : event.status === 'confirmed' ? '#15803d' : '#92400e' }}>
                            {event.status || 'pending'}
                          </span>
                        </div>
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
