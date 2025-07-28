import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DetalleRegistroBottlepack312 from '../Detalles/DetalleRegistroBottlepack312'
import { obtenerRegistrosBottlepack } from '../../../services/produccionService'

const ListaRegistrosBottlepack312 = () => {
  const navigate = useNavigate()
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [registroExpandido, setRegistroExpandido] = useState(null)

  // Normaliza a camelCase para DetalleRegistroBottlepack312
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
    cantidadEnvasada: r.cantidad_envasada,
    cantidadProgramadaDiaria: r.cantidad_programada_diaria,
    cantidadIdealPorHora: r.cantidad_ideal_por_hora,
    cantidadEnvasadaTeorica: r.cantidad_envasada_teorica,
    cantidadSopladaAprobada: r.cantidad_soplada_aprobada,
    cantidadMateriaPrima: r.cantidad_materia_prima,
    horasRetrasoNoEficiencia: r.horas_retraso_no_eficiencia,
    totalHorasRetrasadas: r.total_horas_retrasadas,
    factoresNoEficiencia: r.factores_no_eficiencia,
    retrasosProduccion: r.retrasos_produccion,
    retrasosMantenimiento: r.retrasos_mantenimiento,
    retrasosCalidadControl: r.retrasos_calidad_control,
    otrosFactores: r.otros_factores,
    retrasosASA: r.retrasos_asa,
    retrasosAlmacen: r.retrasos_almacen,
    duracionDias: r.duracion_dias,
  })

  useEffect(() => {
    const cargarRegistros = async () => {
      setLoading(true)
      try {
        const respuesta = await obtenerRegistrosBottlepack('bfs_312_215')
        const lista = Array.isArray(respuesta)
          ? respuesta
          : (Array.isArray(respuesta?.data) ? respuesta.data : [])
        // Invierte la lista para mostrar el registro más reciente primero
        const registrosMapeados = lista.map(mapearRegistro).reverse()
        setRegistros(registrosMapeados)
      } catch {
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
        <div className="container-fluid bg-primary text-white py-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
          <h2 className="fw-bold mb-2 mb-md-0">Registros Bottlepack 312</h2>
          <button className="btn btn-light fw-bold" onClick={() => navigate('/')}>
            Volver al Formulario
          </button>
        </div>
      </div>

      <div className="container-fluid py-4">
        <div className="row g-0">
          {loading ? (
            <div className="col-12 text-center p-5">
              <div className="spinner-border text-primary mb-3" />
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
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => toggleDetalle(i)}
                      >
                        {registroExpandido === i ? 'Ocultar Detalles' : 'Ver Detalles'}
                      </button>
                    </div>
                    {registroExpandido === i && (
                      <div className="mt-3">
                        <DetalleRegistroBottlepack312 registro={r} />
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

export default ListaRegistrosBottlepack312