import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Sede, Categoria, Prioridad, Ticket } from '@/lib/types'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const tickets = await db
      .collection<Ticket>('tickets')
      .find({})
      .sort({ fechaCreacion: -1 })
      .toArray()
    
    // Convertir _id a id string para el frontend
    const ticketsFormatted = tickets.map(t => ({
      ...t,
      id: t._id?.toString() || t.id,
      _id: undefined
    }))
    
    return NextResponse.json(ticketsFormatted)
  } catch (error) {
    console.error('Error al obtener tickets:', error)
    return NextResponse.json({ error: 'Error al obtener tickets' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
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
    
    const db = await getDatabase()
    
    // Obtener y actualizar contador
    const counterResult = await db
      .collection<{ _id: string; seq: number }>('counters')
      .findOneAndUpdate(
        { _id: 'ticketCounter' } as { _id: string },
        { $inc: { seq: 1 } },
        { upsert: true, returnDocument: 'after' }
      )
    
    const ticketNum = counterResult?.seq || 1
    
    const newTicket: Omit<Ticket, 'id'> & { _id?: ObjectId } = {
      numero: `TK-${String(ticketNum).padStart(4, '0')}`,
      nombre,
      sede,
      categoria,
      prioridad,
      estado: 'Pendiente',
      descripcion,
      fechaCreacion: new Date().toISOString(),
      notas: []
    }
    
    const result = await db.collection('tickets').insertOne(newTicket)
    
    return NextResponse.json({
      ...newTicket,
      id: result.insertedId.toString(),
      _id: undefined
    }, { status: 201 })
  } catch (error) {
    console.error('Error al crear ticket:', error)
    return NextResponse.json({ error: 'Error al crear ticket' }, { status: 500 })
  }
}
