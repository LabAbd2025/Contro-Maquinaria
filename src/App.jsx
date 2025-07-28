import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Proximamente from './pages/Proximamente'

// Bottlepack
import FormularioBottlepack321 from './components/FormularioBottelpack/FormularioBottlepack321'
import FormularioBottlepack305 from './components/FormularioBottelpack/FormularioBottlepack305'
import FormularioBottlepack312 from './components/FormularioBottelpack/FormularioBottlepack312'
import ListaRegistrosBottlepack321 from './components/FormularioBottelpack/Listas/ListaRegistrosBottlepack321'
import ListaRegistrosBottlepack305 from './components/FormularioBottelpack/Listas/ListaRegistrosBottlepack305'
import ListaRegistrosBottlepack312 from './components/FormularioBottelpack/Listas/ListaRegistrosBottlepack312'

// Plásticos
import FormularioFCS from './components/FormularioPlaticos/FormularioFCS'
import FormularioFoilCap from './components/FormularioPlaticos/FormularioFoilCap'
import FormularioFoilCap2 from './components/FormularioPlaticos/FormularioFoilCap2'
import FormularioPeletizadora from './components/FormularioPlaticos/FormularioPeletizadora'
import FormularioSopladora from './components/FormularioPlaticos/FormularioSopladora'
import FormularioTapasFlex from './components/FormularioPlaticos/FormularioTapasFlex'
import ListaRegistrosFCS from './components/FormularioPlaticos/Listas/ListaRegistrosFCS'
import ListaRegistrosFoilCap from './components/FormularioPlaticos/Listas/ListaRegistrosFoilCap'
import ListaRegistrosFoilCap2 from './components/FormularioPlaticos/Listas/ListaRegistrosFoilCap2'
import ListaRegistrosPeletizadora from './components/FormularioPlaticos/Listas/ListaRegistrosPeletizadora'
import ListaRegistrosSopladora from './components/FormularioPlaticos/Listas/ListaRegistrosSopladora'
import ListaRegistrosTapasFlex from './components/FormularioPlaticos/Listas/ListaRegistrosTapasFlex'

// PPV
import FormularioPPVEmpaque from './components/FormularioPPV/FormularioPPVEmpaque'
import FormularioPPVLot1 from './components/FormularioPPV/FormularioPPVLot1'
import FormularioPPVLot2 from './components/FormularioPPV/FormularioPPVLot2'
import ListaRegistrosPPVEmpaque from './components/FormularioPPV/Listas/ListaRegistrosPPVEmpaque'
import ListaRegistrosPPVLot1 from './components/FormularioPPV/Listas/ListaRegistrosPPVLot1'
import ListaRegistrosPPVLot2 from './components/FormularioPPV/Listas/ListaRegistrosPPVLot2'

// PGV
import FormularioPGV305Empaque from './components/FormularioPGV/FormularioPGV305Empaque'
import FormularioPGVEmpaque from './components/FormularioPGV/FormularioPGVEmpaque'
import FormularioPGVHemodialisis from './components/FormularioPGV/FormularioPGVHemodialisis'
import FormularioPGVPVC from './components/FormularioPGV/FormularioPGVPVC'
import FormularioPGVPVCStd from './components/FormularioPGV/FormularioPGVPVCStd'
import ListaRegistrosPGV305Empaque from './components/FormularioPGV/Listas/ListaRegistrosPGV305Empaque'
import ListaRegistrosPGVEmpaque from './components/FormularioPGV/Listas/ListaRegistrosPGVEmpaque'
import ListaRegistrosPGVHemodialisis from './components/FormularioPGV/Listas/ListaRegistrosPGVHemodialisis'
import ListaRegistrosPGVPVC from './components/FormularioPGV/Listas/ListaRegistrosPGVPVC'
import ListaRegistrosPGVPVCStd from './components/FormularioPGV/Listas/ListaRegistrosPGVPVCStd'

function App() {
  return (
    <Router>
      <Routes>
        {/* Vista principal */}
        <Route path="/" element={<Dashboard />} />

        {/* Bottlepack */}
        <Route path="/form/bfs_321_196" element={<FormularioBottlepack321 />} />
        <Route path="/form/bfs_305_183" element={<FormularioBottlepack305 />} />
        <Route path="/form/bfs_312_215" element={<FormularioBottlepack312 />} />
        <Route path="/registros/bfs_321_196" element={<ListaRegistrosBottlepack321 />} />
        <Route path="/registros/bfs_305_183" element={<ListaRegistrosBottlepack305 />} />
        <Route path="/registros/bfs_312_215" element={<ListaRegistrosBottlepack312 />} />

        {/* Plásticos */}
        <Route path="/form/INY-FCS-001" element={<FormularioFCS />} />
        <Route path="/form/FOIL-CAP-001" element={<FormularioFoilCap />} />
        <Route path="/form/FOIL-CAP-002" element={<FormularioFoilCap2 />} />
        <Route path="/form/PEL-001" element={<FormularioPeletizadora />} />
        <Route path="/form/SOP-BID-001" element={<FormularioSopladora />} />
        <Route path="/form/INY-TAP-001" element={<FormularioTapasFlex />} />
        <Route path="/registros/INY-FCS-001" element={<ListaRegistrosFCS />} />
        <Route path="/registros/FOIL-CAP-001" element={<ListaRegistrosFoilCap />} />
        <Route path="/registros/FOIL-CAP-002" element={<ListaRegistrosFoilCap2 />} />
        <Route path="/registros/PEL-001" element={<ListaRegistrosPeletizadora />} />
        <Route path="/registros/SOP-BID-001" element={<ListaRegistrosSopladora />} />
        <Route path="/registros/INY-TAP-001" element={<ListaRegistrosTapasFlex />} />

        {/* PPV */}
        <Route path="/form/PPV-EMP-001" element={<FormularioPPVEmpaque />} />
        <Route path="/form/PPV-LOT1-001" element={<FormularioPPVLot1 />} />
        <Route path="/form/PPV-LOT2-001" element={<FormularioPPVLot2 />} />
        <Route path="/registros/PPV-EMP-001" element={<ListaRegistrosPPVEmpaque />} />
        <Route path="/registros/PPV-LOT1-001" element={<ListaRegistrosPPVLot1 />} />
        <Route path="/registros/PPV-LOT2-001" element={<ListaRegistrosPPVLot2 />} />

        {/* PGV */}
        <Route path="/form/PGV-305-001" element={<FormularioPGV305Empaque />} />
        <Route path="/form/PGV-EMP-001" element={<FormularioPGVEmpaque />} />
        <Route path="/form/PGV-HEMO-001" element={<FormularioPGVHemodialisis />} />
        <Route path="/form/PGV-PVC-001" element={<FormularioPGVPVC />} />
        <Route path="/form/PGVPVC-STD-001" element={<FormularioPGVPVCStd />} />
        <Route path="/registros/PGV-305-001" element={<ListaRegistrosPGV305Empaque />} />
        <Route path="/registros/PGV-EMP-001" element={<ListaRegistrosPGVEmpaque />} />
        <Route path="/registros/PGV-HEMO-001" element={<ListaRegistrosPGVHemodialisis />} />
        <Route path="/registros/PGV-PVC-001" element={<ListaRegistrosPGVPVC />} />
        <Route path="/registros/PGVPVC-STD-001" element={<ListaRegistrosPGVPVCStd />} />

        {/* Proximamente */}
        <Route path="/proximamente" element={<Proximamente />} />
      </Routes>
    </Router>
  )
}

export default App
