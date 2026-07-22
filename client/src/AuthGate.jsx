import { useAuth } from './AuthContext'
import Auth from './Auth.jsx'

export default function AuthGate({ children }) {
  const { user } = useAuth()

  if (user === undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', background: 'linear-gradient(135deg, #d8e4f0 0%, #e8f0f8 50%, #d0dcea 100%)', fontFamily: 'Georgia, serif' }}>
        <div style={{ color: '#1a3a5c', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold' }}>Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return children
}
