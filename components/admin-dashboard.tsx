'use client'

import { useState, useMemo, useCallback } from 'react'
import useSWR from 'swr'
import { AdminSidebar } from './admin-sidebar'
import { TicketsTable } from './tickets-table'
import { TicketDetailSheet } from './ticket-detail-sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Ticket, Sede, SEDES } from '@/lib/types'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Search, 
  RefreshCw, 
  Menu,
  TicketIcon,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function AdminDashboard() {
  const { data: tickets = [], mutate, isLoading } = useSWR<Ticket[]>('/api/tickets', fetcher, {
    refreshInterval: 30000
  })
  
  const [selectedSede, setSelectedSede] = useState<Sede | 'Todas'>('Todas')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSedeFilter, setMobileSedeFilter] = useState<Sede | 'Todas'>('Todas')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Calculate ticket counts per sede
  const ticketCounts = useMemo(() => {
    const counts: Record<string, number> = { Todas: tickets.length }
    for (const sede of SEDES) {
      counts[sede] = tickets.filter(t => t.sede === sede).length
    }
    return counts
  }, [tickets])

  // Stats
  const stats = useMemo(() => {
    const pendientes = tickets.filter(t => t.estado === 'Pendiente').length
    const enProceso = tickets.filter(t => t.estado === 'En Proceso').length
    const resueltos = tickets.filter(t => t.estado === 'Resuelto').length
    const alta = tickets.filter(t => t.prioridad === 'Alta' && t.estado !== 'Resuelto').length
    return { pendientes, enProceso, resueltos, alta }
  }, [tickets])

  // Filter tickets
  const filteredTickets = useMemo(() => {
    let result = tickets
    
    const sedeFilter = selectedSede !== 'Todas' ? selectedSede : mobileSedeFilter !== 'Todas' ? mobileSedeFilter : null
    
    if (sedeFilter) {
      result = result.filter(t => t.sede === sedeFilter)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(t => 
        t.numero.toLowerCase().includes(query) ||
        t.nombre.toLowerCase().includes(query) ||
        t.descripcion.toLowerCase().includes(query) ||
        t.categoria.toLowerCase().includes(query)
      )
    }
    
    return result
  }, [tickets, selectedSede, mobileSedeFilter, searchQuery])

  const handleTicketClick = useCallback((ticket: Ticket) => {
    setSelectedTicket(ticket)
    setSheetOpen(true)
  }, [])

  const handleUpdate = useCallback(() => {
    mutate()
  }, [mutate])

  const handleSedeChange = useCallback((sede: Sede | 'Todas') => {
    setSelectedSede(sede)
    setMobileSedeFilter(sede)
    setMobileMenuOpen(false)
  }, [])

  // Mobile sidebar content
  const MobileSidebarContent = () => (
    <div className="flex flex-col h-full">
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
            Filtrar por Sede
          </p>
          <Button
            variant={selectedSede === 'Todas' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => handleSedeChange('Todas')}
          >
            Todos los Tickets
            <span className="ml-auto text-xs text-muted-foreground">
              {ticketCounts['Todas'] || 0}
            </span>
          </Button>
          {SEDES.map((sede) => (
            <Button
              key={sede}
              variant={selectedSede === sede ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleSedeChange(sede)}
            >
              {sede}
              <span className="ml-auto text-xs text-muted-foreground">
                {ticketCounts[sede] || 0}
              </span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <AdminSidebar 
        selectedSede={selectedSede} 
        onSedeChange={handleSedeChange}
        ticketCounts={ticketCounts}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="shrink-0 border-b border-border bg-card/50 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <MobileSidebarContent />
                </SheetContent>
              </Sheet>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Panel de Administracion</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Gestion de tickets de soporte tecnico
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => mutate()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="shrink-0 px-4 lg:px-6 py-4 border-b border-border bg-card/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-orange-500/5 border-orange-500/20">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-2xl font-bold text-orange-500">{stats.pendientes}</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-blue-500" />
                  En Proceso
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-2xl font-bold text-blue-500">{stats.enProceso}</p>
              </CardContent>
            </Card>
            <Card className="bg-emerald-500/5 border-emerald-500/20">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Resueltos
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-2xl font-bold text-emerald-500">{stats.resueltos}</p>
              </CardContent>
            </Card>
            <Card className="bg-rose-500/5 border-rose-500/20">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  Alta Prioridad
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-2xl font-bold text-rose-500">{stats.alta}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="shrink-0 px-4 lg:px-6 py-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por numero, nombre, descripcion..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={mobileSedeFilter}
              onValueChange={(value) => {
                setMobileSedeFilter(value as Sede | 'Todas')
                setSelectedSede(value as Sede | 'Todas')
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por sede" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas las Sedes</SelectItem>
                {SEDES.map((sede) => (
                  <SelectItem key={sede} value={sede}>
                    {sede}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-4 lg:px-6 py-4">
          <TicketsTable 
            tickets={filteredTickets} 
            onTicketClick={handleTicketClick}
          />
        </div>
      </main>

      {/* Ticket Detail Sheet */}
      <TicketDetailSheet
        ticket={selectedTicket}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
