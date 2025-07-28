import React, { useState } from 'react'
import { referenciasProductos } from '../helpers/referenciasProductos'

const SeccionCantidades = ({ formulario, handleChange, modelo }) => {
  const [productoActivo, setProductoActivo] = useState(null)

  // Obtén la referencia del producto seleccionado
  const refProducto = referenciasProductos[formulario.producto]

  return (
    <div className="row g-3">
      {/* Referencia por producto */}
      {modelo !== 'bfs_312_215' ? (
        <div className="col-12">
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
                      onClick={() => setProductoActivo(productoActivo === nombre ? null : nombre)}
                      type="button"
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
        </div>
      ) : (
        <div className="col-12">
          <p className="text-muted small mb-3">
            🔧📦🚧 En referencia de producto estamos trabajando en ello.
          </p>
        </div>
      )}

      {/* CAMPOS DE CANTIDADES */}
      <div className="col-md-6">
        <label className="form-label">
          Cantidad Ideal por Hora
          <span className="text-muted small d-block">Capacidad máxima teórica</span>
        </label>
        <input
          type="number"
          className="form-control"
          value={formulario.cantidadIdealPorHora || ''}
          onChange={(e) => handleChange('cantidadIdealPorHora', e.target.value)}
          min={0}
        />
        {formulario.producto && refProducto && (
          <div className="small text-secondary mt-1">
            Estándar por hora para <b>{formulario.producto}</b>: <b>{refProducto.unidadesPorHora}</b> unidades/hora
          </div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label">
          Cantidad Programada Diaria
          <span className="text-muted small d-block">Meta asignada para la jornada</span>
        </label>
        <input
          type="number"
          className="form-control"
          value={formulario.cantidadProgramadaDiaria || ''}
          onChange={(e) => handleChange('cantidadProgramadaDiaria', e.target.value)}
          min={0}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">
          Cantidad envasada Real
          <span className="text-muted small d-block">Total logrado, descontando mermas</span>
        </label>
        <input
          type="number"
          className="form-control"
          value={formulario.cantidadEnvasada || ''}
          onChange={(e) => handleChange('cantidadEnvasada', e.target.value)}
          min={0}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">
          Cantidad Envasada Teórica
          <span className="text-muted small d-block">Lo esperado según tiempo de trabajo</span>
        </label>
        <input
          type="number"
          className="form-control"
          value={formulario.cantidadEnvasadaTeorica || ''}
          onChange={(e) => handleChange('cantidadEnvasadaTeorica', e.target.value)}
          min={0}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Cantidad Soplada Aprobada</label>
        <input
          type="number"
          className="form-control"
          value={formulario.cantidadSopladaAprobada || ''}
          onChange={(e) => handleChange('cantidadSopladaAprobada', e.target.value)}
          min={0}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Materia Prima Utilizada (KGS)</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={formulario.cantidadMateriaPrima || ''}
          onChange={(e) => handleChange('cantidadMateriaPrima', e.target.value)}
          min={0}
        />
      </div>
    </div>
  )
}

export default SeccionCantidades
