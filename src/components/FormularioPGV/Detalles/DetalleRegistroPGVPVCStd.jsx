import {
  formatearTiempo,
  formatearCantidad,
  formatearPorcentaje,
  calcularSumaHorasRetrasadas,
  calcularHorasIdeal,
  calcularEnvasadoIdeal
} from '../../../components/FormularioPGV/helpers/calculos'

const DetalleRegistroPGVPVCStd = ({ registro: r }) => {
  const factoresNoEficiencia = r.factoresNoEficiencia || r.factores_no_eficiencia
  const retrasosProduccion = r.retrasosProduccion || r.retrasos_produccion
  const retrasosCalidadControl = r.retrasosCalidadControl || r.retrasos_calidad_control
  const retrasosMantenimiento = r.retrasosMantenimiento || r.retrasos_mantenimiento
  const otrosFactores = r.otrosFactores || r.otros_factores

  // Cálculos principales
  const sumaHorasRetrasadasNoEficiencia = calcularSumaHorasRetrasadas(factoresNoEficiencia)
  const totalHorasRetrasadas = calcularSumaHorasRetrasadas({
    ...retrasosProduccion,
    ...retrasosCalidadControl,
    ...retrasosMantenimiento,
    ...otrosFactores
  })
  const envasadoIdeal = calcularEnvasadoIdeal(
    r.horasTrabajadas ?? r.horas_trabajadas,
    r.cantidadIdealPorHora ?? r.cantidad_ideal_por_hora
  )
  const horasIdeal = r.horasIdeales ?? r.horas_ideales ??
    calcularHorasIdeal(r.cantidadEnvasada ?? r.cantidad_envasada, r.cantidadIdealPorHora ?? r.cantidad_ideal_por_hora)

  // Visualización de grupos de retrasos
  const DetallesRetrasos = ({ titulo, data, color }) => (
    <div className="col-md-6 mb-2">
      <div className={`card h-100 border-${color}`}>
        <div className={`card-header bg-${color} text-white`}>{titulo}</div>
        <div className="card-body">
          {Object.entries(data || {}).filter(([, obj]) => obj?.tiempo).length === 0 ? (
            <div className="text-muted small">No se reportaron retrasos</div>
          ) : (
            Object.entries(data || {}).map(([factor, obj], j) =>
              obj?.tiempo ? (
                <div key={j} className="small">
                  <strong>{factor}:</strong> {formatearTiempo(obj.tiempo)}
                  {obj.descripcion && <span className="text-muted"> — {obj.descripcion}</span>}
                </div>
              ) : null
            )
          )}
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
                  <p><strong>Fecha:</strong> {r.fechaInicio ?? r.fecha_inicio} - {r.fechaFin ?? r.fecha_fin}</p>
                  <p><strong>Día:</strong> {(r.dia || r.dia) ?? '-'} {(r.duracionDias ?? r.duracion_dias) && <>({r.duracionDias ?? r.duracion_dias})</>}</p>
                  <p><strong>Producto:</strong> {r.producto ?? '-'}</p>
                  <p><strong>Lote:</strong> {r.lote ?? '-'}</p>
                  {/* Si PGV PVC Std tiene campo especial, agrégalo aquí */}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-primary h-100">
                <div className="card-header">Tiempos</div>
                <div className="card-body">
                  <p><strong>Hora Inicio:</strong> {formatearTiempo(r.horaInicio ?? r.hora_inicio)}</p>
                  <p><strong>Hora Final:</strong> {formatearTiempo(r.horaFinal ?? r.hora_final)}</p>
                  <p><strong>Horas Trabajadas:</strong> {formatearTiempo(r.horasTrabajadas ?? r.horas_trabajadas)}</p>
                  <p><strong>Horas Ideales:</strong> {formatearTiempo(horasIdeal)}</p>
                  <p><strong>Horas Reales:</strong> {formatearTiempo(r.horasReales ?? r.horas_reales)}</p>
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
                    {formatearTiempo(r.horasReales ?? r.horas_reales)} / {formatearTiempo(r.horasTrabajadas ?? r.horas_trabajadas)}
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
                    {formatearCantidad(r.cantidadEnvasada ?? r.cantidad_envasada)} / {formatearCantidad(r.cantidadProgramadaDiaria ?? r.cantidad_programada_diaria)}
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
                        <span className="text-muted">({formatearTiempo(r.horasReales ?? r.horas_reales)} / {formatearTiempo(r.horasTrabajadas ?? r.horas_trabajadas)})</span>
                      </td>
                      <td>{formatearPorcentaje(r.eficiencia)}</td>
                    </tr>
                    <tr>
                      <td>Eficacia</td>
                      <td className="small">
                        (Cantidad Envasada / Cantidad Programada) × 100 <br />
                        <span className="text-muted">({formatearCantidad(r.cantidadEnvasada ?? r.cantidad_envasada)} / {formatearCantidad(r.cantidadProgramadaDiaria ?? r.cantidad_programada_diaria)})</span>
                      </td>
                      <td>{formatearPorcentaje(r.eficacia)}</td>
                    </tr>
                    <tr>
                      <td>Cantidad Ideal por Hora</td>
                      <td className="small">Valor estándar establecido</td>
                      <td>{formatearCantidad(r.cantidadIdealPorHora ?? r.cantidad_ideal_por_hora)}</td>
                    </tr>
                    <tr>
                      <td>Cantidad Envasada Teórica</td>
                      <td className="small">
                        Horas Trabajadas × Cantidad Ideal por Hora <br />
                        <span className="text-muted">{formatearTiempo(r.horasTrabajadas ?? r.horas_trabajadas)} × {formatearCantidad(r.cantidadIdealPorHora ?? r.cantidad_ideal_por_hora)}</span>
                      </td>
                      <td>{formatearCantidad(r.cantidadEnvasadaTeorica ?? r.cantidad_envasada_teorica)}</td>
                    </tr>
                    <tr>
                      <td>Materia Prima Utilizada (KGS)</td>
                      <td className="small">Valor medido en producción</td>
                      <td>{formatearCantidad(r.cantidadMateriaPrima ?? r.cantidad_materia_prima)}</td>
                    </tr>
                    {/* Si tienes algún campo especial de STD agrégalo aquí */}
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

      {/* 4. Resumen de Factores */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">Resumen de Factores</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <DetallesRetrasos
              titulo="Factores que NO afectan eficiencia"
              data={factoresNoEficiencia}
              color="info"
            />
            <DetallesRetrasos
              titulo="Retrasos por Producción"
              data={retrasosProduccion}
              color="danger"
            />
            <DetallesRetrasos
              titulo="Retrasos por Control de Calidad"
              data={retrasosCalidadControl}
              color="warning"
            />
            <DetallesRetrasos
              titulo="Retrasos por Mantenimiento"
              data={retrasosMantenimiento}
              color="primary"
            />
            <DetallesRetrasos
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

export default DetalleRegistroPGVPVCStd
