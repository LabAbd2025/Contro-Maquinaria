// SeccionRetrasos.jsx
import React, { useState } from 'react'
import {
  factoresNoEficiencia,
  retrasosProduccion,
  retrasosMantenimiento,
  otrosFactores
} from '../helpers/calculos'
import { referenciasProductos } from '../helpers/referenciasProductos'

const SeccionRetrasos = ({ formulario, handleRetrasoChange, modelo }) => {
  const [productoActivo, setProductoActivo] = useState(null)

  const renderGrupoRetrasos = (titulo, factores, categoria) => (
    <div className="card mb-4">
      <div className="card-header bg-warning text-dark">
        <h6 className="mb-0">{titulo}</h6>
      </div>
      <div className="card-body">
        <div className="row g-2">
          {factores.map((factor, index) => (
            <div key={index} className="col-lg-6">
              <div className="row g-1 align-items-center">
                <div className="col-8">
                  <label className="form-label text-sm">{factor}</label>
                </div>
                <div className="col-4">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={formulario[categoria][factor]?.tiempo || ''}
                    onChange={(e) => {
                      let valor = e.target.value
                      valor = valor.replace(/[^\d:]/g, '')
                      const [horas = '00', minutos = '00'] = valor.split(':')
                      const h = parseInt(horas) || 0
                      const m = parseInt(minutos) || 0
                      if (h >= 0 && h < 24 && m >= 0 && m < 60) {
                        const tiempoFormateado = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
                        handleRetrasoChange(categoria, factor, tiempoFormateado)
                      } else if (!valor) {
                        handleRetrasoChange(categoria, factor, '')
                      }
                    }}
                    placeholder="00:00"
                  />
                </div>
              </div>
            </div>
          ))}
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
      {renderGrupoRetrasos('Retrasos por Mantenimiento', retrasosMantenimiento, 'retrasosMantenimiento')}
      {renderGrupoRetrasos('Otros Factores', otrosFactores, 'otrosFactores')}
    </div>
  )
}

export default SeccionRetrasos
