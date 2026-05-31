// Schedule interface for court bookings
export interface Schedule {
  id: string
  courtId: string
  date: string
  timeSlot: string
  clientName: string
  clientContact: string
  depositAmount: number
  totalAmount: number
  createdAt: string
}

// Mock data for testing before backend integration
export interface Event {
  id: string
  facilityId: string
  eventName: string
  clientName: string
  clientContact: string
  clientFacebook: string
  date: string
  capacity: number
  depositAmount: number
  totalAmount: number
  extras: string[]
  status?: string
  createdAt: string
}

// Mock events data
export const mockEventsData: Event[] = [
  {
    id: 'today-1',
    facilityId: 'pav-1',
    eventName: 'Company Team Building',
    clientName: 'ABC Corporation',
    clientContact: '09123456000',
    clientFacebook: 'abccorp.fb',
    date: '2026-05-22',
    capacity: 80,
    depositAmount: 3000,
    totalAmount: 8000,
    extras: ['DJ Service', 'Catering'],
    createdAt: '2026-05-20',
  },
  {
    id: '1',
    facilityId: 'pav-1',
    eventName: 'Birthday Party',
    clientName: 'John Smith',
    clientContact: '09123456789',
    clientFacebook: 'john.smith.fb',
    date: '2026-05-25',
    capacity: 50,
    depositAmount: 2000,
    totalAmount: 5000,
    extras: [],
    createdAt: '2024-05-15',
  },
  {
    id: '2',
    facilityId: 'pav-1',
    eventName: 'Wedding Reception',
    clientName: 'Maria Garcia',
    clientContact: '09987654321',
    clientFacebook: 'maria.garcia.fb',
    date: '2026-05-26',
    capacity: 100,
    depositAmount: 5000,
    totalAmount: 15000,
    extras: [],
    createdAt: '2024-05-14',
  },
  {
    id: '3',
    facilityId: 'pav-2',
    eventName: 'Corporate Event',
    clientName: 'Tech Solutions Inc',
    clientContact: '09111222333',
    clientFacebook: 'techsolutions.fb',
    date: '2026-05-27',
    capacity: 30,
    depositAmount: 3000,
    totalAmount: 8000,
    extras: [],
    createdAt: '2024-05-13',
  },
  {
    id: '4',
    facilityId: 'pool-1',
    eventName: 'Swim Meet',
    clientName: 'Aquatic Club',
    clientContact: '09444555666',
    clientFacebook: 'aquaticclub.fb',
    date: '2026-05-28',
    capacity: 150,
    depositAmount: 4000,
    totalAmount: 10000,
    extras: [],
    createdAt: '2024-05-12',
  },
]

export const mockPavilionData = [
  {
    id: 'pav-1',
    name: 'Main Pavilion',
    capacity: 100,
    location: 'Building A',
    status: 'active',
    events: 5,
    lastEvent: '2024-05-15',
  },
  {
    id: 'pav-2',
    name: 'Garden Pavilion',
    capacity: 50,
    location: 'Garden Area',
    status: 'active',
    events: 3,
    lastEvent: '2024-05-10',
  },
  {
    id: 'pav-3',
    name: 'Riverside Pavilion',
    capacity: 75,
    location: 'Near River',
    status: 'maintenance',
    events: 0,
    lastEvent: '2024-04-20',
  },
]

export const mockPoolData = [
  {
    id: 'pool-1',
    name: 'Olympic Pool',
    size: '50m x 25m',
    depth: '2m',
    capacity: 200,
    status: 'open',
    temperature: 26,
    lastCleaned: '2024-05-20',
  },
  {
    id: 'pool-2',
    name: 'Kids Pool',
    size: '10m x 10m',
    depth: '0.5m',
    capacity: 50,
    status: 'open',
    temperature: 28,
    lastCleaned: '2024-05-20',
  },
  {
    id: 'pool-3',
    name: 'Diving Pool',
    size: '25m x 25m',
    depth: '5m',
    capacity: 100,
    status: 'closed',
    temperature: 24,
    lastCleaned: '2024-05-18',
  },
]

