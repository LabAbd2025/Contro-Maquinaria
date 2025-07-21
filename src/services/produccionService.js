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
