import { useState, useEffect } from 'react'
import { Plus, Trash2, X, Edit2 } from 'lucide-react'

interface Facility {
  id: string
  name: string
  type: 'pavilion' | 'pool' | 'court'
  defaultPrice: number
}

interface DefaultPricing {
  pavilion: number
  pool: number
  juletCourt: number
  andoyCourt: number
}

export default function SettingsPage() {
  const [facilities, setFacilities] = useState<Facility[]>([
    { id: 'pav-1', name: 'Main Pavilion', type: 'pavilion', defaultPrice: 5000 },
    { id: 'pool-1', name: 'Olympic Pool', type: 'pool', defaultPrice: 3000 },
    { id: 'court-1', name: 'Juliet Court', type: 'court', defaultPrice: 1000 },
    { id: 'court-2', name: 'Andoy Court', type: 'court', defaultPrice: 900 },
  ])

  const [defaultPricing, setDefaultPricing] = useState<DefaultPricing>({
    pavilion: 5000,
    pool: 3000,
    juletCourt: 1000,
    andoyCourt: 900,
  })

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null)
  const [newFacilityName, setNewFacilityName] = useState('')
  const [newFacilityType, setNewFacilityType] = useState<'pavilion' | 'pool' | 'court'>('pavilion')
  const [newFacilityPrice, setNewFacilityPrice] = useState('')

  const handleAddFacility = () => {
    if (newFacilityName && newFacilityPrice) {
      const newFacility: Facility = {
        id: `${newFacilityType}-${Date.now()}`,
        name: newFacilityName,
        type: newFacilityType,
        defaultPrice: parseInt(newFacilityPrice),
      }
      setFacilities([...facilities, newFacility])
      setNewFacilityName('')
      setNewFacilityPrice('')
      setIsAddModalOpen(false)
    }
  }

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const rawPricing = localStorage.getItem('defaultPricing')
      if (rawPricing) setDefaultPricing(JSON.parse(rawPricing))
    } catch (e) {
      // ignore
    }

    try {
      const rawFacilities = localStorage.getItem('facilities')
      if (rawFacilities) setFacilities(JSON.parse(rawFacilities))
    } catch (e) {
      // ignore
    }
  }, [])

  const [addons, setAddons] = useState<Array<{ name: string; price: number }>>([])
  const [newAddonName, setNewAddonName] = useState('')
  const [newAddonPrice, setNewAddonPrice] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('addons')
      if (raw) setAddons(JSON.parse(raw))
    } catch (e) {}
  }, [])

  const handleAddAddon = () => {
    if (!newAddonName) return
    const a = { name: newAddonName, price: parseFloat(newAddonPrice) || 0 }
    setAddons((cur) => [...cur, a])
    setNewAddonName('')
    setNewAddonPrice('')
  }

  const handleDeleteAddon = (name: string) => setAddons((cur) => cur.filter((a) => a.name !== name))

  const handleSaveAddons = () => {
    try {
      localStorage.setItem('addons', JSON.stringify(addons))
      window.dispatchEvent(new Event('settings:updated'))
      alert('Add-ons saved')
    } catch (e) {
      alert('Failed to save add-ons')
    }
  }

  const handleEditFacility = (facility: Facility) => {
    setEditingFacility(facility)
    setNewFacilityName(facility.name)
    setNewFacilityType(facility.type)
    setNewFacilityPrice(facility.defaultPrice.toString())
    setIsEditModalOpen(true)
  }

  const handleSaveEditFacility = () => {
    if (editingFacility && newFacilityName && newFacilityPrice) {
      setFacilities(
        facilities.map((f) =>
          f.id === editingFacility.id
            ? {
                ...f,
                name: newFacilityName,
                type: newFacilityType,
                defaultPrice: parseInt(newFacilityPrice),
              }
            : f,
        ),
      )
      setIsEditModalOpen(false)
      setEditingFacility(null)
      setNewFacilityName('')
      setNewFacilityPrice('')
    }
  }

  const handleDeleteFacility = (id: string) => {
    if (confirm('Are you sure you want to delete this facility?')) {
      setFacilities(facilities.filter((f) => f.id !== id))
    }
  }

  const handleUpdatePricing = (key: keyof DefaultPricing, value: number) => {
    setDefaultPricing({ ...defaultPricing, [key]: value })
  }

  const handleSaveFacilities = () => {
    try {
      localStorage.setItem('facilities', JSON.stringify(facilities))
      window.dispatchEvent(new Event('settings:updated'))
      alert('Facilities saved')
    } catch (e) {
      alert('Failed to save facilities')
    }
  }

  // dispatch settings updated when saving pricing too
  const handleSavePricing = () => {
    try {
      localStorage.setItem('defaultPricing', JSON.stringify(defaultPricing))
      window.dispatchEvent(new Event('settings:updated'))
      alert('Default pricing settings saved successfully!')
    } catch (e) {
      alert('Failed to save pricing')
    }
  }

  const getFacilityTypeLabel = (type: string) => {
    switch (type) {
      case 'pavilion':
        return 'Pavilion'
      case 'pool':
        return 'Pool'
      case 'court':
        return 'Court'
      default:
        return type
    }
  }

  const getFacilityTypeColor = (type: string) => {
    switch (type) {
      case 'pavilion':
        return { bg: '#dcfce7', text: '#15803d' }
      case 'pool':
        return { bg: '#cffafe', text: '#0369a1' }
      case 'court':
        return { bg: '#fef08a', text: '#854d0e' }
      default:
        return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
      {/* Facilities Management */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937', margin: 0 }}>
              Facilities Management
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#6b7280', margin: 0, marginTop: '0.5rem' }}>
              Add, edit, or manage your pavilions, pools, and courts
            </p>
          </div>
          <button
            onClick={() => {
              setNewFacilityName('')
              setNewFacilityPrice('')
              setIsAddModalOpen(true)
            }}
            style={{
              padding: '0.75rem 1rem',
              background: '#22c55e',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#16a34a')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#22c55e')}
          >
            <Plus size={18} />
            Add Facility
          </button>
        </div>

        {/* Facilities List */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))', gap: isMobile ? '1rem' : '1rem' }}>
          {facilities.map((facility) => {
            const colors = getFacilityTypeColor(facility.type)
            return (
              <div
                key={facility.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  background: '#f9fafb',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                    {facility.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEditFacility(facility)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#3b82f6',
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                      title="Edit facility"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteFacility(facility.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      background: colors.bg,
                      color: colors.text,
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: '600',
                    }}
                  >
                    {getFacilityTypeLabel(facility.type)}
                  </span>
                </div>

                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0, marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: '600' }}>
                    Default Price
                  </p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#22c55e', margin: 0 }}>
                    ₱{facility.defaultPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Default Pricing Settings */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>
          Default Pricing Configuration
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#6b7280', margin: 0, marginBottom: '1.5rem' }}>
          Set default prices that will be suggested when creating new bookings
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Pavilion Pricing */}
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              Pavilion Default Price
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#6b7280' }}>₱</span>
              <input
                type="number"
                value={defaultPricing.pavilion}
                onChange={(e) => handleUpdatePricing('pavilion', parseInt(e.target.value) || 0)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  color: '#1f2937',
                  background: '#fff',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Pool Pricing */}
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              Pool Default Price
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#6b7280' }}>₱</span>
              <input
                type="number"
                value={defaultPricing.pool}
                onChange={(e) => handleUpdatePricing('pool', parseInt(e.target.value) || 0)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  color: '#1f2937',
                  background: '#fff',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Juliet Court Pricing */}
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              Juliet Court Default Price (per slot)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#6b7280' }}>₱</span>
              <input
                type="number"
                value={defaultPricing.juletCourt}
                onChange={(e) => handleUpdatePricing('juletCourt', parseInt(e.target.value) || 0)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  color: '#1f2937',
                  background: '#fff',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Andoy Court Pricing */}
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              Andoy Court Default Price (per slot)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#6b7280' }}>₱</span>
              <input
                type="number"
                value={defaultPricing.andoyCourt}
                onChange={(e) => handleUpdatePricing('andoyCourt', parseInt(e.target.value) || 0)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  color: '#1f2937',
                  background: '#fff',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={handleSavePricing}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#22c55e',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#16a34a')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#22c55e')}
          >
            Save Pricing Settings
          </button>
          <button
            onClick={handleSaveFacilities}
            style={{
              marginLeft: '1rem',
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#2563eb')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#3b82f6')}
          >
            Save Facilities
          </button>
          <button
            onClick={handleSaveAddons}
            style={{
              marginLeft: '1rem',
              padding: '0.75rem 1.5rem',
              background: '#8b5cf6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#7c3aed')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#8b5cf6')}
          >
            Save Add-ons
          </button>
        </div>
      </div>

      {/* Add Facility Modal */}
      {isAddModalOpen && (
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
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '2rem',
              width: '100%',
              maxWidth: '400px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                Add New Facility
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '0.25rem',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Facility Type
                </label>
                <select
                  value={newFacilityType}
                  onChange={(e) => setNewFacilityType(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    color: '#1f2937',
                    background: '#fff',
                  }}
                >
                  <option value="pavilion">Pavilion</option>
                  <option value="pool">Pool</option>
                  <option value="court">Court</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Facility Name
                </label>
                <input
                  type="text"
                  value={newFacilityName}
                  onChange={(e) => setNewFacilityName(e.target.value)}
                  placeholder="e.g., New Pavilion"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    color: '#1f2937',
                    background: '#fff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Default Price
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: '#6b7280' }}>₱</span>
                  <input
                    type="number"
                    value={newFacilityPrice}
                    onChange={(e) => setNewFacilityPrice(e.target.value)}
                    placeholder="0"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.9375rem',
                      color: '#1f2937',
                      background: '#fff',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFacility}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#22c55e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#16a34a')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#22c55e')}
                >
                  Add Facility
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Facility Modal */}
      {isEditModalOpen && (
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
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: '500px',
              padding: '2rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                Edit Facility
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
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
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Facility Type
                </label>
                <select
                  value={newFacilityType}
                  onChange={(e) => setNewFacilityType(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    color: '#1f2937',
                    background: '#fff',
                  }}
                >
                  <option value="pavilion">Pavilion</option>
                  <option value="pool">Pool</option>
                  <option value="court">Court</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Facility Name
                </label>
                <input
                  type="text"
                  value={newFacilityName}
                  onChange={(e) => setNewFacilityName(e.target.value)}
                  placeholder="e.g., New Pavilion"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    color: '#1f2937',
                    background: '#fff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Default Price
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: '#6b7280' }}>₱</span>
                  <input
                    type="number"
                    value={newFacilityPrice}
                    onChange={(e) => setNewFacilityPrice(e.target.value)}
                    placeholder="0"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.9375rem',
                      color: '#1f2937',
                      background: '#fff',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditFacility}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#2563eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#3b82f6')}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add-ons Management */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Add-ons</h2>
        <p style={{ color: '#6b7280' }}>Define add-on services (extras) and their default prices.</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
          <input placeholder="Add-on name" value={newAddonName} onChange={(e) => setNewAddonName(e.target.value)} style={{ padding: '0.5rem', flex: 1 }} />
          <input placeholder="Price" type="number" value={newAddonPrice} onChange={(e) => setNewAddonPrice(e.target.value)} style={{ padding: '0.5rem', width: '140px' }} />
          <button onClick={handleAddAddon} className="btn btn-primary">Add</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {addons.length === 0 ? <p style={{ color: '#9ca3af' }}>No add-ons defined.</p> : addons.map((a) => (
            <div key={a.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f9fafb' }}>
              <div>{a.name} • ₱{a.price.toLocaleString()}</div>
              <button onClick={() => handleDeleteAddon(a.name)} className="btn btn-danger">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
