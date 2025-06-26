import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DetalleRegistroBottlepack312 from '../Detalles/DetalleRegistroBottlepack312'
import { obtenerRegistrosBottlepack } from '../../../services/produccionService'

const ListaRegistrosBottlepack312 = () => {
  const navigate = useNavigate()
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarRegistros = async () => {
      try {
        const data = await obtenerRegistrosBottlepack('bfs_312_215')
        console.log('Registros Bottlepack 312:', data)
        setRegistros(data)
      } catch (err) {
        console.error('Error al obtener registros:', err)
        setError('No se pudieron cargar los registros')
      } finally {
        setLoading(false)
      }
    }

    cargarRegistros()
  }, [])

  return (
    <div className="vh-100 vw-100 p-0 m-0">
      <div className="container-fluid p-0">
        <div className="text-center py-3 bg-primary text-white">
          <h2 className="fw-bold m-0">Registros Bottlepack 312</h2>
          <button className="btn btn-light mt-2" onClick={() => navigate('/')}>
            Volver al Formulario
          </button>
        </div>

        <div className="row g-0">
          {loading ? (
            <div className="col-12 text-center p-5">
              <span className="text-muted">Cargando registros...</span>
            </div>
          ) : error ? (
            <div className="col-12 text-center p-5">
              <span className="text-danger">{error}</span>
            </div>
          ) : registros.length === 0 ? (
            <div className="col-12">
              <div className="card rounded-0">
                <div className="card-body">
                  <p className="text-muted mb-0">No hay registros guardados.</p>
                </div>
              </div>
            </div>
          ) : (
            registros.map((r, i) => (
              <div key={i} className="col-12">
                <div className="card rounded-0 border-0">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Registro #{i + 1}</h5>
                  </div>
                  <DetalleRegistroBottlepack312 registro={r} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ListaRegistrosBottlepack312
