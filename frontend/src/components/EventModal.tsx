import React, { useState, useEffect, useRef } from 'react'
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
    otherEventName: '',
    clientName: '',
    clientContact: '',
    clientFacebook: '',
    date: selectedDate || '',
    capacity: '',
    depositAmount: '',
    totalAmount: '',
    extras: [] as string[],
    status: 'pending',
  })

  const [addons, setAddons] = useState<{ name: string; price: number }[]>([])
  const [autoCalculate, setAutoCalculate] = useState(true)
  const basePriceRef = useRef<number>(0)

  useEffect(() => {
    // load addons and facilities/default pricing from localStorage
    try {
      const raw = localStorage.getItem('addons')
      if (raw) setAddons(JSON.parse(raw))
    } catch (e) {}

    try {
      const rawFacilities = localStorage.getItem('facilities')
      if (rawFacilities) {
        const facilities: any[] = JSON.parse(rawFacilities)
        const found = facilities.find((f) => f.id === facilityId)
        if (found) {
          basePriceRef.current = Number(found.defaultPrice || 0)
        }
      }
    } catch (e) {}

    try {
      const rawPricing = localStorage.getItem('defaultPricing')
      if (rawPricing && !basePriceRef.current) {
        const pricing = JSON.parse(rawPricing)
        // fallback to pavilion default as generic
        basePriceRef.current = Number(pricing.pavilion || 0)
      }
    } catch (e) {}
  }, [facilityId])

  useEffect(() => {
    if (initialEvent) {
      setFormData({
        eventName: EVENT_NAMES.includes(initialEvent.eventName) ? initialEvent.eventName : 'other',
        otherEventName: EVENT_NAMES.includes(initialEvent.eventName) ? '' : initialEvent.eventName,
        clientName: initialEvent.clientName,
        clientContact: initialEvent.clientContact,
        clientFacebook: initialEvent.clientFacebook,
        date: initialEvent.date,
        capacity: initialEvent.capacity.toString(),
        depositAmount: initialEvent.depositAmount.toString(),
        totalAmount: initialEvent.totalAmount.toString(),
        extras: initialEvent.extras,
        status: initialEvent.status || 'pending',
      })
      setAutoCalculate(false)
    } else {
      setFormData({
        eventName: '',
        otherEventName: '',
        clientName: '',
        clientContact: '',
        clientFacebook: '',
        date: selectedDate || '',
        capacity: '',
        depositAmount: '',
        totalAmount: '',
        extras: [],
        status: 'pending',
      })
      // if new event, prefill totalAmount from base price
      setFormData((prev) => ({ ...prev, totalAmount: String(basePriceRef.current || '') }))
      setAutoCalculate(true)
    }
  }, [initialEvent, selectedDate, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'totalAmount') setAutoCalculate(false)
    // clear otherEventName when selecting a built-in event
    if (name === 'eventName' && value !== 'other') {
      setFormData((prev) => ({ ...prev, otherEventName: '' }))
    }
  }

  const handleExtrasChange = (extra: string) => {
    setFormData((prev) => {
      const nextExtras = prev.extras.includes(extra) ? prev.extras.filter((e) => e !== extra) : [...prev.extras, extra]
      // auto-calc total if enabled
      if (autoCalculate) {
        const extrasSum = nextExtras.reduce((sum, name) => {
          const a = addons.find((x) => x.name === name)
          return sum + (a ? Number(a.price) : 0)
        }, 0)
        return { ...prev, extras: nextExtras, totalAmount: String((basePriceRef.current || 0) + extrasSum) }
      }
      return { ...prev, extras: nextExtras }
    })
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
      status: formData.status,
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
              <option value="other">Other (specify)</option>
            </select>

            {formData.eventName === 'other' && (
              <div className="form-group" style={{ width: '95%', marginTop: 8 }}>
                <label className="form-label">Specify Event Type <span className="required">*</span></label>
                <input
                  type="text"
                  name="otherEventName"
                  value={formData.otherEventName}
                  onChange={handleChange}
                  placeholder="Describe the event (e.g., Family Reunion)"
                  className="form-input"
                  required
                />
              </div>
            )}
          </div>

          <div className="form-group"  style={{ width: '95%' }}>
            <label className="form-label">
              Date <span className="required" >*</span>
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

          <div className="form-group" style={{ width: '95%' }}>
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

          <div className="form-group" style={{ width: '95%' }}>
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

          <div className="form-group" style={{ width: '95%' }}>
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
            <div className="form-group" style={{ width: '90%' }}>
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

            <div className="form-group" style={{ width: '90%' }}>
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

          <div className="form-group" style={{ width: '95%' }}>
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
              {(addons.length ? addons.map((a) => a.name) : EXTRAS).map((extra) => {
                const price = addons.find((x) => x.name === extra)?.price
                return (
                  <div key={extra} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`extra-${extra}`}
                      checked={formData.extras.includes(extra)}
                      onChange={() => handleExtrasChange(extra)}
                      className="mr-2"
                    />
                    <label htmlFor={`extra-${extra}`} className="text-sm cursor-pointer">
                      {extra}{price ? ` • ₱${Number(price).toLocaleString()}` : ''}
                    </label>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="form-group" style={{ width: '95%' }}>
            <label className="form-label">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-input">
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
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
