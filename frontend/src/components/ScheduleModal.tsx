import React, { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import type { Schedule } from '../services/mockData'

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ScheduleFormData) => void
  courts: Array<{ id: string; name: string }>
  initialSchedule?: Schedule
}

export interface ScheduleFormData {
  courtId: string
  date: string
  timeSlot: string
  clientName: string
  clientContact: string
  depositAmount: number
  totalAmount: number
}

const COURT_TIME_SLOTS: Record<string, string[]> = {
  '1': ['4pm-6pm', '6pm-8pm', '8pm-10pm', '10pm-12am', 'Custom'],
  '2': ['5pm-7pm', '7pm-9pm', '9pm-11pm', 'Custom'],
}

export default function ScheduleModal({
  isOpen,
  onClose,
  onSave,
  courts,
  initialSchedule,
}: ScheduleModalProps) {
  const [formData, setFormData] = useState<ScheduleFormData>(
    initialSchedule
      ? {
          courtId: initialSchedule.courtId,
          date: initialSchedule.date,
          timeSlot: initialSchedule.timeSlot,
          clientName: initialSchedule.clientName,
          clientContact: initialSchedule.clientContact,
          depositAmount: initialSchedule.depositAmount,
          totalAmount: initialSchedule.totalAmount,
        }
      : {
          courtId: courts[0]?.id || '',
          date: '',
          timeSlot: '',
          clientName: '',
          clientContact: '',
          depositAmount: 500,
          totalAmount: 1000,
        },
  )

  const [customTime, setCustomTime] = useState('')

  const availableTimeSlots = useMemo(
    () => COURT_TIME_SLOTS[formData.courtId] || [],
    [formData.courtId],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.courtId || !formData.date || !formData.clientName || !formData.clientContact) {
      alert('Please fill in all required fields')
      return
    }

    const finalTimeSlot = formData.timeSlot === 'Custom' ? customTime : formData.timeSlot

    if (!finalTimeSlot) {
      alert('Please select or enter a time slot')
      return
    }

    onSave({
      ...formData,
      timeSlot: finalTimeSlot,
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialSchedule ? 'Edit Schedule' : 'Add Schedule'}</h2>
          <button onClick={onClose} className="btn btn-icon btn-secondary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-4">
          {/* Court Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">Court *</label>
            <select
              value={formData.courtId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  courtId: e.target.value,
                  timeSlot: '',
                })
              }
              className="w-full px-3 py-2 border border-var(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
              required
            >
              {courts.map((court) => (
                <option key={court.id} value={court.id}>
                  {court.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-var(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
              required
            />
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-sm font-semibold mb-2">Time Slot *</label>
            <select
              value={formData.timeSlot}
              onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
              className="w-full px-3 py-2 border border-var(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
              required
            >
              <option value="">Select a time slot</option>
              {availableTimeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Time Slot */}
          {formData.timeSlot === 'Custom' && (
            <div>
              <label className="block text-sm font-semibold mb-2">Custom Time (e.g., 3pm-5pm) *</label>
              <input
                type="text"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="e.g., 3pm-5pm"
                className="w-full px-3 py-2 border border-var(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
              />
            </div>
          )}

          {/* Client Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Client Name *</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-3 py-2 border border-var(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
              required
            />
          </div>

          {/* Client Contact */}
          <div>
            <label className="block text-sm font-semibold mb-2">Contact Number *</label>
            <input
              type="tel"
              value={formData.clientContact}
              onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })}
              className="w-full px-3 py-2 border border-var(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
              required
            />
          </div>

          {/* Deposit Amount */}
          <div>
            <label className="block text-sm font-semibold mb-2">Deposit Amount *</label>
            <input
              type="number"
              value={formData.depositAmount}
              onChange={(e) =>
                setFormData({ ...formData, depositAmount: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-var(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
              required
              min="0"
            />
          </div>

          {/* Total Amount */}
          <div>
            <label className="block text-sm font-semibold mb-2">Total Amount *</label>
            <input
              type="number"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-var(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
              required
              min="0"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              {initialSchedule ? 'Update' : 'Add'} Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
