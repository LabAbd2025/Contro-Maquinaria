import React, { useState } from 'react'
import {
  factoresNoEficiencia,
  retrasosProduccion,
  retrasosCalidadControl,
  retrasosMantenimiento,
  retrasosASA,
  retrasosAlmacen,
  otrosFactores,
  placeholdersRetrasos
} from '../helpers/calculos'
import { referenciasProductos } from '../helpers/referenciasProductos'

const SeccionRetrasos = ({ formulario, handleRetrasoChange, modelo }) => {
  const [productoActivo, setProductoActivo] = useState(null)

  // Helper para validar tiempo en formato HH:mm
  const validarHoraMin = (valor) => {
    if (!valor) return true
    return /^([01]?\d|2[0-3]):[0-5]\d$/.test(valor)
  }

  const renderGrupoRetrasos = (titulo, factores, categoria) => (
    <div className="card mb-4">
      <div className="card-header bg-warning text-dark">
        <h6 className="mb-0">{titulo}</h6>
      </div>
      <div className="card-body">
        <div className="row g-2">
          {factores.map((factor, index) => {
            const tiempo = formulario[categoria]?.[factor]?.tiempo || ''
            const descripcion = formulario[categoria]?.[factor]?.descripcion || ''
            const tiempoValido = validarHoraMin(tiempo)

            return (
              <div key={index} className="col-lg-12 mb-2">
                <div className="row g-1 align-items-center">
                  <div className="col-4">
                    <label className="form-label text-sm">{factor}</label>
                  </div>
                  <div className="col-2">
                    <input
                      type="text"
                      className={`form-control form-control-sm ${!tiempoValido && tiempo ? 'is-invalid' : ''}`}
                      value={tiempo}
                      onChange={(e) => {
                        let valor = e.target.value.replace(/[^\d:]/g, '')
                        handleRetrasoChange(
                          categoria,
                          factor,
                          valor,
                          descripcion
                        )
                      }}
                      placeholder="00:00"
                      maxLength={5}
                    />
                    {!tiempoValido && tiempo && (
                      <div className="invalid-feedback p-0 m-0">Formato HH:mm</div>
                    )}
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={descripcion}
                      onChange={(e) => {
                        handleRetrasoChange(
                          categoria,
                          factor,
                          tiempo,
                          e.target.value
                        )
                      }}
                      placeholder={placeholdersRetrasos[factor] || "Motivo o descripción del retraso"}
                      maxLength={120}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Mostrar referencias solo si NO es bfs_312_215 */}
      {modelo !== 'bfs_312_215' && (
        <div className="card border-info mb-4">
          <div className="card-header bg-info text-white py-2">
            Referencia por Producto — Haz clic para ver detalles
          </div>
          <div className="card-body p-3 small">
            <div className="row">
              {Object.entries(referenciasProductos).map(([nombre, ref]) => (
                <div key={nombre} className="col-md-6 mb-2">
                  <button
                    className={`btn btn-outline-primary btn-sm w-100 text-start ${productoActivo === nombre ? 'fw-bold' : ''}`}
                    onClick={() => setProductoActivo(nombre === productoActivo ? null : nombre)}
                  >
                    {nombre}
                  </button>
                  {productoActivo === nombre && (
                    <div className="mt-2 border rounded bg-light p-2">
                      <p className="mb-1"><strong>Limpieza:</strong> {ref.limpieza}</p>
                      <p className="mb-1"><strong>Desinfección:</strong> {ref.desinfeccion}</p>
                      <p className="mb-1"><strong>Despeje de línea:</strong> {ref.despeje}</p>
                      <p className="mb-1"><strong>Armado de líneas:</strong> {ref.armado}</p>
                      <p className="mb-1"><strong>Preparación:</strong> {ref.preparacion}</p>
                      <p className="mb-1"><strong>Aprobación:</strong> {ref.aprobacion}</p>
                      <p className="mb-1"><strong>Puesta en marcha:</strong> {ref.puestaEnMarcha}</p>
                      <hr className="my-1" />
                      <p className="mb-1"><strong>Unidades por hora:</strong> {ref.unidadesPorHora}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Renderizado de todos los grupos de factores */}
      {renderGrupoRetrasos('Factores que No Afectan la Eficiencia', factoresNoEficiencia, 'factoresNoEficiencia')}
      {renderGrupoRetrasos('Retrasos por Producción', retrasosProduccion, 'retrasosProduccion')}
      {renderGrupoRetrasos('Retrasos por Control de Calidad', retrasosCalidadControl, 'retrasosCalidadControl')}
      {renderGrupoRetrasos('Retrasos por Mantenimiento', retrasosMantenimiento, 'retrasosMantenimiento')}
      {renderGrupoRetrasos('Retrasos por ASA', retrasosASA, 'retrasosASA')}
      {renderGrupoRetrasos('Retrasos por Almacén', retrasosAlmacen, 'retrasosAlmacen')}
      {renderGrupoRetrasos('Otros Factores', otrosFactores, 'otrosFactores')}
    </div>
  )
}

export default SeccionRetrasos
