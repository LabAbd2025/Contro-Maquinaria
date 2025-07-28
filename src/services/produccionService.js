const API_URL = import.meta.env.VITE_API_URL || 'https://panel-de-control.onrender.com'

// Guardar un registro Bottlepack
export const guardarRegistroBottlepack = async (modelo, data) => {
  const response = await fetch(`${API_URL}/api/registros/${modelo}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error al guardar registro: ${errorText}`)
  }

  return await response.json()
}

// Obtener registros paginados Bottlepack
export const obtenerRegistrosBottlepack = async (modelo, page = 1, pageSize = 10) => {
  const response = await fetch(`${API_URL}/api/registros/${modelo}?page=${page}&pageSize=${pageSize}`)
  const data = await response.json()
  if (!response.ok) throw new Error(data?.error || 'Error al obtener registros')
  return data
}

// Obtener el detalle de un registro Bottlepack por id
export const obtenerDetalleRegistroBottlepack = async (modelo, id) => {
  const response = await fetch(`${API_URL}/api/registros/${modelo}/${id}`)
  const data = await response.json()
  if (!response.ok) throw new Error(data?.error || 'Error al obtener detalle del registro')
  return data
}

// Obtener registros de Empaque PGV 305
export const obtenerRegistrosPGV305Empaque = async () => {
  const response = await fetch(`${API_URL}/api/produccion/pgv305/empaque`)
  const data = await response.json()
  if (!response.ok) throw new Error(data?.error || 'Error al obtener registros PGV 305 Empaque')
  return data
}

// Guardar un registro de Empaque PGV 305
export const guardarRegistroPGV305Empaque = async (datos) => {
  const response = await fetch(`${API_URL}/api/produccion/pgv305/empaque`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error al guardar registro PGV 305 Empaque: ${errorText}`)
  }

  return await response.json()
}

// Obtener registros de PGV
export const obtenerRegistrosPGVEmpaque = async (modelo) => {
  const response = await fetch(`${API_URL}/api/produccion/${modelo}`)
  const data = await response.json()
  if (!response.ok) throw new Error(data?.error || 'Error al obtener registros PGV')
  return data
}

// obtenerRegistrosPGVHemodialisis
export const obtenerRegistrosPGVHemodialisis = async () => {
  const response = await fetch(`${API_URL}/api/produccion/pgv/hemodialisis`)
  const data = await response.json()
  if (!response.ok) throw new Error(data?.error || 'Error al obtener registros PGV Hemodialisis')
  return data
}

// obtenerRegistrosPGVPVC
export const obtenerRegistrosPGVPVC = async () => {
  const response = await fetch(`${API_URL}/api/produccion/pgv/pvc`)
  const data = await response.json()
  if (!response.ok) throw new Error(data?.error || 'Error al obtener registros PGV PVC')
  return data
}

//obtenerRegistrosPGVPVCStd
export const obtenerRegistrosPGVPVCStd = async () => {
  const response = await fetch(`${API_URL}/api/produccion/pgv/pvc-std`)
  const data = await response.json()
  if (!response.ok) throw new Error(data?.error || 'Error al obtener registros PGV PVC Std')
  return data
}
