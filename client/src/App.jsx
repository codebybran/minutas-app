import { useState, useEffect, useRef } from 'react'
import './App.css'

const FIELD_HELP = {
  ciudad: 'Escribe el nombre de la ciudad o municipio donde se está firmando el contrato. Ejemplo: Cali, El Cerrito, Bogotá.',
  dia: 'Escribe el número del día en que se firma el contrato. Ejemplo: 21',
  mes: 'Escribe el nombre del mes. Ejemplo: abril, mayo, enero.',
  anio: 'Escribe el año en que se firma el contrato. Ejemplo: 2026',
  nombre_vendedor: 'Escribe el nombre completo del vendedor tal como aparece en su cédula de ciudadanía.',
  nombre_comprador: 'Escribe el nombre completo del comprador tal como aparece en su cédula de ciudadanía.',
  estado_civil_vendedor: 'Escribe el estado civil del vendedor. Las opciones son: soltero, casado, divorciado o viudo.',
  estado_civil_comprador: 'Escribe el estado civil del comprador. Las opciones son: soltero, casado, divorciado o viudo.',
  sociedad_conyugal_vendedor: 'Si el vendedor es casado escribe: con sociedad conyugal vigente. Si es soltero, divorciado o viudo escribe: sin sociedad conyugal.',
  sociedad_conyugal_comprador: 'Si el comprador es casado escribe: con sociedad conyugal vigente. Si es soltero, divorciado o viudo escribe: sin sociedad conyugal.',
  sociedad_conyugal: 'Si ambos son casados escribe: con sociedad conyugal vigente. Si son solteros, divorciados o viudos escribe: sin sociedad conyugal.',
  tipo_inmueble: 'Escribe el tipo de bien que se está vendiendo. Ejemplo: casa, apartamento, local comercial, lote, finca.',
  barrio: 'Escribe el nombre del barrio donde está ubicado el inmueble.',
  direccion_inmueble: 'Escribe la dirección completa del inmueble. Ejemplo: Calle 4 Sur # 2A-56.',
  metros: 'Escribe solo el número de metros cuadrados del inmueble. Ejemplo: 120',
  registro_catastral: 'Es el número que identifica el inmueble ante la autoridad catastral. Lo encuentras en el certificado catastral o en la escritura.',
  folio_matricula: 'Es el número de matrícula inmobiliaria. Lo encuentras en el certificado de tradición y libertad. Ejemplo: 370-123456.',
  fecha_adquisicion: 'Escribe la fecha en que el vendedor compró el inmueble. Ejemplo: 15 de mayo de 2018.',
  numero_escritura: 'Es el número de la escritura pública. Solo el número. Ejemplo: 1245.',
  fecha_escritura: 'Escribe la fecha de esa escritura pública. Ejemplo: 21 de abril de 2018.',
  notaria: 'Solo el nombre de la notaría, sin escribir la palabra Notaría. Ejemplo: Única, Primera, Segunda.',
  circulo: 'Solo el nombre de la ciudad del círculo notarial. Ejemplo: El Cerrito, Cali, Bogotá.',
  hora_escritura: 'Escribe la hora en que se firmará la escritura. Ejemplo: 10:00 AM, 2:00 PM.',
  dia_escritura: 'Escribe el número del día en que se firmará la escritura. Ejemplo: 22.',
  mes_escritura: 'Escribe el nombre del mes en que se firmará la escritura. Ejemplo: mayo.',
  anio_escritura: 'Escribe el año en que se firmará la escritura. Ejemplo: 2026.',
  notaria_escritura: 'Solo el nombre de la notaría para la nueva escritura, sin escribir Notaría. Ejemplo: Única, Primera.',
  circulo_escritura: 'Solo la ciudad del círculo notarial para la nueva escritura. Ejemplo: El Cerrito, Cali.',
  valor_letras: 'Escribe el precio total en letras. Ejemplo: cien millones de pesos m/cte.',
  valor_numeros: 'Escribe el precio total en números con puntos. Ejemplo: 100.000.000.',
  pago_inicial_letras: 'Escribe el valor del pago que se hace hoy, en letras. Ejemplo: veinte millones de pesos.',
  pago_inicial_numeros: 'Escribe ese valor en números. Ejemplo: 20.000.000.',
  saldo_letras: 'Escribe el valor que queda pendiente de pagar, en letras. Ejemplo: ochenta millones de pesos.',
  saldo_numeros: 'Escribe ese saldo en números. Ejemplo: 80.000.000.',
  telefono: 'Escribe el número de teléfono que se incluirá en el contrato.',
  multa_letras: 'Escribe el valor de la multa por incumplimiento, en letras. Ejemplo: diez millones de pesos.',
  multa_numeros: 'Escribe ese valor en números. Ejemplo: 10.000.000.',
  nombre_donante: 'Escribe el nombre completo de la persona que dona el bien.',
  nombre_donatario: 'Escribe el nombre completo de la persona que recibe el bien donado.',
  descripcion_bien: 'Describe detalladamente el bien. Ejemplo: apartamento ubicado en la Calle 5 # 3-20, Barrio El Prado, Cali.',
  forma_adquisicion: 'Escribe cómo obtuvo el bien el donante. Ejemplo: compra, herencia, donación.',
  documento_adquisicion: 'Escribe el documento que prueba que el donante es dueño. Ejemplo: escritura pública No. 123 de la Notaría Primera de Cali.',
  destinacion_bien: 'Escribe para qué se usará el bien donado. Ejemplo: vivienda familiar, uso educativo.',
  plazo_no_venta: 'Escribe el número de años sin poder vender el bien. Ejemplo: 5.',
  responsable_gastos: 'Escribe quién pagará los gastos. Ejemplo: el donante, el donatario, ambos por partes iguales.',
  nombre_parte1: 'Escribe el nombre completo de la primera persona que interviene en la permuta, tal como aparece en su cédula.',
  nombre_parte2: 'Escribe el nombre completo de la segunda persona que interviene en la permuta, tal como aparece en su cédula.',
  estado_civil_parte1: 'Escribe el estado civil de la primera parte. Las opciones son: soltero, casado, divorciado o viudo.',
  estado_civil_parte2: 'Escribe el estado civil de la segunda parte. Las opciones son: soltero, casado, divorciado o viudo.',
  tipo_inmueble1: 'Escribe el tipo de bien que entrega la primera parte. Ejemplo: casa, apartamento, local, lote, finca.',
  barrio1: 'Escribe el nombre del barrio donde está ubicado el bien de la primera parte.',
  direccion1: 'Escribe la dirección completa del bien de la primera parte. Ejemplo: Calle 4 Sur # 2A-56.',
  metros1: 'Escribe solo el número de metros cuadrados del bien de la primera parte. Ejemplo: 120.',
  registro_catastral1: 'Es el número que identifica el bien de la primera parte ante la autoridad catastral.',
  numero_escritura1: 'Es el número de la escritura pública con la que la primera parte adquirió su bien. Solo el número. Ejemplo: 1245.',
  fecha_escritura1: 'Escribe la fecha de la escritura con la que la primera parte adquirió su bien. Ejemplo: 15 de mayo de 2018.',
  notaria1: 'Solo el nombre de la notaría del bien de la primera parte, sin escribir Notaría. Ejemplo: Única, Primera.',
  circulo1: 'Solo la ciudad del círculo notarial del bien de la primera parte. Ejemplo: El Cerrito, Cali.',
  folio_matricula1: 'Es el número de matrícula inmobiliaria del bien de la primera parte. Ejemplo: 370-123456.',
  vendedor_original1: 'Escribe el nombre completo de la persona que le vendió el bien a la primera parte.',
  tipo_inmueble2: 'Escribe el tipo de bien que entrega la segunda parte. Ejemplo: casa, apartamento, local, lote, finca.',
  barrio2: 'Escribe el nombre del barrio donde está ubicado el bien de la segunda parte.',
  direccion2: 'Escribe la dirección completa del bien de la segunda parte. Ejemplo: Calle 4 Sur # 2A-56.',
  metros2: 'Escribe solo el número de metros cuadrados del bien de la segunda parte. Ejemplo: 120.',
  registro_catastral2: 'Es el número que identifica el bien de la segunda parte ante la autoridad catastral.',
  vendedor_original2: 'Escribe el nombre completo de la persona que le vendió el bien a la segunda parte.',
  numero_escritura2: 'Es el número de la escritura pública con la que la segunda parte adquirió su bien. Solo el número. Ejemplo: 1245.',
  fecha_escritura2: 'Escribe la fecha de la escritura con la que la segunda parte adquirió su bien. Ejemplo: 15 de mayo de 2018.',
  notaria2: 'Solo el nombre de la notaría del bien de la segunda parte, sin escribir Notaría. Ejemplo: Única, Primera.',
  circulo2: 'Solo la ciudad del círculo notarial del bien de la segunda parte. Ejemplo: El Cerrito, Cali.',
  folio_matricula2: 'Es el número de matrícula inmobiliaria del bien de la segunda parte. Ejemplo: 370-123456.',
  ciudad_comprador: 'Escribe la ciudad o municipio donde vive el comprador. Ejemplo: Cali, El Cerrito, Bogotá.',
  ciudad_vendedor: 'Escribe la ciudad o municipio donde vive el vendedor. Ejemplo: Cali, El Cerrito, Bogotá.',
  nombre_empresa: 'Si el vendedor actúa como representante de una empresa, escribe el nombre completo. Si no aplica escribe: no aplica.',
  domicilio_empresa: 'Escribe la ciudad donde está registrada la empresa. Si no aplica escribe: no aplica.',
  ciudad_pago: 'Escribe la ciudad donde el comprador realizará los pagos. Ejemplo: Cali, El Cerrito.',
  forma_pago: 'Describe cómo se pagará el precio. Ejemplo: cuotas mensuales de $500.000 durante 20 meses.',
  cedula_vendedor: 'Escribe el número de cédula del vendedor. Solo los números. Ejemplo: 1234567890.',
  expedicion_cedula_vendedor: 'Escribe la ciudad donde fue expedida la cédula del vendedor. Ejemplo: Cali, El Cerrito.',
  cedula_comprador: 'Escribe el número de cédula del comprador. Solo los números. Ejemplo: 1234567890.',
  expedicion_cedula_comprador: 'Escribe la ciudad donde fue expedida la cédula del comprador. Ejemplo: Cali, El Cerrito.',
  clase_vehiculo: 'Escribe la clase del vehículo según la tarjeta de propiedad. Ejemplo: automóvil, camioneta, motocicleta.',
  marca_vehiculo: 'Escribe la marca del vehículo. Ejemplo: Toyota, Chevrolet, Renault, Yamaha.',
  tipo_vehiculo: 'Escribe el tipo de vehículo. Ejemplo: sedan, campero, pick-up, furgón.',
  color_vehiculo: 'Escribe el color del vehículo. Ejemplo: blanco, negro, rojo, plateado.',
  modelo_vehiculo: 'Escribe el año modelo del vehículo. Ejemplo: 2020, 2018, 2015.',
  numero_motor: 'Escribe el número de motor que aparece en la tarjeta de propiedad.',
  numero_serie: 'Escribe el número de serie o VIN del vehículo.',
  placa_vehiculo: 'Escribe la placa del vehículo. Ejemplo: ABC123.',
  linea_vehiculo: 'Escribe la línea del vehículo. Ejemplo: Corolla, Spark, Logan, FZ.',
  cilindraje: 'Escribe el cilindraje del vehículo. Ejemplo: 1600 cc, 200 cc.',
  servicio_vehiculo: 'Escribe el tipo de servicio. Ejemplo: particular, público, oficial.',
  carroceria: 'Escribe el tipo de carrocería. Ejemplo: sedan, furgón, campero. Si es moto escribe: no aplica.',
  numero_puertas: 'Escribe el número de puertas. Ejemplo: 2, 4. Si es moto escribe: no aplica.',
  capacidad: 'Escribe la capacidad del vehículo. Ejemplo: 5 pasajeros. Si no aplica escribe: no aplica.',
  documento_aduana: 'Si el vehículo fue importado escribe el número del acta de aduana. Si es nacional escribe: no requiere documento de aduana.',
  estado_vehiculo: 'Describe el estado en que se entrega el vehículo. Ejemplo: perfecto estado de funcionamiento.',
  forma_pago_saldo: 'Describe cómo se pagará el saldo restante. Ejemplo: 15 cuotas mensuales de $1.000.000 pagaderas los días 5 de cada mes.',
  departamento: 'Escribe el nombre del departamento. Ejemplo: Valle del Cauca, Antioquia, Cundinamarca.',
  nombre_deudor: 'Escribe el nombre completo de la persona que debe el dinero y entrega el bien como garantía.',
  nombre_acreedor: 'Escribe el nombre completo de la persona que prestó el dinero y recibirá el bien para administrarlo.',
  cedula_deudor: 'Escribe el número de cédula del deudor. Solo los números.',
  cedula_acreedor: 'Escribe el número de cédula del acreedor. Solo los números.',
  expedicion_cedula_deudor: 'Escribe la ciudad donde fue expedida la cédula del deudor. Ejemplo: Cali, El Cerrito.',
  expedicion_cedula_acreedor: 'Escribe la ciudad donde fue expedida la cédula del acreedor. Ejemplo: Cali, El Cerrito.',
  plazo_anos: 'Escribe el número de años que el acreedor tendrá el bien. Ejemplo: 2.',
  dia_inicio: 'Escribe el número del día en que empieza el plazo. Ejemplo: 1.',
  mes_inicio: 'Escribe el nombre del mes en que empieza el plazo. Ejemplo: mayo.',
  anio_inicio: 'Escribe el año en que empieza el plazo. Ejemplo: 2026.',
  dia_deuda: 'Escribe el número del día en que se contrajo la deuda. Ejemplo: 15.',
  mes_deuda: 'Escribe el nombre del mes en que se contrajo la deuda. Ejemplo: enero.',
  anio_deuda: 'Escribe el año en que se contrajo la deuda. Ejemplo: 2025.',
  valor_deuda_letras: 'Escribe el valor total de la deuda en letras. Ejemplo: diez millones de pesos m/cte.',
  valor_deuda_numeros: 'Escribe el valor total de la deuda en números. Ejemplo: 10.000.000.',
  interes_mensual: 'Escribe el porcentaje de interés mensual. Solo el número. Ejemplo: 2 (significa 2% mensual).',
  periodos_mora: 'Escribe cuántos períodos sin pagar permiten al acreedor pedir la venta judicial. Ejemplo: 3.',
  tipo_explotacion: 'Escribe el tipo de uso permitido para el bien. Ejemplo: arrendamiento, agrícola, comercial.'
}

