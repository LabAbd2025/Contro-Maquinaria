// =================== HELPERS HORAS Y MINUTOS ===================

// Normaliza cualquier string a "HH:mm" para evitar errores en suma/conversión
export const normalizarHoraMin = (valor) => {
  if (!valor) return "00:00";
  if (/^\d{1,2}$/.test(valor)) {
    // Solo minutos (ej: "5" -> "00:05")
    const m = parseInt(valor, 10);
    return `00:${String(m).padStart(2, "0")}`;
  }
  if (/^\d{3,4}$/.test(valor)) {
    // "930" -> "09:30"
    const num = valor.padStart(4, "0");
    return `${num.slice(0, 2)}:${num.slice(2, 4)}`;
  }
  if (/^\d{1,2}:\d{1,2}$/.test(valor)) {
    const [h, m] = valor.split(":").map(n => String(parseInt(n, 10)).padStart(2, "0"));
    return `${h}:${m}`;
  }
  if (/^\d{1,2}:\d{1,2}:\d{1,2}$/.test(valor)) {
    const [h, m] = valor.split(":");
    return `${String(parseInt(h)).padStart(2, "0")}:${String(parseInt(m)).padStart(2, "0")}`;
  }
  return "00:00";
};

// Convierte "HH:mm" o "HH:mm:ss" a milisegundos
export const tiempoEnMs = (str) => {
  if (!str || !str.includes(':')) return 0;
  const partes = str.split(':').map(Number);
  const h = partes[0] || 0;
  const m = partes[1] || 0;
  const s = partes[2] || 0;
  return (h * 3600 + m * 60 + s) * 1000;
}

// Formatea tiempo "HH:mm:ss" o "HH:mm" a "Xh Ymin"
export const formatearTiempo = (tiempo) => {
  if (!tiempo) return '-';
  const [horas, minutos] = tiempo.split(':');
  return `${horas}h ${minutos}min`;
};

export const formatearPorcentaje = (valor) => {
  if (!valor) return '0%';
  return `${parseFloat(valor).toFixed(2)}%`;
};

export const formatearCantidad = (valor) => {
  if (!valor) return '0';
  return Number(valor).toLocaleString();
};

// ==== FUNCIONES PARA SUMAR TIEMPOS DE RETRASOS ====

// Suma todos los tiempos (propiedad .tiempo) de un objeto de retrasos { ...factor: {tiempo, descripcion} }
export const calcularHorasNoEficientes = (causasRetraso) => {
  let totalMs = 0;
  Object.values(causasRetraso).forEach(obj => {
    if (obj?.tiempo && obj.tiempo.includes(':')) {
      totalMs += tiempoEnMs(normalizarHoraMin(obj.tiempo));
    }
  });
  return msAHoraMinSeg(totalMs);
};

// Alias compatible
export const calcularSumaHorasRetrasadas = calcularHorasNoEficientes;

// Suma retrasos de cualquier tipo: soporta { factor: "00:15" } o { factor: {tiempo: "00:15", descripcion: "X"} }
export const sumarRetrasosEficiencia = (retrasos) => {
  let totalMs = 0;
  Object.values(retrasos).forEach(obj => {
    if (typeof obj === 'string' && obj.includes(':')) {
      totalMs += tiempoEnMs(normalizarHoraMin(obj));
    } else if (obj?.tiempo && obj.tiempo.includes(':')) {
      totalMs += tiempoEnMs(normalizarHoraMin(obj.tiempo));
    }
  });
  return msAHoraMinSeg(totalMs);
};

// Devuelve "HH:mm:ss" a partir de ms
export const msAHoraMinSeg = (ms) => {
  const horas = Math.floor(ms / 3600000);
  const minutos = Math.floor((ms % 3600000) / 60000);
  const segundos = Math.floor((ms % 60000) / 1000);
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
};

// ================================================

// Resta dos tiempos "HH:mm:ss" o "HH:mm"
export const restarTiempos = (tiempo1, tiempo2) => {
  const diff = tiempoEnMs(normalizarHoraMin(tiempo1)) - tiempoEnMs(normalizarHoraMin(tiempo2));
  if (diff <= 0) return '00:00:00';
  return msAHoraMinSeg(diff);
};

