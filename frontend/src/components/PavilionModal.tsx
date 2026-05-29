import React, { useState } from 'react'
import { FormField, FormSelect } from './FormField'
import { X, Loader } from 'lucide-react'
import { toast } from 'sonner'

export interface PavilionFormData {
  id?: string
  name: string
  capacity: string
  location: string
  status: string
}

interface PavilionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PavilionFormData) => void
  initialData?: PavilionFormData
  isLoading?: boolean
  title?: string
}

export function PavilionModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  title,
}: PavilionModalProps) {
  const [formData, setFormData] = useState<PavilionFormData>(
    initialData || {
      name: '',
      capacity: '',
      location: '',
      status: 'active',
    }
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    if (!formData.name.trim()) newErrors.name = 'Pavilion name is required'
    if (!formData.capacity) newErrors.capacity = 'Capacity is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    onSubmit(formData)
    setFormData({ name: '', capacity: '', location: '', status: 'active' })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>{title || (initialData ? 'Edit Pavilion' : 'Add Pavilion')}</h2>
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
              label="Pavilion Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter pavilion name"
              error={errors.name}
              required
            />

            <FormField
              label="Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Enter capacity"
              error={errors.capacity}
              required
            />

            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              error={errors.location}
              required
            />

            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'inactive', label: 'Inactive' },
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
