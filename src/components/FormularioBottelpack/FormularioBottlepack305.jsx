import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const [showModal, setShowModal] = useState(false)
  const [guardando, setGuardando] = useState(false) // Bloquear botón durante guardado

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
        alert('⚠️ No se pueden seleccionar fechas anteriores a hoy')
        return
      }
      if (campo === 'fechaFin' && valor < formulario.fechaInicio) {
        alert('⚠️ La fecha de fin no puede ser anterior a la de inicio')
        return
      }
    }
    setFormulario(prev => ({ ...prev, [campo]: valor }))
  }

  // AHORA handleRetrasoChange acepta: categoria, factor, tiempo, descripcion
  const handleRetrasoChange = (categoria, factor, tiempo, descripcion) => {
    setFormulario(prev => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [factor]: { tiempo, descripcion }
      }
    }))
  }

  const guardarRegistro = async () => {
    if (guardando || showModal) return; // Ya está guardando o ya se guardó
    setGuardando(true)
    try {
      const nuevoRegistro = {
        ...formulario,
        id: Date.now(),
        fechaCreacion: new Date().toISOString()
      }
      await guardarRegistroBottlepack('bfs_305_183', nuevoRegistro)
      setShowModal(true)
    } catch {
      alert('❌ Error al guardar. Por favor, intenta nuevamente.')
    } finally {
      setGuardando(false)
    }
  }

  const limpiarFormulario = () => {
    setFormulario(prev => ({ ...prev, observaciones: '' }))
  }

  // Al cerrar el modal, ir a la lista
  const handleModalClose = () => {
    setShowModal(false)
    navigate('/registros/bfs_305_183')
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
              onClick={() => navigate('/registros/bfs_305_183')}
              disabled={guardando}
            >
              Ver Registros
            </button>
          </div>
        </div>
      </div>

      {/* Modal de éxito */}
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

    </div>
  )
}

export default FormularioBottlepack
