import {
  formatearTiempo,
  formatearCantidad,
  formatearPorcentaje,
  calcularSumaHorasRetrasadas,
  calcularEnvasadoIdeal,
  calcularHorasIdeal,
} from '../../../components/FormularioBottelpack/helpers/calculos';

// Convierte "HH:mm" o "HH:mm:ss" a horas decimales
function parseTiempoAHoras(str) {
  if (!str) return 0;
  const partes = str.split(':').map(Number);
  if (partes.length === 2) return partes[0] + partes[1] / 60;
  if (partes.length === 3) return partes[0] + partes[1] / 60 + partes[2] / 3600;
  return 0;
}

// Configura aquí tus grupos de retrasos y el orden de visualización
const GRUPOS_RETRASO = [
  { key: 'factoresNoEficiencia', titulo: 'Factores que NO afectan eficiencia', color: 'info' },
  { key: 'retrasosProduccion', titulo: 'Retrasos por Producción', color: 'danger' },
  { key: 'retrasosCalidadControl', titulo: 'Retrasos por Control de Calidad', color: 'warning' },
  { key: 'retrasosMantenimiento', titulo: 'Retrasos por Mantenimiento', color: 'primary' },
  { key: 'retrasosASA', titulo: 'Retrasos ASA', color: 'success' },         // Puedes habilitar cuando el backend los tenga
  { key: 'retrasosAlmacen', titulo: 'Retrasos Almacén', color: 'secondary' },// Puedes habilitar cuando el backend los tenga
  { key: 'otrosFactores', titulo: 'Otros Factores', color: 'dark' },
];

const DetalleRegistroBottlepack321 = ({ registro: r }) => {
  // Extrae todos los posibles grupos de retrasos
  const gruposRetrasos = GRUPOS_RETRASO.map(grupo => ({
    ...grupo,
    data: r[grupo.key] || {},
  }));

  // Cálculos
  const horasIdeal = calcularHorasIdeal(r.cantidadEnvasada, r.cantidadIdealPorHora);
  const envasadoIdeal = calcularEnvasadoIdeal(r.horasTrabajadas, r.cantidadIdealPorHora);

  // Sumatorias
  const sumaHorasRetrasadasNoEficiencia = calcularSumaHorasRetrasadas(r.factoresNoEficiencia || {});
  const totalHorasRetrasadas = calcularSumaHorasRetrasadas(
    Object.assign(
      {},
      r.retrasosProduccion || {},
      r.retrasosCalidadControl || {},
      r.retrasosMantenimiento || {},
      r.retrasosASA || {},
      r.retrasosAlmacen || {},
      r.otrosFactores || {}
    )
  );

  // Métricas principales
  const eficiencia =
    r.horasTrabajadas && horasIdeal && r.horasTrabajadas !== '00:00' && horasIdeal !== '00:00'
      ? ((parseTiempoAHoras(horasIdeal) / parseTiempoAHoras(r.horasTrabajadas)) * 100).toFixed(2)
      : '0.00';

  const eficacia =
    r.cantidadEnvasada && r.cantidadProgramadaDiaria
      ? ((Number(r.cantidadEnvasada) / Number(r.cantidadProgramadaDiaria)) * 100).toFixed(2)
      : '0.00';

  // Render para cada grupo de retrasos
  const GrupoRetrasos = ({ titulo, data, color }) => {
    const items = Object.entries(data || {}).filter(
      ([, obj]) => obj && obj.tiempo && obj.tiempo !== '00:00' && obj.tiempo !== '00:00:00'
    );
    if (items.length === 0) return null;
    return (
      <div className="col-md-6 mb-2">
        <div className={`card h-100 border-${color}`}>
          <div className={`card-header bg-${color} text-white`}>{titulo}</div>
          <div className="card-body">
            {items.map(([factor, obj], i) => (
              <div key={i} className="small">
                <strong>
                  {factor.replaceAll('_', ' ').replace(/\s+/g, ' ').trim()}:
                </strong>{' '}
                {formatearTiempo(obj.tiempo)}
                {obj.descripcion && (
                  <span className="text-muted"> — {obj.descripcion}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

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
                  <p>
                    <strong className="text-danger">Fecha:</strong>{' '}
                    {r.fechaInicio || '-'} {r.fechaFin ? `- ${r.fechaFin}` : ''}
                  </p>
                  <p>
                    <strong className="text-danger">Día:</strong> {r.dia || '-'}{' '}
                    {r.duracionDias && <>({r.duracionDias})</>}
                  </p>
                  <p>
                    <strong className="text-danger">Producto:</strong>{' '}
                    {r.producto || '-'}
                  </p>
                  <p>
                    <strong className="text-danger">Lote:</strong>{' '}
                    {r.lote || '-'}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-primary h-100">
                <div className="card-header">Tiempos</div>
                <div className="card-body">
                  <p>
                    <strong>Hora Inicio:</strong> {formatearTiempo(r.horaInicio)}
                  </p>
                  <p>
                    <strong>Hora Final:</strong> {formatearTiempo(r.horaFinal)}
                  </p>
                  <p>
                    <strong>Horas Trabajadas:</strong> {formatearTiempo(r.horasTrabajadas)}
                  </p>
                  <p>
                    <strong>Horas Ideales:</strong> {formatearTiempo(horasIdeal)}
                  </p>
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
                      style={{ width: `${eficiencia}%` }}
                    >
                      {formatearPorcentaje(eficiencia)}
                    </div>
                  </div>
                  <div className="text-center small text-muted">
                    Horas Ideales / Horas Trabajadas
                  </div>
                  <div className="text-center fw-bold">
                    {formatearTiempo(horasIdeal)} / {formatearTiempo(r.horasTrabajadas)}
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
                      style={{ width: `${eficacia}%` }}
                    >
                      {formatearPorcentaje(eficacia)}
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
                        (Horas Ideales / Horas Trabajadas) × 100 <br />
                        <span className="text-muted">
                          ({formatearTiempo(horasIdeal)} / {formatearTiempo(r.horasTrabajadas)})
                        </span>
                      </td>
                      <td>{formatearPorcentaje(eficiencia)}</td>
                    </tr>
                    <tr>
                      <td>Eficacia</td>
                      <td className="small">
                        (Cantidad Envasada / Cantidad Programada) × 100 <br />
                        <span className="text-muted">
                          ({formatearCantidad(r.cantidadEnvasada)} / {formatearCantidad(r.cantidadProgramadaDiaria)})
                        </span>
                      </td>
                      <td>{formatearPorcentaje(eficacia)}</td>
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
                        <span className="text-muted">
                          {formatearTiempo(r.horasTrabajadas)} × {formatearCantidad(r.cantidadIdealPorHora)}
                        </span>
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
            {gruposRetrasos.map(
              ({ key, titulo, data, color }) =>
                Object.values(data || {}).some(
                  obj => obj && obj.tiempo && obj.tiempo !== '00:00' && obj.tiempo !== '00:00:00'
                ) && (
                  <GrupoRetrasos
                    key={key}
                    titulo={titulo}
                    data={data}
                    color={color}
                  />
                )
            )}
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
  );
};

export default DetalleRegistroBottlepack321;