const PASOS_SIGUIENTE = {
  1: {
    titulo: 'Promesa de Compraventa de Inmueble',
    pasos: [
      { num: 1, titulo: 'Firmar el documento', descripcion: 'Reúnase con la otra parte y firmen el contrato ante dos testigos mayores de edad. Cada parte se queda con una copia original firmada.' },
      { num: 2, titulo: 'Autenticar las firmas (opcional pero recomendado)', descripcion: 'Lleven el documento a cualquier Notaría con sus cédulas de ciudadanía. El notario verificará su identidad y autenticará las firmas. Costo aproximado: entre $15.000 y $30.000 por firma.' },
      { num: 3, titulo: 'Guardar el documento en lugar seguro', descripcion: 'Conserve su copia en un lugar seguro. Este documento es prueba legal del acuerdo entre las partes.' },
      { num: 4, titulo: 'En la fecha acordada: ir a la Notaría', descripcion: 'El día pactado en el contrato, ambas partes deben ir a la Notaría acordada con: cédulas de ciudadanía, el certificado de tradición y libertad del inmueble (vigente, máximo 30 días), paz y salvo de impuesto predial, paz y salvo de valorización, paz y salvo de servicios públicos.' },
      { num: 5, titulo: 'Firma de la Escritura Pública', descripcion: 'El Notario redactará y leerá la escritura de compraventa. Ambas partes la firman. El vendedor recibe el pago acordado.' },
      { num: 6, titulo: 'Pagar los impuestos de la transacción', descripcion: 'Deben pagarse: el impuesto de registro (aproximadamente 1% del valor del inmueble) y los derechos notariales. Estos gastos se pagan en la Notaría o en el banco autorizado.' },
      { num: 7, titulo: 'Registrar la Escritura', descripcion: 'Lleven la escritura a la Oficina de Registro de Instrumentos Públicos de su ciudad. Allí registran el cambio de propietario. A partir de ese momento el comprador es el nuevo dueño legal del inmueble.' }
    ]
  },
  2: {
    titulo: 'Promesa de Donación',
    pasos: [
      { num: 1, titulo: 'Firmar el documento', descripcion: 'Reúnanse donante y donatario y firmen el contrato ante dos testigos. Cada parte conserva una copia.' },
      { num: 2, titulo: 'Solicitar la Insinuación Notarial', descripcion: 'Deben ir a una Notaría a solicitar la insinuación. Lleven: cédulas de ciudadanía, el contrato de promesa de donación firmado, documentos del bien a donar (escritura, certificado de tradición). El Notario autorizará la donación mediante acto notarial.' },
      { num: 3, titulo: 'Firma de la Escritura Pública de Donación', descripcion: 'Una vez aprobada la insinuación, el Notario elabora la escritura de donación. Ambas partes la firman en la Notaría.' },
      { num: 4, titulo: 'Pagar los impuestos', descripcion: 'Se deben pagar los derechos notariales y el impuesto de registro. El responsable de estos gastos es quien acordaron en el contrato.' },
      { num: 5, titulo: 'Registrar la Escritura', descripcion: 'Lleven la escritura a la Oficina de Registro de Instrumentos Públicos. Allí quedaría registrado el nuevo propietario del bien donado.' }
    ]
  },
  3: {
    titulo: 'Compraventa de Inmueble',
    pasos: [
      { num: 1, titulo: 'Este contrato debe elevarse a Escritura Pública', descripcion: 'En Colombia, la compraventa de inmuebles SIEMPRE debe hacerse mediante Escritura Pública ante Notario. Este documento es el borrador del acuerdo.' },
      { num: 2, titulo: 'Ir a la Notaría', descripcion: 'Ambas partes deben ir a la Notaría acordada con: cédulas de ciudadanía, certificado de tradición y libertad del inmueble (vigente), paz y salvo de impuesto predial, paz y salvo de valorización, paz y salvo de servicios públicos.' },
      { num: 3, titulo: 'Firma de la Escritura Pública', descripcion: 'El Notario redacta y lee la escritura. Ambas partes la firman. El vendedor recibe el pago. El comprador recibe la copia de la escritura.' },
      { num: 4, titulo: 'Pagar los impuestos', descripcion: 'Se pagan: impuesto de registro (1% del valor), derechos notariales y retención en la fuente si aplica.' },
      { num: 5, titulo: 'Registrar la Escritura', descripcion: 'Lleven la escritura a la Oficina de Registro de Instrumentos Públicos. Una vez registrada, el comprador es el propietario legal.' }
    ]
  },
  4: {
    titulo: 'Contrato de Permuta',
    pasos: [
      { num: 1, titulo: 'Firmar el documento', descripcion: 'Ambas partes firman el contrato ante dos testigos. Cada parte conserva una copia.' },
      { num: 2, titulo: 'Ir a la Notaría para elevar a Escritura Pública', descripcion: 'La permuta de inmuebles debe hacerse por Escritura Pública. Lleven: cédulas de ciudadanía, certificados de tradición de ambos inmuebles, paz y salvos de impuestos de ambos inmuebles.' },
      { num: 3, titulo: 'Firma de la Escritura Pública', descripcion: 'El Notario redacta la escritura de permuta. Ambas partes la firman. Se entregan mutuamente los inmuebles.' },
      { num: 4, titulo: 'Pagar los impuestos', descripcion: 'Cada parte paga los impuestos correspondientes al inmueble que recibe: impuesto de registro y derechos notariales.' },
      { num: 5, titulo: 'Registrar la Escritura', descripcion: 'Lleven la escritura a la Oficina de Registro de Instrumentos Públicos para registrar el cambio de propietario de cada inmueble.' }
    ]
  },
  5: {
    titulo: 'Compraventa de Bien Mueble con Reserva de Dominio',
    pasos: [
      { num: 1, titulo: 'Firmar el documento', descripcion: 'Vendedor y comprador firman el contrato ante dos testigos. Cada parte conserva una copia original.' },
      { num: 2, titulo: 'Registrar el contrato si el bien es identificable', descripcion: 'Si el bien mueble es identificable (como una máquina industrial con serial), se recomienda registrar el contrato en la Cámara de Comercio para proteger los derechos del vendedor frente a terceros.' },
      { num: 3, titulo: 'Entregar el bien al comprador', descripcion: 'El vendedor entrega físicamente el bien al comprador. El comprador es responsable del bien pero no es propietario hasta pagar la última cuota.' },
      { num: 4, titulo: 'Realizar los pagos acordados', descripcion: 'El comprador debe pagar las cuotas en las fechas acordadas. Guarde todos los comprobantes de pago.' },
      { num: 5, titulo: 'Al pagar la última cuota', descripcion: 'Una vez pagada la totalidad del precio, el vendedor debe entregar al comprador un documento escrito confirmando que recibió el pago total y que el comprador es el nuevo propietario del bien.' }
    ]
  },
  6: {
    titulo: 'Compraventa de Vehículo Automotor',
    pasos: [
      { num: 1, titulo: 'Firmar el documento', descripcion: 'Vendedor y comprador firman el contrato. Cada parte conserva una copia.' },
      { num: 2, titulo: 'Verificar que el vehículo no tenga problemas legales', descripcion: 'Antes de pagar, verifique en la página de la RUNT (www.runt.com.co) que el vehículo no tenga multas, embargos ni prendas.' },
      { num: 3, titulo: 'Realizar el traspaso en el organismo de tránsito', descripcion: 'Ambas partes deben ir al organismo de tránsito donde está registrado el vehículo. Lleven: cédulas de ciudadanía, contrato de compraventa, tarjeta de propiedad original, SOAT vigente, revisión técnico-mecánica vigente.' },
      { num: 4, titulo: 'Pagar los derechos de traspaso', descripcion: 'Se pagan los derechos de traspaso en el organismo de tránsito. El costo varía según el municipio.' },
      { num: 5, titulo: 'Recibir la nueva tarjeta de propiedad', descripcion: 'El organismo de tránsito expide una nueva tarjeta de propiedad a nombre del comprador. A partir de ese momento el comprador es el propietario legal.' }
    ]
  },
  7: {
    titulo: 'Compraventa de Vehículo con Reserva de Dominio',
    pasos: [
      { num: 1, titulo: 'Firmar el documento', descripcion: 'Vendedor y comprador firman el contrato ante dos testigos. Cada parte conserva una copia.' },
      { num: 2, titulo: 'Registrar la reserva de dominio en tránsito', descripcion: 'El vendedor debe ir al organismo de tránsito a registrar la reserva de dominio sobre el vehículo. Esto protege al vendedor e impide que el comprador venda el vehículo antes de pagar.' },
      { num: 3, titulo: 'Realizar los pagos acordados', descripcion: 'El comprador paga las cuotas en las fechas acordadas. Guarde todos los comprobantes de pago.' },
      { num: 4, titulo: 'Al pagar la última cuota', descripcion: 'Una vez pagada la totalidad, el vendedor debe ir con el comprador al organismo de tránsito a levantar la reserva de dominio y hacer el traspaso definitivo.' },
      { num: 5, titulo: 'Recibir la tarjeta de propiedad', descripcion: 'El organismo de tránsito expide la tarjeta de propiedad a nombre del comprador sin reserva de dominio. A partir de ese momento es el propietario pleno.' }
    ]
  },
  8: {
    titulo: 'Contrato de Anticresis',
    pasos: [
      { num: 1, titulo: 'Firmar el documento', descripcion: 'Deudor y acreedor firman el contrato ante dos testigos. Cada parte conserva una copia.' },
      { num: 2, titulo: 'Autenticar las firmas en Notaría', descripcion: 'Lleven el contrato a una Notaría con sus cédulas para autenticar las firmas. Esto le da mayor validez legal al documento.' },
      { num: 3, titulo: 'Entregar el bien al acreedor', descripcion: 'El deudor entrega físicamente el bien inmueble al acreedor. El acreedor podrá usarlo o arrendarlo para cobrar los intereses de la deuda.' },
      { num: 4, titulo: 'El acreedor administra el bien', descripcion: 'El acreedor recibe los frutos del bien (arriendos, cosechas, etc.) y los imputa primero a los intereses y luego al capital de la deuda.' },
      { num: 5, titulo: 'Al pagar la deuda total', descripcion: 'Una vez pagada la totalidad de la deuda e intereses, el acreedor debe devolver el bien al deudor en el mismo estado en que lo recibió.' },
      { num: 6, titulo: 'Si el deudor no paga', descripcion: 'Si el deudor incumple, el acreedor puede acudir a un juez para solicitar la venta judicial del bien y cobrar su deuda con el producido de esa venta.' }
    ]
  }
}

