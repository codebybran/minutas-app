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
  'Matrimonio'
]

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
    const civilPath = path.join(__dirname, '../data/templates/minutas-derecho-civil.json')
    const familiaPath = path.join(__dirname, '../data/templates/minutas-derecho-familia.json')

    const minutasCivil = JSON.parse(fs.readFileSync(civilPath, 'utf8'))
    const minutasFamilia = JSON.parse(fs.readFileSync(familiaPath, 'utf8'))

    const categories = [
      {
        id: 'derecho-civil',
        name: 'Minutas Derecho Civil',
        minutas: ordenarMinutas(minutasCivil, SUBTITLE_ORDER_CIVIL).map(m => ({
          id: m.id,
          title: m.title,
          subtitle: m.subtitle
        }))
      },
      {
        id: 'derecho-familia',
        name: 'Derecho de Familia',
        minutas: ordenarMinutas(minutasFamilia, SUBTITLE_ORDER_FAMILIA).map(m => ({
          id: m.id,
          title: m.title,
          subtitle: m.subtitle
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
      filePath = path.join(__dirname, '../data/templates/minutas-derecho-familia.json')
    } else {
      filePath = path.join(__dirname, '../data/templates/minutas-derecho-civil.json')
    }

    const minutas = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const minuta = minutas.find(m => String(m.id) === String(minutaId))

    if (!minuta) return res.status(404).json({ error: 'Minuta no encontrada' })

    res.json({
      id: minuta.id,
      title: minuta.title,
      template: minuta.template,
      fields: minuta.fields
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al cargar la minuta' })
  }
})

module.exports = router