import React from 'react'
import { tiposParadaPlastico, placeholdersParadasPlastico } from '../helpers/calculos'

// Requiere en el padre: handleParadaChange(tipo, tiempo, descripcion)
const SeccionParadasPlastico = ({ formulario, handleParadaChange }) => {
  // Helper para formato HH:mm
  const validarHoraMin = valor => !valor || /^([01]?\d|2[0-3]):[0-5]\d$/.test(valor)

  return (
    <div className="row g-3">
      {tiposParadaPlastico.map((tipo) => {
        const campo = (formulario.paradas && formulario.paradas[tipo]) || {}
        const tiempoValido = validarHoraMin(campo.tiempo)
        return (
          <div className="col-md-6" key={tipo}>
            <div className="mb-2">
              <label className="form-label fw-semibold">{tipo}</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className={`form-control form-control-sm ${campo.tiempo && !tiempoValido ? 'is-invalid' : ''}`}
                  placeholder="00:00"
                  value={campo.tiempo || ''}
                  onChange={e => handleParadaChange(tipo, e.target.value, campo.descripcion || '')}
                  maxLength={5}
                  style={{ width: 90 }}
                />
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder={placeholdersParadasPlastico[tipo]}
                  value={campo.descripcion || ''}
                  onChange={e => handleParadaChange(tipo, campo.tiempo || '', e.target.value)}
                  maxLength={120}
                />
              </div>
              {!tiempoValido && campo.tiempo && (
                <div className="invalid-feedback d-block">Formato HH:mm</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SeccionParadasPlastico
