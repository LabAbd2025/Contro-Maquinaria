// =================== HELPERS DE TIEMPO, PRODUCCIÓN Y FORMATO ===================

// --- Normaliza cualquier string a "HH:mm" o "HH:mm:ss"
export const normalizarHoraMin = (valor) => {
  if (!valor || typeof valor !== 'string') return "00:00";
  valor = valor.trim();
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

// --- Convierte "HH:mm" o "HH:mm:ss" a milisegundos
export const tiempoEnMs = (str) => {
  if (!str || !str.includes(':')) return 0;
  const partes = str.split(':').map(Number);
  const h = partes[0] || 0;
  const m = partes[1] || 0;
  const s = partes[2] || 0;
  return (h * 3600 + m * 60 + s) * 1000;
};

// --- Formatea tiempo "HH:mm:ss" o "HH:mm" a "Xh Ymin"
export const formatearTiempo = (tiempo) => {
  if (!tiempo) return '-';
  const partes = tiempo.split(':').map(Number);
  if (partes.length === 2) return `${partes[0]}h ${partes[1]}min`;
  if (partes.length === 3) return `${partes[0]}h ${partes[1]}min`;
  return tiempo;
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

// ==== FUNCIONES DE SUMA Y OPERACIÓN DE TIEMPOS ====

// Suma todos los tiempos (.tiempo) de un objeto { ...factor: {tiempo, descripcion} }
export const calcularHorasNoEficientes = (causasRetraso) => {
  if (!causasRetraso || typeof causasRetraso !== 'object') causasRetraso = {};
  let totalMs = 0;
  Object.values(causasRetraso || {}).forEach(obj => {
    if (obj && typeof obj === "object" && obj.tiempo && obj.tiempo.includes(':')) {
      totalMs += tiempoEnMs(normalizarHoraMin(obj.tiempo));
    }
  });
  return msAHoraMinSeg(totalMs);
};
export const calcularSumaHorasRetrasadas = calcularHorasNoEficientes;

// Suma retrasos soportando ambos formatos
export const sumarRetrasosEficiencia = (retrasos) => {
  if (!retrasos || typeof retrasos !== 'object') retrasos = {};
  let totalMs = 0;
  Object.values(retrasos).forEach(obj => {
    if (typeof obj === 'string' && obj.includes(':')) {
      totalMs += tiempoEnMs(normalizarHoraMin(obj));
    } else if (obj && typeof obj === "object" && obj.tiempo && obj.tiempo.includes(':')) {
      totalMs += tiempoEnMs(normalizarHoraMin(obj.tiempo));
    }
  });
  return msAHoraMinSeg(totalMs);
};

// --- Convierte ms a "HH:mm:ss"
export const msAHoraMinSeg = (ms) => {
  if (isNaN(ms) || ms <= 0) return '00:00:00';
  const horas = Math.floor(ms / 3600000);
  const minutos = Math.floor((ms % 3600000) / 60000);
  const segundos = Math.floor((ms % 60000) / 1000);
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
};

// --- Resta dos tiempos "HH:mm:ss" o "HH:mm"
export const restarTiempos = (tiempo1, tiempo2) => {
  const diff = tiempoEnMs(normalizarHoraMin(tiempo1)) - tiempoEnMs(normalizarHoraMin(tiempo2));
  if (diff <= 0) return '00:00:00';
  return msAHoraMinSeg(diff);
};

// --- Calcula duración entre dos horas (formato "HH:mm" o "HH:mm:ss")
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

// --- Calcula horas efectivas para eficiencia: Jornada - Suma(retrasos que afectan eficiencia)
export const calcularHorasEfectivas = (horaInicio, horaFin, retrasosEficiencia) => {
  const jornada = calcularDuracionEntreHoras(horaInicio, horaFin); // "HH:mm:ss"
  const totalRetrasos = sumarRetrasosEficiencia(retrasosEficiencia);
  return restarTiempos(jornada, totalRetrasos);
};

// --- Eficiencia industrial: (Horas Ideales / Horas Trabajadas) * 100
export const calcularEficienciaPPV = (horasIdeales, horasTrabajadas) => {
  const idealMs = tiempoEnMs(normalizarHoraMin(horasIdeales));
  const trabajadoMs = tiempoEnMs(normalizarHoraMin(horasTrabajadas));
  if (trabajadoMs === 0) return '0';
  return ((idealMs / trabajadoMs) * 100).toFixed(2);
};

// --- Eficacia: (Unidades Envasadas / Programadas) * 100
export const calcularEficaciaPPV = (envasadas, programadas) => {
  const a = parseFloat(envasadas);
  const b = parseFloat(programadas);
  if (!a || !b || b === 0) return '0';
  return ((a / b) * 100).toFixed(2);
};

// --- Calcula "Horas ideales" para una cantidad envasada y ritmo ideal por hora
export function calcularHorasIdealPPV(cantidadEnvasada, cantidadIdealPorHora) {
  const envasada = Number(cantidadEnvasada);
  const idealHora = Number(cantidadIdealPorHora);
  if (!envasada || !idealHora || isNaN(envasada) || isNaN(idealHora)) return "";
  const horas = envasada / idealHora;
  const totalSegundos = Math.floor(horas * 3600);
  const h = Math.floor(totalSegundos / 3600);
  const m = Math.floor((totalSegundos % 3600) / 60);
  const s = totalSegundos % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// --- Calcula envasado ideal en base a horas trabajadas y cantidad ideal/hora
export const calcularEnvasadoIdeal = (horasSoplado, cantidadIdealHora) => {
  if (!horasSoplado || !cantidadIdealHora) return 0;
  const [h, m] = normalizarHoraMin(horasSoplado).split(':').map(Number);
  const horasDecimal = h + (m / 60);
  return Math.round(horasDecimal * cantidadIdealHora);
};

// --- Fecha actual en formato "YYYY-MM-DD"
export const obtenerFechaActual  = () => {
  const fecha = new Date();
  return fecha.toISOString().split('T')[0]; // "YYYY-MM-DD"
};
// --- Devuelve nombre del día (Ej: "Lunes")
export const obtenerNombreDia = (fechaStr) => {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr + 'T00:00:00');
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[fecha.getDay()];
};

export const calcularEficienciaReal = (horasReales, horasTrabajadas) => {
  const realesMs = tiempoEnMs(normalizarHoraMin(horasReales));
  const trabajadasMs = tiempoEnMs(normalizarHoraMin(horasTrabajadas));
  if (trabajadasMs === 0) return '0.00';
  return ((realesMs / trabajadasMs) * 100).toFixed(2);
};

export const calcularHorasIdeal = (cantidadEnvasada, ritmoIdealPorHora) => {
  const envasada = Number(cantidadEnvasada);
  const ritmoIdeal = Number(ritmoIdealPorHora);
  if (!envasada || !ritmoIdeal || isNaN(envasada) || isNaN(ritmoIdeal)) return "";
  const horas = envasada / ritmoIdeal;
  const totalSegundos = Math.floor(horas * 3600);
  const h = Math.floor(totalSegundos / 3600);
  const m = Math.floor((totalSegundos % 3600) / 60);
  const s = totalSegundos % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

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