// Calcula duración entre dos horas (inicio, fin) en formato "HH:mm" o "HH:mm:ss"
export const calcularDuracionEntreHoras = (inicio, fin) => {
  if (!inicio || !fin) return '00:00:00';
  const [horaInicio, minInicio] = normalizarHoraMin(inicio).split(':').map(Number);
  const [horaFin, minFin] = normalizarHoraMin(fin).split(':').map(Number);
  if (isNaN(horaInicio) || isNaN(minInicio) || isNaN(horaFin) || isNaN(minFin)) return '00:00:00';
  const fechaInicio = new Date(2000, 0, 1, horaInicio, minInicio, 0);
  let fechaFin = new Date(2000, 0, 1, horaFin, minFin, 0);
  if (fechaFin < fechaInicio) fechaFin = new Date(2000, 0, 2, horaFin, minFin, 0);
  const diffMs = fechaFin - fechaInicio;
  return msAHoraMinSeg(diffMs);
};

// Calcula horas efectivas para eficiencia: Jornada - Suma(retrasos que afectan eficiencia)
export const calcularHorasEfectivas = (horaInicio, horaFin, retrasosEficiencia) => {
  const jornada = calcularDuracionEntreHoras(horaInicio, horaFin); // "HH:mm:ss"
  const totalRetrasos = sumarRetrasosEficiencia(retrasosEficiencia);
  return restarTiempos(jornada, totalRetrasos);
};

// Eficiencia real: (Horas efectivas / Horas trabajadas jornada) * 100
export const calcularEficiencia = (horasEfectivas, horasTrabajadas) => {
  const real = tiempoEnMs(normalizarHoraMin(horasEfectivas));
  const total = tiempoEnMs(normalizarHoraMin(horasTrabajadas));
  if (total === 0) return '0';
  return ((real / total) * 100).toFixed(2);
};

// Eficacia: (Unidades envasadas reales / Unidades programadas) * 100
export const calcularEficacia = (envasadas, programadas) => {
  const a = parseFloat(envasadas);
  const b = parseFloat(programadas);
  if (!a || !b || b === 0) return '0';
  return ((a / b) * 100).toFixed(2);
};

// Calcular tiempo ideal para una cantidad envasada dado un ritmo ideal por hora
export const calcularHorasIdeal = (cantidadEnvasada, cantidadIdealHora) => {
  if (!cantidadEnvasada || !cantidadIdealHora) return '00:00';
  const horasDecimal = cantidadEnvasada / cantidadIdealHora;
  const horas = Math.floor(horasDecimal);
  const minutos = Math.round((horasDecimal - horas) * 60);
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
};

export const obtenerFechaActual = () => {
  const fecha = new Date();
  return fecha.toISOString().split('T')[0];
};

export const obtenerNombreDia = (fechaStr) => {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr + 'T00:00:00');
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[fecha.getDay()];
};

export const calcularEnvasadoIdeal = (horasSoplado, cantidadIdealHora) => {
  if (!horasSoplado || !cantidadIdealHora) return 0;
  const [h, m] = normalizarHoraMin(horasSoplado).split(':').map(Number);
  const horasDecimal = h + (m / 60);
  return Math.round(horasDecimal * cantidadIdealHora);
};

// ----- Catálogos para tu formulario -----
// Factores que No Afectan la Eficiencia
export const factoresNoEficiencia = [
  "Arranque (Despeje de Línea, Desinfección, Calentamiento de Máquinas y Limpieza)",
  "Apagado de Equipos",
  "Mantenimiento Preventivo",
  "Aprobación de Preparación",
  "Paradas por Stock",
  "Otros (No afectan eficiencia)"
]

// Retrasos por Producción
export const retrasosProduccion = [
  "Falla por Operación del Equipo",
  "Falta de Capacitación del Personal",
  "Falta de Personal",
  "No se solicitó Insumo",
  "Mala coordinación de Producción",
  "Mala Preparación de Producto",
  "Limpieza Mal Hecha",
  "Retraso en Despeje de Línea",
  "Análisis Incorrecto",
  "Paradas Injustificadas"
]

