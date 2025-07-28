import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || 'https://panel-de-control.onrender.com'

export const guardarRegistroDivision = async (modelo, datos) => {
  return await axios.post(`${API_URL}/api/division/${modelo}`, datos)
}

export const obtenerRegistrosDivision = async (modelo) => {
  const { data } = await axios.get(`${API_URL}/api/division/${modelo}`)
  return data
}
