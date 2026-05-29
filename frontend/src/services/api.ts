const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
})

// Pavilion APIs
export const pavilionAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/pavilion`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch pavilion data')
    return response.json()
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/pavilion/${id}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch pavilion')
    return response.json()
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/pavilion`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create pavilion')
    return response.json()
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/pavilion/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update pavilion')
    return response.json()
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/pavilion/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete pavilion')
    return response.json()
  },
}

// Pool APIs
export const poolAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/pool`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch pool data')
    return response.json()
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/pool/${id}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch pool')
    return response.json()
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/pool`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create pool')
    return response.json()
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/pool/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update pool')
    return response.json()
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/pool/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete pool')
    return response.json()
  },
}

// Court APIs
export const courtAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/court`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch court data')
    return response.json()
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/court/${id}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch court')
    return response.json()
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/court`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create court')
    return response.json()
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/court/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update court')
    return response.json()
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/court/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete court')
    return response.json()
  },
}

// Maintenance APIs
export const maintenanceAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/maintenance`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch maintenance data')
    return response.json()
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch maintenance')
    return response.json()
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/maintenance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create maintenance')
    return response.json()
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update maintenance')
    return response.json()
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete maintenance')
    return response.json()
  },
}

// Pavilion booking APIs
export const pavilionBookingAPI = {
  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/pavilion/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const e = await response.json().catch(() => ({}))
      throw new Error(e.error || 'Failed to create booking')
    }
    return response.json()
  },

  getByPavilion: async (pavilionId: string) => {
    const response = await fetch(`${API_BASE_URL}/pavilion/bookings?pavilionId=${encodeURIComponent(pavilionId)}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch bookings')
    return response.json()
  },

  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/pavilion/bookings/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    })
    if (!response.ok) throw new Error('Failed to update booking status')
    return response.json()
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/pavilion/bookings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete booking')
    return response.json()
  },
}

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || data.message || 'Login failed')
    return data
  },

  register: async (email: string, password: string, fullName: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || data.message || 'Register failed')
    return data
  },
}