const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

const SUBTITLE_ORDER_CIVIL = [
  'Transferencia de Dominio', 'Uso y Goce', 'Servicios y Obra',
  'Garantías y Crédito', 'Representación y Poderes', 'Litigios y Créditos',
  'Personas Jurídicas', 'Propiedad Horizontal', 'Declaraciones y Actos Notariales'
]
const SUBTITLE_ORDER_FAMILIA = [
  'Matrimonio','Sociedad Conyugal y Patrimonial','Estado Civil','Sucesiones',
  'Filiación y Reconocimiento','Unión Marital de Hecho','Rendición de Cuentas',
  'Separación y Divorcio','Alimentos','Sucesiones Judiciales',
  'Patrimonio de Familia','Violencia Intrafamiliar','Permisos y Declaraciones'
]
const SUBTITLE_ORDER_COMERCIAL = ['Títulos Valores','Contratos Mercantiles','Propiedad Intelectual','Cobranza']
const SUBTITLE_ORDER_SOCIEDADES = [
  'Empresa Unipersonal y Sociedades Básicas',
  'Sociedad Anónima',
  'Sociedad Limitada (Ltda.)',
  'Sociedad en Comandita',
  'Transformación y Fusión de Sociedades'
]
const SUBTITLE_ORDER_LABORAL = [
  'Contratos de Trabajo', 'Reglamentos Internos', 'Contratos Especiales de Trabajo',
  'Terminación del Contrato', 'Derecho Sindical y Negociación Colectiva', 'Seguridad Social y Licencias'
]
const SUBTITLE_ORDER_ADMINISTRATIVO = [
  'Derechos de Petición', 'Quejas y Reclamos', 'Contratación Estatal',
  'Procesos Policivos', 'Vía Gubernativa y Contencioso Administrativo'
]
const SUBTITLE_ORDER_CONSTITUCIONAL = [
  'Acciones de Tutela', 'Acciones Populares y de Cumplimiento', 'Control Constitucional'
]
const SUBTITLE_ORDER_PENAL = ['Defensa Penal', 'Acción Civil', 'Mecanismos Alternativos']
const SUBTITLE_ORDER_RESOLUCION = ['Conciliación', 'Arbitramento']
const SUBTITLE_ORDER_PROCESAL_LABORAL = ['Procesos Laborales']
const SUBTITLE_ORDER_PROCESAL_CIVIL = [
  'Disposiciones Generales', 'Procesos Declarativos', 'Procesos Ejecutivos',
  'Medidas Cautelares', 'Incidentes y Recursos'
]
const SUBTITLE_ORDER_TRIBUTARIO = ['Recursos y Respuestas', 'Cobro Coactivo']

function ordenarMinutas(minutas, order) {
  const grupos = {}
  order.forEach(s => grupos[s] = [])
  minutas.forEach(m => {
    const sub = m.subtitle || 'General'
    if (!grupos[sub]) grupos[sub] = []
    grupos[sub].push(m)
  })
  const result = []
  order.forEach(sub => {
    if (grupos[sub] && grupos[sub].length > 0)
      grupos[sub].forEach(m => result.push({ ...m, subtitle: sub }))
  })
  return result
}

