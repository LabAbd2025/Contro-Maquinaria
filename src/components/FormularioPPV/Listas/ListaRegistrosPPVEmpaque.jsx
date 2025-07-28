import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DetalleRegistroPPVEmpaque from '../Detalles/DetalleRegistroPPVEmpaque'
import { obtenerRegistrosPPV } from '../../../services/ppvService'

const ListaRegistrosPPVEmpaque = () => {
  const navigate = useNavigate()
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [registroExpandido, setRegistroExpandido] = useState(null)

  // Mapeo para mostrar en el frontend
  const mapearRegistro = (r) => ({
    ...r,
    fechaInicio: r.fecha_inicio,
    fechaFin: r.fecha_fin,
    horaInicio: r.hora_inicio,
    horaFinal: r.hora_final,
    horasTrabajadas: r.horas_trabajadas,
    horasReales: r.horas_reales,
    horasIdeales: r.horas_ideales,
    eficiencia: r.eficiencia,
    eficacia: r.eficacia,
    cantidadProducida: r.cantidad_producida,
    cantidadProgramadaDiaria: r.cantidad_programada_diaria,
    cantidadIdealPorHora: r.cantidad_ideal_por_hora,
    cantidadProducidaTeorica: r.cantidad_producida_teorica,
    cantidadMateriaPrima: r.cantidad_materia_prima,
    horasRetrasoNoEficiencia: r.horas_retraso_no_eficiencia,
    totalHorasRetrasadas: r.total_horas_retrasadas,
    factoresNoEficiencia: r.factores_no_eficiencia,
    retrasosProduccion: r.retrasos_produccion,
    retrasosMantenimiento: r.retrasos_mantenimiento,
    retrasosCalidadControl: r.retrasos_calidad_control,
    retrasosASA: r.retrasos_asa,
    retrasosAlmacen: r.retrasos_almacen,
    otrosFactores: r.otros_factores,
    duracionDias: r.duracion_dias,
  })

  useEffect(() => {
    const cargarRegistros = async () => {
      setLoading(true)
      try {
        // Cambia 'ppv_empaque' por la clave/tabla que uses para Empaque
        const respuesta = await obtenerRegistrosPPV('ppv_empaque')
        const lista = Array.isArray(respuesta)
          ? respuesta
          : (Array.isArray(respuesta?.data) ? respuesta.data : [])
        
        const registrosMapeados = lista.map(mapearRegistro).reverse()
        setRegistros(registrosMapeados)
      } catch (err) {
        console.error('Error al obtener registros:', err)
        setError('No se pudieron cargar los registros')
      } finally {
        setLoading(false)
      }
    }
    cargarRegistros()
  }, [])

  const toggleDetalle = (index) => {
    setRegistroExpandido(registroExpandido === index ? null : index)
  }

  return (
    <div className="vh-100 vw-100 p-0 m-0 bg-light">
      <div className="sticky-top shadow-sm">
        <div className="container-fluid bg-warning text-dark py-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
          <h2 className="fw-bold mb-2 mb-md-0">Registros PPV Empaque</h2>
          <button className="btn btn-light fw-bold" onClick={() => navigate('/form/PPV-EMP-001')}>
            Volver al Formulario
          </button>
        </div>
      </div>

      <div className="container-fluid py-4">
        <div className="row g-0">
          {loading ? (
            <div className="col-12 text-center p-5">
              <div className="spinner-border text-warning mb-3" />
              <div>Cargando registros...</div>
            </div>
          ) : error ? (
            <div className="col-12 text-center p-5">
              <span className="text-danger">{error}</span>
            </div>
          ) : registros.length === 0 ? (
            <div className="col-12 text-center p-5">
              <div className="alert alert-info mb-0">
                No hay registros guardados.
              </div>
            </div>
          ) : (
            registros.map((r, i) => (
              <div key={i} className="col-12 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">
                          Registro #{registros.length - i} - {r.fechaInicio}
                        </h5>
                        <p className="mb-0 small text-muted">
                          Producto: <strong>{r.producto}</strong> | Lote: <strong>{r.lote}</strong><br />
                          Horas trabajadas: <strong>{r.horasTrabajadas}</strong> | Eficiencia: <strong>{r.eficiencia}%</strong>
                        </p>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => toggleDetalle(i)}
                      >
                        {registroExpandido === i ? 'Ocultar Detalles' : 'Ver Detalles'}
                      </button>
                    </div>
                    {registroExpandido === i && (
                      <div className="mt-3">
                        <DetalleRegistroPPVEmpaque registro={r} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ListaRegistrosPPVEmpaque
