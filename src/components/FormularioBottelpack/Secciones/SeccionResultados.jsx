const SeccionResultados = ({ formulario, handleChange }) => {
  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label">
            Suma de Horas Retrasadas por Factores que NO Afectan Eficiencia
          </label>
          <input
            type="text"
            className="form-control bg-success text-white"
            value={formulario.horasRetrasoNoEficiencia}
            readOnly
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Total de Horas Retrasadas (que SÍ afectan eficiencia)
          </label>
          <input
            type="text"
            className="form-control bg-danger text-white"
            value={formulario.totalHorasRetrasadas}
            readOnly
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            % de Eficacia de Unidades Envasadas vs Programadas
          </label>
          <input
            type="text"
            className="form-control bg-info text-white"
            value={`${formulario.eficacia}%`}
            readOnly
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            % de Eficiencia de Horas Reales vs Trabajadas
          </label>
          <input
            type="text"
            className="form-control bg-warning text-dark"
            value={`${formulario.eficiencia}%`}
            readOnly
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Observaciones</label>
        <textarea
          className="form-control"
          rows={4}
          value={formulario.observaciones}
          onChange={(e) => handleChange('observaciones', e.target.value)}
          placeholder="Razón de disminución de eficiencia y otras observaciones..."
        />
      </div>
    </div>
  )
}

export default SeccionResultados
