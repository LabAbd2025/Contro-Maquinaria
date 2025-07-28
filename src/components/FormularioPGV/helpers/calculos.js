// --- Normaliza cualquier string a "HH:mm"
export const normalizarHoraMin = (valor) => {
  if (!valor || typeof valor !== 'string') return "00:00";
  valor = valor.trim();
  if (/^\d{1,2}$/.test(valor)) {
    const m = parseInt(valor, 10);
    return `00:${String(m).padStart(2, "0")}`;
  }
  if (/^\d{3,4}$/.test(valor)) {
    const num = valor.padStart(4, "0");
    return `${num.slice(0, 2)}:${num.slice(2, 4)}`;
  }
  if (/^\d{1,2}:\d{1,2}$/.test(valor)) {
    const [h, m] = valor.split(":").map(n => String(parseInt(n, 10)).padStart(2, "0"));
    return `${h}:${m}`;
  }
  return "00:00";
};

// --- Convierte "HH:mm" a milisegundos
export const tiempoEnMs = (str) => {
  if (!str || !str.includes(':')) return 0;
  const [h, m] = normalizarHoraMin(str).split(':').map(Number);
  return (h * 3600 + m * 60) * 1000;
};

// --- Formatea tiempo "HH:mm" a "Xh Ymin"
export const formatearTiempo = (tiempo) => {
  if (!tiempo) return '-';
  const [h, m] = normalizarHoraMin(tiempo).split(':').map(Number);
  return `${h}h ${m}min`;
};

// --- Formatea porcentaje a "xx.xx%"
export const formatearPorcentaje = (valor) => {
  const num = parseFloat(valor);
  if (isNaN(num)) return '0%';
  return `${num.toFixed(2)}%`;
};

// --- Formatea cantidad con separador de miles
export const formatearCantidad = (valor) => {
  const num = Number(valor);
  if (isNaN(num) || !isFinite(num)) return '0';
  return num.toLocaleString();
};

// --- Suma todos los tiempos (.tiempo) de un objeto { ...factor: {tiempo, descripcion} }
export const calcularSumaHorasRetrasadas = (causasRetraso) => {
  let totalMs = 0;
  Object.values(causasRetraso || {}).forEach(obj => {
    if (obj && typeof obj === "object" && obj.tiempo && obj.tiempo.includes(':')) {
      totalMs += tiempoEnMs(obj.tiempo);
    }
  });
  return msAHoraMin(totalMs);
};
// Alias para compatibilidad Bottlepack
export const calcularHorasNoEficientes = calcularSumaHorasRetrasadas;

// --- Convierte ms a "HH:mm"
export const msAHoraMin = (ms) => {
  if (isNaN(ms) || ms <= 0) return '00:00';
  const horas = Math.floor(ms / 3600000);
  const minutos = Math.floor((ms % 3600000) / 60000);
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
};
// --- Devuelve nombre del día (Ej: "Lunes")
export const obtenerNombreDia = (fechaStr) => {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr + 'T00:00:00');
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[fecha.getDay()];
};


// --- Resta dos tiempos "HH:mm"
export const restarTiempos = (tiempo1, tiempo2) => {
  const diff = tiempoEnMs(tiempo1) - tiempoEnMs(tiempo2);
  if (diff <= 0) return '00:00';
  return msAHoraMin(diff);
};

