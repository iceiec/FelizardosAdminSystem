import React from 'react'
import { AlertCircle, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '0.75rem',
                backgroundColor: isDangerous ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              }}
            >
              <AlertCircle
                size={20}
                style={{ color: isDangerous ? 'var(--color-danger)' : 'var(--color-info)' }}
              />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="btn-icon"
            disabled={isLoading}
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

        <div className="modal-body">
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{message}</p>
        </div>

        <div className="modal-footer">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isLoading}
            style={{ flex: 1 }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={isDangerous ? 'btn btn-danger' : 'btn btn-primary'}
            style={{ flex: 1 }}
          >
            {isLoading ? 'Loading...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
