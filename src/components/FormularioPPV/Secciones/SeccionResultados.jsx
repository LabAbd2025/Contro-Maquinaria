import React from "react";
import { formatearTiempo, formatearPorcentaje } from '../helpers/calculos';

const SeccionResultadosPPV = ({ formulario, handleChange }) => {
  const {
    horasRetrasoNoEficiencia = "00:00:00",
    totalHorasRetrasadas = "00:00:00",
    eficacia = "0",
    eficiencia = "0",
    observaciones = "",
  } = formulario || {};

  const eficaciaNum = parseFloat(eficacia) || 0;
  const eficienciaNum = parseFloat(eficiencia) || 0;

  return (
    <div className="w-100">
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">
            Suma de Horas de Paro que <b>NO</b> afectan Eficiencia
          </label>
          <div className="input-group">
            <span className="input-group-text bg-success text-white fw-bold">
              <i className="bi bi-hourglass-split"></i>
            </span>
            <input
              type="text"
              className="form-control bg-success text-white fw-bold"
              value={formatearTiempo(horasRetrasoNoEficiencia)}
              readOnly
              tabIndex={-1}
              style={{ fontSize: "1.2rem" }}
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">
            Total de Horas de Paro (que <b>SÍ</b> afectan eficiencia)
          </label>
          <div className="input-group">
            <span className="input-group-text bg-danger text-white fw-bold">
              <i className="bi bi-exclamation-diamond"></i>
            </span>
            <input
              type="text"
              className="form-control bg-danger text-white fw-bold"
              value={formatearTiempo(totalHorasRetrasadas)}
              readOnly
              tabIndex={-1}
              style={{ fontSize: "1.2rem" }}
            />
          </div>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">
            % de <b>Eficacia</b> (Producido vs Programado)
          </label>
          <div className="progress" style={{ height: 38 }}>
            <div
              className="progress-bar bg-info text-dark fw-bold"
              role="progressbar"
              style={{
                width: `${Math.min(eficaciaNum, 100)}%`,
                fontSize: "1.1rem"
              }}
            >
              {formatearPorcentaje(eficaciaNum)}
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">
            % de <b>Eficiencia</b> (Horas Reales vs Trabajadas)
          </label>
          <div className="progress" style={{ height: 38 }}>
            <div
              className="progress-bar bg-warning text-dark fw-bold"
              role="progressbar"
              style={{
                width: `${Math.min(eficienciaNum, 100)}%`,
                fontSize: "1.1rem"
              }}
            >
              {formatearPorcentaje(eficienciaNum)}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Observaciones</label>
        <textarea
          className="form-control"
          rows={4}
          value={observaciones}
          onChange={(e) => handleChange("observaciones", e.target.value)}
          placeholder="Detalle causas de paros, comentarios de producción, etc…"
        />
      </div>
    </div>
  );
};

export default SeccionResultadosPPV;
