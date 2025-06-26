import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

// Formularios por modelo
import FormularioBottlepack321 from './components/FormularioBottelpack/FormularioBottlepack321'
import FormularioBottlepack305 from './components/FormularioBottelpack/FormularioBottlepack305'
import FormularioBottlepack312 from './components/FormularioBottelpack/FormularioBottlepack312'

// Listas de registros por modelo
import ListaRegistrosBottlepack321 from './components/FormularioBottelpack/Listas/ListaRegistrosBottlepack321'
import ListaRegistrosBottlepack305 from './components/FormularioBottelpack/Listas/ListaRegistrosBottlepack305'
import ListaRegistrosBottlepack312 from './components/FormularioBottelpack/Listas/ListaRegistrosBottlepack312'

//Proximamente
import Proximamente from './pages/Proximamente'
function App() {
  return (
    <Router>
      <Routes>
        {/* Vista principal */}
        <Route path="/" element={<Dashboard />} />

        {/* Formularios por máquina */}
        <Route path="/form/bsf_321_196" element={<FormularioBottlepack321 />} />
        <Route path="/form/bfs_305_183" element={<FormularioBottlepack305 />} />
        <Route path="/form/bfs_312_215" element={<FormularioBottlepack312 />} />

        {/* Proximamente */}
        <Route path="/proximamente" element={<Proximamente />} />

        {/* Formularios de maquina de plasticos*/}


        {/* Listas por máquina */}
        <Route path="/registros/bsf_321_196" element={<ListaRegistrosBottlepack321 />} />
        <Route path="/registros/bfs_305_183" element={<ListaRegistrosBottlepack305 />} />
        <Route path="/registros/bfs_312_215" element={<ListaRegistrosBottlepack312 />} />
      </Routes>
    </Router>
  )
}

export default App
