import {
  formatearTiempo,
  formatearCantidad,
  formatearPorcentaje,
  calcularSumaHorasRetrasadas,
  calcularEnvasadoIdeal,
  calcularHorasIdeal
} from '../../../components/FormularioBottelpack/helpers/calculos'

const DetalleRegistroBottlepack305 = ({ registro: r }) => {
  const sumaHorasRetrasadasNoEficiencia = calcularSumaHorasRetrasadas(r.factoresNoEficiencia)
  const envasadoIdeal = calcularEnvasadoIdeal(r.horasTrabajadas, r.cantidadIdealPorHora)
  const horasIdeal = calcularHorasIdeal(r.cantidadEnvasada, r.cantidadIdealPorHora)
  const totalHorasRetrasadas = calcularSumaHorasRetrasadas({
    ...r.retrasosProduccion,
    ...r.retrasosCalidadControl,
    ...r.retrasosMantenimiento,
    ...r.otrosFactores
  })

  return (
    <div className="card-body p-4">
      {/* Información General */}
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
                  <p><strong>Fecha:</strong> {r.fechaInicio} - {r.fechaFin}</p>
                  <p><strong>Día:</strong> {r.dia} ({r.duracionDias})</p>
                  <p><strong>Producto:</strong> {r.producto}</p>
                  <p><strong>Lote:</strong> {r.lote}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-primary h-100">
                <div className="card-header">Tiempos</div>
                <div className="card-body">
                  <p><strong>Hora Inicio:</strong> {formatearTiempo(r.horaInicio)}</p>
                  <p><strong>Hora Final:</strong> {formatearTiempo(r.horaFinal)}</p>
                  <p><strong>Horas Trabajadas:</strong> {formatearTiempo(r.horasTrabajadas)}</p>
                  <p><strong>Horas Reales:</strong> {formatearTiempo(r.horasReales)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas de Producción */}
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
                      style={{ width: `${r.eficiencia}%` }}
                    >
                      {formatearPorcentaje(r.eficiencia)}
                    </div>
                  </div>
                  <div className="text-center small text-muted">
                    Horas Reales / Horas Trabajadas
                  </div>
                  <div className="text-center fw-bold">
                    {formatearTiempo(r.horasReales)} / {formatearTiempo(r.horasTrabajadas)}
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
                      style={{ width: `${r.eficacia}%` }}
                    >
                      {formatearPorcentaje(r.eficacia)}
                    </div>
                  </div>
                  <div className="text-center small text-muted">
                    Cantidad Envasada / Cantidad Programada
                  </div>
                  <div className="text-center fw-bold">
                    {formatearCantidad(r.cantidadEnvasada)} / {formatearCantidad(r.cantidadProgramadaDiaria)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Métricas */}
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
                        <span className="text-muted">({formatearTiempo(r.horasReales)} / {formatearTiempo(r.horasTrabajadas)})</span>
                      </td>
                      <td>{formatearPorcentaje(r.eficiencia)}</td>
                    </tr>
                    <tr>
                      <td>Eficacia</td>
                      <td className="small">
                        (Cantidad Envasada / Cantidad Programada) × 100 <br />
                        <span className="text-muted">({formatearCantidad(r.cantidadEnvasada)} / {formatearCantidad(r.cantidadProgramadaDiaria)})</span>
                      </td>
                      <td>{formatearPorcentaje(r.eficacia)}</td>
                    </tr>
                    <tr>
                      <td>Cantidad Ideal por Hora</td>
                      <td className="small">Valor estándar establecido</td>
                      <td>{formatearCantidad(r.cantidadIdealPorHora)}</td>
                    </tr>
                    <tr>
                      <td>Cantidad Envasada Teórica</td>
                      <td className="small">
                        Horas Trabajadas × Cantidad Ideal por Hora <br />
                        <span className="text-muted">{formatearTiempo(r.horasTrabajadas)} × {formatearCantidad(r.cantidadIdealPorHora)}</span>
                      </td>
                      <td>{formatearCantidad(r.cantidadEnvasadaTeorica)}</td>
                    </tr>
                    <tr>
                      <td>Cantidad Soplada Aprobada</td>
                      <td className="small">Valor medido en producción</td>
                      <td>{formatearCantidad(r.cantidadSopladaAprobada)}</td>
                    </tr>
                    <tr>
                      <td>Materia Prima Utilizada (KGS)</td>
                      <td className="small">Valor medido en producción</td>
                      <td>{formatearCantidad(r.cantidadMateriaPrima)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Adicionales */}
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
                <td>Envasado Ideal (según horas de soplado)</td>
                <td>{formatearCantidad(envasadoIdeal)}</td>
              </tr>
              <tr>
                <td>Horas Ideal (según cantidad envasada)</td>
                <td>{formatearTiempo(horasIdeal)}</td>
              </tr>
              <tr>
                <td>Total de Horas Retrasadas</td>
                <td>{formatearTiempo(totalHorasRetrasadas)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen de Factores */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">Resumen de Factores</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="card h-100 border-info">
                <div className="card-header bg-info text-white">No Afectan Eficiencia</div>
                <div className="card-body">
                  <p className="small mb-2">
                    <strong>Total Horas:</strong> {formatearTiempo(r.horasRetrasoNoEficiencia)}
                  </p>
                  {Object.entries(r.factoresNoEficiencia || {}).map(([factor, data], j) => (
                    data.tiempo && (
                      <div key={j} className="small">
                        - {factor}: {formatearTiempo(data.tiempo)}
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 border-danger">
                <div className="card-header bg-danger text-white">Sí Afectan Eficiencia</div>
                <div className="card-body">
                  <p className="small mb-2">
                    <strong>Total Horas:</strong> {formatearTiempo(r.totalHorasRetrasadas)}
                  </p>
                  {Object.entries(r.retrasosProduccion || {}).map(([factor, data], j) => (
                    data.tiempo && (
                      <div key={j} className="small">
                        - {factor}: {formatearTiempo(data.tiempo)}
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Observaciones */}
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

export default DetalleRegistroBottlepack305
