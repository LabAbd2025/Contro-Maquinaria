import React from 'react'
import {
  parosMaquina,
  parosProduccion,
  parosCalidad,
  parosMantenimiento,
  otrosParos,
  placeholdersParos
} from '../helpers/calculos'

const SeccionRetrasosPPV = ({ formulario, handleRetrasoChange }) => {

  // Helper para validar tiempo en formato HH:mm
  const validarHoraMin = (valor) => {
    if (!valor) return true
    return /^([01]?\d|2[0-3]):[0-5]\d$/.test(valor)
  }

  // Render de grupo de paros
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
                      placeholder={placeholdersParos[factor] || "Motivo o descripción del paro"}
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
      {renderGrupoRetrasos('Paros de Máquina', parosMaquina, 'parosMaquina')}
      {renderGrupoRetrasos('Paros de Producción', parosProduccion, 'parosProduccion')}
      {renderGrupoRetrasos('Paros de Calidad', parosCalidad, 'parosCalidad')}
      {renderGrupoRetrasos('Paros de Mantenimiento', parosMantenimiento, 'parosMantenimiento')}
      {renderGrupoRetrasos('Otros Paros', otrosParos, 'otrosParos')}
    </div>
  )
}

export default SeccionRetrasosPPV
