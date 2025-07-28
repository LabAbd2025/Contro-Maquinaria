import React from 'react'

const SeccionCantidades = ({ formulario, handleChange }) => {
  return (
    <div className="row g-3">
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
