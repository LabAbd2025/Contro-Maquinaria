import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "bootstrap-icons/font/bootstrap-icons.css";

const Dashboard = () => {
  const navigate = useNavigate()
  const [selectedMachine] = useState('')

  const machines = {
    bottlepack: {
      name: 'Bottlepack',
      icon: 'bi-droplet-fill',
      color: 'primary',
      models: [
        { id: 'bfs_321_196', name: 'BSF 321-196', icon: 'bi-beaker' },
        { id: 'bfs_305_183', name: 'BFS 305-183', icon: 'bi-capsule' },
        { id: 'bfs_312_215', name: 'BFS 312-215', icon: 'bi-droplet-half' }
      ]
    },
    plasticos: {
      name: 'División de Plásticos',
      icon: 'bi-tools',
      color: 'success',
      models: [
        { id: 'SOP-BID-001', name: 'Sopladora de Bidones', icon: 'bi-box-seam' },
        { id: 'INY-TAP-001', name: 'Inyectora de Tapas Flex', icon: 'bi-tools' },
        { id: 'PEL-001', name: 'Peletizadora', icon: 'bi-recycle' },
        { id: 'INY-FCS-001', name: 'Inyectora FCS', icon: 'bi-hammer' },
        { id: 'FOIL-CAP-001', name: 'Foil Cap', icon: 'bi-capsule' },
        { id: 'FOIL-CAP-002', name: 'Foil Cap 2', icon: 'bi-capsule-pill' }
      ]
    },
    pgv: {
      name: 'Control PGV',
      icon: 'bi-clipboard-check',
      color: 'info',
      models: [
        { id: 'PGV-EMP-001', name: 'Control PGV Empaque', icon: 'bi-clipboard2-pulse' },
        { id: 'PGV-305-001', name: 'Control PGV 305 Empaque', icon: 'bi-clipboard2-pulse-fill' },
        { id: 'PGV-PVC-001', name: 'Control PGV PVC', icon: 'bi-clipboard2-data' },
        { id: 'PGV-HEMO-001', name: 'Control PGV Hemodialisis', icon: 'bi-heart-pulse' },
        { id: 'PGVPVC-STD-001', name: 'Standard PGVPVC', icon: 'bi-clipboard2-data-fill' }
      ]
    },
    ppv: {
      name: 'Control PPV',
      icon: 'bi-clipboard-data',
      color: 'warning',
      models: [
        { id: 'PPV-EMP-001', name: 'Control PPV Empaque', icon: 'bi-clipboard2-check' },
        { id: 'PPV-LOT1-001', name: 'Control PPV Lot1', icon: 'bi-clipboard2-data' },
        { id: 'PPV-LOT2-001', name: 'Control PPV Lot2', icon: 'bi-clipboard2-data-fill' }
      ]
    }
  }

  // IDs de modelos que tienen formulario implementado
  const idsConFormulario = [
    // Bottlepack
    'bfs_321_196', 'bfs_305_183', 'bfs_312_215',
    // Plásticos
    'INY-FCS-001', 'FOIL-CAP-001', 'FOIL-CAP-002', 'PEL-001', 'SOP-BID-001', 'INY-TAP-001',
    // PPV
    'PPV-EMP-001', 'PPV-LOT1-001', 'PPV-LOT2-001',
    // PGV
    'PGV-305-001', 'PGV-EMP-001', 'PGV-HEMO-001', 'PGV-PVC-001', 'PGVPVC-STD-001'
  ];


  // Navegación al formulario (tarjeta)
  const handleNavigate = (modelId) => {
    if (idsConFormulario.includes(modelId)) {
      navigate(`/form/${modelId}`)
    } else {
      navigate('/proximamente')
    }
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container-fluid px-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-speedometer2 fs-1 text-primary me-3"></i>
              <div>
                <h1 className="text-primary fw-bold mb-0 animate__animated animate__fadeIn">Panel de Control - ABD</h1>
                <p className="text-muted mb-0 animate__animated animate__fadeIn animate__delay-1s">Gestión de maquinarias industriales</p>
              </div>
            </div>
            <div className="border-bottom pb-3"></div>
          </div>
        </div>

        <div className="row g-4">
          {Object.entries(machines).map(([key, machine], index) => (
            <div
              key={key}
              className="col-lg-6 animate__animated animate__fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`card border-${machine.color} border-top-0 border-end-0 border-bottom-0 border-4 shadow-sm h-100`}>
                <div className="card-header bg-white">
                  <div className="d-flex align-items-center">
                    <i className={`bi ${machine.icon} fs-4 text-${machine.color} me-2`}></i>
                    <h4 className="card-title mb-0 text-dark">{machine.name}</h4>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    {machine.models.map((model) => (
                      <div key={model.id} className="col-md-6">
                        <div
                          className={`card h-100 machine-card cursor-pointer ${selectedMachine === model.id ? `border-${machine.color} border-2 shadow selected` : 'border-light'}`}
                          onClick={() => handleNavigate(model.id)}
                        >
                          <div className="card-body d-flex align-items-center p-3">
                            <div className={`bg-${machine.color}-subtle p-3 rounded-3 me-3 icon-container`}>
                              <i className={`bi ${model.icon} fs-4 text-${machine.color}`}></i>
                            </div>
                            <div className="machine-info">
                              <h6 className="mb-1 fw-semibold">{model.name}</h6>
                              <small className="text-muted d-block">{model.id.toUpperCase()}</small>
                              <span className={`badge bg-${machine.color}-subtle text-${machine.color} mt-1`}>{machine.name}</span>
                              <div className="mt-2 d-flex gap-2">
                                {/* Botón Registros: NAVIGATE A /registros/:modelId */}
                                <button
                                  className={`btn btn-sm btn-${machine.color}`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/registros/${model.id}`)
                                  }}
                                >
                                  Registros
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .machine-card {
          transition: all 0.3s ease;
          transform: translateY(0);
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .machine-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          z-index: 10;
        }
        .machine-card.selected {
          transform: scale(1.02);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .icon-container {
          transition: all 0.3s ease;
        }
        .machine-card:hover .icon-container {
          transform: rotate(15deg) scale(1.1);
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .animate__animated {
          animation-duration: 0.5s;
        }
      `}</style>
    </div>
  )
}

export default Dashboard
