import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const guardarRegistroDivision = async (modelo, datos) => {
  return await axios.post(`${API_URL}/api/division/${modelo}`, datos)
}

export const obtenerRegistrosDivision = async (modelo) => {
  const { data } = await axios.get(`${API_URL}/api/division/${modelo}`)
  return data
}
