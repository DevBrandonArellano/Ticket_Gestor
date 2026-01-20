import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Estado, NotaTecnica } from '@/lib/types'
import { ObjectId } from 'mongodb'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()
    
    let ticket
    try {
      ticket = await db.collection('tickets').findOne({ _id: new ObjectId(id) })
    } catch {
      // Si el id no es un ObjectId válido, intentar buscar por el campo id
      ticket = await db.collection('tickets').findOne({ id })
    }
    
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json({
      ...ticket,
      id: ticket._id?.toString() || ticket.id,
      _id: undefined
    })
  } catch (error) {
    console.error('Error al obtener ticket:', error)
    return NextResponse.json({ error: 'Error al obtener ticket' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const db = await getDatabase()
    
    let objectId: ObjectId
    try {
      objectId = new ObjectId(id)
    } catch {
      return NextResponse.json({ error: 'ID de ticket inválido' }, { status: 400 })
    }
    
    if (body.estado) {
      const result = await db.collection('tickets').findOneAndUpdate(
        { _id: objectId },
        { $set: { estado: body.estado as Estado } },
        { returnDocument: 'after' }
      )
      
      if (!result) {
        return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 })
      }
      
      return NextResponse.json({
        ...result,
        id: result._id?.toString(),
        _id: undefined
      })
    }
    
    if (body.nota) {
      const nota: NotaTecnica = {
        id: `n${Date.now()}`,
        contenido: body.nota as string,
        fecha: new Date().toISOString()
      }
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await db.collection('tickets').findOneAndUpdate(
        { _id: objectId },
        { $push: { notas: nota } } as any,
        { returnDocument: 'after' }
      )
      
      if (!result) {
        return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 })
      }
      
      return NextResponse.json({
        ...result,
        id: result._id?.toString(),
        _id: undefined
      })
    }
    
    return NextResponse.json({ error: 'Operación no válida' }, { status: 400 })
  } catch (error) {
    console.error('Error al actualizar ticket:', error)
    return NextResponse.json({ error: 'Error al actualizar ticket' }, { status: 500 })
  }
}
