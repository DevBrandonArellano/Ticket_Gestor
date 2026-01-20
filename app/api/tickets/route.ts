import { NextResponse } from 'next/server'
import { getTickets, createTicket } from '@/lib/ticket-store'
import { Sede, Categoria, Prioridad } from '@/lib/types'

export async function GET() {
  const tickets = getTickets()
  return NextResponse.json(tickets)
}

export async function POST(request: Request) {
  const body = await request.json()
  
  const { nombre, sede, categoria, prioridad, descripcion } = body as {
    nombre: string
    sede: Sede
    categoria: Categoria
    prioridad: Prioridad
    descripcion: string
  }
  
  if (!nombre || !sede || !categoria || !prioridad || !descripcion) {
    return NextResponse.json(
      { error: 'Todos los campos son requeridos' },
      { status: 400 }
    )
  }
  
  const ticket = createTicket({ nombre, sede, categoria, prioridad, descripcion })
  return NextResponse.json(ticket, { status: 201 })
}
