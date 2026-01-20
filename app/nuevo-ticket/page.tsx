import { TicketForm } from '@/components/ticket-form'
import { ThemeToggle } from '@/components/theme-toggle'
import { TicketIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NuevoTicketPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <TicketIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">Mesa de Ayuda TI</h1>
                <p className="text-xs text-muted-foreground">Sistema de Tickets</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-foreground">Reportar un Problema</h2>
            <p className="mt-2 text-muted-foreground">
              Completa el siguiente formulario y nuestro equipo de soporte tecnico 
              atendera tu solicitud lo antes posible.
            </p>
          </div>
          
          <TicketForm />

          <p className="text-xs text-muted-foreground text-center max-w-sm">
            Si tienes una emergencia contacta directamente con el administrador 
            o mediante el correo: sistemas@interfibra.com.ec
          </p>
        </div>
      </main>
    </div>
  )
}
