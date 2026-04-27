const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

const SUBTITLE_ORDER_CIVIL = [
  'Transferencia de Dominio',
  'Uso y Goce',
  'Servicios y Obra',
  'Garantías y Crédito',
  'Representación y Poderes',
  'Litigios y Créditos',
  'Personas Jurídicas',
  'Propiedad Horizontal'
]

const SUBTITLE_ORDER_FAMILIA = [
  'Matrimonio',
  'Sociedad Conyugal y Patrimonial'
]

const TIPO_TRAMITE = {
  // Civil - Transferencia de Dominio
  1: 'Notarial', 2: 'Notarial', 3: 'Notarial', 4: 'Notarial',
  5: 'Privado', 6: 'Privado', 7: 'Privado',
  // Civil - Uso y Goce
  8: 'Privado', 9: 'Notarial', 10: 'Privado',
  // Civil - slugs
  'compraventa-retroventa': 'Notarial',
  'cesion-derechos-hereditarios': 'Notarial',
  'estatutos-fundacion': 'Privado',
  'estatutos-fundacion-gobernacion': 'Privado',
  'contrato-construccion': 'Privado',
  'contrato-construccion-materiales': 'Privado',
  'contrato-deposito': 'Privado',
  'cesion-derechos-litigiosos': 'Privado',
  'arrendamiento-vivienda-urbana': 'Privado',
  'arrendamiento-inmueble-muebles': 'Privado',
  'cesion-contrato-arrendamiento': 'Privado',
  'notificacion-cesion-arrendamiento': 'Privado',
  'prestacion-servicios-profesionales': 'Privado',
  'servicios-abogado': 'Privado',
  'poder-general': 'Notarial',
  'poder-especial-venta-inmueble': 'Notarial',
  'revocatoria-poder-general': 'Notarial',
  'contrato-civil-obra': 'Privado',
  'contrato-aparceria': 'Privado',
  'fianza-abierta': 'Privado',
  'prenda-abierta': 'Privado',
  'pignoracion-rentas': 'Privado',
  'hipoteca-abierta': 'Notarial',
  'mutuo-civil-hipoteca': 'Notarial',
  'hipoteca-garantizar-saldo': 'Notarial',
  'ampliacion-hipoteca': 'Notarial',
  'cancelacion-hipoteca': 'Notarial',
  'compraventa-propiedad-horizontal': 'Notarial',
  'reglamento-propiedad-horizontal': 'Notarial',
  'acta-asamblea-propietarios': 'Privado',
  'carta-primera-convocatoria': 'Privado',
  'carta-segunda-convocatoria': 'Privado',
  'poder-asistir-asamblea': 'Privado',
  // Familia - Matrimonio
  'capitulaciones-matrimoniales': 'Notarial',
  'poder-contraer-matrimonio': 'Notarial',
  'solicitud-matrimonio-notario': 'Notarial',
  'matrimonio-civil-notario': 'Notarial',
  // Familia - Sociedad Conyugal y Patrimonial
  'disolucion-liquidacion-sociedad-conyugal': 'Notarial',
  'disolucion-sociedad-conyugal-sin-bienes': 'Notarial',
  'disolucion-liquidacion-sociedad-patrimonial': 'Notarial',
}

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
    if (grupos[sub] && grupos[sub].length > 0) {
      grupos[sub].forEach(m => result.push({ ...m, subtitle: sub }))
    }
  })
  return result
}

router.get('/', (req, res) => {
  try {
    const civilPath = path.join(__dirname, '../../data/templates/minutas-derecho-civil.json')
    const familiaPath = path.join(__dirname, '../../data/templates/minutas-derecho-familia.json')

    const minutasCivil = JSON.parse(fs.readFileSync(civilPath, 'utf8'))
    const minutasFamilia = JSON.parse(fs.readFileSync(familiaPath, 'utf8'))

    const categories = [
      {
        id: 'derecho-civil',
        name: 'Minutas Derecho Civil',
        minutas: ordenarMinutas(minutasCivil, SUBTITLE_ORDER_CIVIL).map(m => ({
          id: m.id,
          title: m.title,
          subtitle: m.subtitle,
          tipo_tramite: TIPO_TRAMITE[m.id] || 'Privado'
        }))
      },
      {
        id: 'derecho-familia',
        name: 'Derecho de Familia',
        minutas: ordenarMinutas(minutasFamilia, SUBTITLE_ORDER_FAMILIA).map(m => ({
          id: m.id,
          title: m.title,
          subtitle: m.subtitle,
          tipo_tramite: TIPO_TRAMITE[m.id] || 'Notarial'
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
    if (categoryId === 'derecho-familia') {
      filePath = path.join(__dirname, '../../data/templates/minutas-derecho-familia.json')
    } else {
      filePath = path.join(__dirname, '../../data/templates/minutas-derecho-civil.json')
    }

    const minutas = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const minuta = minutas.find(m => String(m.id) === String(minutaId))

    if (!minuta) return res.status(404).json({ error: 'Minuta no encontrada' })

    res.json({
      id: minuta.id,
      title: minuta.title,
      template: minuta.template,
      fields: minuta.fields,
      tipo_tramite: TIPO_TRAMITE[minuta.id] || 'Notarial'
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al cargar la minuta' })
  }
})

module.exports = router