export const mockCourtData = [
  {
    id: '1',
    name: 'Juliet Court',
    surface: 'Wood',
    status: 'available',
    nextBooking: '2024-05-22 10:00',
  },
  {
    id: '2',
    name: 'Andoy Court',
    surface: 'Concrete',
    status: 'booked',
    nextBooking: '2024-05-22 14:00',
  },
]

// Mock schedule data for court bookings
export const mockScheduleData: Schedule[] = [
  {
    id: 'sch-1',
    courtId: '1',
    date: '2024-05-25',
    timeSlot: '4pm-6pm',
    clientName: 'John Doe',
    clientContact: '09123456789',
    depositAmount: 500,
    totalAmount: 1000,
    createdAt: '2024-05-20',
  },
  {
    id: 'sch-2',
    courtId: '1',
    date: '2024-05-26',
    timeSlot: '6pm-8pm',
    clientName: 'Jane Smith',
    clientContact: '09987654321',
    depositAmount: 500,
    totalAmount: 1000,
    createdAt: '2024-05-20',
  },
  {
    id: 'sch-3',
    courtId: '2',
    date: '2024-05-27',
    timeSlot: '5pm-7pm',
    clientName: 'Mike Johnson',
    clientContact: '09111222333',
    depositAmount: 500,
    totalAmount: 1000,
    createdAt: '2024-05-20',
  },
]

export const mockMaintenanceData = [
  {
    id: '1',
    title: 'Replace roof tiles',
    location: 'Main Pavilion',
    priority: 'high',
    status: 'in-progress',
    assignee: 'John Doe',
    dueDate: '2024-05-25',
  },
  {
    id: '2',
    title: 'Pool pump maintenance',
    location: 'Olympic Pool',
    priority: 'medium',
    status: 'pending',
    assignee: 'Jane Smith',
    dueDate: '2024-05-28',
  },
  {
    id: '3',
    title: 'Court surface repair',
    location: 'Court 3',
    priority: 'high',
    status: 'completed',
    assignee: 'Mike Johnson',
    dueDate: '2024-05-20',
  },
  {
    id: '4',
    title: 'Paint pavilion walls',
    location: 'Garden Pavilion',
    priority: 'low',
    status: 'pending',
    assignee: 'Sarah Williams',
    dueDate: '2024-06-05',
  },
]

// Mock API service for testing
export const mockAPI = {
  pavilion: {
    getAll: async () => mockPavilionData,
    getById: async (id: string) => mockPavilionData.find((p) => p.id === id),
    create: async (data: any) => ({ id: Date.now().toString(), ...data }),
    update: async (id: string, data: any) => ({ ...mockPavilionData.find((p) => p.id === id), ...data }),
    delete: async (id: string) => ({ success: true }),
  },
  pool: {
    getAll: async () => mockPoolData,
    getById: async (id: string) => mockPoolData.find((p) => p.id === id),
    create: async (data: any) => ({ id: Date.now().toString(), ...data }),
    update: async (id: string, data: any) => ({ ...mockPoolData.find((p) => p.id === id), ...data }),
    delete: async (id: string) => ({ success: true }),
  },
  court: {
    getAll: async () => mockCourtData,
    getById: async (id: string) => mockCourtData.find((c) => c.id === id),
    create: async (data: any) => ({ id: Date.now().toString(), ...data }),
    update: async (id: string, data: any) => ({ ...mockCourtData.find((c) => c.id === id), ...data }),
    delete: async (id: string) => ({ success: true }),
  },
  maintenance: {
    getAll: async () => mockMaintenanceData,
    getById: async (id: string) => mockMaintenanceData.find((m) => m.id === id),
    create: async (data: any) => ({ id: Date.now().toString(), ...data }),
    update: async (id: string, data: any) => ({ ...mockMaintenanceData.find((m) => m.id === id), ...data }),
    delete: async (id: string) => ({ success: true }),
  },
}
