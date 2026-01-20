'use client'

import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  Clock,
  Hash,
  Send,
  Sparkles
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

  useEffect(() => {
    if (ticket) {
      setEstado(ticket.estado)
    }
  }, [ticket])

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

  const getEstadoColor = (estado: Estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-orange-500/10 border-orange-500/30'
      case 'En Proceso':
        return 'bg-blue-500/10 border-blue-500/30'
      case 'Resuelto':
        return 'bg-emerald-500/10 border-emerald-500/30'
      default:
        return 'bg-muted border-border'
    }
  }

  if (!ticket) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md lg:max-w-lg p-0 flex flex-col gap-0 border-l-0 sm:border-l overflow-hidden">
        {/* Header compacto */}
        <div className="shrink-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 border-b">
          <SheetHeader className="p-3 sm:p-4">
            {/* Número y badges en una línea */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                <Hash className="h-3 w-3 text-primary" />
                <span className="text-xs font-mono font-semibold text-primary">{ticket.numero}</span>
              </div>
              <PriorityBadge prioridad={ticket.prioridad} />
              <StatusBadge estado={ticket.estado} />
            </div>
            
            {/* Título */}
            <SheetTitle className="text-base sm:text-lg font-bold text-left leading-tight mt-2">
              {ticket.categoria}
            </SheetTitle>
          </SheetHeader>
        </div>

        {/* Contenido scrolleable */}
        <ScrollArea className="flex-1">
          <div className="p-3 sm:p-4 flex flex-col gap-3">
            
            {/* Info del solicitante - Grid compacto */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase">Solicitante</p>
                  <p className="text-xs font-medium truncate">{ticket.nombre}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase">Sede</p>
                  <p className="text-xs font-medium truncate">{ticket.sede}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase">Categoría</p>
                  <p className="text-xs font-medium truncate">{ticket.categoria}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase">Creado</p>
                  <p className="text-xs font-medium truncate">{formatDate(ticket.fechaCreacion)}</p>
                </div>
              </div>
            </div>

            {/* Descripción - Compacta */}
            <div className="p-3 bg-muted/20 rounded-lg border border-border/50">
              <div className="flex items-center gap-1.5 mb-2">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold">Descripción</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {ticket.descripcion}
              </p>
            </div>

            {/* Cambiar Estado - Compacto */}
            <div className={`p-3 rounded-lg border transition-colors ${getEstadoColor(ticket.estado)}`}>
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">Gestionar Estado</span>
              </div>
              <div className="flex gap-2 items-center">
                <Label className="text-xs shrink-0">Cambiar a:</Label>
                <Select
                  value={estado || ticket.estado}
                  onValueChange={(value) => {
                    setEstado(value as Estado)
                    handleEstadoChange(value as Estado)
                  }}
                  disabled={loadingEstado}
                >
                  <SelectTrigger className="flex-1 h-8 text-xs bg-background/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((e) => (
                      <SelectItem key={e} value={e} className="text-xs">
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingEstado && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />}
              </div>
            </div>

            {/* Notas Técnicas - Compacto */}
            <div className="p-3 rounded-lg border border-border/50">
              <div className="flex items-center gap-1.5 mb-2">
                <MessageSquarePlus className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs font-semibold">Notas Técnicas</span>
                {ticket.notas.length > 0 && (
                  <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
                    {ticket.notas.length}
                  </span>
                )}
              </div>
              
              {/* Lista de notas */}
              {ticket.notas.length > 0 ? (
                <div className="flex flex-col gap-1.5 max-h-24 overflow-y-auto mb-2">
                  {ticket.notas.map((nota) => (
                    <div 
                      key={nota.id} 
                      className="bg-muted/50 p-2 rounded-md border border-border/50 text-xs"
                    >
                      <p className="text-foreground leading-relaxed">{nota.contenido}</p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" />
                        {formatDate(nota.fecha)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic mb-2">Sin notas.</p>
              )}

              {/* Agregar nota */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                <Textarea
                  placeholder="Escribe una nota técnica..."
                  rows={2}
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  className="resize-none text-xs min-h-[50px]"
                />
                <Button 
                  onClick={handleAddNota} 
                  disabled={loadingNota || !nota.trim()}
                  className="w-full sm:w-auto sm:self-end"
                  size="sm"
                >
                  {loadingNota ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="mr-1.5 h-3.5 w-3.5" />
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
