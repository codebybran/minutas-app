import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch() {
    const ultimoIntento = Number(sessionStorage.getItem('lexdoc_last_error_reload') || 0)
    const ahora = Date.now()
    if (ahora - ultimoIntento > 5000) {
      sessionStorage.setItem('lexdoc_last_error_reload', String(ahora))
      window.location.reload()
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', background: 'linear-gradient(135deg, #d8e4f0 0%, #e8f0f8 50%, #d0dcea 100%)', fontFamily: 'Georgia, serif' }}>
          <div style={{ color: '#1a3a5c', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold' }}>Cargando...</div>
        </div>
      )
    }
    return this.props.children
  }
}