function TooltipField({ field, onChange }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)
  const help = FIELD_HELP[field.name]

  const handleMouseEnter = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const tooltipWidth = 260
      let left = rect.left
      if (left + tooltipWidth > window.innerWidth - 20) {
        left = rect.right - tooltipWidth
      }
      setTooltipPos({ top: rect.bottom + 6, left })
    }
    setShowTooltip(true)
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#3a6a9a', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          {field.label}
        </label>
        {help && (
          <div ref={btnRef} onMouseEnter={handleMouseEnter} onMouseLeave={() => setShowTooltip(false)}
            style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#b8962e', color: '#fff', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help', flexShrink: 0 }}>
            ?
          </div>
        )}
      </div>
      <input
        type={field.type}
        placeholder={`Ingrese ${field.label.toLowerCase()}`}
        onChange={e => onChange(field.name, e.target.value)}
        style={{ width: '100%', padding: '10px 14px', background: '#f7fafc', border: '1px solid #c8d8e8', borderRadius: '6px', fontSize: '13px', color: '#1a3a5c', boxSizing: 'border-box', outline: 'none', fontFamily: 'Georgia, serif' }}
      />
      {showTooltip && help && (
        <div style={{ position: 'fixed', top: tooltipPos.top, left: tooltipPos.left, background: '#1a3a5c', color: '#e0eaf5', fontSize: '12px', lineHeight: '1.6', padding: '10px 14px', borderRadius: '6px', width: '260px', zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,0.25)', border: '1px solid #b8962e', pointerEvents: 'none' }}>
          <div style={{ color: '#e2b94a', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>¿Cómo llenar este campo?</div>
          {help}
        </div>
      )}
    </div>
  )
}

function PanelPasos({ minutaId, onClose }) {
  const pasos = PASOS_SIGUIENTE[minutaId]
  if (!pasos) return null

  const handlePrint = () => {
    const contenido = document.getElementById('pasos-imprimir').innerHTML
    const ventana = window.open('', '_blank')
    ventana.document.write(`
      <html><head><title>Guía de trámites</title>
      <style>
        body { font-family: 'Times New Roman', serif; margin: 2cm; color: #000; }
        h2 { color: #1a3a5c; border-bottom: 2px solid #b8962e; padding-bottom: 8px; }
        .paso { margin-bottom: 20px; }
        .paso-num { background: #1a3a5c; color: #e2b94a; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 10px; }
        .paso-titulo { font-weight: bold; font-size: 14px; }
        .paso-desc { margin-top: 6px; margin-left: 38px; font-size: 13px; line-height: 1.6; }
      </style></head>
      <body>${contenido}</body></html>
    `)
    ventana.document.close()
    ventana.print()
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '12px', width: '680px', maxHeight: '85vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a3a5c, #2c5282)', padding: '20px 24px', borderBottom: '3px solid #b8962e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#e2b94a', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Guía de Trámites</div>
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>¿Qué hago ahora?</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #ffffff44', color: '#fff', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }}>✕ Cerrar</button>
        </div>

        {/* Contenido */}
        <div style={{ overflowY: 'auto', padding: '24px', flex: 1 }} id="pasos-imprimir">
          <h2 style={{ color: '#1a3a5c', fontSize: '16px', marginBottom: '20px', borderBottom: '2px solid #e2b94a', paddingBottom: '10px' }}>
            Pasos a seguir después de generar su documento: {pasos.titulo}
          </h2>
          {pasos.pasos.map(paso => (
            <div key={paso.num} className="paso" style={{ marginBottom: '20px', display: 'flex', gap: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1a3a5c', color: '#e2b94a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0, marginTop: '2px' }}>
                {paso.num}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#1a3a5c', fontSize: '14px', marginBottom: '6px' }}>{paso.titulo}</div>
                <div style={{ color: '#4a6a8a', fontSize: '13px', lineHeight: '1.7' }}>{paso.descripcion}</div>
              </div>
            </div>
          ))}
          <div style={{ background: '#fff8e7', border: '1px solid #e2b94a', borderRadius: '8px', padding: '14px', marginTop: '10px' }}>
            <div style={{ color: '#b8962e', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>⚠️ Importante</div>
            <div style={{ color: '#5a4a20', fontSize: '12px', lineHeight: '1.6' }}>Esta guía es informativa. Para casos específicos o dudas legales, consulte siempre con un abogado titulado. Los costos y requisitos pueden variar según el municipio y la fecha.</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={handlePrint} style={{ padding: '10px 24px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
            🖨️ Imprimir guía
          </button>
          <button onClick={onClose} style={{ padding: '10px 24px', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedMinuta, setSelectedMinuta] = useState(null)
  const [minutaDetail, setMinutaDetail] = useState(null)
  const [formData, setFormData] = useState({})
  const [previewHTML, setPreviewHTML] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingWord, setLoadingWord] = useState(false)
  const [showPasos, setShowPasos] = useState(false)

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
    setShowPasos(false)
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
      body: JSON.stringify({ template: minutaDetail.template, title: minutaDetail.title, data: formData })
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
        body: JSON.stringify({ template: minutaDetail.template, title: minutaDetail.title, data: formData })
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${minutaDetail.title}.docx`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      alert('Error al generar el documento Word.')
    }
    setLoadingWord(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#f0f4f8', fontFamily: 'Georgia, serif' }}>

      {showPasos && <PanelPasos minutaId={minutaDetail?.id} onClose={() => setShowPasos(false)} />}

      <header style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #2c5282 100%)', borderBottom: '3px solid #b8962e', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', flexShrink: 0, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '28px' }}>⚖️</div>
          <div>
            <div style={{ color: '#e2b94a', fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px' }}>LEXDOC</div>
            <div style={{ color: '#a0bcd8', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>Generador de Minutas Legales · Colombia</div>
          </div>
        </div>
        <div style={{ color: '#a0bcd8', fontSize: '13px', letterSpacing: '1px' }}>
          {categories.reduce((acc, cat) => acc + cat.minutas.length, 0)} minutas disponibles
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside style={{ width: '300px', background: '#1e3a5c', borderRight: '1px solid #2c5282', overflowY: 'auto', overflowX: 'hidden', flexShrink: 0 }}>
          <div style={{ padding: '20px' }}>
            <div style={{ color: '#e2b94a', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px', borderBottom: '1px solid #2c5282', paddingBottom: '8px' }}>
              Categorías de Minutas
            </div>
            {categories.length === 0 && <p style={{ fontSize: '13px', color: '#6b8caa' }}>No hay minutas cargadas aún.</p>}
            {categories.map(cat => (
              <div key={cat.id} style={{ marginBottom: '8px' }}>
                <div onClick={() => setSelectedCategory(selectedCategory?.id === cat.id ? null : cat)}
                  style={{ cursor: 'pointer', padding: '10px 14px', background: selectedCategory?.id === cat.id ? '#2c5282' : '#162d4a', border: `1px solid ${selectedCategory?.id === cat.id ? '#e2b94a' : '#2c5282'}`, borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', color: selectedCategory?.id === cat.id ? '#e2b94a' : '#90b4d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <span>📂 {cat.name}</span>
                  <span style={{ fontSize: '11px', background: '#e2b94a22', color: '#e2b94a', padding: '2px 8px', borderRadius: '10px' }}>{cat.minutas.length}</span>
                </div>
                {selectedCategory?.id === cat.id && (
                  <div style={{ marginLeft: '8px', borderLeft: '2px solid #e2b94a55', paddingLeft: '8px', marginTop: '4px' }}>
                    {cat.minutas.map(m => (
                      <div key={m.id} onClick={() => handleSelectMinuta(m)}
                        style={{ cursor: 'pointer', padding: '8px 10px', background: selectedMinuta?.id === m.id ? '#2c5282' : 'transparent', borderRadius: '4px', fontSize: '12px', color: selectedMinuta?.id === m.id ? '#e2b94a' : '#90b4d0', marginBottom: '2px', lineHeight: '1.4', borderLeft: selectedMinuta?.id === m.id ? '2px solid #e2b94a' : '2px solid transparent' }}>
                        {m.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <main style={{ flex: 1, overflowY: 'auto', background: '#f0f4f8' }}>
          {!minutaDetail && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚖️</div>
              <h1 style={{ color: '#1a3a5c', fontSize: '32px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '12px', textAlign: 'center' }}>LEXDOC</h1>
              <p style={{ color: '#5a7a9a', fontSize: '16px', marginBottom: '40px', textAlign: 'center' }}>Generador Profesional de Minutas Legales para Colombia</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '640px', width: '100%' }}>
                {[
                  { icon: '📋', text: 'Selecciona una categoría del panel izquierdo' },
                  { icon: '✍️', text: 'Completa el formulario con los datos requeridos' },
                  { icon: '📄', text: 'Descarga tu documento en Word o imprime en PDF' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #c8d8e8', borderTop: '3px solid #b8962e', borderRadius: '8px', padding: '24px 16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.icon}</div>
                    <div style={{ color: '#4a6a8a', fontSize: '13px', lineHeight: '1.5' }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {minutaDetail && (
            <div style={{ padding: '28px 36px' }}>
              <div style={{ background: '#fff', border: '1px solid #c8d8e8', borderLeft: '5px solid #b8962e', borderRadius: '8px', padding: '18px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ color: '#b8962e', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Documento Legal</div>
                <h1 style={{ color: '#1a3a5c', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{minutaDetail.title}</h1>
                <div style={{ color: '#7a9ab5', fontSize: '12px', marginTop: '6px' }}>
                  {minutaDetail.fields.length} campos requeridos · Pasa el mouse sobre el ícono <span style={{ background: '#b8962e', color: '#fff', borderRadius: '50%', padding: '0 4px', fontSize: '10px', fontWeight: 'bold' }}>?</span> para ver instrucciones
                </div>
              </div>

              <div style={{ background: '#fff', border: '1px solid #c8d8e8', borderRadius: '8px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ color: '#1a3a5c', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px', borderBottom: '2px solid #e2b94a', paddingBottom: '10px' }}>
                  Datos del Documento
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {minutaDetail.fields.map(field => (
                    <TooltipField key={field.name} field={field} onChange={handleChange} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={handlePreview} disabled={loading} style={{ padding: '12px 28px', background: loading ? '#a0b4c8' : '#1a3a5c', color: '#fff', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                  {loading ? 'GENERANDO...' : '👁️ PREVISUALIZAR'}
                </button>
                {previewHTML && (
                  <>
                    <button onClick={handlePrint} style={{ padding: '12px 28px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                      🖨️ IMPRIMIR / PDF
                    </button>
                    <button onClick={handleDownloadWord} disabled={loadingWord} style={{ padding: '12px 28px', background: '#1565c0', color: '#fff', border: 'none', borderRadius: '6px', cursor: loadingWord ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                      {loadingWord ? 'GENERANDO...' : '📄 DESCARGAR WORD'}
                    </button>
                    <button onClick={() => setShowPasos(true)} style={{ padding: '12px 28px', background: '#b8962e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                      📋 ¿QUÉ HAGO AHORA?
                    </button>
                  </>
                )}
              </div>

              {previewHTML && (
                <div style={{ background: '#fff', border: '1px solid #c8d8e8', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ padding: '12px 20px', borderBottom: '2px solid #e2b94a', background: '#1a3a5c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e2b94a' }}></div>
                    <span style={{ color: '#a0bcd8', fontSize: '12px', letterSpacing: '1px' }}>VISTA PREVIA DEL DOCUMENTO</span>
                  </div>
                  <iframe id="preview-iframe" srcDoc={previewHTML} style={{ width: '100%', height: '850px', border: 'none' }} title="Vista previa del documento" />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App