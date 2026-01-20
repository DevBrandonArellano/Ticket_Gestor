import { NextResponse } from 'next/server'
import { getTicketById, updateTicketEstado, addNotaToTicket } from '@/lib/ticket-store'
import { Estado } from '@/lib/types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const ticket = getTicketById(id)
  
  if (!ticket) {
    return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 })
  }
  
  return NextResponse.json(ticket)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  
  if (body.estado) {
    const ticket = updateTicketEstado(id, body.estado as Estado)
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 })
    }
    return NextResponse.json(ticket)
  }
  
  if (body.nota) {
    const ticket = addNotaToTicket(id, body.nota as string)
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 })
    }
    return NextResponse.json(ticket)
  }
  
  return NextResponse.json({ error: 'Operación no válida' }, { status: 400 })
}
