import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TicketIcon, PlusCircle, LayoutDashboard, ArrowRight } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <TicketIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">Mesa de Ayuda TI</h1>
                <p className="text-xs text-muted-foreground">Sistema de Gestion de Tickets</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-12 max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Sistema de Gestion de Tickets de Soporte Tecnico
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty max-w-xl mx-auto">
              Reporta problemas tecnicos, solicita accesos y da seguimiento a tus solicitudes 
              de manera facil y rapida.
            </p>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 gap-6 w-full">
            <Card className="group hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                  <PlusCircle className="h-6 w-6" />
                </div>
                <CardTitle>Crear Nuevo Ticket</CardTitle>
                <CardDescription>
                  Reporta un problema tecnico o solicita soporte para tu equipo de trabajo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/nuevo-ticket">
                  <Button className="w-full group-hover:bg-primary/90">
                    Crear Ticket
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                  <LayoutDashboard className="h-6 w-6" />
                </div>
                <CardTitle>Panel de Administracion</CardTitle>
                <CardDescription>
                  Accede al dashboard para gestionar y dar seguimiento a todos los tickets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ir al Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Info */}
          <div className="text-center w-full pt-8 border-t border-border">
            <p className="text-3xl font-bold text-primary">4</p>
            <p className="text-sm text-muted-foreground mt-1">Sedes Activas</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Departamento de Tecnologia de la Informacion - Soporte Tecnico
        </div>
      </footer>
    </div>
  )
}
