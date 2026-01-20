import { Ticket, Estado, NotaTecnica } from './types'

// Simulated in-memory store (in production, use a database)
let tickets: Ticket[] = [
  {
    id: '1',
    numero: 'TK-0001',
    nombre: 'Juan Pérez',
    sede: 'Norte',
    categoria: 'Hardware',
    prioridad: 'Alta',
    estado: 'Pendiente',
    descripcion: 'La impresora del piso 3 no enciende después de un corte de luz.',
    fechaCreacion: '2026-01-18T10:30:00',
    notas: []
  },
  {
    id: '2',
    numero: 'TK-0002',
    nombre: 'María García',
    sede: 'Sur',
    categoria: 'Software',
    prioridad: 'Media',
    estado: 'En Proceso',
    descripcion: 'Error al abrir Excel, muestra mensaje de licencia expirada.',
    fechaCreacion: '2026-01-17T14:15:00',
    notas: [
      {
        id: 'n1',
        contenido: 'Se verificó la licencia, requiere renovación.',
        fecha: '2026-01-17T16:00:00'
      }
    ]
  },
  {
    id: '3',
    numero: 'TK-0003',
    nombre: 'Carlos López',
    sede: 'Central',
    categoria: 'Redes',
    prioridad: 'Alta',
    estado: 'Pendiente',
    descripcion: 'Sin conexión a internet en toda el área de contabilidad.',
    fechaCreacion: '2026-01-19T08:00:00',
    notas: []
  },
  {
    id: '4',
    numero: 'TK-0004',
    nombre: 'Ana Martínez',
    sede: 'Administrativa',
    categoria: 'Accesos',
    prioridad: 'Baja',
    estado: 'Resuelto',
    descripcion: 'Solicito acceso al sistema de nóminas para el nuevo empleado.',
    fechaCreacion: '2026-01-15T11:45:00',
    notas: [
      {
        id: 'n2',
        contenido: 'Acceso otorgado y credenciales enviadas por correo.',
        fecha: '2026-01-15T15:30:00'
      }
    ]
  },
  {
    id: '5',
    numero: 'TK-0005',
    nombre: 'Roberto Sánchez',
    sede: 'Norte',
    categoria: 'Software',
    prioridad: 'Media',
    estado: 'Pendiente',
    descripcion: 'El sistema ERP se congela al generar reportes mensuales.',
    fechaCreacion: '2026-01-19T09:20:00',
    notas: []
  },
  {
    id: '6',
    numero: 'TK-0006',
    nombre: 'Laura Torres',
    sede: 'Sur',
    categoria: 'Hardware',
    prioridad: 'Baja',
    estado: 'En Proceso',
    descripcion: 'Teclado con teclas que no responden correctamente.',
    fechaCreacion: '2026-01-16T13:00:00',
    notas: [
      {
        id: 'n3',
        contenido: 'Se ordenó teclado de reemplazo, llegará en 2 días.',
        fecha: '2026-01-17T10:00:00'
      }
    ]
  }
]

let ticketCounter = 6

export function getTickets(): Ticket[] {
  return [...tickets]
}

export function getTicketById(id: string): Ticket | undefined {
  return tickets.find(t => t.id === id)
}

export function createTicket(data: Omit<Ticket, 'id' | 'numero' | 'fechaCreacion' | 'notas' | 'estado'>): Ticket {
  ticketCounter++
  const newTicket: Ticket = {
    ...data,
    id: String(ticketCounter),
    numero: `TK-${String(ticketCounter).padStart(4, '0')}`,
    estado: 'Pendiente',
    fechaCreacion: new Date().toISOString(),
    notas: []
  }
  tickets = [newTicket, ...tickets]
  return newTicket
}

export function updateTicketEstado(id: string, estado: Estado): Ticket | undefined {
  const index = tickets.findIndex(t => t.id === id)
  if (index === -1) return undefined
  tickets[index] = { ...tickets[index], estado }
  return tickets[index]
}

export function addNotaToTicket(ticketId: string, contenido: string): Ticket | undefined {
  const index = tickets.findIndex(t => t.id === ticketId)
  if (index === -1) return undefined
  
  const nota: NotaTecnica = {
    id: `n${Date.now()}`,
    contenido,
    fecha: new Date().toISOString()
  }
  
  tickets[index] = {
    ...tickets[index],
    notas: [...tickets[index].notas, nota]
  }
  return tickets[index]
}
