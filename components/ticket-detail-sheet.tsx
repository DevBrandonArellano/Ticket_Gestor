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
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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

  // Reset state when ticket changes
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
        return 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400'
      case 'En Proceso':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
      case 'Resuelto':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
      default:
        return 'bg-muted border-border'
    }
  }

  if (!ticket) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl lg:max-w-2xl p-0 flex flex-col gap-0 border-l-0 sm:border-l">
        {/* Header con gradiente */}
        <div className="shrink-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 border-b">
          <SheetHeader className="p-4 sm:p-6">
            {/* Número del ticket destacado */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full">
                <Hash className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-mono font-semibold text-primary">{ticket.numero}</span>
              </div>
            </div>
            
            {/* Título y badges */}
            <div className="flex flex-col gap-3">
              <SheetTitle className="text-xl sm:text-2xl font-bold text-left leading-tight">
                {ticket.categoria}
              </SheetTitle>
              <div className="flex flex-wrap gap-2">
                <PriorityBadge prioridad={ticket.prioridad} />
                <StatusBadge estado={ticket.estado} />
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Contenido scrolleable */}
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
            
            {/* Info del solicitante - Card compacta */}
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Solicitante</p>
                      <p className="text-sm font-medium truncate">{ticket.nombre}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                      <Building2 className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Sede</p>
                      <p className="text-sm font-medium truncate">{ticket.sede}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                      <Tag className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Categoría</p>
                      <p className="text-sm font-medium truncate">{ticket.categoria}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                      <Calendar className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Fecha de Creación</p>
                      <p className="text-sm font-medium">{formatDate(ticket.fechaCreacion)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Descripción */}
            <Card className="border-border/50">
              <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">Descripción del Problema</span>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {ticket.descripcion}
                </p>
              </CardContent>
            </Card>

            {/* Cambiar Estado */}
            <Card className={`transition-colors duration-200 ${getEstadoColor(ticket.estado)}`}>
              <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-background/50">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-semibold">Gestionar Estado</span>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <Label className="text-sm shrink-0">Cambiar a:</Label>
                  <div className="flex gap-2 flex-1">
                    <Select
                      value={estado || ticket.estado}
                      onValueChange={(value) => {
                        setEstado(value as Estado)
                        handleEstadoChange(value as Estado)
                      }}
                      disabled={loadingEstado}
                    >
                      <SelectTrigger className="flex-1 bg-background/80">
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
                    {loadingEstado && <Loader2 className="h-4 w-4 animate-spin self-center shrink-0" />}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notas Técnicas */}
            <Card className="border-border/50">
              <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10">
                    <MessageSquarePlus className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <span className="text-sm font-semibold">Notas Técnicas</span>
                  {ticket.notas.length > 0 && (
                    <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full">
                      {ticket.notas.length}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 flex flex-col gap-4">
                {/* Lista de notas existentes */}
                {ticket.notas.length > 0 ? (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {ticket.notas.map((nota) => (
                      <div 
                        key={nota.id} 
                        className="bg-muted/50 p-3 rounded-lg border border-border/50 transition-colors hover:bg-muted/70"
                      >
                        <p className="text-sm text-foreground leading-relaxed">{nota.contenido}</p>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(nota.fecha)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No hay notas registradas.</p>
                )}

                {/* Agregar nueva nota */}
                <div className="flex flex-col gap-3 pt-2 border-t border-border/50">
                  <Textarea
                    placeholder="Escribe una nota técnica sobre el progreso o solución..."
                    rows={3}
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    className="resize-none"
                  />
                  <Button 
                    onClick={handleAddNota} 
                    disabled={loadingNota || !nota.trim()}
                    className="w-full sm:w-auto sm:self-end"
                    size="sm"
                  >
                    {loadingNota ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Agregar Nota
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
