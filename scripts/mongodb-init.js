// ===========================================
// Script para MongoDB Atlas - Ticket Gestor
// ===========================================
// 
// No necesitas ejecutar ningún script manualmente.
// MongoDB crea las colecciones automáticamente cuando insertas datos.
//
// Sin embargo, si deseas inicializar la base de datos con índices
// y el contador, ejecuta esto en MongoDB Compass o Atlas Shell:


// 1. Conectarte a tu base de datos
use tickets_db

// 2. Crear índices para mejor rendimiento
db.tickets.createIndex({ fechaCreacion: -1 })
db.tickets.createIndex({ estado: 1 })
db.tickets.createIndex({ sede: 1 })

// 3. Inicializar el contador de tickets (opcional, se crea automáticamente)
db.counters.insertOne({
  _id: "ticketCounter",
  seq: 0
})

// 4. (Opcional) Insertar un ticket de prueba
db.tickets.insertOne({
  numero: "TK-0001",
  nombre: "Usuario de Prueba",
  sede: "Interfibra",
  categoria: "Software",
  prioridad: "Media",
  estado: "Pendiente",
  descripcion: "Ticket de prueba para verificar la conexión",
  fechaCreacion: new Date().toISOString(),
  notas: []
})

// Actualizar el contador si insertaste el ticket de prueba
db.counters.updateOne(
  { _id: "ticketCounter" },
  { $set: { seq: 1 } }
)
