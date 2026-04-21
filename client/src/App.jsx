import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedMinuta, setSelectedMinuta] = useState(null)
  const [minutaDetail, setMinutaDetail] = useState(null)
  const [formData, setFormData] = useState({})
  const [previewHTML, setPreviewHTML] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingWord, setLoadingWord] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3001/api/minutas')
      .then(r => r.json())
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const handleSelectMinuta = async (minuta) => {
    setSelectedMinuta(minuta)
    setPreviewHTML('')
    setFormData({})
    const res = await fetch(`http://localhost:3001/api/minutas/${selectedCategory.id}/${minuta.id}`)
    const data = await res.json()
    setMinutaDetail(data)
  }

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePreview = async () => {
    setLoading(true)
    const res = await fetch('http://localhost:3001/api/generate/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: minutaDetail.template,
        title: minutaDetail.title,
        data: formData
      })
    })
    const data = await res.json()
    setPreviewHTML(data.html)
    setLoading(false)
  }

  const handlePrint = () => {
    const iframe = document.getElementById('preview-iframe')
    iframe.contentWindow.print()
  }

  const handleDownloadWord = async () => {
    setLoadingWord(true)
    try {
      const res = await fetch('http://localhost:3001/api/generate/word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: minutaDetail.template,
          title: minutaDetail.title,
          data: formData
        })
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${minutaDetail.title}.doc`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      alert('Error al generar el documento Word.')
    }
    setLoadingWord(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>

      {/* SIDEBAR */}
      <div style={{ width: '300px', background: '#1e3a5f', color: '#fff', padding: '20px', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '20px', borderBottom: '1px solid #fff3', paddingBottom: '10px' }}>
          ⚖️ Minutas Legales Colombia
        </h2>
        {categories.length === 0 && (
          <p style={{ fontSize: '13px', color: '#aaa' }}>No hay minutas cargadas aún.</p>
        )}
        {categories.map(cat => (
          <div key={cat.id} style={{ marginBottom: '16px' }}>
            <div
              onClick={() => setSelectedCategory(cat)}
              style={{
                cursor: 'pointer',
                padding: '8px 12px',
                background: selectedCategory?.id === cat.id ? '#2d5a8e' : '#16305a',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 'bold',
                marginBottom: '6px'
              }}
            >
              📁 {cat.name}
            </div>
            {selectedCategory?.id === cat.id && cat.minutas.map(m => (
              <div
                key={m.id}
                onClick={() => handleSelectMinuta(m)}
                style={{
                  cursor: 'pointer',
                  padding: '6px 12px 6px 24px',
                  background: selectedMinuta?.id === m.id ? '#4a7ab5' : 'transparent',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginBottom: '2px'
                }}
              >
                {m.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {!minutaDetail && (
          <div style={{ textAlign: 'center', marginTop: '80px', color: '#666' }}>
            <h1 style={{ fontSize: '28px', color: '#1e3a5f' }}>Generador de Minutas Legales</h1>
            <p>Selecciona una categoría y una minuta del panel izquierdo para comenzar.</p>
          </div>
        )}

        {minutaDetail && (
          <div>
            <h1 style={{ fontSize: '20px', color: '#1e3a5f', marginBottom: '24px' }}>
              {minutaDetail.title}
            </h1>

            {/* FORMULARIO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {minutaDetail.fields.map(field => (
                <div key={field.name}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '4px' }}>
                    {field.label} *
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.label}
                    onChange={e => handleChange(field.name, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* BOTONES */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <button
                onClick={handlePreview}
                disabled={loading}
                style={{ padding: '10px 24px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
              >
                {loading ? 'Generando...' : '👁️ Previsualizar'}
              </button>

              {previewHTML && (
                <>
                  <button
                    onClick={handlePrint}
                    style={{ padding: '10px 24px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
                  >
                    🖨️ Imprimir / Guardar PDF
                  </button>
                  <button
                    onClick={handleDownloadWord}
                    disabled={loadingWord}
                    style={{ padding: '10px 24px', background: '#1565c0', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
                  >
                    {loadingWord ? 'Generando...' : '📄 Descargar Word'}
                  </button>
                </>
              )}
            </div>

            {/* VISTA PREVIA */}
            {previewHTML && (
              <div>
                <h3 style={{ color: '#1e3a5f', marginBottom: '12px' }}>Vista previa:</h3>
                <iframe
                  id="preview-iframe"
                  srcDoc={previewHTML}
                  style={{ width: '100%', height: '800px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}
                  title="Vista previa del documento"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App