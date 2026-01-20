export type Sede = 'Interfibra' | 'Jaltextiles' | 'Ribel' | 'Hiltexpoy'
export type Categoria = 'Hardware' | 'Software' | 'Redes' | 'Accesos'
export type Prioridad = 'Baja' | 'Media' | 'Alta'
export type Estado = 'Pendiente' | 'En Proceso' | 'Resuelto'

export interface NotaTecnica {
  id: string
  contenido: string
  fecha: string
}

export interface Ticket {
  id: string
  numero: string
  nombre: string
  sede: Sede
  categoria: Categoria
  prioridad: Prioridad
  estado: Estado
  descripcion: string
  fechaCreacion: string
  notas: NotaTecnica[]
}

export const SEDES: Sede[] = ['Interfibra', 'Jaltextiles', 'Ribel', 'Hiltexpoy']
export const CATEGORIAS: Categoria[] = ['Hardware', 'Software', 'Redes', 'Accesos']
export const PRIORIDADES: Prioridad[] = ['Baja', 'Media', 'Alta']
export const ESTADOS: Estado[] = ['Pendiente', 'En Proceso', 'Resuelto']
