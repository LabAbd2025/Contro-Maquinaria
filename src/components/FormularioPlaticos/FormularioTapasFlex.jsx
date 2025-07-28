import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { guardarRegistroDivision } from '../../services/divisionService'
import {
  calcularDuracionEntreHorasPlastico,
  calcularEficienciaPlastico,
  calcularEficaciaPlastico,
  calcularTotalParadas,
  calcularHorasIdealPlastico,
  obtenerNombreDia,
  restarTiemposPlastico,
  obtenerFechaActual
} from './helpers/calculos'

import SeccionBasicoPlastico from './Secciones/SeccionBasicosPlastico'
import SeccionCantidadesPlastico from './Secciones/SeccionCantidadesPlastico'
import SeccionParadasPlastico from './Secciones/SeccionParadasPlastico'
import SeccionResultadosPlastico from './Secciones/SeccionResultadosPlastico'
import { FaHome } from 'react-icons/fa'

const FORMULARIO_INICIAL = {
  fechaInicio: '', fechaFin: '', duracionDias: '', dia: '',
  producto: '', lote: '', horaInicio: '', horaFinal: '',
  horasTrabajadas: '', horasReales: '', horasIdeales: '',
  cantidadIdealPorHora: '',
  cantidadProgramadaDiaria: '', cantidadEnvasada: '', cantidadEnvasadaTeorica: '',
  cantidadSopladaAprobada: '', cantidadMateriaPrima: '',
  paradas: {}, totalParadas: '',
  eficiencia: '', eficacia: '', observaciones: ''
}

const FormularioTapasFlex = () => {
  const navigate = useNavigate()
  const [seccionActiva, setSeccionActiva] = useState('basicos')
  const [showModal, setShowModal] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const [formulario, setFormulario] = useState({ ...FORMULARIO_INICIAL })

  // Autocalcula día, horas trabajadas y duración
  useEffect(() => {
    if (formulario.fechaInicio) {
      const dia = obtenerNombreDia(formulario.fechaInicio)
      setFormulario(prev => ({ ...prev, dia }))
    }
    if (formulario.horaInicio && formulario.horaFinal) {
      const horasTrabajadas = calcularDuracionEntreHorasPlastico(formulario.horaInicio, formulario.horaFinal)
      setFormulario(prev => ({ ...prev, horasTrabajadas }))
    }
    if (formulario.fechaInicio && formulario.fechaFin) {
      const inicio = new Date(formulario.fechaInicio)
      const fin = new Date(formulario.fechaFin)
      const diff = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)) + 1
      setFormulario(prev => ({ ...prev, duracionDias: `${diff} día(s)` }))
    }
  }, [formulario.fechaInicio, formulario.fechaFin, formulario.horaInicio, formulario.horaFinal])

  // Autocalcula métricas
  useEffect(() => {
    const totalParadas = calcularTotalParadas(formulario.paradas)
    const horasReales = restarTiemposPlastico(formulario.horasTrabajadas, totalParadas)
    const horasIdeales = calcularHorasIdealPlastico(formulario.cantidadEnvasada, formulario.cantidadIdealPorHora)
    const eficiencia = calcularEficienciaPlastico(horasReales, formulario.horasTrabajadas)
    const eficacia = calcularEficaciaPlastico(formulario.cantidadEnvasada, formulario.cantidadProgramadaDiaria)
    setFormulario(prev => ({
      ...prev,
      totalParadas,
      horasReales,
      horasIdeales,
      eficiencia,
      eficacia
    }))
  }, [
    formulario.horasTrabajadas,
    formulario.paradas,
    formulario.cantidadEnvasada,
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

  const handleParadaChange = (factor, tiempo, descripcion) => {
    setFormulario(prev => ({
      ...prev,
      paradas: {
        ...prev.paradas,
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
      await guardarRegistroDivision('inyectora_tapas_flex', nuevoRegistro)
      setShowModal(true)
    } catch {
      alert('❌ Error al guardar. Por favor, intenta nuevamente.')
    } finally {
      setGuardando(false)
    }
  }

  const limpiarFormulario = () => {
    setFormulario({ ...FORMULARIO_INICIAL })
  }

  const handleModalClose = () => {
    setShowModal(false)
    navigate('/registros/division_inyectora_tapas_flex')
  }

  return (
    <div className="container-fluid py-4 bg-light">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-success text-white d-flex align-items-center gap-3">
          <FaHome style={{ cursor: 'pointer' }} size={20} onClick={() => navigate('/')} title="Ir al inicio" />
          <h3 className="mb-0">Control Inyectora Tapas Flex</h3>
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
              <button className={`nav-link ${seccionActiva === 'paradas' ? 'active' : ''}`} onClick={() => setSeccionActiva('paradas')}>Paradas</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${seccionActiva === 'resultados' ? 'active' : ''}`} onClick={() => setSeccionActiva('resultados')}>Resultados</button>
            </li>
          </ul>

          {/* Secciones visuales */}
          {seccionActiva === 'basicos' && (
            <SeccionBasicoPlastico formulario={formulario} handleChange={handleChange} />
          )}
          {seccionActiva === 'cantidades' && (
            <SeccionCantidadesPlastico formulario={formulario} handleChange={handleChange} />
          )}
          {seccionActiva === 'paradas' && (
            <SeccionParadasPlastico formulario={formulario} handleParadaChange={handleParadaChange} />
          )}
          {seccionActiva === 'resultados' && (
            <SeccionResultadosPlastico formulario={formulario} />
          )}

          <div className="d-flex gap-2 mt-4">
            <button
              className="btn btn-success btn-lg"
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
              onClick={() => navigate('/registros/division_inyectora_tapas_flex')}
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

export default FormularioTapasFlex
