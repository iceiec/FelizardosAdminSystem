import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { mockMaintenanceData } from '@/services/mockData'
import { maintenanceAPI } from '@/services/api'
import { toast } from 'sonner'
import { MaintenanceModal, type MaintenanceFormData } from '@/components/MaintenanceModal'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Input } from '@/components/ui/input'

interface MaintenanceTask extends MaintenanceFormData {
  id: string
}

export default function MaintenancePage() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null })

  useEffect(() => {
    const loadData = async () => {
      try {
        const apiTasks = await maintenanceAPI.getAll().catch(() => [])
        if (apiTasks?.length) {
          setTasks(apiTasks.map((task: any) => ({
            id: task.id,
            title: task.title,
            location: task.location,
            priority: task.priority,
            status: task.status,
            assignee: task.assignee,
            dueDate: task.dueDate || task.due_date,
            description: task.description || '',
          })))
        } else {
          setTasks(mockMaintenanceData)
        }
      } catch (error) {
        toast.error('Failed to load maintenance data')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterStatus === 'all') return matchesSearch
    return matchesSearch && task.status === filterStatus
  })

  const handleAdd = () => {
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleEdit = (task: MaintenanceTask) => {
    setEditingId(task.id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setConfirmDialog({ isOpen: true, id })
  }

  const confirmDelete = () => {
    if (confirmDialog.id) {
      const deleteTask = async () => {
        try {
          await maintenanceAPI.delete(confirmDialog.id!)
          setTasks(tasks.filter((t) => t.id !== confirmDialog.id))
          toast.success('Task deleted successfully')
        } catch (error) {
          setTasks(tasks.filter((t) => t.id !== confirmDialog.id))
          toast.success('Task deleted locally')
        }
      }
      deleteTask()
      setConfirmDialog({ isOpen: false, id: null })
    }
  }

  const handleSubmit = async (data: MaintenanceFormData) => {
    const payload = {
      title: data.title,
      location: data.location,
      priority: data.priority,
      status: data.status,
      assignee: data.assignee,
      dueDate: data.dueDate,
      description: data.description || '',
    }

    if (editingId) {
      try {
        const updated = await maintenanceAPI.update(editingId, payload)
        setTasks(tasks.map((t) => (t.id === editingId ? { ...updated, dueDate: updated.dueDate || updated.due_date } : t)))
        toast.success('Task updated successfully')
      } catch (error) {
        setTasks(tasks.map((t) => (t.id === editingId ? { ...t, ...data, id: editingId } : t)))
        toast.success('Task updated locally')
      }
    } else {
      try {
        const created = await maintenanceAPI.create(payload)
        setTasks([...tasks, { ...created, dueDate: created.dueDate || created.due_date }])
        toast.success('Task created successfully')
      } catch (error) {
        const newTask: MaintenanceTask = {
          id: `task-${Date.now()}`,
          ...data,
        }
        setTasks([...tasks, newTask])
        toast.success('Task created locally')
      }
    }
    setIsModalOpen(false)
    setEditingId(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }
      case 'medium':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' }
      case 'low':
        return { bg: '#f0fdf4', text: '#15803d', border: '#dcfce7' }
      default:
        return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb', icon: Clock }
      case 'in-progress':
        return { bg: '#dbeafe', text: '#0c4a6e', border: '#bae6fd', icon: AlertCircle }
      case 'completed':
        return { bg: '#f0fdf4', text: '#15803d', border: '#dcfce7', icon: CheckCircle }
      default:
        return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb', icon: Clock }
    }
  }

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }

  const editingTask = editingId ? tasks.find((t) => t.id === editingId) : undefined

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '3rem', color: '#9ca3af' }}>
        Loading tasks...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
            Maintenance Tasks
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#6b7280', margin: 0 }}>
            Track and manage facility maintenance operations
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="btn btn-primary"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Total Tasks', value: stats.total },
          { label: 'Pending', value: stats.pending },
          { label: 'In Progress', value: stats.inProgress },
          { label: 'Completed', value: stats.completed },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card"
            style={{
              padding: '1.75rem',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
          >
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: 0, marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1f2937', margin: 0 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div
          style={{
            padding: '1rem',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <Search size={20} style={{ color: '#9ca3af' }} />
          <Input
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '0.9375rem',
              outline: 'none',
              width: '100%',
              color: '#1f2937',
            }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {['all', 'pending', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{
                fontSize: '0.875rem',
                padding: '0.625rem 1rem',
              }}
            >
              {status === 'all' ? 'All Tasks' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div
          style={{
            padding: '3rem',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            textAlign: 'center',
            color: '#9ca3af',
          }}
        >
          <p style={{ fontSize: '0.9375rem' }}>No maintenance tasks found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredTasks.map((task) => {
            const priorityColor = getPriorityColor(task.priority)
            const statusColor = getStatusColor(task.status)
            const StatusIcon = statusColor.icon
            return (
              <div
                key={task.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '1rem', flex: 1 }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background: statusColor.bg,
                        color: statusColor.text,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <StatusIcon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
                        {task.title}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, marginBottom: '0.75rem' }}>
                        📍 {task.location}
                      </p>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div className="badge" style={{ background: priorityColor.bg, color: priorityColor.text, border: `1px solid ${priorityColor.border}` }}>
                          {task.priority} Priority
                        </div>
                        <div className="badge" style={{ background: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}>
                          {task.status.replace('-', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(task)}
                      className="btn btn-secondary"
                      style={{
                        padding: '0.625rem 0.75rem',
                      }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="btn btn-danger"
                      style={{
                        padding: '0.625rem 0.75rem',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Task Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <div>
                    <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: 0, marginBottom: '0.25rem', fontWeight: '600' }}>
                      Assigned to
                    </p>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      {task.assignee}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: 0, marginBottom: '0.25rem', fontWeight: '600' }}>
                      Due Date
                    </p>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      {task.dueDate}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <MaintenanceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingId(null)
        }}
        onSubmit={handleSubmit}
        initialData={editingTask}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Task"
        message="Are you sure you want to delete this maintenance task? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
        confirmText="Delete"
        isDangerous
      />
    </div>
  )
}
