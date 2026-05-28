import Dexie from 'dexie'

export const db = new Dexie('InaestudioDB')

db.version(1).stores({
  turnos: '++id, fecha, profesionalId, clienta, estadoPago',
  profesionales: '++id, nombre, usuario, activo',
  servicios: '++id, nombre, categoria, activo',
  cuentaCorriente: '++id, clienta, estado, fechaAcordada',
  saldosAFavor: '++id, clienta',
  propinas: '++id, profesionalId, turnoId, fecha',
  recordatorios: '++id, clienta, ultimaFecha',
  facturacion: '++id, turnoId, mes, anio',
  configuracion: 'clave',
  clientas: '++id, nombre'
})

export async function initializeDefaultData() {
  const profesionalesCount = await db.profesionales.count()
  
  if (profesionalesCount === 0) {
    const profesionales = [
      { nombre: 'CAMILA', porcentaje: 50, categoria: 'Uñas', usuario: 'CAMILA1234', clave: '1234', activo: true, servicios: ['Uñas acrílico', 'Uñas gel'] },
      { nombre: 'PAULA', porcentaje: 50, categoria: 'Uñas', usuario: 'PAULA1234', clave: '1234', activo: true, servicios: ['Uñas acrílico'] },
      { nombre: 'MICA', porcentaje: 50, categoria: 'Faciales', usuario: 'MICA1234', clave: '1234', activo: true, servicios: ['Facial básico'] },
      { nombre: 'JULIO', porcentaje: 100, categoria: 'Masajes', usuario: 'JULIO1234', clave: '1234', activo: true, servicios: ['Masaje relajante'] },
      { nombre: 'MAR LASH', porcentaje: 35, categoria: 'Pestañas', usuario: 'MARLASH1234', clave: '1234', activo: true, servicios: ['Pestañas extensión'] },
      { nombre: 'TAROT', porcentaje: 50, categoria: 'Tarot', usuario: 'TAROT1234', clave: '1234', activo: true, servicios: ['Lectura tarot'] },
      { nombre: 'CELESTE DEPILACION', porcentaje: 50, categoria: 'Depilación', usuario: 'CELESTEDEPILACION1234', clave: '1234', activo: true, servicios: ['Depilación completa'] },
      { nombre: 'ADRI', porcentaje: 45, categoria: 'Faciales', usuario: 'ADRI1234', clave: '1234', activo: true, servicios: ['Facial avanzado'] },
      { nombre: 'MARTINA', porcentaje: 30, categoria: 'Depilación', usuario: 'MARTINA1234', clave: '1234', activo: true, servicios: ['Depilación parcial'] },
      { nombre: 'CELESTE FACIALES', porcentaje: 70, categoria: 'Faciales', usuario: 'CELESTEFACIALES1234', clave: '1234', activo: true, servicios: ['Tratamiento facial premium'] }
    ]
    await db.profesionales.bulkAdd(profesionales)
  }

  const serviciosCount = await db.servicios.count()
  if (serviciosCount === 0) {
    const servicios = [
      { nombre: 'Uñas acrílico', categoria: 'Uñas', precioBase: 2500, duracion: 60, activo: true },
      { nombre: 'Uñas gel', categoria: 'Uñas', precioBase: 2800, duracion: 45, activo: true },
      { nombre: 'Pestañas extensión', categoria: 'Pestañas', precioBase: 3500, duracion: 90, activo: true },
      { nombre: 'Depilación completa', categoria: 'Depilación', precioBase: 2000, duracion: 45, activo: true },
      { nombre: 'Facial básico', categoria: 'Faciales', precioBase: 2200, duracion: 60, activo: true },
      { nombre: 'Facial avanzado', categoria: 'Faciales', precioBase: 3500, duracion: 90, activo: true },
      { nombre: 'Masaje relajante', categoria: 'Masajes', precioBase: 3000, duracion: 60, activo: true },
      { nombre: 'Lectura tarot', categoria: 'Tarot', precioBase: 1500, duracion: 30, activo: true }
    ]
    await db.servicios.bulkAdd(servicios)
  }
}

export async function exportAllData() {
  const data = {
    turnos: await db.turnos.toArray(),
    profesionales: await db.profesionales.toArray(),
    servicios: await db.servicios.toArray(),
    cuentaCorriente: await db.cuentaCorriente.toArray(),
    clientas: await db.clientas.toArray(),
    exportedAt: new Date().toISOString()
  }
  return data
}

export async function importData(data) {
  try {
    if (data.turnos) await db.turnos.bulkAdd(data.turnos, { allKeys: true })
    if (data.profesionales) await db.profesionales.bulkAdd(data.profesionales, { allKeys: true })
    if (data.servicios) await db.servicios.bulkAdd(data.servicios, { allKeys: true })
    if (data.cuentaCorriente) await db.cuentaCorriente.bulkAdd(data.cuentaCorriente, { allKeys: true })
    if (data.clientas) await db.clientas.bulkAdd(data.clientas, { allKeys: true })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
