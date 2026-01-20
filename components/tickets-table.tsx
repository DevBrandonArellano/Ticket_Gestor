'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PriorityBadge, StatusBadge } from './priority-badge'
import { Ticket } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TicketsTableProps {
  tickets: Ticket[]
  onTicketClick: (ticket: Ticket) => void
}

export function TicketsTable({ tickets, onTicketClick }: TicketsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground">No hay tickets</h3>
        <p className="text-sm text-muted-foreground mt-1">
          No se encontraron tickets con los filtros aplicados.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-24">Numero</TableHead>
            <TableHead>Solicitante</TableHead>
            <TableHead className="hidden md:table-cell">Sede</TableHead>
            <TableHead className="hidden sm:table-cell">Categoria</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="hidden lg:table-cell">Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => onTicketClick(ticket)}
            >
              <TableCell className="font-mono text-sm text-muted-foreground">
                {ticket.numero}
              </TableCell>
              <TableCell className="font-medium">{ticket.nombre}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {ticket.sede}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {ticket.categoria}
              </TableCell>
              <TableCell>
                <PriorityBadge prioridad={ticket.prioridad} />
              </TableCell>
              <TableCell>
                <StatusBadge estado={ticket.estado} />
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                {formatDate(ticket.fechaCreacion)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
