// Convierte "HH:mm" o "HH:mm:ss" a milisegundos
export const tiempoEnMs = (str) => {
  if (!str || !str.includes(':')) return 0
  const [h, m, s = '00'] = str.split(':').map(Number)
  return ((h || 0) * 3600 + (m || 0) * 60 + (s || 0)) * 1000
}

// Calcula la duración entre dos horas (inicio, fin) en formato "HH:mm" → "HH:mm:ss"
export const calcularDuracionEntreHoras = (inicio, fin) => {
  if (!inicio || !fin) return '00:00:00'
  const [horaInicio, minInicio] = inicio.split(':').map(Number)
  const [horaFin, minFin] = fin.split(':').map(Number)
  if (isNaN(horaInicio) || isNaN(minInicio) || isNaN(horaFin) || isNaN(minFin)) return '00:00:00'
  const fechaInicio = new Date(2000, 0, 1, horaInicio, minInicio, 0)
  let fechaFin = new Date(2000, 0, 1, horaFin, minFin, 0)
  if (fechaFin < fechaInicio) fechaFin = new Date(2000, 0, 2, horaFin, minFin, 0)
  const diffMs = fechaFin - fechaInicio
  const horas = Math.floor(diffMs / 3600000)
  const minutos = Math.floor((diffMs % 3600000) / 60000)
  const segundos = Math.floor((diffMs % 60000) / 1000)
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
}

// Resta dos tiempos tipo "HH:mm:ss"
export const restarTiempos = (tiempo1, tiempo2) => {
  const diff = tiempoEnMs(tiempo1) - tiempoEnMs(tiempo2)
  if (diff <= 0) return '00:00:00'
  const horas = Math.floor(diff / 3600000)
  const minutos = Math.floor((diff % 3600000) / 60000)
  const segundos = Math.floor((diff % 60000) / 1000)
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
}

// Suma los retrasos que AFECTAN EFICIENCIA (objeto con campos tipo "00:45", "00:15"...)
// Ejemplo entrada: { produccion: "00:30", calidad: "00:15", mantenimiento: "00:20", otros: "00:10" }
export const sumarRetrasosEficiencia = (retrasos) => {
  let totalMs = 0
  Object.values(retrasos).forEach(tiempo => {
    if (tiempo && tiempo.includes(':')) totalMs += tiempoEnMs(tiempo)
  })
  const horas = Math.floor(totalMs / 3600000)
  const minutos = Math.floor((totalMs % 3600000) / 60000)
  const segundos = Math.floor((totalMs % 60000) / 1000)
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
}

// Calcula horas efectivas para eficiencia: Jornada - Suma(retrasos que afectan eficiencia)
export const calcularHorasEfectivas = (horaInicio, horaFin, retrasosEficiencia) => {
  const jornada = calcularDuracionEntreHoras(horaInicio, horaFin) // "HH:mm:ss"
  const totalRetrasos = sumarRetrasosEficiencia(retrasosEficiencia)
  return restarTiempos(jornada, totalRetrasos)
}

// Eficiencia real (igual que en Excel): (Horas efectivas / Horas jornada total) * 100
export const calcularEficiencia = (horasEfectivas, horasTrabajadas) => {
  const real = tiempoEnMs(horasEfectivas)
  const total = tiempoEnMs(horasTrabajadas)
  if (total === 0) return '0'
  return ((real / total) * 100).toFixed(2)
}

// Eficacia: (Unidades envasadas reales / Unidades programadas) * 100
export const calcularEficacia = (envasadas, programadas) => {
  const a = parseFloat(envasadas)
  const b = parseFloat(programadas)
  if (!a || !b || b === 0) return '0'
  return ((a / b) * 100).toFixed(2)
}

// Formatea tiempo "HH:mm:ss" a "Xh Ymin"
export const formatearTiempo = (tiempo) => {
  if (!tiempo) return '-'
  const [horas, minutos] = tiempo.split(':')
  return `${horas}h ${minutos}min`
}

// Día de la semana para la fecha (opcional visual)
export const obtenerNombreDia = (fechaStr) => {
  if (!fechaStr) return ''
  const fecha = new Date(fechaStr + 'T00:00:00')
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return dias[fecha.getDay()]
}

// --- Catalogación de factores (para formulario y validaciones, igual que en tu estructura) ---

export const factoresNoEficiencia = [
  'Arranque (Despeje de Línea, Desinfección, Calentamiento de Máquinas y Limpieza)',
  'Apagado de Equipos',
  'Mantenimiento Preventivo',
  'Aprobación de Preparación',
  'Paradas por Stock',
  'Otros'
]

export const retrasosProduccion = [
  'Falla por Operación del Equipo',
  'Falta de Capacitación del Personal',
  'Falta de Personal',
  'No se solicitó Insumo',
  'Mala coordinación de Producción',
  'Mala Preparación de Producto',
  'Limpieza Mal Hecha',
  'Retraso en Despeje de Línea',
  'Análisis Incorrecto',
  'Paradas Injustificadas'
]

export const retrasosMantenimiento = [
  'Falla Mecánica del Equipo',
  'Retraso en la Entrega de Equipo',
  'Falla Eléctrica del Equipo'
]

export const otrosFactores = [
  'Falta de API',
  'Retraso por Falta de Personal Capacitado',
  'Retraso por falta de Personal',
  'Falta de Insumo en Almacén',
  'Corte de Energía Eléctrica Externa',
  'Falta de Contratación de Personal (RRHH)',
  'No se compró Insumo Solicitado (compras)',
  'Falta de Espacio en Almacén',
  'Otros'
]
