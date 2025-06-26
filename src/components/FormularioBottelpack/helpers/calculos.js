export const tiempoEnMs = (str) => {
  if (!str || !str.includes(':')) return 0
  const [h, m, s = '00'] = str.split(':').map(Number)
  return ((h || 0) * 3600 + (m || 0) * 60 + (s || 0)) * 1000
}

export const formatearTiempo = (tiempo) => {
  if (!tiempo) return '-'
  const [horas, minutos] = tiempo.split(':')
  return `${horas}h ${minutos}min`
}

export const formatearPorcentaje = (valor) => {
  if (!valor) return '0%'
  return `${parseFloat(valor).toFixed(2)}%`
}


export const formatearCantidad = (valor) => {
  if (!valor) return '0'
  return Number(valor).toLocaleString()
}


export const calcularSumaHorasRetrasadas = (factores) => {
  if (!factores) return '00:00'
  const minutosTotales = Object.values(factores)
    .reduce((total, item) => {
      if (!item?.tiempo) return total
      const [h, m] = item.tiempo.split(':').map(Number)
      return total + (h * 60) + m
    }, 0)

  const horas = Math.floor(minutosTotales / 60)
  const minutos = minutosTotales % 60
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`
}

export const calcularEnvasadoIdeal = (horasSoplado, cantidadIdealHora) => {
  if (!horasSoplado || !cantidadIdealHora) return 0
  const [h, m] = horasSoplado.split(':').map(Number)
  const horasDecimal = h + (m / 60)
  return Math.round(horasDecimal * cantidadIdealHora)
}


export const calcularHorasNoEficientes = (causasRetraso) => {
  const totalMs = Object.values(causasRetraso)
    .filter(obj => obj?.tiempo)
    .map(obj => {
      const [horas = '00', minutos = '00'] = obj.tiempo.split(':')
      const horasMs = parseInt(horas) * 3600 * 1000
      const minutosMs = parseInt(minutos) * 60 * 1000
      return horasMs + minutosMs
    })
    .reduce((acc, ms) => acc + ms, 0)

  const horas = Math.floor(totalMs / 3600000)
  const minutos = Math.floor((totalMs % 3600000) / 60000)
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`
}

export const calcularEficiencia = (horasReales, horasTrabajadas) => {
  const real = tiempoEnMs(horasReales)
  const total = tiempoEnMs(horasTrabajadas)
  if (total === 0) return '0'
  return ((real / total) * 100).toFixed(2)
}

export const calcularEficacia = (envasadas, programadas) => {
  const a = parseFloat(envasadas)
  const b = parseFloat(programadas)
  if (!a || !b || b === 0) return '0'
  return ((a / b) * 100).toFixed(2)
}

export const restarTiempos = (tiempo1, tiempo2) => {
  const diff = tiempoEnMs(tiempo1) - tiempoEnMs(tiempo2)
  if (diff <= 0) return '00:00:00'
  const horas = Math.floor(diff / 3600000)
  const minutos = Math.floor((diff % 3600000) / 60000)
  const segundos = Math.floor((diff % 60000) / 1000)
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
}

export const obtenerFechaActual = () => {
  const fecha = new Date()
  return fecha.toISOString().split('T')[0]
}


export const calcularDuracionEntreHoras = (inicio, fin) => {
  if (!inicio || !fin) return '00:00:00'
  const [horaInicio, minInicio] = inicio.split(':').map(Number)
  const [horaFin, minFin] = fin.split(':').map(Number)
  if (isNaN(horaInicio) || isNaN(minInicio) || isNaN(horaFin) || isNaN(minFin)) {
    return '00:00:00'
  }
  const fechaInicio = new Date(2000, 0, 1, horaInicio, minInicio, 0)
  let fechaFin = new Date(2000, 0, 1, horaFin, minFin, 0)
  if (fechaFin < fechaInicio) fechaFin = new Date(2000, 0, 2, horaFin, minFin, 0)
  const diffMs = fechaFin - fechaInicio
  const horas = Math.floor(diffMs / 3600000)
  const minutos = Math.floor((diffMs % 3600000) / 60000)
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`
}


export const calcularHorasIdeal = (cantidadEnvasada, cantidadIdealHora) => {
  if (!cantidadEnvasada || !cantidadIdealHora) return '00:00'
  const horasDecimal = cantidadEnvasada / cantidadIdealHora
  const horas = Math.floor(horasDecimal)
  const minutos = Math.round((horasDecimal - horas) * 60)
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`
}



export const obtenerNombreDia = (fechaStr) => {
  if (!fechaStr) return ''
  const fecha = new Date(fechaStr + 'T00:00:00')
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return dias[fecha.getDay()]
}

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
