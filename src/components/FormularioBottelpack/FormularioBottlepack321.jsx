import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { guardarRegistroBottlepack } from '../../services/produccionService'
import {
  calcularDuracionEntreHoras,
  calcularEficacia,
  calcularEficiencia,
  calcularHorasNoEficientes,
  calcularHorasIdeal,
  obtenerNombreDia,
  restarTiempos,
  obtenerFechaActual
} from './helpers/calculos'

import SeccionBasicos from './Secciones/SeccionBasicos'
import SeccionCantidades from './Secciones/SeccionCantidades'
import SeccionRetrasos from './Secciones/SeccionRetrasos'
import SeccionResultados from './Secciones/SeccionResultados'
import { FaHome } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Estado inicial del formulario
const FORMULARIO_INICIAL = {
  fechaInicio: '', fechaFin: '', duracionDias: '', dia: '',
  producto: '', lote: '', horaInicio: '', horaFinal: '',
  horasTrabajadas: '', horasReales: '', horasIdeales: '',
  cantidadIdealPorHora: '',
  cantidadProgramadaDiaria: '', cantidadEnvasada: '', cantidadEnvasadaTeorica: '',
  cantidadSopladaAprobada: '', cantidadMateriaPrima: '',
  factoresNoEficiencia: {},
  retrasosProduccion: {},
  retrasosCalidadControl: {},
  retrasosMantenimiento: {},
  retrasosASA: {},
  retrasosAlmacen: {},
  otrosFactores: {},
  totalHorasRetrasadas: '', horasRetrasoNoEficiencia: '',
  eficacia: '', eficiencia: '', observaciones: ''
}

