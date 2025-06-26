import { useParams } from 'react-router-dom'
import {
  FormularioBottlepack321,
  FormularioBottlepack305,
  FormularioBottlepack312
} from '../components/FormularioBottelpack'

const ProduccionPage = () => {
  const { modelId } = useParams()

  const renderFormulario = () => {
    switch (modelId) {
      case 'BSF-321-196':
        return <FormularioBottlepack321 modelo="bfs_321_196" />
      case 'BFS-305-183':
        return <FormularioBottlepack305 modelo="bfs_305_183" />
      case 'BFS-312-215':
        return <FormularioBottlepack312 modelo="bfs_312_215" />
      default:
        return <div>Modelo no encontrado</div>
    }
  }

  return <div>{renderFormulario()}</div>
}

export default ProduccionPage
