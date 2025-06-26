import React, { useState } from 'react'
import { obtenerFechaActual } from '../helpers/calculos'
import { referenciasProductos } from '../helpers/referenciasProductos'

const SeccionBasicos = ({ formulario, handleChange, modelo }) => {
  const [productoActivo, setProductoActivo] = useState(null)

  return (
    <div className="row g-3">
      {/* Referencia por producto o mensaje alternativo */}
      <div className="col-12">
        {modelo !== 'bfs_312_215' ? (
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
        ) : (
          <p className="text-muted small mb-3">
            🔧📦🚧 En referencia de producto estamos trabajando en ello.
          </p>
        )}
      </div>

      <div className="col-md-6">
        <label className="form-label">Fecha de Inicio</label>
        <input
          type="date"
          className="form-control"
          value={formulario.fechaInicio}
          min={obtenerFechaActual()}
          onChange={(e) => {
            handleChange('fechaInicio', e.target.value)
            if (formulario.fechaFin && formulario.fechaFin < e.target.value) {
              handleChange('fechaFin', e.target.value)
            }
          }}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Fecha de Fin</label>
        <input
          type="date"
          className="form-control"
          value={formulario.fechaFin}
          min={formulario.fechaInicio || obtenerFechaActual()}
          onChange={(e) => handleChange('fechaFin', e.target.value)}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Duración</label>
        <input
          type="text"
          className="form-control"
          value={formulario.duracionDias}
          readOnly
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Día</label>
        <input
          type="text"
          className="form-control"
          value={formulario.dia}
          readOnly
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Producto</label>
        <input
          type="text"
          className="form-control"
          value={formulario.producto}
          onChange={(e) => handleChange('producto', e.target.value)}
          placeholder="Ej: Solución X"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Lote</label>
        <input
          type="text"
          className="form-control"
          value={formulario.lote}
          onChange={(e) => handleChange('lote', e.target.value)}
          placeholder="Ej: L-001"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Hora Inicio</label>
        <input
          type="time"
          className="form-control"
          value={formulario.horaInicio}
          onChange={(e) => handleChange('horaInicio', e.target.value)}
          step="60"
          required
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Hora Final</label>
        <input
          type="time"
          className="form-control"
          value={formulario.horaFinal}
          onChange={(e) => handleChange('horaFinal', e.target.value)}
          step="60"
          required
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Horas Trabajadas</label>
        <input
          type="text"
          className="form-control bg-light"
          value={formulario.horasTrabajadas}
          readOnly
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Horas Reales</label>
        <input
          type="text"
          className="form-control bg-light"
          value={formulario.horasReales}
          readOnly
        />
      </div>
    </div>
  )
}

export default SeccionBasicos
