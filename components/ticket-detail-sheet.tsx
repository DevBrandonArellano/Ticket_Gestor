'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PriorityBadge, StatusBadge } from './priority-badge'
import { Ticket, ESTADOS, Estado } from '@/lib/types'
import { 
  Building2, 
  Tag, 
  Calendar, 
  User, 
  FileText, 
  MessageSquarePlus,
  Loader2,
  Clock
} from 'lucide-react'

interface TicketDetailSheetProps {
  ticket: Ticket | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function TicketDetailSheet({ ticket, open, onOpenChange, onUpdate }: TicketDetailSheetProps) {
  const [estado, setEstado] = useState<Estado | ''>('')
  const [nota, setNota] = useState('')
  const [loadingEstado, setLoadingEstado] = useState(false)
  const [loadingNota, setLoadingNota] = useState(false)

  const handleEstadoChange = async (nuevoEstado: Estado) => {
    if (!ticket) return
    setLoadingEstado(true)
    
    try {
      await fetch(`/api/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      })
      onUpdate()
    } catch (error) {
      console.error('Error al actualizar estado:', error)
    } finally {
      setLoadingEstado(false)
    }
  }

  const handleAddNota = async () => {
    if (!ticket || !nota.trim()) return
    setLoadingNota(true)
    
    try {
      await fetch(`/api/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nota: nota.trim() })
      })
      setNota('')
      onUpdate()
    } catch (error) {
      console.error('Error al agregar nota:', error)
    } finally {
      setLoadingNota(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!ticket) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-hidden flex flex-col">
        <SheetHeader className="shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-lg font-mono text-muted-foreground">{ticket.numero}</span>
            <PriorityBadge prioridad={ticket.prioridad} />
            <StatusBadge estado={ticket.estado} />
          </div>
          <SheetTitle className="text-left">{ticket.categoria}</SheetTitle>
          <SheetDescription className="text-left">
            Detalles y gestion del ticket
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="flex flex-col gap-6 pb-6">
            {/* Info del ticket */}
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Solicitante:</span>
                <span className="text-foreground font-medium">{ticket.nombre}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Sede:</span>
                <span className="text-foreground font-medium">{ticket.sede}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>Categoria:</span>
                <span className="text-foreground font-medium">{ticket.categoria}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Creado:</span>
                <span className="text-foreground font-medium">{formatDate(ticket.fechaCreacion)}</span>
              </div>
            </div>

            <Separator />

            {/* Descripcion */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Descripcion
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-3 rounded-lg">
                {ticket.descripcion}
              </p>
            </div>

            <Separator />

            {/* Cambiar Estado */}
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-medium">Cambiar Estado</Label>
              <div className="flex gap-2">
                <Select
                  value={estado || ticket.estado}
                  onValueChange={(value) => {
                    setEstado(value as Estado)
                    handleEstadoChange(value as Estado)
                  }}
                  disabled={loadingEstado}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingEstado && <Loader2 className="h-4 w-4 animate-spin self-center" />}
              </div>
            </div>

            <Separator />

            {/* Notas Tecnicas */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MessageSquarePlus className="h-4 w-4" />
                Notas Tecnicas
              </div>
              
              {ticket.notas.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {ticket.notas.map((nota) => (
                    <div key={nota.id} className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-foreground">{nota.contenido}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(nota.fecha)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay notas registradas.</p>
              )}

              <div className="flex flex-col gap-2 mt-2">
                <Textarea
                  placeholder="Escribe una nota tecnica..."
                  rows={3}
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                />
                <Button 
                  onClick={handleAddNota} 
                  disabled={loadingNota || !nota.trim()}
                  size="sm"
                >
                  {loadingNota ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                  )}
                  Agregar Nota
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
