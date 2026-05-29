import React, { useState } from 'react'
import { FormField, FormSelect } from './FormField'
import { X, Loader } from 'lucide-react'

export interface PoolFormData {
  id?: string
  name: string
  size: string
  depth: string
  capacity: string
  status: string
  temperature: string
}

interface PoolModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PoolFormData) => void
  initialData?: PoolFormData
  isLoading?: boolean
  title?: string
}

export function PoolModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  title,
}: PoolModalProps) {
  const [formData, setFormData] = useState<PoolFormData>(
    initialData || {
      name: '',
      size: '',
      depth: '',
      capacity: '',
      status: 'operational',
      temperature: '',
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
    if (!formData.name.trim()) newErrors.name = 'Pool name is required'
    if (!formData.size) newErrors.size = 'Size is required'
    if (!formData.depth) newErrors.depth = 'Depth is required'
    if (!formData.capacity) newErrors.capacity = 'Capacity is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    onSubmit(formData)
    setFormData({ name: '', size: '', depth: '', capacity: '', status: 'operational', temperature: '' })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>{title || (initialData ? 'Edit Pool' : 'Add Pool')}</h2>
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
              label="Pool Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter pool name"
              error={errors.name}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField
                label="Size (m)"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g., 25x10"
                error={errors.size}
                required
              />

              <FormField
                label="Depth (m)"
                name="depth"
                value={formData.depth}
                onChange={handleChange}
                placeholder="e.g., 2.5"
                error={errors.depth}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Max occupancy"
                error={errors.capacity}
                required
              />

              <FormField
                label="Temperature (°C)"
                name="temperature"
                type="number"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="Current temp"
              />
            </div>

            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'operational', label: 'Operational' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'closed', label: 'Closed' },
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
