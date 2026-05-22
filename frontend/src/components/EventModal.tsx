import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Event } from '../services/mockData'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<Event, 'id' | 'createdAt'>) => void
  facilityId: string
  initialEvent?: Event | null
  selectedDate?: string
}

// Placeholder lists - user will update these later
const EVENT_NAMES = ['Birthday Party', 'Wedding', 'Corporate Event', 'Seminar', 'Concert', 'Sports Event']

const EXTRAS = ['Catering', 'Sound System', 'Lighting', 'Chairs', 'Tables', 'Tent', 'Decorations']

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  facilityId,
  initialEvent,
  selectedDate,
}: EventModalProps) {
  const [formData, setFormData] = useState({
    eventName: '',
    clientName: '',
    clientContact: '',
    clientFacebook: '',
    date: selectedDate || '',
    capacity: '',
    depositAmount: '',
    totalAmount: '',
    extras: [] as string[],
  })

  useEffect(() => {
    if (initialEvent) {
      setFormData({
        eventName: initialEvent.eventName,
        clientName: initialEvent.clientName,
        clientContact: initialEvent.clientContact,
        clientFacebook: initialEvent.clientFacebook,
        date: initialEvent.date,
        capacity: initialEvent.capacity.toString(),
        depositAmount: initialEvent.depositAmount.toString(),
        totalAmount: initialEvent.totalAmount.toString(),
        extras: initialEvent.extras,
      })
    } else {
      setFormData({
        eventName: '',
        clientName: '',
        clientContact: '',
        clientFacebook: '',
        date: selectedDate || '',
        capacity: '',
        depositAmount: '',
        totalAmount: '',
        extras: [],
      })
    }
  }, [initialEvent, selectedDate, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleExtrasChange = (extra: string) => {
    setFormData((prev) => ({
      ...prev,
      extras: prev.extras.includes(extra) ? prev.extras.filter((e) => e !== extra) : [...prev.extras, extra],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.eventName || !formData.clientName || !formData.date) {
      alert('Please fill in all required fields')
      return
    }

    onSave({
      facilityId,
      eventName: formData.eventName,
      clientName: formData.clientName,
      clientContact: formData.clientContact,
      clientFacebook: formData.clientFacebook,
      date: formData.date,
      capacity: parseInt(formData.capacity) || 0,
      depositAmount: parseFloat(formData.depositAmount) || 0,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      extras: formData.extras,
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialEvent ? 'Edit Event' : 'Add Event'}</h2>
          <button onClick={onClose} className="btn btn-icon btn-secondary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">
              Event Name <span className="required">*</span>
            </label>
            <select name="eventName" value={formData.eventName} onChange={handleChange} className="form-input">
              <option value="">Select an event...</option>
              {EVENT_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Date <span className="required">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Client&apos;s Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Enter client name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Contact Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              name="clientContact"
              value={formData.clientContact}
              onChange={handleChange}
              placeholder="09xxxxxxxxx"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Facebook Account</label>
            <input
              type="text"
              name="clientFacebook"
              value={formData.clientFacebook}
              onChange={handleChange}
              placeholder="Facebook username or URL"
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 640 ? '1fr' : '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                Capacity <span className="required">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="0"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Deposit Amount <span className="required">*</span>
              </label>
              <input
                type="number"
                name="depositAmount"
                value={formData.depositAmount}
                onChange={handleChange}
                placeholder="0.00"
                className="form-input"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Total Amount <span className="required">*</span>
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              placeholder="0.00"
              className="form-input"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Extras</label>
            <div className="space-y-2">
              {EXTRAS.map((extra) => (
                <div key={extra} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`extra-${extra}`}
                    checked={formData.extras.includes(extra)}
                    onChange={() => handleExtrasChange(extra)}
                    className="mr-2"
                  />
                  <label htmlFor={`extra-${extra}`} className="text-sm cursor-pointer">
                    {extra}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