router.get('/', (req, res) => {
  try {
    const civilPath = path.join(__dirname, '../../data/templates/minutas-derecho-civil.json')
    const familiaPath = path.join(__dirname, '../../data/templates/minutas-derecho-familia.json')
    const comercialPath = path.join(__dirname, '../../data/templates/minutas-derecho-comercial.json')
    const sociedadesPath = path.join(__dirname, '../../data/templates/minutas-derecho-sociedades.json')
    const laboralPath = path.join(__dirname, '../../data/templates/minutas-derecho-laboral.json')
    const administrativoPath = path.join(__dirname, '../../data/templates/minutas-derecho-administrativo.json')
    const constitucionalPath = path.join(__dirname, '../../data/templates/minutas-derecho-constitucional.json')
    const procesalCivilPath = path.join(__dirname, '../../data/templates/minutas-derecho-procesal-civil.json')
  const procesalLaboralPath = path.join(__dirname, '../../data/templates/minutas-derecho-procesal-laboral.json')
  const penalPath = path.join(__dirname, '../../data/templates/minutas-derecho-penal.json')
  const resolucionPath = path.join(__dirname, '../../data/templates/minutas-resolucion-conflictos.json')
  const tributarioPath = path.join(__dirname, '../../data/templates/minutas-derecho-tributario.json')

    const minutasCivil = JSON.parse(fs.readFileSync(civilPath, 'utf8'))
    const minutasFamilia = JSON.parse(fs.readFileSync(familiaPath, 'utf8'))
    const minutasComercial = JSON.parse(fs.readFileSync(comercialPath, 'utf8'))
    const minutasSociedades = JSON.parse(fs.readFileSync(sociedadesPath, 'utf8'))
    const minutasLaboral = JSON.parse(fs.readFileSync(laboralPath, 'utf8'))
    const minutasAdministrativo = JSON.parse(fs.readFileSync(administrativoPath, 'utf8'))
    const minutasConstitucional = JSON.parse(fs.readFileSync(constitucionalPath, 'utf8'))
    const minutasProcesalCivil = JSON.parse(fs.readFileSync(procesalCivilPath, 'utf8'))
  const minutasProcesalLaboral = JSON.parse(fs.readFileSync(procesalLaboralPath, 'utf8'))
  const minutasPenal = JSON.parse(fs.readFileSync(penalPath, 'utf8'))
  const minutasResolucion = JSON.parse(fs.readFileSync(resolucionPath, 'utf8'))
  const minutasTributario = JSON.parse(fs.readFileSync(tributarioPath, 'utf8'))

    const categories = [
      {
        id: 'derecho-civil', name: 'Derecho Civil',
        minutas: ordenarMinutas(minutasCivil, SUBTITLE_ORDER_CIVIL).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: m.tipo_tramite
        }))
      },
      {
        id: 'derecho-familia', name: 'Derecho de Familia',
        minutas: ordenarMinutas(minutasFamilia, SUBTITLE_ORDER_FAMILIA).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: m.tipo_tramite
        }))
      },
      {
        id: 'derecho-comercial', name: 'Derecho Comercial',
        minutas: ordenarMinutas(minutasComercial, SUBTITLE_ORDER_COMERCIAL).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: m.tipo_tramite
        }))
      },
      {
        id: 'derecho-sociedades', name: 'Derecho de Sociedades',
        minutas: ordenarMinutas(minutasSociedades, SUBTITLE_ORDER_SOCIEDADES).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: m.tipo_tramite
        }))
      },
      {
        id: 'derecho-laboral', name: 'Derecho Laboral',
        minutas: ordenarMinutas(minutasLaboral, SUBTITLE_ORDER_LABORAL).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: m.tipo_tramite
        }))
      },
      {
        id: 'derecho-administrativo', name: 'Derecho Administrativo',
        minutas: ordenarMinutas(minutasAdministrativo, SUBTITLE_ORDER_ADMINISTRATIVO).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: m.tipo_tramite
        }))
      },
      {
        id: 'derecho-constitucional', name: 'Derecho Constitucional',
        minutas: ordenarMinutas(minutasConstitucional, SUBTITLE_ORDER_CONSTITUCIONAL).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: m.tipo_tramite
        }))
      },
      {
        id: 'derecho-procesal-civil', name: 'Derecho Procesal Civil',
        minutas: ordenarMinutas(minutasProcesalCivil, SUBTITLE_ORDER_PROCESAL_CIVIL).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: m.tipo_tramite
        }))
      }
    ,{
      id: 'derecho-procesal-laboral', name: 'Derecho Procesal Laboral',
      minutas: ordenarMinutas(minutasProcesalLaboral, SUBTITLE_ORDER_PROCESAL_LABORAL).map(m => ({
        id: m.id, title: m.title, subtitle: m.subtitle,
        tipo_tramite: m.tipo_tramite
      }))
    }
  ,{
      id: 'derecho-penal', name: 'Derecho Penal',
      minutas: ordenarMinutas(minutasPenal, SUBTITLE_ORDER_PENAL).map(m => ({
        id: m.id, title: m.title, subtitle: m.subtitle,
        tipo_tramite: m.tipo_tramite
      }))
    }
    ,{
      id: 'resolucion-conflictos', name: 'Resolución de Conflictos',
      minutas: ordenarMinutas(minutasResolucion, SUBTITLE_ORDER_RESOLUCION).map(m => ({
        id: m.id, title: m.title, subtitle: m.subtitle,
        tipo_tramite: m.tipo_tramite
      }))
    }
    ,{
  id: 'derecho-tributario', name: 'Derecho Tributario',
  minutas: ordenarMinutas(minutasTributario, SUBTITLE_ORDER_TRIBUTARIO).map(m => ({
    id: m.id, title: m.title, subtitle: m.subtitle,
    tipo_tramite: m.tipo_tramite
  }))
}
    ]
    res.json(categories)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al cargar las minutas' })
  }
})

router.get('/:categoryId/:minutaId', (req, res) => {
  try {
    const { categoryId, minutaId } = req.params
    let filePath
    if (categoryId === 'derecho-familia')
      filePath = path.join(__dirname, '../../data/templates/minutas-derecho-familia.json')
    else if (categoryId === 'derecho-tributario')
      filePath = path.join(__dirname, '../../data/templates/minutas-derecho-tributario.json')
    else if (categoryId === 'derecho-comercial')
      filePath = path.join(__dirname, '../../data/templates/minutas-derecho-comercial.json')
    else if (categoryId === 'derecho-sociedades')
      filePath = path.join(__dirname, '../../data/templates/minutas-derecho-sociedades.json')
    else if (categoryId === 'derecho-laboral')
      filePath = path.join(__dirname, '../../data/templates/minutas-derecho-laboral.json')
    else if (categoryId === 'derecho-administrativo')
      filePath = path.join(__dirname, '../../data/templates/minutas-derecho-administrativo.json')
    else if (categoryId === 'derecho-constitucional')
      filePath = path.join(__dirname, '../../data/templates/minutas-derecho-constitucional.json')
    else if (categoryId === 'derecho-penal')
    filePath = path.join(__dirname, '../../data/templates/minutas-derecho-penal.json')
    else if (categoryId === 'resolucion-conflictos')
    filePath = path.join(__dirname, '../../data/templates/minutas-resolucion-conflictos.json')
    else if (categoryId === 'derecho-procesal-laboral')
    filePath = path.join(__dirname, '../../data/templates/minutas-derecho-procesal-laboral.json')
    else if (categoryId === 'derecho-procesal-civil')
      filePath = path.join(__dirname, '../../data/templates/minutas-derecho-procesal-civil.json')
    else
      filePath = path.join(__dirname, '../../data/templates/minutas-derecho-civil.json')
    

    const minutas = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const minuta = minutas.find(m => String(m.id) === String(minutaId))
    if (!minuta) return res.status(404).json({ error: 'Minuta no encontrada' })
    res.json({
      id: minuta.id, title: minuta.title, template: minuta.template,
      fields: minuta.fields, tipo_tramite: minuta.tipo_tramite
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al cargar la minuta' })
  }
})

module.exports = router