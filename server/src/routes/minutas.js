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


const TIPO_TRAMITE = {
  'declaracion-union-marital-hecho-notarial':'Notarial',
  'disolucion-sociedad-patrimonial-umh-mutuo-consentimiento':'Notarial',
  1:'Notarial',2:'Notarial',3:'Notarial',4:'Notarial',5:'Privado',6:'Privado',7:'Privado',
  8:'Privado',9:'Notarial',10:'Privado',
  'compraventa-retroventa':'Notarial','cesion-derechos-hereditarios-civil':'Notarial',
  'estatutos-fundacion':'Privado','estatutos-fundacion-gobernacion':'Privado',
  'contrato-construccion':'Privado','contrato-construccion-materiales':'Privado',
  'contrato-deposito':'Privado','cesion-derechos-litigiosos':'Privado',
  'arrendamiento-vivienda-urbana':'Privado','arrendamiento-inmueble-muebles':'Privado',
  'cesion-contrato-arrendamiento':'Privado','notificacion-cesion-arrendamiento':'Privado',
  'prestacion-servicios-profesionales':'Privado','servicios-abogado':'Privado',
  'poder-general':'Notarial','poder-especial-venta-inmueble':'Notarial',
  'revocatoria-poder-general':'Notarial','contrato-civil-obra':'Privado',
  'contrato-aparceria':'Privado','fianza-abierta':'Privado','prenda-abierta':'Privado',
  'pignoracion-rentas':'Privado','hipoteca-abierta':'Notarial','mutuo-civil-hipoteca':'Notarial',
  'hipoteca-garantizar-saldo':'Notarial','ampliacion-hipoteca':'Notarial',
  'cancelacion-hipoteca':'Notarial','compraventa-propiedad-horizontal':'Notarial',
  'reglamento-propiedad-horizontal':'Notarial','acta-asamblea-propietarios':'Privado',
  'carta-primera-convocatoria':'Privado','carta-segunda-convocatoria':'Privado',
  'poder-asistir-asamblea':'Privado',
  // --- DERECHO DE FAMILIA ---
  'capitulaciones-matrimoniales':'Notarial','poder-contraer-matrimonio':'Notarial',
  'solicitud-matrimonio-notario':'Notarial','matrimonio-civil-notario':'Notarial',
  'disolucion-liquidacion-sociedad-conyugal':'Notarial',
  'disolucion-sociedad-conyugal-sin-bienes':'Notarial',
  'disolucion-liquidacion-sociedad-patrimonial':'Notarial',
  'legitimacion-hijo-extramatrimonial':'Notarial',
  'reconocimiento-hijo-extramatrimonial':'Notarial',
  'solicitud-correccion-registro-civil':'Privado',
  'correccion-errores-registro-civil':'Notarial',
  'cambio-correccion-adicion-nombre':'Notarial',
  'testamento-abierto':'Notarial','testamento-cerrado-presentacion':'Notarial',
  'constitucion-testamento-cerrado':'Privado','solicitud-apertura-testamento-cerrado':'Privado',
  'cesion-derechos-hereditarios':'Notarial','poder-liquidacion-sucesion':'Privado',
  'solicitud-liquidacion-sucesion':'Privado','inventarios-avaluos-sucesion':'Privado',
  'trabajo-particion-adjudicacion':'Privado',
  'revocatoria-poder-contraer-matrimonio':'Notarial',
  // Familia nuevas
  'demanda-filiacion-natural':'Privado',
  'demanda-declaracion-union-marital':'Privado',
  'poder-rendicion-provocada-cuentas':'Privado',
  'demanda-rendicion-provocada-cuentas':'Privado',
  'poder-rendicion-espontanea-cuentas':'Privado',
  'demanda-rendicion-espontanea-cuentas':'Privado',
  'poder-proceso-separacion-bienes':'Privado',
  'demanda-separacion-bienes':'Privado',
  'medidas-cautelares-separacion-bienes':'Privado',
  'demanda-separacion-cuerpos':'Privado',
  'demanda-divorcio-contencioso':'Privado',
  'demanda-fijacion-cuota-alimentaria':'Privado',
  'demanda-ejecutivo-alimentos':'Privado',
  'demanda-apertura-sucesion':'Privado',
  'presentacion-inventarios-avaluos-judicial':'Privado',
  'demanda-cancelacion-patrimonio-familia':'Privado',
  'cancelacion-patrimonio-familia-hijos-mayores':'Notarial',
  'constitucion-patrimonio-familia':'Notarial',
  'solicitud-medida-proteccion-violencia-intrafamiliar':'Privado',
  'mutuo-civil-simple':'Privado',
  'contrato-mandato-civil':'Privado',
  'cesion-creditos-ordinaria':'Privado',
  'estatutos-corporacion-asociacion':'Privado',
  'autorizacion-hijos-cancelar-patrimonio':'Privado',
  'demanda-divorcio-mutuo-consentimiento':'Privado',
  'acuerdo-divorcio-mutuo-consentimiento':'Privado',
  'divorcio-ante-notario':'Notarial',
  'solicitud-declaracion-muerte-desaparecimiento':'Privado',
  'demanda-adopcion':'Privado',
  'solicitud-reconocimiento-hijo-extramatrimonial':'Privado',
  'solicitud-permiso-menor-salir-pais':'Privado',
  // --- DERECHO COMERCIAL ---
  'letra-de-cambio':'Privado',
  'endoso-titulo-valor':'Privado',
  'contrato-distribucion':'Privado',
  'acuerdo-confidencialidad-comercial':'Privado',
  'licencia-uso-marca':'Privado',
  'cesion-marca':'Privado',
  'acuerdo-de-pago':'Privado',
  'pagare':'Privado','carta-instrucciones-pagare':'Privado',
  'compraventa-establecimiento-comercio':'Privado','arrendamiento-local-comercial':'Privado',
  'subarriendo-local-comercial':'Privado','agencia-comercial':'Privado',
  'concesion-comercial':'Privado','contrato-suministro':'Privado',
  'constancia-contrato-suministro':'Privado','contrato-franquicia':'Privado',
  'contrato-fabricacion':'Privado','outsourcing-sistemas':'Privado',
  'contrato-consignacion':'Privado','cuentas-en-participacion':'Privado',
  'contrato-revisoria-fiscal':'Privado','contrato-corretaje':'Privado',
  'corretaje-inmuebles':'Privado','consultoria-extranjeros':'Privado',
  'poder-derechos-autor':'Privado','contrato-edicion':'Privado',
  'cesion-derechos-patrimoniales-autor':'Privado','contrato-traduccion':'Privado',
  'contrato-licencia-productos':'Privado',
  'contrato-factoring':'Privado',
  'carta-cobro':'Privado',
  'cuenta-cobro':'Privado',
  // Comercial nueva
  'demanda-cancelacion-reposicion-titulo-valor':'Privado',
  // --- DERECHO DE SOCIEDADES ---
  'constitucion-sas':'Privado',
  'reforma-estatutos-sas':'Privado',
  'constitucion-empresa-unipersonal':'Privado','constitucion-sociedad-hecho':'Privado',
  'constitucion-sociedad-colectiva':'Notarial','poder-constituir-sociedad-anonima':'Privado',
  'poder-representar-asamblea':'Privado','poder-representar-accionista-permanente':'Privado',
  'constitucion-sociedad-anonima':'Notarial','estatutos-sociedad-anonima-compleja':'Notarial',
  'constitucion-sociedad-limitada':'Notarial',
  'acta-junta-socios-ordinaria':'Privado',
  'acta-junta-socios-cesion-cuotas':'Privado',
  'extracto-asamblea-reforma-estatutos':'Privado',
  'autorizacion-reforma-estatutaria-supersociedades':'Privado',
  'escritura-reforma-cesion-cuotas-ltda':'Notarial',
  'certificacion-legalidad-cesion-cuotas':'Privado',
  'estatutos-sociedad-comandita-simple':'Notarial',
  'estatutos-sociedad-comandita-acciones':'Notarial',
  'acta-asamblea-general':'Privado','dictamen-revisor-fiscal-sin-salvedades-sa':'Privado',
  'dictamen-revisor-fiscal-sin-salvedades-sucursal':'Privado',
  'dictamen-revisor-fiscal-abstencion':'Privado','reglamento-emision-acciones':'Privado',
  'transformacion-comandita-simple-acciones':'Notarial',
  'acta-asamblea-aprueba-fusion':'Privado',
  'estatutos-fondo-empleados':'Privado',
  // --- DERECHO LABORAL ---
  'contrato-termino-indefinido':'Privado',
  'contrato-termino-fijo-1-3':'Privado',
  'contrato-termino-fijo-inferior-1':'Privado',
  'contrato-obra-labor':'Privado',
  'contrato-salario-integral':'Privado',
  'reglamento-interno-trabajo':'Privado',
  'reglamento-higiene-seguridad':'Privado',
  'contrato-direccion-confianza-manejo':'Privado',
  'contrato-celadores-vigilantes':'Privado',
  'contrato-servicio-domestico':'Privado',
  'contrato-aprendizaje':'Privado',
  'carta-terminacion-justa-causa':'Privado',
  'terminacion-sin-justa-causa':'Privado',
  'liquidacion-prestaciones-sociales':'Privado',
  'solicitud-compensacion-vacaciones':'Privado',
  'estatutos-organizacion-sindical':'Privado',
  'acta-iniciacion-arreglo-directo':'Privado',
  'actas-tramite-arreglo-directo':'Privado',
  'acta-final-arreglo-directo':'Privado',
  'solicitud-licencia-paternidad':'Privado',
  // --- DERECHO ADMINISTRATIVO ---
  'derecho-peticion-interes-general':'Privado',
  'derecho-peticion-interes-particular':'Privado',
  'derecho-peticion-informacion-copias':'Privado',
  'modelo-quejas-reclamos':'Privado',
  'queja-entidad-financiera':'Privado',
  'desistimiento-derecho-peticion':'Privado',
  'solicitud-facultades-oficiosas':'Privado',
  'constitucion-union-temporal':'Privado',
  'constitucion-consorcio':'Privado',
  'pliego-condiciones-licitacion':'Privado',
  'informe-interventoria-obra':'Privado',
  'acta-iniciacion-contrato-obra':'Privado',
  'contrato-obra-estatal':'Privado',
  'contrato-compraventa-estatal':'Privado',
  'contrato-suministro-estatal':'Privado',
  'contrato-administracion-delegada':'Privado',
  'poder-lanzamiento-ocupacion-hecho':'Privado',
  'querella-lanzamiento-ocupacion-hecho':'Privado',
  'solicitud-declaracion-extrajuicio':'Privado',
  'poder-amparo-domicilio':'Privado',
  'querella-amparo-domicilio-propietario':'Privado',
  'querella-amparo-domicilio-tenedor':'Privado',
  'poder-perturbacion-posesion':'Privado',
  'querella-perturbacion-posesion':'Privado',
  'poder-recuperacion-espacio-publico':'Privado',
  'querella-recuperacion-espacio-publico':'Privado',
  'recurso-reposicion':'Privado',
  'recurso-apelacion-administrativo':'Privado',
  'revocatoria-directa':'Privado',
  'demanda-nulidad-simple':'Privado',
  'demanda-nulidad-restablecimiento-derecho':'Privado',
  'demanda-electoral':'Privado',
  // --- DERECHO CONSTITUCIONAL ---
  'accion-tutela':'Privado',
  'tutela-agente-oficioso':'Privado',
  'poder-tramitar-tutela':'Privado',
  'poder-contestar-tutela':'Privado',
  'solicitud-insistencia-revision-tutela':'Privado',
  'accion-popular':'Privado',
  'accion-cumplimiento':'Privado',
  'contestacion-accion-cumplimiento':'Privado',
  'accion-inconstitucionalidad':'Privado',
  'desistimiento-accion-tutela':'Privado',
  'contestacion-accion-tutela-general':'Privado',
  'recurso-apelacion-tutela-solicitante':'Privado',
  'recurso-apelacion-tutela-accionado':'Privado',
  // --- DERECHO PROCESAL CIVIL ---
  'cesion-derechos-litigiosos-procesal':'Privado',
  'solicitud-amparo-pobreza':'Privado',
  'solicitud-suspension-proceso-civil':'Privado',
  'poder-pruebas-anticipadas':'Privado',
  'solicitud-interrogatorio-parte':'Privado',
  'poder-proceso-ordinario':'Privado',
  'demanda-ordinaria-civil':'Privado',
  'contestacion-demanda-civil':'Privado',
  'demanda-proceso-pertenencia':'Privado',
  'demanda-accion-reivindicatoria':'Privado',
  'demanda-proceso-monitorio':'Privado',
  'demanda-verbal-sumario-perjuicios-obligacion':'Privado',
  'demanda-restitucion-inmueble-arrendado':'Privado',
  'demanda-pago-consignacion':'Privado',
  'demanda-imposicion-servidumbre':'Privado',
  'demanda-division-material':'Privado',
  'poder-proceso-ejecutivo':'Privado',
  'demanda-proceso-ejecutivo-singular':'Privado',
  'demanda-ejecutiva-titulo-hipotecario':'Privado',
  'excepciones-previas-proceso-ejecutivo':'Privado',
  'excepciones-merito-proceso-ejecutivo':'Privado',
  // Procesal Civil nuevas
  'solicitud-medidas-cautelares':'Privado',
  'incidente-levantamiento-medidas-cautelares':'Privado',
  'terminacion-proceso-ejecutivo-pago':'Privado',
  'acumulacion-procesos-ejecutivos':'Privado',
  'recurso-queja-auto-apelable':'Privado',
  'incidente-nulidad-remate':'Privado',
  'poder-especial-compra-inmueble':'Notarial',
  'declaracion-fin-extraprocesal':'Notarial',
  'aviso-terminacion-arrendamiento-arrendador':'Privado',
  'aviso-terminacion-arrendamiento-arrendatario':'Privado',
  'solicitud-primera-copia-hipoteca':'Notarial',
  'dacion-en-pago':'Privado',
  // --- DERECHO TRIBUTARIO ---
  'recurso-reconsideracion':'Privado',
  'respuesta-requerimiento-especial':'Privado',
  'respuesta-requerimiento-ordinario':'Privado',
  'excepcion-prescripcion-mandamiento-pago':'Privado',
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
          tipo_tramite: TIPO_TRAMITE[m.id] || 'Privado'
        }))
      },
      {
        id: 'derecho-familia', name: 'Derecho de Familia',
        minutas: ordenarMinutas(minutasFamilia, SUBTITLE_ORDER_FAMILIA).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: TIPO_TRAMITE[m.id] || 'Notarial'
        }))
      },
      {
        id: 'derecho-comercial', name: 'Derecho Comercial',
        minutas: ordenarMinutas(minutasComercial, SUBTITLE_ORDER_COMERCIAL).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: TIPO_TRAMITE[m.id] || 'Privado'
        }))
      },
      {
        id: 'derecho-sociedades', name: 'Derecho de Sociedades',
        minutas: ordenarMinutas(minutasSociedades, SUBTITLE_ORDER_SOCIEDADES).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: TIPO_TRAMITE[m.id] || 'Privado'
        }))
      },
      {
        id: 'derecho-laboral', name: 'Derecho Laboral',
        minutas: ordenarMinutas(minutasLaboral, SUBTITLE_ORDER_LABORAL).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: TIPO_TRAMITE[m.id] || 'Privado'
        }))
      },
      {
        id: 'derecho-administrativo', name: 'Derecho Administrativo',
        minutas: ordenarMinutas(minutasAdministrativo, SUBTITLE_ORDER_ADMINISTRATIVO).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: TIPO_TRAMITE[m.id] || 'Privado'
        }))
      },
      {
        id: 'derecho-constitucional', name: 'Derecho Constitucional',
        minutas: ordenarMinutas(minutasConstitucional, SUBTITLE_ORDER_CONSTITUCIONAL).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: TIPO_TRAMITE[m.id] || 'Privado'
        }))
      },
      {
        id: 'derecho-procesal-civil', name: 'Derecho Procesal Civil',
        minutas: ordenarMinutas(minutasProcesalCivil, SUBTITLE_ORDER_PROCESAL_CIVIL).map(m => ({
          id: m.id, title: m.title, subtitle: m.subtitle,
          tipo_tramite: TIPO_TRAMITE[m.id] || 'Privado'
        }))
      }
    ,{
      id: 'derecho-procesal-laboral', name: 'Derecho Procesal Laboral',
      minutas: ordenarMinutas(minutasProcesalLaboral, SUBTITLE_ORDER_PROCESAL_LABORAL).map(m => ({
        id: m.id, title: m.title, subtitle: m.subtitle,
        tipo_tramite: TIPO_TRAMITE[m.id] || 'Privado'
      }))
    }
  ,{
      id: 'derecho-penal', name: 'Derecho Penal',
      minutas: ordenarMinutas(minutasPenal, SUBTITLE_ORDER_PENAL).map(m => ({
        id: m.id, title: m.title, subtitle: m.subtitle,
        tipo_tramite: TIPO_TRAMITE[m.id] || 'Privado'
      }))
    }
    ,{
      id: 'resolucion-conflictos', name: 'Resolución de Conflictos',
      minutas: ordenarMinutas(minutasResolucion, SUBTITLE_ORDER_RESOLUCION).map(m => ({
        id: m.id, title: m.title, subtitle: m.subtitle,
        tipo_tramite: TIPO_TRAMITE[m.id] || 'Privado'
      }))
    }
    ,{
  id: 'derecho-tributario', name: 'Derecho Tributario',
  minutas: ordenarMinutas(minutasTributario, SUBTITLE_ORDER_TRIBUTARIO).map(m => ({
    id: m.id, title: m.title, subtitle: m.subtitle,
    tipo_tramite: TIPO_TRAMITE[m.id] || 'Privado'
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
      fields: minuta.fields, tipo_tramite: TIPO_TRAMITE[minuta.id] || 'Privado'
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al cargar la minuta' })
  }
})

module.exports = router