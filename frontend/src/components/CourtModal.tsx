import React, { useState } from 'react'
import { FormField, FormSelect } from './FormField'
import { X, Loader } from 'lucide-react'

export interface CourtFormData {
  id?: string
  name: string
  surface: string
  status: string
  nextBooking: string
}

interface CourtModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CourtFormData) => void
  initialData?: CourtFormData
  isLoading?: boolean
  title?: string
}

export function CourtModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  title,
}: CourtModalProps) {
  const [formData, setFormData] = useState<CourtFormData>(
    initialData || {
      name: '',
      surface: '',
      status: 'available',
      nextBooking: '',
    }
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Court name is required'
    if (!formData.surface.trim()) newErrors.surface = 'Surface type is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    onSubmit(formData)
    setFormData({ name: '', surface: '', status: 'available', nextBooking: '' })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>{title || (initialData ? 'Edit Court' : 'Add Court')}</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn-icon"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <FormField
              label="Court Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Court 1"
              error={errors.name}
              required
            />

            <FormSelect
              label="Surface Type"
              name="surface"
              value={formData.surface}
              onChange={handleChange}
              options={[
                { value: 'hardcourt', label: 'Hardcourt' },
                { value: 'clay', label: 'Clay' },
                { value: 'grass', label: 'Grass' },
                { value: 'indoor', label: 'Indoor' },
              ]}
              error={errors.surface}
              required
            />

            <FormField
              label="Next Booking"
              name="nextBooking"
              type="datetime-local"
              value={formData.nextBooking}
              onChange={handleChange}
              placeholder="Select date and time"
            />

            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'available', label: 'Available' },
                { value: 'booked', label: 'Booked' },
                { value: 'maintenance', label: 'Maintenance' },
              ]}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {isLoading && <Loader size={16} className="animate-spin" />}
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
