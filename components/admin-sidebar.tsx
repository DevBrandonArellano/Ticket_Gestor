'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { SEDES, Sede } from '@/lib/types'
import { 
  LayoutDashboard, 
  Building2, 
  TicketIcon,
  MapPin
} from 'lucide-react'

interface AdminSidebarProps {
  selectedSede: Sede | 'Todas'
  onSedeChange: (sede: Sede | 'Todas') => void
  ticketCounts: Record<string, number>
}

export function AdminSidebar({ selectedSede, onSedeChange, ticketCounts }: AdminSidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/50">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <TicketIcon className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">Tickets TI</span>
        </div>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="flex flex-col gap-1">
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Vista General
          </p>
          <Button
            variant={selectedSede === 'Todas' ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-3"
            onClick={() => onSedeChange('Todas')}
          >
            <LayoutDashboard className="h-4 w-4" />
            Todos los Tickets
            <span className="ml-auto text-xs text-muted-foreground">
              {ticketCounts['Todas'] || 0}
            </span>
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col gap-1">
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Filtrar por Sede
          </p>
          {SEDES.map((sede) => (
            <Button
              key={sede}
              variant={selectedSede === sede ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3"
              onClick={() => onSedeChange(sede)}
            >
              <MapPin className="h-4 w-4" />
              {sede}
              <span className="ml-auto text-xs text-muted-foreground">
                {ticketCounts[sede] || 0}
              </span>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <Separator />
      
      <div className="p-4">
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Mesa de Ayuda TI</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
