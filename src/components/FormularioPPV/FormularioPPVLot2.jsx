import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { guardarRegistroPPV } from '../../services/ppvService' // Debes tener este servicio creado
import {
  calcularDuracionEntreHoras,
  calcularEficaciaPPV,
  calcularEficienciaPPV,
  calcularHorasNoEficientes,
  calcularHorasIdealPPV,
  obtenerNombreDia,
  restarTiempos,
  obtenerFechaActual
} from './helpers/calculos'

import SeccionBasicosPPV from './Secciones/SeccionBasicos'
import SeccionCantidadesPPV from './Secciones/SeccionCantidades'
import SeccionRetrasosPPV from './Secciones/SeccionRetrasos'
import SeccionResultadosPPV from './Secciones/SeccionResultados'
import { FaHome } from 'react-icons/fa'

// ==== Estado inicial para PPV Lot2 ====
const FORMULARIO_PPV_LOT2 = {
  fechaInicio: '', fechaFin: '', duracionDias: '', dia: '',
  producto: '', lote: '', horaInicio: '', horaFinal: '',
  horasTrabajadas: '', horasReales: '', horasIdeales: '',
  cantidadIdealPorHora: '',
  cantidadProgramadaDiaria: '', cantidadProducida: '', cantidadProducidaTeorica: '',
  cantidadMateriaPrima: '',
  factoresNoEficiencia: {},
  retrasosProduccion: {}, retrasosCalidadControl: {}, retrasosMantenimiento: {},
  retrasosASA: {}, retrasosAlmacen: {}, otrosFactores: {},
  totalHorasRetrasadas: '', horasRetrasoNoEficiencia: '',
  eficacia: '', eficiencia: '', observaciones: ''
}

const FormularioPPVLot2 = () => {
  const navigate = useNavigate()
  const [seccionActiva, setSeccionActiva] = useState('basicos')
  const [showModal, setShowModal] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const [formulario, setFormulario] = useState({ ...FORMULARIO_PPV_LOT2 })

  // Autocalcula día, horas trabajadas y duración
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
    // Suma todos los retrasos de eficiencia
    const todosRetrasos = {
      ...formulario.retrasosProduccion,
      ...formulario.retrasosCalidadControl,
      ...formulario.retrasosMantenimiento,
      ...formulario.retrasosASA,
      ...formulario.retrasosAlmacen,
      ...formulario.otrosFactores
    }
    const totalHorasRetrasadas = calcularHorasNoEficientes(todosRetrasos)
    const horasReales = restarTiempos(
      restarTiempos(formulario.horasTrabajadas, horasNoEficiencia),
      totalHorasRetrasadas
    )

    // Horas ideales calculadas para PPV Lot2
    const horasIdeales = calcularHorasIdealPPV(
      formulario.cantidadProducida,
      formulario.cantidadIdealPorHora
    )

    const eficiencia = calcularEficienciaPPV(horasReales, formulario.horasTrabajadas)
    const eficacia = calcularEficaciaPPV(formulario.cantidadProducida, formulario.cantidadProgramadaDiaria)

    setFormulario(prev => ({
      ...prev,
      horasRetrasoNoEficiencia: horasNoEficiencia,
      totalHorasRetrasadas,
      horasReales,
      horasIdeales,
      eficiencia,
      eficacia
    }))
  }, [
    formulario.horasTrabajadas,
    formulario.factoresNoEficiencia,
    formulario.retrasosProduccion,
    formulario.retrasosCalidadControl,
    formulario.retrasosMantenimiento,
    formulario.retrasosASA,
    formulario.retrasosAlmacen,
    formulario.otrosFactores,
    formulario.cantidadProducida,
    formulario.cantidadIdealPorHora,
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
    if (guardando || showModal) return
    setGuardando(true)
    try {
      const nuevoRegistro = {
        ...formulario,
        id: Date.now(),
        fechaCreacion: new Date().toISOString()
      }
      await guardarRegistroPPV('ppv_lot2', nuevoRegistro) // Cambia la clave a la tabla/colección que uses
      setShowModal(true)
    } catch {
      alert('❌ Error al guardar. Por favor, intenta nuevamente.')
    } finally {
      setGuardando(false)
    }
  }

  const limpiarFormulario = () => {
    setFormulario({ ...FORMULARIO_PPV_LOT2 })
  }

  const handleModalClose = () => {
    setShowModal(false)
    navigate('/registros/PPV-LOT2-001')
  }

  return (
    <div className="container-fluid py-4 bg-light">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-warning text-dark d-flex align-items-center gap-3">
          <FaHome style={{ cursor: 'pointer' }} size={20} onClick={() => navigate('/')} title="Ir al inicio" />
          <h3 className="mb-0">Control de Producción PPV - Lote 2</h3>
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
              <button className={`nav-link ${seccionActiva === 'retrasos' ? 'active' : ''}`} onClick={() => setSeccionActiva('retrasos')}>Paros y Retrasos</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${seccionActiva === 'resultados' ? 'active' : ''}`} onClick={() => setSeccionActiva('resultados')}>Resultados</button>
            </li>
          </ul>

          {/* Secciones visuales */}
          {seccionActiva === 'basicos' && (
            <SeccionBasicosPPV formulario={formulario} handleChange={handleChange} />
          )}
          {seccionActiva === 'cantidades' && (
            <SeccionCantidadesPPV formulario={formulario} handleChange={handleChange} />
          )}
          {seccionActiva === 'retrasos' && (
            <SeccionRetrasosPPV formulario={formulario} handleRetrasoChange={handleRetrasoChange} />
          )}
          {seccionActiva === 'resultados' && (
            <SeccionResultadosPPV formulario={formulario} handleChange={handleChange} />
          )}

          <div className="d-flex gap-2 mt-4">
            <button
              className="btn btn-warning btn-lg"
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
              onClick={() => navigate('/registros/PPV-LOT2-001')}
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

export default FormularioPPVLot2