const FormularioBottlepack321 = () => {
  const navigate = useNavigate()
  const [seccionActiva, setSeccionActiva] = useState('basicos')
  const [guardando, setGuardando] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [formulario, setFormulario] = useState({ ...FORMULARIO_INICIAL })

  // Calcula día, horas trabajadas y duración automáticamente
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
    const jornada = calcularDuracionEntreHoras(formulario.horaInicio, formulario.horaFinal)
    const horasNoEficiencia = calcularHorasNoEficientes(formulario.factoresNoEficiencia)
    const todosRetrasos = {
      ...formulario.retrasosProduccion,
      ...formulario.retrasosCalidadControl,
      ...formulario.retrasosMantenimiento,
      ...formulario.retrasosASA,
      ...formulario.retrasosAlmacen,
      ...formulario.otrosFactores
    }
    const totalHorasRetrasadas = calcularHorasNoEficientes(todosRetrasos)
    const horasTrabajadas = restarTiempos(jornada, horasNoEficiencia)
    const horasReales = restarTiempos(horasTrabajadas, totalHorasRetrasadas)

    // CALCULO DE HORAS IDEALES (mejorado)
    const horasIdeales = calcularHorasIdeal(
      formulario.cantidadEnvasada,
      formulario.cantidadIdealPorHora
    )

    // Para debug:
    console.log('[DEBUG] Horas ideales:', {
      cantidadEnvasada: formulario.cantidadEnvasada,
      cantidadIdealPorHora: formulario.cantidadIdealPorHora,
      horasIdeales
    })

    const eficiencia = calcularEficiencia(horasIdeales, horasTrabajadas)
    const eficacia = calcularEficacia(formulario.cantidadEnvasada, formulario.cantidadProgramadaDiaria)

    setFormulario(prev => ({
      ...prev,
      horasTrabajadas,
      horasRetrasoNoEficiencia: horasNoEficiencia,
      totalHorasRetrasadas,
      horasReales,
      horasIdeales,
      eficiencia,
      eficacia
    }))
  }, [
    formulario.horaInicio,
    formulario.horaFinal,
    formulario.factoresNoEficiencia,
    formulario.retrasosProduccion,
    formulario.retrasosCalidadControl,
    formulario.retrasosMantenimiento,
    formulario.retrasosASA,
    formulario.retrasosAlmacen,
    formulario.otrosFactores,
    formulario.cantidadEnvasada,
    formulario.cantidadIdealPorHora,
    formulario.cantidadProgramadaDiaria
  ])

  // Actualiza valores del formulario
  const handleChange = (campo, valor) => {

    if ((campo === 'fechaInicio' || campo === 'fechaFin') && valor) {
      const fechaActual = obtenerFechaActual()
      if (valor < fechaActual) {
        toast.warn('No se pueden seleccionar fechas anteriores a hoy')
        return
      }
      if (campo === 'fechaFin' && valor < formulario.fechaInicio) {
        toast.warn('La fecha de fin no puede ser anterior a la de inicio')
        return
      }
    }
    console.log(`[HANDLE CHANGE] campo: ${campo}, valor: ${valor}`)
    setFormulario(prev => ({ ...prev, [campo]: valor }))
  }

  const handleRetrasoChange = (categoria, factor, tiempo, descripcion) => {
    setFormulario(prev => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [factor]: { tiempo, descripcion }
      }
    }))
  }

  const validarFormulario = () => {
    if (!formulario.fechaInicio || !formulario.horaInicio || !formulario.horaFinal) {
      toast.error('Completa Fecha de Inicio, Hora Inicio y Hora Final')
      return false
    }
    if (!formulario.producto) {
      toast.error('Debes ingresar el Producto')
      return false
    }
    if (!formulario.cantidadProgramadaDiaria || !formulario.cantidadEnvasada || !formulario.cantidadIdealPorHora) {
      toast.error('Completa cantidades programada, envasada y estándar por hora')
      return false
    }
    return true
  }

  // === ACTUALIZADO: Solo manda campos existentes en la BD ===
  const guardarRegistro = async () => {
    console.log('[ANTES DE GUARDAR]', formulario)
    if (guardando || showModal) return
    if (!validarFormulario()) return
    setGuardando(true)
    try {
      const registro = {
        fechaInicio: formulario.fechaInicio,
        fechaFin: formulario.fechaFin,
        duracionDias: formulario.duracionDias,
        dia: formulario.dia,
        producto: formulario.producto,
        lote: formulario.lote,
        horaInicio: formulario.horaInicio,
        horaFinal: formulario.horaFinal,
        horasTrabajadas: formulario.horasTrabajadas,
        horasReales: formulario.horasReales,
        cantidadIdealPorHora: formulario.cantidadIdealPorHora,
        cantidadProgramadaDiaria: formulario.cantidadProgramadaDiaria,
        cantidadEnvasada: formulario.cantidadEnvasada,
        cantidadEnvasadaTeorica: formulario.cantidadEnvasadaTeorica,
        cantidadSopladaAprobada: formulario.cantidadSopladaAprobada,
        cantidadMateriaPrima: formulario.cantidadMateriaPrima,
        factoresNoEficiencia: formulario.factoresNoEficiencia,
        retrasosProduccion: formulario.retrasosProduccion,
        retrasosCalidadControl: formulario.retrasosCalidadControl,
        retrasosMantenimiento: formulario.retrasosMantenimiento,
        retrasosASA: formulario.retrasosASA,
        retrasosAlmacen: formulario.retrasosAlmacen,
        otrosFactores: formulario.otrosFactores,
        totalHorasRetrasadas: formulario.totalHorasRetrasadas,
        horasRetrasoNoEficiencia: formulario.horasRetrasoNoEficiencia,
        eficacia: formulario.eficacia,
        eficiencia: formulario.eficiencia,
        observaciones: formulario.observaciones
      }
      console.log('Registrando datos:', registro)
      await guardarRegistroBottlepack('bfs_321_196', registro)
      setShowModal(true)
      toast.success('Registro guardado exitosamente. ¡Buen trabajo!')
    } catch (error) {
      console.error(error)
      toast.error('Error al guardar. Por favor, intenta nuevamente.')
    } finally {
      setGuardando(false)
    }
  }

  const limpiarFormulario = () => {
    setFormulario({ ...FORMULARIO_INICIAL })
  }

  const handleModalClose = () => {
    setShowModal(false)
    navigate('/registros/bfs_321_196')
  }

  return (
    <div className="container-fluid py-4 bg-light">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white d-flex align-items-center gap-3">
          <FaHome style={{ cursor: 'pointer' }} size={20} onClick={() => navigate('/')} title="Ir al inicio" />
          <h3 className="mb-0">Control de Producción Bottlepack 321</h3>
        </div>
        <div className="card-body">
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
          {seccionActiva === 'basicos' && (
            <SeccionBasicos formulario={formulario} handleChange={handleChange} modelo="bfs_321_196" />
          )}
          {seccionActiva === 'cantidades' && (
            <SeccionCantidades formulario={formulario} handleChange={handleChange} modelo="bfs_321_196" />
          )}
          {seccionActiva === 'retrasos' && (
            <SeccionRetrasos formulario={formulario} handleRetrasoChange={handleRetrasoChange} modelo="bfs_321_196" />
          )}
          {seccionActiva === 'resultados' && (
            <SeccionResultados formulario={formulario} handleChange={handleChange} modelo="bfs_321_196" />
          )}

          <div className="d-flex gap-2 mt-4">
            <button
              className="btn btn-primary btn-lg"
              onClick={guardarRegistro}
              disabled={guardando || showModal}
            >
              {guardando ? 'Guardando...' : 'Guardar Registro'}
            </button>
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={limpiarFormulario}
              disabled={guardando || showModal}
            >
              Limpiar Formulario
            </button>
            <button
              className="btn btn-info btn-lg"
              onClick={() => navigate('/registros/bfs_321_196')}
              disabled={guardando}
            >
              Ver Registros
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal show fade" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">¡Registro Exitoso!</h5>
              </div>
              <div className="modal-body">
                <p>El registro fue guardado exitosamente.<br />Puedes consultar los registros en la lista.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleModalClose}>Aceptar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  )
}

export default FormularioBottlepack321
