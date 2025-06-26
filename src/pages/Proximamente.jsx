import { useNavigate } from 'react-router-dom'
import { FaTools } from 'react-icons/fa'

const Proximamente = () => {
  const navigate = useNavigate()

  return (
    <div style={{ height: '100vh', width: '100vw' }} className="d-flex justify-content-center align-items-center bg-light">
      <div className="text-center">
        <FaTools size={64} className="text-warning mb-3" />
        <h1 className="fw-bold text-secondary mb-3">¡Estamos trabajando en ello!</h1>
        <p className="text-muted mb-4">
          Esta funcionalidad estará disponible próximamente. Gracias por tu paciencia. 🚧
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Volver al Panel de Control
        </button>
      </div>
    </div>
  )
}

export default Proximamente
