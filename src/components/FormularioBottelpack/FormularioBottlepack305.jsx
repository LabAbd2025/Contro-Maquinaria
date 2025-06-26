import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { guardarRegistroBottlepack } from '../../services/produccionService'
import {
  calcularDuracionEntreHoras,
  calcularEficacia,
  calcularEficiencia,
  calcularHorasNoEficientes,
  obtenerNombreDia,
  restarTiempos,
  obtenerFechaActual
} from './helpers/calculos'

import SeccionBasicos from './Secciones/SeccionBasicos'
import SeccionCantidades from './Secciones/SeccionCantidades'
import SeccionRetrasos from './Secciones/SeccionRetrasos'
import SeccionResultados from './Secciones/SeccionResultados'
import { FaHome } from 'react-icons/fa'

const FormularioBottlepack = () => {
  const navigate = useNavigate()
  const [seccionActiva, setSeccionActiva] = useState('basicos')

  const [formulario, setFormulario] = useState({
    fechaInicio: '', fechaFin: '', duracionDias: '', dia: '',
    producto: '', lote: '', horaInicio: '', horaFinal: '',
    horasTrabajadas: '', horasReales: '', cantidadIdealPorHora: '',
    cantidadProgramadaDiaria: '', cantidadEnvasada: '', cantidadEnvasadaTeorica: '',
    cantidadSopladaAprobada: '', cantidadMateriaPrima: '', factoresNoEficiencia: {},
    retrasosProduccion: {}, retrasosCalidadControl: {}, retrasosMantenimiento: {},
    otrosFactores: {}, totalHorasRetrasadas: '', horasRetrasoNoEficiencia: '',
    eficacia: '', eficiencia: '', observaciones: ''
  })

  useEffect(() => {
    if (formulario.fechaInicio) {
      const dia = obtenerNombreDia(formulario.fechaInicio)
      setFormulario(prev => ({ ...prev, dia }))
    }
    if (formulario.horaInicio && formulario.horaFinal) {
      const horasTrabajadas = calcularDuracionEntreHoras(formulario.horaInicio, formulario.horaFinal)
      setFormulario(prev => ({ ...prev, horasTrabajadas }))
    }
    if (formulario.fechaInicio && formulario.fechaFin) {
      const inicio = new Date(formulario.fechaInicio)
      const fin = new Date(formulario.fechaFin)
      const diff = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)) + 1
      setFormulario(prev => ({ ...prev, duracionDias: `${diff} día(s)` }))
    }
  }, [formulario.fechaInicio, formulario.fechaFin, formulario.horaInicio, formulario.horaFinal])

  useEffect(() => {
    const horasNoEficiencia = calcularHorasNoEficientes(formulario.factoresNoEficiencia)
    const todosRetrasos = {
      ...formulario.retrasosProduccion,
      ...formulario.retrasosCalidadControl,
      ...formulario.retrasosMantenimiento,
      ...formulario.otrosFactores
    }
    const totalHorasRetrasadas = calcularHorasNoEficientes(todosRetrasos)
    const horasReales = restarTiempos(
      restarTiempos(formulario.horasTrabajadas, horasNoEficiencia),
      totalHorasRetrasadas
    )
    const eficiencia = calcularEficiencia(horasReales, formulario.horasTrabajadas)
    const eficacia = calcularEficacia(formulario.cantidadEnvasada, formulario.cantidadProgramadaDiaria)

    setFormulario(prev => ({
      ...prev,
      horasRetrasoNoEficiencia: horasNoEficiencia,
      totalHorasRetrasadas,
      horasReales,
      eficiencia,
      eficacia
    }))
  }, [
    formulario.horasTrabajadas,
    formulario.factoresNoEficiencia,
    formulario.retrasosProduccion,
    formulario.retrasosCalidadControl,
    formulario.retrasosMantenimiento,
    formulario.otrosFactores,
    formulario.cantidadEnvasada,
    formulario.cantidadProgramadaDiaria
  ])

  const handleChange = (campo, valor) => {
    if ((campo === 'fechaInicio' || campo === 'fechaFin') && valor) {
      const fechaActual = obtenerFechaActual()
      if (valor < fechaActual) {
        toast.warning('⚠️ No se pueden seleccionar fechas anteriores a hoy')
        return
      }
      if (campo === 'fechaFin' && valor < formulario.fechaInicio) {
        toast.warning('⚠️ La fecha de fin no puede ser anterior a la de inicio')
        return
      }
    }
    setFormulario(prev => ({ ...prev, [campo]: valor }))
  }

  const handleRetrasoChange = (categoria, factor, valor) => {
    setFormulario(prev => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [factor]: { ...prev[categoria][factor], tiempo: valor }
      }
    }))
  }

  const guardarRegistro = async () => {
    try {
      const nuevoRegistro = {
        ...formulario,
        id: Date.now(),
        fechaCreacion: new Date().toISOString()
      }
      await guardarRegistroBottlepack('bfs_305_183', nuevoRegistro)
      toast.success('✅ Registro guardado exitosamente. ¡Buen trabajo!')
      navigate('/registros/bfs_305_183')
    } catch (error) {
      console.error(error)
      toast.error('❌ Error al guardar. Por favor, intenta nuevamente.')
    }
  }

  const limpiarFormulario = () => {
    setFormulario(prev => ({ ...prev, observaciones: '' }))
  }

  return (
    <div className="container-fluid py-4 bg-light">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white d-flex align-items-center gap-3">
          <FaHome style={{ cursor: 'pointer' }} size={20} onClick={() => navigate('/')} title="Ir al inicio" />
          <h3 className="mb-0">Control de Producción Bottlepack 305</h3>
        </div>
        <div className="card-body">

          {/* Tabs de navegación */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button className={`nav-link ${seccionActiva === 'basicos' ? 'active' : ''}`} onClick={() => setSeccionActiva('basicos')}>Datos Básicos</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${seccionActiva === 'cantidades' ? 'active' : ''}`} onClick={() => setSeccionActiva('cantidades')}>Cantidades</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${seccionActiva === 'retrasos' ? 'active' : ''}`} onClick={() => setSeccionActiva('retrasos')}>Retrasos</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${seccionActiva === 'resultados' ? 'active' : ''}`} onClick={() => setSeccionActiva('resultados')}>Resultados</button>
            </li>
          </ul>

          {/* Secciones visuales */}
          {seccionActiva === 'basicos' && (
            <SeccionBasicos formulario={formulario} handleChange={handleChange} />
          )}

          {seccionActiva === 'cantidades' && (
            <SeccionCantidades formulario={formulario} handleChange={handleChange} />
          )}

          {seccionActiva === 'retrasos' && (
            <SeccionRetrasos formulario={formulario} handleRetrasoChange={handleRetrasoChange} />
          )}

          {seccionActiva === 'resultados' && (
            <SeccionResultados formulario={formulario} handleChange={handleChange} />
          )}

          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-primary btn-lg" onClick={guardarRegistro}>Guardar Registro</button>
            <button className="btn btn-outline-secondary btn-lg" onClick={limpiarFormulario}>Limpiar Formulario</button>
            <button className="btn btn-info btn-lg" onClick={() => navigate('/registros/bfs_305_183')}>
              Ver Registros
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  )
}

export default FormularioBottlepack
