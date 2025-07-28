import { useParams } from 'react-router-dom'

// ===== Importa todos los formularios Bottlepack =====
import FormularioBottlepack321 from '../components/FormularioBottelpack/FormularioBottlepack321'
import FormularioBottlepack305 from '../components/FormularioBottelpack/FormularioBottlepack305'
import FormularioBottlepack312 from '../components/FormularioBottelpack/FormularioBottlepack312'

// ===== Importa todos los formularios de Plásticos =====
import FormularioFCS from '../components/FormularioPlaticos/FormularioFCS'
import FormularioFoilCap from '../components/FormularioPlaticos/FormularioFoilCap'
import FormularioFoilCap2 from '../components/FormularioPlaticos/FormularioFoilCap2'
import FormularioPeletizadora from '../components/FormularioPlaticos/FormularioPeletizadora'
import FormularioSopladora from '../components/FormularioPlaticos/FormularioSopladora'
import FormularioTapasFlex from '../components/FormularioPlaticos/FormularioTapasFlex'

// ===== Importa todos los formularios de PPV =====
import FormularioPPVEmpaque from '../components/FormularioPPV/FormularioPPVEmpaque'
import FormularioPPVLot1 from '../components/FormularioPPV/FormularioPPVLot1'
import FormularioPPVLot2 from '../components/FormularioPPV/FormularioPPVLot2'

// ===== Importa todos los formularios de PGV =====
import FormularioPGVEmpaque from '../components/FormularioPGV/FormularioPGVEmpaque'
import FormularioPGV305 from '../components/FormularioPGV/FormularioPGV305'
import FormularioPGVPVC from '../components/FormularioPGV/FormularioPGVPVC'
import FormularioPGVHEMO from '../components/FormularioPGV/FormularioPGVHEMO'
import FormularioPGVPVCSTD from '../components/FormularioPGV/FormularioPGVPVCStd'

// ===== Mapeo exacto de IDs del dashboard a componentes de formulario =====
const FORMULARIOS = {
  // === Bottlepack ===
  'bfs_321_196': <FormularioBottlepack321 modelo="bfs_321_196" />,
  'bfs_305_183': <FormularioBottlepack305 modelo="bfs_305_183" />,
  'bfs_312_215': <FormularioBottlepack312 modelo="bfs_312_215" />,

  // === Plásticos ===
  'INY-FCS-001': <FormularioFCS modelo="inyectora_fcs" />,
  'FOIL-CAP-001': <FormularioFoilCap modelo="foil_cap" />,
  'FOIL-CAP-002': <FormularioFoilCap2 modelo="foil_cap_2" />,
  'PEL-001': <FormularioPeletizadora modelo="peletizadora" />,
  'SOP-BID-001': <FormularioSopladora modelo="sopladora_bidones" />,
  'INY-TAP-001': <FormularioTapasFlex modelo="inyectora_tapas_flex" />,

  // === PPV ===
  'PPV-EMP-001': <FormularioPPVEmpaque modelo="ppv_empaque" />,
  'PPV-LOT1-001': <FormularioPPVLot1 modelo="ppv_lot1" />,
  'PPV-LOT2-001': <FormularioPPVLot2 modelo="ppv_lot2" />,

  // === PGV ===
  'PGV-EMP-001': <FormularioPGVEmpaque modelo="pgv_empaque" />,
  'PGV-305-001': <FormularioPGV305 modelo="pgv_305" />,
  'PGV-PVC-001': <FormularioPGVPVC modelo="pgv_pvc" />,
  'PGV-HEMO-001': <FormularioPGVHEMO modelo="pgv_hemo" />,
  'PGVPVC-STD-001': <FormularioPGVPVCSTD modelo="pgv_pvc_std" />
}

const ProduccionPage = () => {
  const { modelId } = useParams()
  const formulario = FORMULARIOS[modelId]

  return (
    <div>
      {formulario
        ? formulario
        : (
          <div className="alert alert-danger mt-5">
            Modelo no encontrado: <b>{modelId}</b>
          </div>
        )
      }
    </div>
  )
}

export default ProduccionPage
