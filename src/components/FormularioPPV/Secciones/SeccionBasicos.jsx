import React from 'react'
import { obtenerFechaActual, obtenerNombreDia } from '../helpers/calculos'

const SeccionBasicosPPV = ({ formulario, handleChange }) => {
  return (
    <div className="row g-3">

      <div className="col-md-6">
        <label className="form-label">Fecha de Inicio</label>
        <input
          type="date"
          className="form-control"
          value={formulario.fechaInicio || ''}
          max={obtenerFechaActual()} // Solo deja fechas actuales o pasadas
          onChange={(e) => {
            handleChange('fechaInicio', e.target.value)
            if (!e.target.value) {
              handleChange('fechaFin', '')
              handleChange('dia', '')
              handleChange('duracionDias', '')
            } else if (formulario.fechaFin && formulario.fechaFin < e.target.value) {
              handleChange('fechaFin', e.target.value)
            }
            // Autocompleta el día de la semana automáticamente
            handleChange('dia', obtenerNombreDia(e.target.value))
          }}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Fecha de Fin</label>
        <input
          type="date"
          className="form-control"
          value={formulario.fechaFin || ''}
          min={formulario.fechaInicio || ''}
          max={obtenerFechaActual()}
          onChange={(e) => handleChange('fechaFin', e.target.value)}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Duración (días)</label>
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
        <label className="form-label">Producto / Línea</label>
        <input
          type="text"
          className="form-control"
          value={formulario.producto || ''}
          onChange={e => handleChange('producto', e.target.value)}
          placeholder="Ej: Bolsa PVC, Bolsa Hemodiálisis..."
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
        <label className="form-label">Hora de Inicio</label>
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
          value={
            formulario.horasIdeales && formulario.horasIdeales !== ''
              ? formulario.horasIdeales
              : (!formulario.cantidadEnvasada || !formulario.cantidadIdealPorHora
                ? 'Completa Envasada y Estándar/hora'
                : '00:00:00')
          }
          readOnly
          placeholder="Se calcula según Cantidad Envasada y ritmo/hora"
        />
      </div>
    </div>
  )
}

export default SeccionBasicosPPV