// --- Calcula duración entre dos horas ("HH:mm")
export const calcularDuracionEntreHoras = (inicio, fin) => {
  if (!inicio || !fin) return '00:00';
  const [h1, m1] = normalizarHoraMin(inicio).split(':').map(Number);
  const [h2, m2] = normalizarHoraMin(fin).split(':').map(Number);
  let mins1 = h1 * 60 + m1;
  let mins2 = h2 * 60 + m2;
  if (mins2 < mins1) mins2 += 24 * 60; // Soporta cruces de medianoche
  const diff = mins2 - mins1;
  const horas = Math.floor(diff / 60);
  const mins = diff % 60;
  return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

// --- Calcula horas ideales: Cantidad Envasada / Cantidad Ideal por Hora
export function calcularHorasIdeal(cantidadEnvasada, cantidadIdealPorHora) {
  const envasada = Number(cantidadEnvasada);
  const idealHora = Number(cantidadIdealPorHora);
  if (!envasada || !idealHora || isNaN(envasada) || isNaN(idealHora)) return "00:00";
  const horas = envasada / idealHora;
  const totalMins = Math.round(horas * 60);
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// --- Eficacia: (Cantidad Envasada / Cantidad Programada) × 100
export const calcularEficacia = (envasadas, programadas) => {
  const a = parseFloat(envasadas);
  const b = parseFloat(programadas);
  if (!a || !b || b === 0) return '0';
  return ((a / b) * 100).toFixed(2);
};

// --- Eficiencia: (Horas Reales / Horas Trabajadas) × 100
export const calcularEficiencia = (horasReales, horasTrabajadas) => {
  const realesMs = tiempoEnMs(horasReales);
  const trabajadasMs = tiempoEnMs(horasTrabajadas);
  if (trabajadasMs === 0) return '0';
  return ((realesMs / trabajadasMs) * 100).toFixed(2);
};

// --- Calcula horas reales: Horas trabajadas - suma(retrasos)
export const calcularHorasReales = (horasTrabajadas, totalHorasRetrasadas) => {
  return restarTiempos(horasTrabajadas, totalHorasRetrasadas);
};

// --- Calcula envasado ideal: Horas trabajadas × Cantidad ideal/hora
export const calcularEnvasadoIdeal = (horasTrabajadas, cantidadIdealPorHora) => {
  if (!horasTrabajadas || !cantidadIdealPorHora) return 0;
  const [h, m] = normalizarHoraMin(horasTrabajadas).split(':').map(Number);
  const horasDecimal = h + (m / 60);
  return Math.round(horasDecimal * cantidadIdealPorHora);
};

export const obtenerFechaActual = () => {
  const fecha = new Date();
  return fecha.toISOString().split('T')[0]; // Retorna en formato YYYY-MM-DD
}

// =================== CATÁLOGOS Y PLACEHOLDERS PARA PPV/PGV ===================

// === PAROS DE MAQUINA ===
export const parosMaquina = [
  "Falla Eléctrica",
  "Falla Mecánica",
  "Falla Electrónica",
  "Falla PLC",
  "Falla Motores"
];

// === PAROS DE PRODUCCIÓN ===
export const parosProduccion = [
  "Falta de Personal",
  "Esperando Material de Envase",
  "Esperando Material de Empaque",
  "Esperando Insumos"
];

// === PAROS DE CALIDAD ===
export const parosCalidad = [
  "Esperando Análisis",
  "No Conformidad Calidad",
  "Reproceso"
];

// === PAROS DE MANTENIMIENTO ===
export const parosMantenimiento = [
  "Mantenimiento Programado",
  "Mantenimiento Correctivo"
];

// === OTROS PAROS ===
export const otrosParos = [
  "Paro de Limpieza",
  "Cambio de Formato",
  "Paros Administrativos"
];

// === PLACEHOLDERS PARA DESCRIPCIÓN DE PAROS/RETRASOS ===
export const placeholdersParos = {
  // Máquina
  "Falla Eléctrica": "Ej: Corte de energía, falla en tablero",
  "Falla Mecánica": "Ej: Atascamiento, rotura de piezas",
  "Falla Electrónica": "Ej: Tarjeta dañada, sensor fallando",
  "Falla PLC": "Ej: Problema en el controlador",
  "Falla Motores": "Ej: Motor quemado o fuera de servicio",

  // Producción
  "Falta de Personal": "Ej: Operario ausente, cambio de turno",
  "Esperando Material de Envase": "Ej: Botellas, bolsas, tapones",
  "Esperando Material de Empaque": "Ej: Cajas, etiquetas, film",
  "Esperando Insumos": "Ej: Falta de materia prima",

  // Calidad
  "Esperando Análisis": "Ej: Demora en resultados de laboratorio",
  "No Conformidad Calidad": "Ej: Producto rechazado, reproceso",
  "Reproceso": "Ej: Producto reprocesado por defectos",

  // Mantenimiento
  "Mantenimiento Programado": "Ej: Parada semanal, mensual",
  "Mantenimiento Correctivo": "Ej: Reparación urgente",

  // Otros
  "Paro de Limpieza": "Ej: Limpieza obligatoria o extraordinaria",
  "Cambio de Formato": "Ej: Cambio de presentación o tamaño",
  "Paros Administrativos": "Ej: Esperando autorización, visita auditoría"
}

// ALIAS para compatibilidad universal con Bottlepack y PGV/PPV

export const factoresNoEficiencia = otrosParos; // Para formularios que piden "factoresNoEficiencia"
export const retrasosProduccion = parosProduccion;
export const retrasosCalidadControl = parosCalidad;
export const retrasosMantenimiento = parosMantenimiento;

// Alias para "otrosFactores" y "otrosParos"
export const otrosFactores = otrosParos;

// Alias de placeholders, por si usan nombre alternativo
export const placeholdersRetrasos = placeholdersParos;

// === Exporta TODO también como default si quieres importar todo de una:
export default {
  normalizarHoraMin,
  tiempoEnMs,
  formatearTiempo,
  formatearPorcentaje,
  formatearCantidad,
  calcularSumaHorasRetrasadas,
  calcularHorasNoEficientes,
  msAHoraMin,
  restarTiempos,
  calcularDuracionEntreHoras,
  calcularHorasIdeal,
  calcularEficacia,
  calcularEficiencia,
  calcularHorasReales,
  calcularEnvasadoIdeal,
  obtenerFechaActual,
  parosMaquina,
  parosProduccion,
  parosCalidad,
  parosMantenimiento,
  otrosParos,
  factoresNoEficiencia,
  retrasosProduccion,
  retrasosCalidadControl,
  retrasosMantenimiento,
  otrosFactores,
  placeholdersParos,
  placeholdersRetrasos
};