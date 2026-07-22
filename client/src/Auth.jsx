import { useState } from 'react'
import { auth } from './firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import fondoJusticia from './assets/justicia-fondo.png'

function traducirError(codigo) {
  const mapa = {
    'auth/invalid-email': 'El correo electrónico no es válido.',
    'auth/user-not-found': 'No existe una cuenta con ese correo.',
    'auth/wrong-password': 'La contraseña es incorrecta.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/missing-password': 'Ingresa una contraseña.',
  }
  return mapa[codigo] || 'Ocurrió un error. Intenta de nuevo.'
}

const IconoCorreo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8962e" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 6l10 7 10-7" /></svg>
)
const IconoCandado = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8962e" strokeWidth="2"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
)
const IconoOjo = ({ visible }) => (
  visible
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7a9ab5" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7a9ab5" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a20.3 20.3 0 015.06-5.94M9.9 4.24A10.94 10.94 0 0112 4c7 0 11 7 11 7a20.3 20.3 0 01-3.08 4.31M1 1l22 22" /></svg>
)

export default function Auth() {
  const [modo, setModo] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verPassword, setVerPassword] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const inputStyle = {
    width: '100%', padding: '12px 12px 12px 38px', border: '1px solid #2c3e50', borderRadius: '8px',
    fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: 'rgba(255,255,255,0.06)',
    color: '#e8f0f8', fontFamily: 'Georgia, serif'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')
    setCargando(true)
    try {
      if (modo === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(traducirError(err.code))
    } finally {
      setCargando(false)
    }
  }

  const handleOlvidoPassword = async () => {
    setError('')
    setMensaje('')
    if (!email) { setError('Ingresa tu correo arriba para enviarte el enlace de recuperación.'); return }
    try {
      await sendPasswordResetEmail(auth, email)
      setMensaje('Te enviamos un enlace para restablecer tu contraseña.')
    } catch (err) {
      setError(traducirError(err.code))
    }
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100vw', fontFamily: 'Georgia, serif',
      backgroundColor: '#05070c',
      backgroundImage: `linear-gradient(180deg, rgba(3,5,10,0.08) 0%, rgba(3,5,10,0.18) 60%, rgba(3,5,10,0.4) 100%), url(${fondoJusticia})`,
      backgroundSize: 'cover', backgroundPosition: 'center 15%', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', boxSizing: 'border-box', overflowY: 'auto',
    }}>
      <div style={{ width: 'min(420px, 92vw)' }}>

        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div style={{ color: '#e2b94a', fontSize: '30px', fontWeight: 'bold', letterSpacing: '4px', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>LEXDOC</div>
          <div style={{ color: '#e8f0f8', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
            Generador de Minutas Legales
          </div>
          <div style={{ color: '#b8962e', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginTop: '4px' }}>— Colombia —</div>
        </div>

        <div style={{ background: 'rgba(10,16,26,0.88)', backdropFilter: 'blur(6px)', borderRadius: '14px', padding: '30px', border: '1px solid rgba(226,185,74,0.25)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>

          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div style={{ color: '#e8f0f8', fontSize: '17px', fontWeight: 'bold' }}>Bienvenido a <span style={{ color: '#e2b94a' }}>LEXDOC</span></div>
            <div style={{ color: '#7a9ab5', fontSize: '12px', marginTop: '4px' }}>
              {modo === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta para comenzar'}
            </div>
          </div>

          <div style={{ display: 'flex', marginBottom: '22px', borderBottom: '1px solid #1e3a5f' }}>
            <div onClick={() => { setModo('login'); setError(''); setMensaje('') }}
              style={{ flex: 1, textAlign: 'center', padding: '10px 0', cursor: 'pointer', color: modo === 'login' ? '#e2b94a' : '#7a9ab5', fontSize: '13px', fontWeight: 'bold', borderBottom: modo === 'login' ? '2px solid #e2b94a' : '2px solid transparent', marginBottom: '-1px' }}>
              Iniciar Sesión
            </div>
            <div onClick={() => { setModo('registro'); setError(''); setMensaje('') }}
              style={{ flex: 1, textAlign: 'center', padding: '10px 0', cursor: 'pointer', color: modo === 'registro' ? '#e2b94a' : '#7a9ab5', fontSize: '13px', fontWeight: 'bold', borderBottom: modo === 'registro' ? '2px solid #e2b94a' : '2px solid transparent', marginBottom: '-1px' }}>
              Crear Cuenta
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}><IconoCorreo /></div>
              <input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}><IconoCandado /></div>
              <input type={verPassword ? 'text' : 'password'} placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={{ ...inputStyle, paddingRight: '38px' }} />
              <div onClick={() => setVerPassword(!verPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                <IconoOjo visible={verPassword} />
              </div>
            </div>

            {modo === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: '18px' }}>
                <span onClick={handleOlvidoPassword} style={{ color: '#b8962e', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>¿Olvidaste tu contraseña?</span>
              </div>
            )}

            {error && (
              <div style={{ background: 'rgba(176,48,48,0.15)', border: '1px solid rgba(229,165,165,0.4)', color: '#ff9a9a', fontSize: '12px', padding: '10px 12px', borderRadius: '6px', marginBottom: '16px' }}>
                {error}
              </div>
            )}
            {mensaje && (
              <div style={{ background: 'rgba(46,125,50,0.15)', border: '1px solid rgba(129,199,132,0.4)', color: '#a5e0a8', fontSize: '12px', padding: '10px 12px', borderRadius: '6px', marginBottom: '16px' }}>
                {mensaje}
              </div>
            )}

            <button type="submit" disabled={cargando}
              style={{ width: '100%', padding: '13px', background: cargando ? '#8a7420' : 'linear-gradient(135deg, #e2b94a, #c9a030)', color: '#1a1204', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', cursor: cargando ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {cargando ? 'CARGANDO...' : (modo === 'login' ? 'INICIAR SESIÓN' : 'CREAR CUENTA')}
              {!cargando && '→'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '12px', color: '#7a9ab5' }}>
            {modo === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <span onClick={() => { setModo(modo === 'login' ? 'registro' : 'login'); setError(''); setMensaje('') }}
              style={{ color: '#e2b94a', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
              {modo === 'login' ? 'Crear cuenta' : 'Inicia sesión'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '22px', marginTop: '22px', flexWrap: 'wrap' }}>
          {[
            { valor: '100%', label: 'Seguro' },
            { valor: '100%', label: 'Colombiano' },
            { valor: '282', label: 'Minutas' },
            { valor: '12', label: 'Áreas del Derecho' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: '#e2b94a', fontSize: '15px', fontWeight: 'bold', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{s.valor}</div>
              <div style={{ color: '#e8f0f8', fontSize: '10px', letterSpacing: '0.5px', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
