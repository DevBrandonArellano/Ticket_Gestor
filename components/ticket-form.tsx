'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SEDES, CATEGORIAS, PRIORIDADES, Sede, Categoria, Prioridad } from '@/lib/types'
import { CheckCircle, Send, Loader2 } from 'lucide-react'

export function TicketForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ticketNumero, setTicketNumero] = useState('')
  
  const [formData, setFormData] = useState({
    nombre: '',
    sede: '' as Sede | '',
    categoria: '' as Categoria | '',
    prioridad: 'Media' as Prioridad,
    descripcion: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre || !formData.sede || !formData.categoria || !formData.descripcion) {
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const ticket = await response.json()
        setTicketNumero(ticket.numero)
        setSuccess(true)
      }
    } catch (error) {
      console.error('Error al crear ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewTicket = () => {
    setSuccess(false)
    setTicketNumero('')
    setFormData({
      nombre: '',
      sede: '' as Sede | '',
      categoria: '' as Categoria | '',
      prioridad: 'Media',
      descripcion: ''
    })
  }

  if (success) {
    return (
      <Card className="w-full max-w-lg border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-emerald-500/20 p-3">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Ticket Creado Exitosamente</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Tu ticket ha sido registrado con el numero:
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-500">{ticketNumero}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Guarda este numero para dar seguimiento a tu solicitud.
            </p>
            <Button onClick={handleNewTicket} variant="outline" className="mt-2 bg-transparent">
              Crear Otro Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-xl">Nuevo Ticket de Soporte</CardTitle>
        <CardDescription>
          Completa el formulario para reportar un problema o solicitud.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input
              id="nombre"
              placeholder="Ej: Juan Perez"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sede">Sede</Label>
              <Select
                value={formData.sede}
                onValueChange={(value) => setFormData({ ...formData, sede: value as Sede })}
              >
                <SelectTrigger id="sede">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {SEDES.map((sede) => (
                    <SelectItem key={sede} value={sede}>
                      {sede}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value as Categoria })}
              >
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="prioridad">Prioridad</Label>
            <Select
              value={formData.prioridad}
              onValueChange={(value) => setFormData({ ...formData, prioridad: value as Prioridad })}
            >
              <SelectTrigger id="prioridad">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORIDADES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descripcion">Descripcion del Problema</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe detalladamente el problema o solicitud..."
              rows={4}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Ticket
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
