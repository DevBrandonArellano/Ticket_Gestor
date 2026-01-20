import { Badge } from '@/components/ui/badge'
import { Prioridad, Estado } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PriorityBadgeProps {
  prioridad: Prioridad
}

export function PriorityBadge({ prioridad }: PriorityBadgeProps) {
  const styles = {
    Baja: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    Media: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Alta: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  }

  return (
    <Badge variant="outline" className={cn(styles[prioridad])}>
      {prioridad}
    </Badge>
  )
}

interface StatusBadgeProps {
  estado: Estado
}

export function StatusBadge({ estado }: StatusBadgeProps) {
  const styles = {
    Pendiente: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'En Proceso': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Resuelto: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  }

  return (
    <Badge variant="outline" className={cn(styles[estado])}>
      {estado}
    </Badge>
  )
}
