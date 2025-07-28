// helpers/calculosPlastico.js

// Normaliza string a "HH:mm"
export function normalizarHoraMin(valor) {
  if (!valor || typeof valor !== 'string') return "00:00";
  valor = valor.trim();
  if (/^\d{1,2}$/.test(valor)) return `00:${String(parseInt(valor, 10)).padStart(2, "0")}`;
  if (/^\d{3,4}$/.test(valor)) {
    const num = valor.padStart(4, "0");
    return `${num.slice(0, 2)}:${num.slice(2, 4)}`;
  }
  if (/^\d{1,2}:\d{1,2}$/.test(valor)) {
    const [h, m] = valor.split(":").map(n => String(parseInt(n, 10)).padStart(2, "0"));
    return `${h}:${m}`;
  }
  return valor;
}
// Fecha actual en YYYY-MM-DD
export function obtenerFechaActual() {
  const fecha = new Date();
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

// Devuelve nombre de día de la semana para una fecha (YYYY-MM-DD)
export function obtenerNombreDia(fechaStr) {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr + 'T00:00:00');
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[fecha.getDay()];
}


// Calcula la duración entre dos horas (formato HH:mm)
export function calcularDuracionEntreHorasPlastico(horaInicio, horaFinal) {
  if (!horaInicio || !horaFinal) return "00:00";
  const [h1, m1] = normalizarHoraMin(horaInicio).split(":").map(Number);
  const [h2, m2] = normalizarHoraMin(horaFinal).split(":").map(Number);
  let mins = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (mins < 0) mins += 24 * 60; // cruce de medianoche
  const horas = Math.floor(mins / 60);
  const min = mins % 60;
  return `${String(horas).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

// ALIAS para compatibilidad con código legacy/frontend
// Suma tiempos tipo { motivo: {tiempo: "00:30"}, ... }
export function sumarParadas(obj) {
  if (!obj || typeof obj !== 'object') return "00:00";
  let total = 0;
  Object.values(obj).forEach(f => {
    if (!f?.tiempo) return;
    const [h, m] = normalizarHoraMin(f.tiempo).split(":").map(Number);
    total += h * 60 + m;
  });
  const horas = Math.floor(total / 60);
  const mins = total % 60;
  return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

// Alias para compatibilidad
export const calcularTotalParadas = sumarParadas;

// Resta dos tiempos ("08:00" - "00:45" = "07:15")
export function restarTiempos(a, b) {
  const [ha, ma] = normalizarHoraMin(a).split(":").map(Number);
  const [hb, mb] = normalizarHoraMin(b).split(":").map(Number);
  let mins = (ha * 60 + ma) - (hb * 60 + mb);
  if (mins < 0) mins = 0;
  const horas = Math.floor(mins / 60);
  const min = mins % 60;
  return `${String(horas).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

// ALIAS para compatibilidad
export const restarTiemposPlastico = restarTiempos;

// Calcula Horas Reales: trabajadas - totalParadas
export function calcularHorasReales(horasTrabajadas, totalParadas) {
  return restarTiempos(horasTrabajadas, totalParadas);
}

// Eficiencia: (Horas Reales / Horas Trabajadas) * 100
export function calcularEficiencia(horasReales, horasTrabajadas) {
  if (!horasReales || !horasTrabajadas) return 0;
  const [hr, mr] = normalizarHoraMin(horasReales).split(":").map(Number);
  const [ht, mt] = normalizarHoraMin(horasTrabajadas).split(":").map(Number);
  const minsR = hr * 60 + mr, minsT = ht * 60 + mt;
  if (!minsT) return 0;
  return ((minsR / minsT) * 100).toFixed(2);
}

// Alias para compatibilidad: eficiencia
export const calcularEficienciaPlastico = calcularEficiencia;

// Eficacia: (Cantidad Envasada / Cantidad Programada Diaria) * 100
export function calcularEficacia(cantEnvasada, cantProgramada) {
  if (!cantEnvasada || !cantProgramada) return 0;
  return ((parseFloat(cantEnvasada) / parseFloat(cantProgramada)) * 100).toFixed(2);
}

// Alias para compatibilidad: eficacia
export const calcularEficaciaPlastico = calcularEficacia;

// Envasado Ideal: horasTrabajadas * cantidadIdealPorHora
export function calcularEnvasadoIdeal(horasTrabajadas, cantidadIdealPorHora) {
  if (!horasTrabajadas || !cantidadIdealPorHora) return 0;
  const [h, m] = normalizarHoraMin(horasTrabajadas).split(":").map(Number);
  const totalHoras = h + (m / 60);
  return Math.round(totalHoras * cantidadIdealPorHora);
}

// Horas Ideal (según cantidad envasada): cantidadEnvasada / cantidadIdealPorHora
export function calcularHorasIdealPlastico(cantidadEnvasada, cantidadIdealPorHora) {
  if (!cantidadEnvasada || !cantidadIdealPorHora) return "00:00";
  const horas = Math.floor(cantidadEnvasada / cantidadIdealPorHora);
  const mins = Math.round(((cantidadEnvasada / cantidadIdealPorHora) - horas) * 60);
  return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

// Alias para compatibilidad: el frontend a veces pide calcularHorasIdeal
export const calcularHorasIdeal = calcularHorasIdealPlastico;

// Helpers de presentación
export function formatearTiempo(val) {
  if (!val) return "00:00";
  return normalizarHoraMin(val);
}
export function formatearCantidad(val) {
  if (val == null) return "0";
  return Number(val).toLocaleString();
}
export function formatearPorcentaje(val) {
  if (val == null || isNaN(val)) return "0%";
  return `${parseFloat(val).toFixed(2)}%`;
}

// Tipos de paradas para plásticos
export const tiposParadaPlastico = [
  "Parada de máquina",
  "Parada por falta de material",
  "Parada por limpieza",
  "Parada por mantenimiento",
  "Parada por calidad",
  "Parada por falta de personal",
  "Parada por otras causas"
];

export const placeholdersParadasPlastico = {
  "Parada de máquina": "Ej: Falla técnica, atasco",
  "Parada por falta de material": "Ej: Sin insumo para proceso",
  "Parada por limpieza": "Ej: Limpieza obligatoria de la línea",
  "Parada por mantenimiento": "Ej: Cambio de repuesto, lubricación",
  "Parada por calidad": "Ej: Esperando resultado laboratorio",
  "Parada por falta de personal": "Ej: Operario ausente",
  "Parada por otras causas": "Describe el motivo"
};
