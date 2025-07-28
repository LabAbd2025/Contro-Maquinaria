import React from 'react'

const SeccionCantidadesPPV = ({ formulario, handleChange }) => {
  return (
    <div className="row g-3">

      <div className="col-md-6">
        <label className="form-label">
          Unidades Programadas
          <span className="text-muted small d-block">Meta de producción para la jornada</span>
        </label>
        <input
          type="number"
          className="form-control"
          value={formulario.unidadesProgramadas || ''}
          onChange={e => handleChange('unidadesProgramadas', e.target.value)}
          min={0}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">
          Unidades Producidas (Real)
          <span className="text-muted small d-block">Total logrado, descontando defectos/mermas</span>
        </label>
        <input
          type="number"
          className="form-control"
          value={formulario.unidadesProducidas || ''}
          onChange={e => handleChange('unidadesProducidas', e.target.value)}
          min={0}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">
          Unidades Defectuosas
          <span className="text-muted small d-block">No conformes o descartadas</span>
        </label>
        <input
          type="number"
          className="form-control"
          value={formulario.unidadesDefectuosas || ''}
          onChange={e => handleChange('unidadesDefectuosas', e.target.value)}
          min={0}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">
          Unidades Aprobadas
          <span className="text-muted small d-block">Unidades aptas tras control</span>
        </label>
        <input
          type="number"
          className="form-control"
          value={formulario.unidadesAprobadas || ''}
          onChange={e => handleChange('unidadesAprobadas', e.target.value)}
          min={0}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">
          Materia Prima Utilizada (KGS)
        </label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={formulario.materiaPrimaUtilizada || ''}
          onChange={e => handleChange('materiaPrimaUtilizada', e.target.value)}
          min={0}
        />
      </div>
    </div>
  )
}

export default SeccionCantidadesPPV
