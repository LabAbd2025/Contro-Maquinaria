import React from 'react'
import {
  sumarParadas,
  calcularEficiencia,
  calcularEficacia
} from '../helpers/calculos'

const SeccionResultadosPlastico = ({ formulario }) => {
  const totalParadas = sumarParadas(formulario.paradas)
  const eficiencia = calcularEficiencia(formulario.horasReales, formulario.horasTrabajadas)
  const eficacia = calcularEficacia(formulario.cantidadEnvasada, formulario.cantidadProgramadaDiaria)

  return (
    <div className="row g-4">
      <div className="col-md-6">
        <div className="card border-success">
          <div className="card-header bg-success text-white">
            <b>Eficiencia</b>
          </div>
          <div className="card-body">
            <p>
              <b>Fórmula:</b> (Horas Reales / Horas Trabajadas) × 100
              <br />
              <b>Valor:</b> {isNaN(eficiencia) ? "0" : eficiencia}%<br />
              <span className="text-muted small">
                ({formulario.horasReales || "00:00"} / {formulario.horasTrabajadas || "00:00"})
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card border-primary">
          <div className="card-header bg-primary text-white">
            <b>Eficacia</b>
          </div>
          <div className="card-body">
            <p>
              <b>Fórmula:</b> (Cantidad Producida / Programada) × 100<br />
              <b>Valor:</b> {isNaN(eficacia) ? "0" : eficacia}%<br />
              <span className="text-muted small">
                ({formulario.cantidadEnvasada || "0"} / {formulario.cantidadProgramadaDiaria || "0"})
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card border-warning">
          <div className="card-header bg-warning text-dark">
            <b>Total de Paradas/Recesos</b>
          </div>
          <div className="card-body">
            <b>{totalParadas}</b> <span className="text-muted small">(HH:mm)</span>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card border-info">
          <div className="card-header bg-info text-white">
            <b>Materia Prima Utilizada</b>
          </div>
          <div className="card-body">
            <b>{formulario.cantidadMateriaPrima || "0"}</b> kg
          </div>
        </div>
      </div>

      {/* Otros resultados que quieras mostrar */}
      <div className="col-12">
        <div className="card border-secondary">
          <div className="card-header bg-secondary text-white">
            Observaciones
          </div>
          <div className="card-body">
            <span className="small">{formulario.observaciones || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeccionResultadosPlastico
