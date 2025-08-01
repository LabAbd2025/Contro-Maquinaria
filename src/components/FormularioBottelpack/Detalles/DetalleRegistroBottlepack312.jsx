import {
  formatearTiempo,
  formatearCantidad,
  formatearPorcentaje,
  calcularSumaHorasRetrasadas,
  calcularEnvasadoIdeal,
  calcularHorasIdeal
} from '../../../components/FormularioBottelpack/helpers/calculos'

const DetalleRegistroBottlepack312 = ({ registro: r }) => {
  // Compatibilidad con registros snake_case o camelCase
  const factoresNoEficiencia = r.factores_no_eficiencia || r.factoresNoEficiencia;
  const retrasosProduccion = r.retrasos_produccion || r.retrasosProduccion;
  const retrasosCalidadControl = r.retrasos_calidad_control || r.retrasosCalidadControl;
  const retrasosMantenimiento = r.retrasos_mantenimiento || r.retrasosMantenimiento;
  const otrosFactores = r.otros_factores || r.otrosFactores;
  const horasIdeales = r.horas_ideales || r.horasIdeales || calcularHorasIdeal(r.cantidad_envasada || r.cantidadEnvasada, r.cantidad_ideal_por_hora || r.cantidadIdealPorHora);

  // Cálculos de métricas adicionales
  const sumaHorasRetrasadasNoEficiencia = calcularSumaHorasRetrasadas(factoresNoEficiencia);
  const envasadoIdeal = calcularEnvasadoIdeal(r.horas_trabajadas || r.horasTrabajadas, r.cantidad_ideal_por_hora || r.cantidadIdealPorHora);
  const totalHorasRetrasadas = calcularSumaHorasRetrasadas({
    ...retrasosProduccion,
    ...retrasosCalidadControl,
    ...retrasosMantenimiento,
    ...otrosFactores
  });

  // Componente para mostrar cada grupo de factores/retrasos con descripción
  const GrupoRetrasos = ({ titulo, data, color }) => (
    <div className="col-md-6 mb-2">
      <div className={`card h-100 border-${color}`}>
        <div className={`card-header bg-${color} text-white`}>{titulo}</div>
        <div className="card-body">
          {Object.entries(data || {}).filter(([, obj]) => obj?.tiempo).length === 0
            ? <div className="text-muted small">No se reportaron retrasos</div>
            : Object.entries(data || {}).map(([factor, obj], i) =>
                obj?.tiempo ? (
                  <div key={i} className="small">
                    <strong>{factor}:</strong> {formatearTiempo(obj.tiempo)}
                    {obj.descripcion && <span className="text-muted"> — {obj.descripcion}</span>}
                  </div>
                ) : null
              )
          }
        </div>
      </div>
    </div>
  )

  return (
    <div className="card-body p-4">
      {/* 1. Información General y Tiempos */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Información General y Tiempos</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="card border-primary h-100">
                <div className="card-header">Datos Generales</div>
                <div className="card-body">
                  <p><strong className="text-danger">Fecha:</strong> {r.fecha_inicio || r.fechaInicio} - {r.fecha_fin || r.fechaFin}</p>
                  <p><strong className="text-danger">Día:</strong> {r.dia || '-'} {r.duracion_dias || r.duracionDias ? <>({r.duracion_dias || r.duracionDias})</> : null}</p>
                  <p><strong className="text-danger">Producto:</strong> {r.producto || '-'}</p>
                  <p><strong className="text-danger">Lote:</strong> {r.lote || '-'}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-primary h-100">
                <div className="card-header">Tiempos</div>
                <div className="card-body">
                  <p><strong>Hora Inicio:</strong> {formatearTiempo(r.hora_inicio || r.horaInicio)}</p>
                  <p><strong>Hora Final:</strong> {formatearTiempo(r.hora_final || r.horaFinal)}</p>
                  <p><strong>Horas Trabajadas:</strong> {formatearTiempo(r.horas_trabajadas || r.horasTrabajadas)}</p>
                  <p><strong>Horas Reales:</strong> {formatearTiempo(r.horas_reales || r.horasReales)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Métricas de Producción */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Métricas de Producción</h5>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="text-center mb-3">Eficiencia</h6>
                  <div className="progress" style={{ height: '25px' }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${r.eficiencia || 0}%` }}
                    >
                      {formatearPorcentaje(r.eficiencia)}
                    </div>
                  </div>
                  <div className="text-center small text-muted">
                    Horas Reales / Horas Trabajadas
                  </div>
                  <div className="text-center fw-bold">
                    {formatearTiempo(r.horas_reales || r.horasReales)} / {formatearTiempo(r.horas_trabajadas || r.horasTrabajadas)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="text-center mb-3">Eficacia</h6>
                  <div className="progress" style={{ height: '25px' }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: `${r.eficacia || 0}%` }}
                    >
                      {formatearPorcentaje(r.eficacia)}
                    </div>
                  </div>
                  <div className="text-center small text-muted">
                    Cantidad Envasada / Cantidad Programada
                  </div>
                  <div className="text-center fw-bold">
                    {formatearCantidad(r.cantidad_envasada || r.cantidadEnvasada)} / {formatearCantidad(r.cantidad_programada_diaria || r.cantidadProgramadaDiaria)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-info">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm table-bordered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Métrica</th>
                      <th>Fórmula</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Eficiencia</td>
                      <td className="small">
                        (Horas Reales / Horas Trabajadas) × 100 <br />
                        <span className="text-muted">
                          ({formatearTiempo(r.horas_reales || r.horasReales)} / {formatearTiempo(r.horas_trabajadas || r.horasTrabajadas)})
                        </span>
                      </td>
                      <td>{formatearPorcentaje(r.eficiencia)}</td>
                    </tr>
                    <tr>
                      <td>Eficacia</td>
                      <td className="small">
                        (Cantidad Envasada / Cantidad Programada) × 100 <br />
                        <span className="text-muted">
                          ({formatearCantidad(r.cantidad_envasada || r.cantidadEnvasada)} / {formatearCantidad(r.cantidad_programada_diaria || r.cantidadProgramadaDiaria)})
                        </span>
                      </td>
                      <td>{formatearPorcentaje(r.eficacia)}</td>
                    </tr>
                    <tr>
                      <td>Cantidad Ideal por Hora</td>
                      <td className="small">Valor estándar establecido</td>
                      <td>{formatearCantidad(r.cantidad_ideal_por_hora || r.cantidadIdealPorHora)}</td>
                    </tr>
                    <tr>
                      <td>Cantidad Envasada Teórica</td>
                      <td className="small">
                        Horas Trabajadas × Cantidad Ideal por Hora <br />
                        <span className="text-muted">{formatearTiempo(r.horas_trabajadas || r.horasTrabajadas)} × {formatearCantidad(r.cantidad_ideal_por_hora || r.cantidadIdealPorHora)}</span>
                      </td>
                      <td>{formatearCantidad(r.cantidad_envasada_teorica || r.cantidadEnvasadaTeorica)}</td>
                    </tr>
                    <tr>
                      <td>Horas Ideales</td>
                      <td className="small">
                        Cantidad Envasada / Cantidad Ideal por Hora <br />
                        <span className="text-muted">{formatearCantidad(r.cantidad_envasada || r.cantidadEnvasada)} / {formatearCantidad(r.cantidad_ideal_por_hora || r.cantidadIdealPorHora)}</span>
                      </td>
                      <td>{formatearTiempo(horasIdeales)}</td>
                    </tr>
                    <tr>
                      <td>Cantidad Soplada Aprobada</td>
                      <td className="small">Valor medido en producción</td>
                      <td>{formatearCantidad(r.cantidad_soplada_aprobada || r.cantidadSopladaAprobada)}</td>
                    </tr>
                    <tr>
                      <td>Materia Prima Utilizada (KGS)</td>
                      <td className="small">Valor medido en producción</td>
                      <td>{formatearCantidad(r.cantidad_materia_prima || r.cantidadMateriaPrima)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Métricas Adicionales */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">Métricas Adicionales</h5>
        </div>
        <div className="card-body">
          <table className="table table-sm table-bordered mb-0">
            <tbody>
              <tr>
                <td>Suma de Horas Retrasadas (NO Afectan Eficiencia)</td>
                <td>{formatearTiempo(sumaHorasRetrasadasNoEficiencia)}</td>
              </tr>
              <tr>
                <td>Envasado Ideal (según horas trabajadas)</td>
                <td>{formatearCantidad(envasadoIdeal)}</td>
              </tr>
              <tr>
                <td>Horas Ideales (según cantidad envasada)</td>
                <td>{formatearTiempo(horasIdeales)}</td>
              </tr>
              <tr>
                <td>Total de Horas Retrasadas</td>
                <td>{formatearTiempo(totalHorasRetrasadas)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Resumen de Factores — TODOS los grupos */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">Resumen de Factores</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <GrupoRetrasos
              titulo="Factores que NO afectan eficiencia"
              data={factoresNoEficiencia}
              color="info"
            />
            <GrupoRetrasos
              titulo="Retrasos por Producción"
              data={retrasosProduccion}
              color="danger"
            />
            <GrupoRetrasos
              titulo="Retrasos por Control de Calidad"
              data={retrasosCalidadControl}
              color="warning"
            />
            <GrupoRetrasos
              titulo="Retrasos por Mantenimiento"
              data={retrasosMantenimiento}
              color="primary"
            />
            <GrupoRetrasos
              titulo="Otros Factores"
              data={otrosFactores}
              color="secondary"
            />
          </div>
        </div>
      </div>

      {/* 5. Observaciones */}
      {r.observaciones && (
        <div className="card shadow-sm">
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0">Observaciones</h5>
          </div>
          <div className="card-body">
            <p className="mb-0 small">{r.observaciones}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetalleRegistroBottlepack312