// Retrasos por Control de Calidad
export const retrasosCalidadControl = [
  "Falta de API (Autorización de Puesta en Marcha)",
  "Esperando Resultado de Control de Calidad",
  "Reanálisis de Producto",
  "Ajuste de Parámetros por Rechazo",
  "Falta de Material de Control",
  "Liberación Tardía",
  "Otros (Control de Calidad)"
]

// Retrasos por Mantenimiento
export const retrasosMantenimiento = [
  "Falla Mecánica del Equipo",
  "Retraso en la Entrega de Equipo",
  "Falla Eléctrica del Equipo",
  "Mantenimiento Correctivo",
  "Mantenimiento Programado"
]

// Otros Factores
export const otrosFactores = [
  "Retraso por Falta de Personal Capacitado",
  "Retraso por falta de Personal",
  "Falta de Insumo en Almacén",
  "Corte de Energía Eléctrica Externa",
  "Falta de Contratación de Personal (RRHH)",
  "No se compró Insumo Solicitado (compras)",
  "Falta de Espacio en Almacén",
  "Otros"
]

// Opcional: Placeholders sugeridos para cada campo de descripción
export const placeholdersRetrasos = {
  "Arranque (Despeje de Línea, Desinfección, Calentamiento de Máquinas y Limpieza)": "Ej: Toma de muestras para calidad",
  "Apagado de Equipos": "Ej: Apagado al terminar producción",
  "Mantenimiento Preventivo": "Ej: Cambio de filtro programado",
  "Aprobación de Preparación": "Ej: Esperando autorización de jefe de área",
  "Paradas por Stock": "Ej: Sin envases en almacén",
  "Otros (No afectan eficiencia)": "Describe el motivo",
  "Falla por Operación del Equipo": "Ej: Atascamiento en válvula de llenado",
  "Falta de Capacitación del Personal": "Ej: Personal nuevo en capacitación",
  "Falta de Personal": "Ej: 2 operarios ausentes",
  "No se solicitó Insumo": "Ej: No llegó plástico para soplado",
  "Mala coordinación de Producción": "Ej: Cambio de orden en programación",
  "Mala Preparación de Producto": "Ej: Parámetros de mezcla incorrectos",
  "Limpieza Mal Hecha": "Ej: Repetición de limpieza por residuos",
  "Retraso en Despeje de Línea": "Ej: Línea ocupada por lote anterior",
  "Análisis Incorrecto": "Ej: Error en medición de viscosidad",
  "Paradas Injustificadas": "Ej: Pausa sin motivo reportado",
  "Falta de API (Autorización de Puesta en Marcha)": "Ej: Esperando documento API",
  "Esperando Resultado de Control de Calidad": "Ej: Control de calidad demorado",
  "Reanálisis de Producto": "Ej: Repetición de análisis microbiológico",
  "Ajuste de Parámetros por Rechazo": "Ej: Ajuste de temperatura por defecto",
  "Falta de Material de Control": "Ej: Sin reactivos para ensayo",
  "Liberación Tardía": "Ej: Aprobación fuera de tiempo",
  "Otros (Control de Calidad)": "Describe el motivo",
  "Falla Mecánica del Equipo": "Ej: Rotura de correa transportadora",
  "Retraso en la Entrega de Equipo": "Ej: Máquina no disponible a tiempo",
  "Falla Eléctrica del Equipo": "Ej: Fallo en tablero eléctrico",
  "Mantenimiento Correctivo": "Ej: Cambio urgente de motor",
  "Mantenimiento Programado": "Ej: Parada por mantenimiento anual",
  "Retraso por Falta de Personal Capacitado": "Ej: Solo personal nuevo disponible",
  "Retraso por falta de Personal": "Ej: Ausencia de técnico",
  "Falta de Insumo en Almacén": "Ej: No hay botellas en stock",
  "Corte de Energía Eléctrica Externa": "Ej: Apagón por tormenta",
  "Falta de Contratación de Personal (RRHH)": "Ej: Vacante sin cubrir",
  "No se compró Insumo Solicitado (compras)": "Ej: Insumo no tramitado",
  "Falta de Espacio en Almacén": "Ej: No hay espacio para almacenamiento",
  "Otros": "Describe el motivo"
}
