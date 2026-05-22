const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
})

// Pavillion APIs
export const pavillionAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/pavillion`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch pavillion data')
    return response.json()
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/pavillion/${id}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch pavillion')
    return response.json()
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/pavillion`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create pavillion')
    return response.json()
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/pavillion/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update pavillion')
    return response.json()
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/pavillion/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete pavillion')
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
