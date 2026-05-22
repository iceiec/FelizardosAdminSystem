import React, { useState } from 'react'
import { FormField, FormSelect } from './FormField'
import { X, Loader } from 'lucide-react'

export interface MaintenanceFormData {
  id?: string
  title: string
  location: string
  priority: string
  status: string
  assignee: string
  dueDate: string
  description?: string
}

interface MaintenanceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: MaintenanceFormData) => void
  initialData?: MaintenanceFormData
  isLoading?: boolean
  title?: string
}

export function MaintenanceModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  title,
}: MaintenanceModalProps) {
  const [formData, setFormData] = useState<MaintenanceFormData>(
    initialData || {
      title: '',
      location: '',
      priority: 'medium',
      status: 'pending',
      assignee: '',
      dueDate: '',
      description: '',
    }
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Task title is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.priority) newErrors.priority = 'Priority is required'
    if (!formData.status) newErrors.status = 'Status is required'
    if (!formData.assignee.trim()) newErrors.assignee = 'Assignee is required'
    if (!formData.dueDate.trim()) newErrors.dueDate = 'Due date is required'
    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit(formData)
    setFormData({
      title: '',
      location: '',
      priority: 'medium',
      status: 'pending',
      assignee: '',
      dueDate: '',
      description: '',
    })
    setErrors({})
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
            {title || (initialData?.id ? 'Edit Task' : 'Add New Task')}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <FormField
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Fix pavilion roof leak"
            error={errors.title}
            required
          />

          <FormField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Main Pavilion"
            error={errors.location}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormSelect
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              error={errors.priority}
              required
            />

            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
              error={errors.status}
              required
            />
          </div>

          <FormField
            label="Assigned To"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            placeholder="e.g., John Doe"
            error={errors.assignee}
            required
          />

          <FormField
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            error={errors.dueDate}
            required
          />

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Add any additional details..."
            rows={3}
          />

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Saving...
                </>
              ) : (
                initialData?.id ? 'Update' : 'Add'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
