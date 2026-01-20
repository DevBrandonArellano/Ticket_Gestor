import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'ADMIN_PASSWORD no configurada en el servidor' },
        { status: 500 }
      )
    }
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Clave incorrecta' },
        { status: 401 }
      )
    }
    
    // Crear token simple (timestamp + hash básico)
    const token = Buffer.from(`admin_${Date.now()}_${Math.random()}`).toString('base64')
    
    const cookieStore = await cookies()
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 horas
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en auth:', error)
    return NextResponse.json({ error: 'Error de autenticación' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  return NextResponse.json({ success: true })
}
