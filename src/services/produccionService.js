const API_URL = import.meta.env.VITE_API_URL || 'https://panel-de-control.onrender.com'

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

export const obtenerRegistrosBottlepack = async (modelo) => {
  const response = await fetch(`https://panel-de-control.onrender.com/api/registros/${modelo}`)
  const data = await response.json()
  if (!response.ok) throw new Error(data?.error || 'Error al obtener registros')
  return data
}
