import React from 'react'
import { obtenerFechaActual } from '../helpers/calculos'

const SeccionBasicosPlastico = ({ formulario, handleChange }) => {
  return (
    <div className="row g-3">

      <div className="col-md-6">
        <label className="form-label">Fecha de Inicio</label>
        <input
          type="date"
          className="form-control"
          value={formulario.fechaInicio || ''}
          min={obtenerFechaActual()}
          onChange={e => {
            handleChange('fechaInicio', e.target.value)
            if (!e.target.value) {
              handleChange('fechaFin', '')
              handleChange('dia', '')
              handleChange('duracionDias', '')
            } else if (formulario.fechaFin && formulario.fechaFin < e.target.value) {
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
          value={formulario.fechaFin || ''}
          min={formulario.fechaInicio || obtenerFechaActual()}
          onChange={e => handleChange('fechaFin', e.target.value)}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Duración</label>
        <input
          type="text"
          className="form-control"
          value={formulario.duracionDias || ''}
          readOnly
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Día</label>
        <input
          type="text"
          className="form-control"
          value={formulario.dia || ''}
          readOnly
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Producto</label>
        <input
          type="text"
          className="form-control"
          value={formulario.producto || ''}
          onChange={e => handleChange('producto', e.target.value)}
          placeholder="Nombre del producto"
          required
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Lote</label>
        <input
          type="text"
          className="form-control"
          value={formulario.lote || ''}
          onChange={e => handleChange('lote', e.target.value)}
          placeholder="Ej: L-001"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Hora Inicio</label>
        <input
          type="time"
          className="form-control"
          value={formulario.horaInicio || ''}
          onChange={e => handleChange('horaInicio', e.target.value)}
          step="60"
          required
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Hora Final</label>
        <input
          type="time"
          className="form-control"
          value={formulario.horaFinal || ''}
          onChange={e => handleChange('horaFinal', e.target.value)}
          step="60"
          required
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Horas Trabajadas (total)</label>
        <input
          type="text"
          className="form-control bg-light"
          value={formulario.horasTrabajadas || ''}
          readOnly
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Horas Ideales (según producción)</label>
        <input
          type="text"
          className="form-control bg-light"
          value={formulario.horasIdeales || ''}
          readOnly
          placeholder="Se calcula según Cantidad Envasada y ritmo/hora"
        />
      </div>
    </div>
  )
}

export default SeccionBasicosPlastico
