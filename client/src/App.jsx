import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './App.css'
 
// BADGE TIPO TRÁMITE -
function getBadgeTramite(tipo) {
  if (tipo === 'Notarial') return {
    label: '🏛️ TRÁMITE NOTARIAL',
    bg: 'linear-gradient(135deg, #1a3a5c, #0d2240)',
    border: '#e2b94a', color: '#e2b94a', dot: '#e2b94a',
    shadow: '0 2px 0 #061528, 0 4px 10px rgba(0,0,0,0.3)',
    tooltip: 'Este documento debe otorgarse ante Notario mediante Escritura Pública o autenticación de firmas.'
  }
  if (tipo === 'Privado') return {
    label: '📄 DOCUMENTO PRIVADO',
    bg: 'linear-gradient(135deg, #0d3018, #0a2010)',
    border: '#4caf50', color: '#6fcf7a', dot: '#4caf50',
    shadow: '0 2px 0 #061508, 0 4px 10px rgba(0,0,0,0.3)',
    tooltip: 'Este documento se firma entre las partes. Se recomienda autenticar firmas ante Notario.'
  }
  return {
    label: '⚖️ DOCUMENTO LEGAL',
    bg: 'linear-gradient(135deg, #2a1a4a, #1a0d30)',
    border: '#9c6fe0', color: '#c4a0f0', dot: '#9c6fe0',
    shadow: '0 2px 0 #100820, 0 4px 10px rgba(0,0,0,0.3)',
    tooltip: 'Documento legal.'
  }
}
// 

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
  plazo_anos: 'Escribe el número de años. Ejemplo: 2.',
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
  tipo_explotacion: 'Escribe el tipo de uso permitido para el bien. Ejemplo: arrendamiento, agrícola, comercial.',
  nombre_propietario: 'Escribe el nombre completo del propietario del inmueble tal como aparece en su cédula.',
  ciudad_propietario: 'Escribe la ciudad o municipio donde vive el propietario. Ejemplo: Cali, El Cerrito.',
  cedula_propietario: 'Escribe el número de cédula del propietario. Solo los números.',
  expedicion_cedula_propietario: 'Escribe la ciudad donde fue expedida la cédula del propietario. Ejemplo: Cali, El Cerrito.',
  nombre_usufructuario: 'Escribe el nombre completo de la persona que va a usar y disfrutar el bien.',
  ciudad_usufructuario: 'Escribe la ciudad o municipio donde vive el usufructuario. Ejemplo: Cali, El Cerrito.',
  cedula_usufructuario: 'Escribe el número de cédula del usufructuario. Solo los números.',
  expedicion_cedula_usufructuario: 'Escribe la ciudad donde fue expedida la cédula del usufructuario. Ejemplo: Cali, El Cerrito.',
  descripcion_inmueble: 'Describe el inmueble detalladamente. Ejemplo: casa de dos pisos, área de 120 metros cuadrados, registro catastral 762480002000000020546, matrícula inmobiliaria 370-123456.',
  uso_inmueble: 'Escribe para qué se va a usar el inmueble. Ejemplo: vivienda familiar, uso comercial, actividad agrícola.',
  plazo_maximo: 'Escribe el plazo máximo en años que puede durar el usufructo. Ejemplo: 10.',
  facultades_adicionales: 'Escribe qué otras cosas puede hacer el usufructuario con el bien. Ejemplo: arrendar el inmueble con autorización previa y escrita del propietario.',
  nombre_comodante: 'Escribe el nombre completo de la persona que presta los bienes gratuitamente, tal como aparece en su cédula.',
  nombre_comodatario: 'Escribe el nombre completo de la persona que recibe los bienes en préstamo, tal como aparece en su cédula.',
  descripcion_bienes: 'Describe detalladamente cada bien prestado. Ejemplo: un computador portátil marca Dell modelo Inspiron, serial ABC123, color negro.',
  direccion_bienes: 'Escribe la dirección exacta donde deben permanecer los bienes durante el contrato. Ejemplo: Calle 4 Sur # 2A-56.',
  ciudad_bienes: 'Escribe la ciudad donde deben permanecer los bienes. Ejemplo: El Cerrito, Cali, Bogotá.',
  fines_uso: 'Escribe para qué puede usar los bienes el comodatario. Ejemplo: uso exclusivo en actividades académicas y de investigación.',
  obligaciones_comodatario: 'Describe las obligaciones del comodatario. Ejemplo: cuidar y mantener los bienes en buen estado, responder por daños o pérdidas, asegurar los bienes y restituirlos al terminar el contrato.',
  duracion: 'Escribe cuánto tiempo dura el contrato. Ejemplo: 6 meses, 1 año, 30 días.',
  ciudad_firma: 'Escriba el nombre de la ciudad o municipio donde se va a firmar el contrato. Ej: Cali, Bogotá, Medellín.',
  dia_firma: 'Escriba el día en número en que se firma el contrato. Ej: 22.',
  mes_firma: 'Escriba el mes en letras en que se firma el contrato. Ej: abril.',
  año_firma: 'Escriba el año en que se firma el contrato. Ej: 2026.',
  vecino_vendedor: 'Escriba la ciudad donde reside el vendedor actualmente.',
  expedida_vendedor: 'Escriba la ciudad donde fue expedida la cédula del vendedor.',
  vecino_comprador: 'Escriba la ciudad donde reside el comprador actualmente.',
  expedida_comprador: 'Escriba la ciudad donde fue expedida la cédula del comprador.',
  ubicacion_inmueble: 'Escriba la dirección completa del inmueble. Ej: Calle 15 # 8-42, barrio El Peñón.',
  ciudad_inmueble: 'Escriba la ciudad donde está ubicado el inmueble.',
  linderos: 'Describa los límites del inmueble por los cuatro puntos cardinales. Ej: Norte: con la calle 15; Sur: con el predio de Juan García.',
  vendedor_anterior: 'Escriba el nombre completo de la persona que le vendió el inmueble al vendedor actual.',
  numero_escritura_anterior: 'Escriba solo el número de la escritura pública con la que el vendedor adquirió el inmueble. Ej: 1245.',
  notaria_anterior: 'Escriba el nombre de la notaría sin escribir la palabra notaría. Ej: Primera, Única, Segunda.',
  circulo_anterior: 'Escriba solo la ciudad del círculo notarial donde se otorgó la escritura anterior. Ej: Cali.',
  dia_escritura_anterior: 'Escriba el día en número en que fue otorgada la escritura anterior. Ej: 10.',
  mes_escritura_anterior: 'Escriba el mes en letras de la escritura anterior. Ej: marzo.',
  año_escritura_anterior: 'Escriba el año de la escritura anterior. Ej: 2018.',
  ciudad_registro: 'Escriba la ciudad de la oficina de registro de instrumentos públicos donde está inscrito el inmueble.',
  dia_registro: 'Escriba el día en número en que fue inscrito el inmueble en registro. Ej: 15.',
  mes_registro: 'Escriba el mes en letras en que fue inscrito el inmueble. Ej: abril.',
  año_registro: 'Escriba el año en que fue inscrito el inmueble. Ej: 2018.',
  precio_compraventa: 'Escriba el precio total en letras y en números. Ej: ciento veinte millones de pesos ($120.000.000).',
  plazo_retroventa: 'Escriba el plazo máximo en que el vendedor puede ejercer la retroventa. Ej: dos (2) años, seis (6) meses.',
  precio_retroventa: 'Escriba el precio que deberá pagar el vendedor para recuperar el inmueble. Ej: ciento veinte millones de pesos ($120.000.000).',
  plazo_aviso: 'Escriba el tiempo mínimo de aviso previo que debe dar el vendedor antes de ejercer la retroventa. Ej: treinta (30) días.',
  nombre_fallecido: 'Escriba el nombre completo de la persona fallecida cuya herencia se está cediendo.',
  dia_fallecido: 'Escriba el día en número en que falleció el causante. Ej: 15.',
  mes_fallecido: 'Escriba el mes en letras en que falleció el causante. Ej: enero.',
  año_fallecido: 'Escriba el año en que falleció el causante. Ej: 2024.',
  juzgado: 'Escriba el nombre del juzgado donde está en trámite el proceso de sucesión. Ej: Primero Civil del Circuito.',
  ciudad_juzgado: 'Escriba la ciudad donde está ubicado el juzgado.',
  condicion_vendedor: 'Escriba la relación del vendedor con el fallecido. Ej: hijo, hija, cónyuge, hermano, sobrino.',
  descripcion_bienes: 'Describa cada inmueble de la sucesión con su ubicación, linderos y número de matrícula inmobiliaria.',
  precio_cesion: 'Escriba el precio acordado por la cesión en letras y números. Ej: cincuenta millones de pesos ($50.000.000).',
  nombre_fundacion: 'Escriba el nombre completo de la fundación tal como quedará registrado legalmente. Ej: Fundación Semillas de Esperanza.',
  municipio_domicilio: 'Escriba el municipio donde tendrá su sede principal la fundación. Ej: El Cerrito, Cali, Bogotá.',
  departamento_domicilio: 'Escriba el departamento donde está ubicado el municipio sede. Ej: Valle del Cauca, Antioquia.',
  objeto_fundacion: 'Describa detalladamente las actividades que realizará la fundación. Ej: promover la educación de niños en situación de vulnerabilidad mediante programas de becas y talleres formativos.',
  bienes_iniciales: 'Describa cada bien o suma que conforman el patrimonio inicial y quién lo aporta. Ej: A. La suma de cinco millones de pesos ($5.000.000) aportada por Carlos Pérez. B. Un computador portátil marca Dell aportado por María García.',
  ciudad_asamblea: 'Escriba la ciudad donde se realizarán las asambleas ordinarias de la fundación.',
  dias_reunion_ordinaria: 'Escriba los primeros días del mes en que se realizará la reunión ordinaria. Ej: diez (10).',
  mes_reunion_ordinaria: 'Escriba el mes del año en que se realizará la reunión ordinaria anual. Ej: marzo, febrero.',
  num_miembros_consejo: 'Escriba el número de miembros del consejo de administración. Ej: cinco (5), tres (3).',
  periodo_consejo: 'Escriba el período de duración del consejo de administración. Ej: dos (2) años, un (1) año.',
  cuantia_contratos: 'Escriba el valor máximo de contratos que el director puede celebrar sin autorización del consejo. Ej: cinco millones de pesos ($5.000.000).',
  porcentaje_disolucion: 'Escriba el porcentaje de votos requerido para disolver la fundación. Ej: setenta (70), cien (100).',
  revisor_fiscal: 'Escriba el nombre completo del revisor fiscal principal.',
  suplente_revisor: 'Escriba el nombre completo del suplente del revisor fiscal.',
  secretario: 'Escriba el nombre completo de la persona designada como secretario.',
  nominador_secretario: 'Escriba quién nombra al secretario. Ej: la asamblea de fundadores, el consejo de administración.',
  director_principal: 'Escriba el nombre completo de la persona designada como director principal.',
  director_suplente: 'Escriba el nombre completo del suplente del director.',
  miembros_consejo_principales: 'Escriba los nombres completos de los miembros principales del consejo, separados por punto y coma. Ej: Carlos Pérez Ríos; María García López; Luis Torres Mora.',
  miembros_consejo_suplentes: 'Escriba los nombres completos de los miembros suplentes del consejo, separados por punto y coma. Ej: Ana Gómez Ruiz; Pedro Salcedo Vera; Rosa Martínez Gil.',
  // Minuta 14 — Contrato de construcción sin suministro de materiales
  nombre_contratante: 'Escriba el nombre completo de la persona que encarga y paga la obra (el dueño del proyecto).',
  nombre_contratista: 'Escriba el nombre completo de la persona que dirigirá y ejecutará la construcción.',
  ciudad_domicilio: 'Escriba la ciudad donde viven ambas partes. Si viven en ciudades diferentes escriba las dos. Ej: Cali y El Cerrito.',
  cedula_contratante: 'Escriba el número de cédula del contratante. Solo los números.',
  cedula_contratista: 'Escriba el número de cédula del contratista. Solo los números.',
  expedicion_contratante: 'Escriba la ciudad donde fue expedida la cédula del contratante. Ej: Cali, El Cerrito.',
  expedicion_contratista: 'Escriba la ciudad donde fue expedida la cédula del contratista. Ej: Cali, El Cerrito.',
  descripcion_obra: 'Describa qué se va a construir. Ej: una casa de dos pisos con tres habitaciones, dos baños, sala, comedor y cocina.',
  descripcion_lote: 'Describa el lote donde se construirá. Incluya área y matrícula inmobiliaria si la tiene. Ej: lote de 200 metros cuadrados, matrícula inmobiliaria 370-123456.',
  ubicacion_lote: 'Escriba la dirección o ubicación exacta del lote. Ej: Calle 4 Sur # 2A-56, Barrio Villa del Carmen.',
  ciudad_obra: 'Escriba la ciudad donde está ubicado el lote de construcción.',
  nombre_arquitecto: 'Escriba el nombre completo del arquitecto que elaboró el plano de la obra.',
  plazo_obra: 'Escriba el tiempo acordado para terminar la obra. Ej: seis (6) meses, doce (12) semanas, noventa (90) días.',
  porcentaje_honorarios: 'Escriba el porcentaje de honorarios del contratista sobre el costo total de la obra. Solo el número. Ej: quince (15).',
  costo_obra_letras: 'Escriba el costo total estimado de la obra en letras. Ej: cincuenta millones de pesos.',
  costo_obra_numeros: 'Escriba el costo total estimado de la obra en números. Ej: $50.000.000.',
  honorarios_letras: 'Escriba el total de honorarios del contratista en letras. Es el porcentaje aplicado al costo total. Ej: siete millones quinientos mil pesos.',
  honorarios_numeros: 'Escriba el total de honorarios en números. Ej: $7.500.000.',
  anticipo_letras: 'Escriba el valor del anticipo que se entrega al firmar el contrato, en letras. Ej: un millón quinientos mil pesos.',
  anticipo_numeros: 'Escriba el valor del anticipo en números. Ej: $1.500.000.',
  porcentaje_anticipo: 'Escriba el porcentaje del anticipo sobre el total de honorarios. Solo el número. Ej: veinte (20).',
  forma_pago_saldo: 'Describa cómo se pagará el saldo después del anticipo. Ej: pagos semanales de $500.000 / pagos quincenales de $1.000.000 / pagos mensuales de $2.000.000 / pagos por etapas según avance de obra.',
  dia_pago: 'Escriba el día exacto en que se realizarán los pagos. Ej: todos los viernes / los días 15 y 30 de cada mes / el último día hábil de cada mes.',
  condicion_pago: 'Escriba si hay alguna condición para hacer el pago. Ej: sin condición adicional / previa presentación de informe de avance semanal / previa firma de acta de recibo parcial de obra.',
  porcentaje_retencion: 'Escriba el porcentaje que se retendrá del último pago como garantía de buena ejecución. Solo el número. Ej: diez (10).',
  plazo_retencion: 'Escriba cuántos días después de entregar la obra se libera la retención de garantía. Ej: treinta (30), sesenta (60).',
  sucesor_contratista: 'Escriba quién continuará la obra si el contratista fallece o queda incapacitado. Ej: la persona que el contratista designe mediante escrito / el profesional que acuerden las partes de común acuerdo.',
  penalizacion_letras: 'Escriba el valor de la multa por incumplimiento de plazos, en letras. Ej: doscientos mil pesos, quinientos mil pesos.',
  penalizacion_numeros: 'Escriba el valor de la multa en números. Ej: $200.000, $500.000.',
  unidad_penalizacion: 'Escriba cada cuánto tiempo o por qué hecho se cobra la penalización. Ej: día de retraso / semana de retraso / incumplimiento injustificado.',
  mecanismo_divergencias: 'Escriba cómo se resolverán las diferencias entre las partes. Ej: mediación ante la Cámara de Comercio de la ciudad / amigable composición / decisión de un árbitro designado por las partes / juez ordinario competente.',
  ciudad_jurisdiccion: 'Escriba la ciudad cuyos jueces serán competentes para resolver conflictos. Ej: Cali, El Cerrito, Bogotá.',
  num_ejemplares: 'Escriba en cuántos ejemplares se firma el contrato. Ej: dos (2), tres (3).',
  // Minuta 15 — Contrato de construcción con suministro de materiales
  ubicacion_terreno: 'Escriba la dirección completa del terreno donde se construirá. Ej: Carrera 8 # 12-34, Barrio Los Pinos, El Cerrito.',
  suministrador_materiales: 'Escriba quién suministra los materiales. Ej: el contratista / el contratante / ambas partes según pliego de condiciones.',
  precio_total_letras: 'Escriba el precio total de la obra en letras. Ej: ochenta millones de pesos.',
  precio_total_numeros: 'Escriba el precio total de la obra en números. Ej: $80.000.000.',
  porcentaje_anticipo: 'Escriba el porcentaje del anticipo inicial para acopio de materiales. Solo el número en letras. Ej: treinta (30).',
  porcentaje_pago_b: 'Escriba el porcentaje del segundo pago. Solo el número en letras. Ej: veinte (20).',
  condicion_pago_b: 'Escriba cuándo se hace el segundo pago. Ej: al terminar la cimentación / a los treinta días de iniciada la obra / al completar la estructura.',
  porcentaje_pago_c: 'Escriba el porcentaje del tercer pago. Solo el número en letras. Ej: veinte (20).',
  condicion_pago_c: 'Escriba cuándo se hace el tercer pago. Ej: al terminar muros y cubierta / a los sesenta días de iniciada la obra / al completar acabados.',
  porcentaje_saldo: 'Escriba el porcentaje del pago final al recibir la obra terminada. Solo el número en letras. Ej: treinta (30).',
  porcentaje_retencion: 'Escriba el porcentaje de retención de garantía sobre cada pago. Solo el número en letras. Ej: diez (10).',
  meses_retencion: 'Escriba cuántos meses después de entregar la obra se devuelve la retención. Ej: seis (6), doce (12).',
  plazo_inicio: 'Escriba el plazo para iniciar la obra desde la firma. Ej: diez (10) días, quince (15) días hábiles.',
  plazo_entrega: 'Escriba el plazo total para entregar la obra terminada. Ej: seis (6) meses, ciento ochenta (180) días.',
  multa_letras: 'Escriba el valor de la multa por retraso en letras. Ej: doscientos mil pesos, quinientos mil pesos.',
  multa_numeros: 'Escriba el valor de la multa por retraso en números. Ej: $200.000, $500.000.',
  unidad_multa: 'Escriba la unidad de tiempo de la multa. Ej: día / semana.',
  dias_rescision: 'Escriba los días adicionales de retraso que permiten rescindir el contrato. Ej: treinta (30) días, quince (15) días.',
  domicilio_contratante: 'Escriba la dirección completa del contratante para notificaciones legales. Ej: Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito.',
  domicilio_contratista: 'Escriba la dirección completa del contratista para notificaciones legales. Ej: Carrera 8 # 12-34, Barrio Los Pinos, El Cerrito.',
  ciudad_jurisdiccion: 'Escriba la ciudad cuyos jueces serán competentes para resolver conflictos. Ej: Cali, El Cerrito, Bogotá.',
  // Minuta 16 — Contrato de depósito
  nombre_depositante: 'Escriba el nombre completo de la persona que entrega los bienes para su custodia, tal como aparece en su cédula.',
  nombre_depositario: 'Escriba el nombre completo de la persona que recibirá y guardará los bienes, tal como aparece en su cédula.',
  descripcion_bienes: 'Describa detalladamente cada bien entregado en depósito. Incluya marca, modelo, serial y color si aplica. Ej: un televisor Samsung 55 pulgadas serial ABC123, color negro; una nevera LG 350 litros serial XYZ456, color gris.',
  direccion_custodia: 'Escriba la dirección exacta donde permanecerán los bienes durante el depósito. Ej: Calle 4 Sur # 2A-56, Barrio Villa del Carmen.',
  ciudad_custodia: 'Escriba la ciudad donde permanecerán los bienes. Ej: El Cerrito, Cali, Bogotá.',
  remuneracion_letras: 'Escriba el valor que recibirá el depositario por sus servicios de custodia, en letras. Ej: cincuenta mil pesos, doscientos mil pesos.',
  remuneracion_numeros: 'Escriba ese valor en números. Ej: $50.000, $200.000.',
  periodicidad_pago: 'Escriba cada cuánto se pagará esa remuneración. Ej: mensuales / anuales / diarios / por el término total del contrato.',
  // Minuta 17 — Cesión o venta de derechos litigiosos
  nombre_cedente: 'Escriba el nombre completo de la persona que vende o cede el derecho litigioso, tal como aparece en su cédula.',
  nombre_cesionario: 'Escriba el nombre completo de la persona que compra el derecho litigioso, tal como aparece en su cédula.',
  tipo_proceso: 'Escriba el tipo de proceso judicial. Ej: ordinario civil / de sucesión / ejecutivo / laboral.',
  demandante: 'Escriba el nombre completo de quien demanda en el proceso judicial.',
  demandado: 'Escriba el nombre completo de quien es demandado en el proceso judicial.',
  juzgado: 'Escriba el nombre del juzgado donde se tramita el proceso. Ej: Primero Civil del Circuito / Segundo Civil Municipal / Primero Laboral.',
  dia_notificacion: 'Escriba el día en número en que fue notificada la demanda. Ej: 15.',
  mes_notificacion: 'Escriba el mes en letras en que fue notificada la demanda. Ej: enero, marzo.',
  anio_notificacion: 'Escriba el año en que fue notificada la demanda. Ej: 2023.',
  precio_letras: 'Escriba el precio de la cesión en letras. Ej: cinco millones de pesos.',
  precio_numeros: 'Escriba el precio de la cesión en números. Ej: $5.000.000.',
  forma_pago: 'Describa cómo pagará el cesionario. Ej: de contado al momento de firmar / el 50% hoy y el 50% en treinta días / en tres cuotas mensuales iguales.',
  // Minuta 18 — Arrendamiento de vivienda urbana
  nombre_arrendatario1: 'Escriba el nombre completo del arrendatario principal, tal como aparece en su cédula.',
  nombre_arrendatario2_texto: 'Si hay un segundo arrendatario escriba su nombre precedido de " y". Ej: " y María García López". Si no hay segundo arrendatario escriba: no aplica.',
  ciudad_arrendatarios: 'Escriba la ciudad donde viven los arrendatarios. Ej: El Cerrito, Cali.',
  cedula_arrendatario1: 'Escriba el número de cédula del arrendatario principal. Solo los números.',
  cedula_arrendatario2_texto: 'Si hay segundo arrendatario escriba su cédula precedida de " y". Ej: " y 1098765432". Si no aplica escriba: no aplica.',
  nombre_arrendador: 'Escriba el nombre completo del arrendador (dueño del inmueble), tal como aparece en su cédula.',
  cedula_arrendador: 'Escriba el número de cédula del arrendador. Solo los números.',
  expedicion_arrendador: 'Escriba la ciudad donde fue expedida la cédula del arrendador. Ej: Cali, El Cerrito.',
  numero_inmueble: 'Escriba el número de nomenclatura del inmueble. Ej: 2A-56 / apartamento 301 / casa 12.',
  ciudad_inmueble: 'Escriba la ciudad donde está ubicado el inmueble arrendado.',
  linderos_inmueble: 'Describa los linderos del inmueble por los cuatro puntos cardinales. Ej: Norte: con la calle 4; Sur: con el predio de Juan García; Oriente: con la carrera 8; Occidente: con el predio de María Torres.',
  duracion_meses: 'Escriba la duración del contrato en meses en letras y números. Ej: doce (12), seis (6).',
  mes_inicio: 'Escriba el mes de inicio del contrato. Ej: mayo, enero.',
  anio_inicio: 'Escriba el año de inicio del contrato. Ej: 2026.',
  periodo_prorroga: 'Escriba el período de prórroga automática si ninguna parte avisa. Ej: un (1) año / seis (6) meses / el mismo término inicial.',
  canon_letras: 'Escriba el valor del canon mensual en letras. Ej: un millón doscientos mil pesos.',
  canon_numeros: 'Escriba el valor del canon mensual en números. Ej: $1.200.000.',
  lugar_pago: 'Escriba dónde o cómo se paga el canon. Ej: la oficina del arrendador ubicada en Calle 4 # 2-50 / cuenta Bancolombia No. 123456789 / a orden del arrendador.',
  pago_energia: 'Escriba quién paga la energía eléctrica. Ej: el arrendatario / el arrendador.',
  pago_gas: 'Escriba quién paga el gas. Ej: el arrendatario / el arrendador / no aplica si no hay gas.',
  pago_agua: 'Escriba quién paga agua y aseo. Ej: el arrendatario / el arrendador.',
  pago_telefono: 'Escriba quién paga teléfono e internet. Ej: el arrendatario / el arrendador / no aplica.',
  porcentaje_reajuste: 'Escriba el porcentaje de reajuste anual del canon. El máximo legal es el 100% del IPC del año anterior. Escriba: cien (100). Si acuerdan menos escriba el porcentaje acordado.',
  direccion_notificacion_arrendador: 'Escriba la dirección completa del arrendador para recibir notificaciones judiciales. Ej: Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito.',
  direccion_notificacion_arrendatario: 'Escriba la dirección del arrendatario para notificaciones. Normalmente es la misma del inmueble arrendado.',
  // Minuta 19 — Arrendamiento de inmueble con muebles
  nombre_arrendador: 'Escriba el nombre completo del arrendador (dueño del inmueble y los muebles), tal como aparece en su cédula.',
  cedula_arrendador: 'Escriba el número de cédula del arrendador. Solo los números.',
  expedicion_arrendador: 'Escriba la ciudad donde fue expedida la cédula del arrendador. Ej: Cali, El Cerrito.',
  nombre_arrendatario: 'Escriba el nombre completo del arrendatario, tal como aparece en su cédula.',
  cedula_arrendatario: 'Escriba el número de cédula del arrendatario. Solo los números.',
  expedicion_arrendatario: 'Escriba la ciudad donde fue expedida la cédula del arrendatario. Ej: Cali, El Cerrito.',
  ubicacion_inmueble: 'Escriba la dirección completa del inmueble con muebles. Ej: Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito.',
  comodidades_inmueble: 'Describa las comodidades del inmueble. Ej: sala, comedor, tres habitaciones, dos baños, cocina integral, garaje y patio.',
  destinacion_inmueble: 'Escriba el uso permitido del inmueble. Ej: vivienda familiar / uso turístico y de hospedaje / uso comercial.',
  canon_letras: 'Escriba el valor del canon mensual en letras. Ej: un millón quinientos mil pesos.',
  canon_numeros: 'Escriba el valor del canon mensual en números. Ej: $1.500.000.',
  dia_pago_inicio: 'Escriba el día inicial del período de pago. Ej: 1.',
  dia_pago_fin: 'Escriba el día final del período de pago. Ej: 5.',
  lugar_pago: 'Escriba dónde o cómo se paga el canon. Ej: la oficina del arrendador / cuenta Bancolombia No. 123456789 / a orden del arrendador.',
  duracion: 'Escriba la duración del contrato. Ej: seis (6) meses / doce (12) meses / noventa (90) días.',
  fecha_inicio: 'Escriba la fecha de inicio del contrato. Ej: el 1 de mayo de 2026.',
  multa_diaria_letras: 'Escriba la multa diaria por no restituir el inmueble al vencer, en letras. Ej: cien mil pesos, doscientos mil pesos.',
  multa_diaria_numeros: 'Escriba la multa diaria en números. Ej: $100.000, $200.000.',
  clausula_penal_letras: 'Escriba el valor de la cláusula penal por incumplimiento general, en letras. Ej: dos millones de pesos.',
  clausula_penal_numeros: 'Escriba el valor de la cláusula penal en números. Ej: $2.000.000.',
  plazo_nueva_garantia: 'Escriba los días que tiene el arrendatario para presentar nuevo fiador si el actual falla. Ej: diez (10), quince (15).',
  forma_reajuste: 'Escriba cómo se reajusta el canon anualmente. Ej: anualmente conforme al IPC certificado por el DANE / en el porcentaje que acuerden las partes al inicio de cada período.',
  domicilio_arrendador: 'Escriba la dirección completa del arrendador para notificaciones judiciales. Ej: Carrera 8 # 12-34, Barrio Los Pinos, El Cerrito.',
  nombre_fiador: 'Escriba el nombre completo del fiador, quien garantiza el cumplimiento del arrendatario.',
  cedula_fiador: 'Escriba el número de cédula del fiador. Solo los números.',
  expedicion_fiador: 'Escriba la ciudad donde fue expedida la cédula del fiador. Ej: Cali, El Cerrito.',
  // Minuta 20 — Cesión de contrato de arrendamiento
  nombre_cedente: 'Escriba el nombre completo del cedente — es el antiguo dueño del inmueble que vende y cede el contrato de arrendamiento al nuevo propietario.',
  ciudad_cedente: 'Escriba la ciudad donde vive el cedente. Ej: El Cerrito, Cali.',
  cedula_cedente: 'Escriba el número de cédula del cedente. Solo los números.',
  expedicion_cedente: 'Escriba la ciudad donde fue expedida la cédula del cedente. Ej: Cali, El Cerrito.',
  nombre_cesionario: 'Escriba el nombre completo del cesionario — es el nuevo dueño del inmueble que compró el bien y recibe el contrato de arrendamiento.',
  ciudad_cesionario: 'Escriba la ciudad donde vive el cesionario. Ej: El Cerrito, Cali.',
  cedula_cesionario: 'Escriba el número de cédula del cesionario. Solo los números.',
  expedicion_cesionario: 'Escriba la ciudad donde fue expedida la cédula del cesionario. Ej: Cali, El Cerrito.',
  dia_contrato: 'Escriba el día en que se celebró el contrato de arrendamiento original. Solo el número. Ej: 15.',
  mes_contrato: 'Escriba el mes en que se celebró el contrato de arrendamiento original. Ej: enero, marzo.',
  anio_contrato: 'Escriba el año en que se celebró el contrato de arrendamiento original. Ej: 2024.',
  nombre_arrendatario: 'Escriba el nombre completo del arrendatario — la persona que ocupa el inmueble y paga el canon.',
  ubicacion_inmueble: 'Escriba la dirección completa del inmueble arrendado. Ej: Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito.',
  destinacion_inmueble: 'Escriba el uso al que está destinado el inmueble. Ej: vivienda familiar / uso comercial.',
  numero_escritura: 'Escriba solo el número de la escritura pública con la que el cesionario compró el inmueble. Ej: 1245.',
  fecha_escritura: 'Escriba la fecha completa de esa escritura de compraventa. Ej: 15 de marzo de 2026.',
  notaria: 'Escriba el nombre de la notaría sin escribir la palabra notaría. Ej: Única, Primera, Segunda.',
  circulo_notarial: 'Escriba la ciudad del círculo notarial donde se otorgó la escritura. Ej: El Cerrito, Cali.',
  ciudad_registro: 'Escriba la ciudad de la Oficina de Registro de Instrumentos Públicos donde está inscrito el inmueble.',
  fecha_registro: 'Escriba la fecha en que fue inscrita la escritura en el registro. Ej: 20 de marzo de 2026.',
  folio_matricula: 'Escriba el número del folio de matrícula inmobiliaria del inmueble. Ej: 370-123456.',
  // Minuta 21 — Notificación privada de cesión del contrato de arrendamiento
  ciudad_fecha: 'Escriba la ciudad y la fecha completa de la carta. Ej: El Cerrito, 21 de abril de 2026.',
  nombre_arrendatario: 'Escriba el nombre completo del arrendatario destinatario — quien ocupa el inmueble y recibirá esta notificación.',
  direccion_arrendatario: 'Escriba la dirección donde se envía la carta al arrendatario. Normalmente es la dirección del inmueble arrendado.',
  nombre_cesionario: 'Escriba el nombre completo del cesionario — el nuevo dueño del inmueble que firma esta carta notificando al arrendatario.',
  ciudad_cesionario: 'Escriba la ciudad donde vive el cesionario. Ej: El Cerrito, Cali.',
  cedula_cesionario: 'Escriba el número de cédula del cesionario. Solo los números.',
  expedicion_cesionario: 'Escriba la ciudad donde fue expedida la cédula del cesionario. Ej: Cali, El Cerrito.',
  numero_escritura: 'Escriba el número de la escritura pública de compraventa del inmueble. Solo el número. Ej: 1245.',
  notaria: 'Escriba el nombre de la notaría sin escribir la palabra notaría. Ej: Única, Primera, Segunda.',
  circulo_notarial: 'Escriba la ciudad del círculo notarial. Ej: El Cerrito, Cali.',
  fecha_escritura: 'Escriba la fecha completa de la escritura de compraventa. Ej: 15 de marzo de 2026.',
  nombre_vendedor: 'Escriba el nombre completo del vendedor — el antiguo dueño que vendió el inmueble y era el arrendador original.',
  ubicacion_inmueble: 'Escriba la dirección completa del inmueble arrendado. Ej: Calle 4 Sur # 2A-56, Barrio Villa del Carmen.',
  tipo_contrato: 'Escriba si el contrato de arrendamiento es verbal o escrito.',
  destinacion_inmueble: 'Escriba el uso al que está destinado el inmueble. Ej: vivienda urbana / uso comercial.',
  fecha_cesion: 'Escriba la fecha del documento de cesión del contrato. Ej: 20 de marzo de 2026.',
  datos_pago: 'Escriba la dirección o cuenta bancaria donde el arrendatario debe pagar el canon desde ahora. Ej: Carrera 8 # 12-34, El Cerrito / cuenta Bancolombia No. 123456789 a nombre de Carlos Pérez.',
  folio_matricula: 'Escriba el número del folio de matrícula inmobiliaria. Ej: 370-123456.',
  // Minuta 22 — Contrato de prestación de servicios profesionales
  nombre_contratista: 'Escriba el nombre completo del contratista — la persona que prestará el servicio profesional, tal como aparece en su cédula.',
  profesion_contratista: 'Escriba la profesión u oficio del contratista. Ej: abogado, contador público, ingeniero civil, médico, arquitecto, diseñador gráfico.',
  estado_civil_contratista: 'Escriba el estado civil del contratista. Ej: soltero, casado, divorciado, viudo.',
  identificacion_contratista: 'Escriba la identificación completa del contratista. Ej: cédula de ciudadanía No. 1234567890 expedida en Cali.',
  domicilio_contratista: 'Escriba la dirección completa del contratista. Ej: Carrera 8 # 12-34, Barrio Los Pinos, El Cerrito.',
  nombre_contratante: 'Escriba el nombre completo del contratante — la persona o empresa que contrata el servicio, tal como aparece en su documento de identidad.',
  estado_civil_contratante: 'Escriba el estado civil del contratante. Ej: soltero, casado, divorciado, viudo.',
  identificacion_contratante: 'Escriba la identificación completa del contratante. Ej: cédula de ciudadanía No. 0987654321 expedida en El Cerrito.',
  domicilio_contratante: 'Escriba la dirección completa del contratante. Ej: Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito.',
  objeto_contrato: 'Describa para qué se contratan los servicios. Ej: asesorar jurídicamente en el proceso de sucesión / elaborar la contabilidad mensual de la empresa / diseñar el plano arquitectónico de la vivienda / representar al cliente en proceso laboral.',
  tareas_especificas: 'Liste las tareas concretas que realizará el contratista. Ej: 1. Revisar y organizar documentos. 2. Elaborar la demanda. 3. Representar al cliente en audiencias. 4. Entregar informe de resultados.',
  honorarios_letras: 'Escriba el valor total de los honorarios en letras. Ej: tres millones de pesos, quinientos mil pesos.',
  honorarios_numeros: 'Escriba el valor total de los honorarios en números. Ej: $3.000.000, $500.000.',
  ciudad_pago: 'Escriba la ciudad donde se realizará el pago. Ej: El Cerrito, Cali.',
  horario_pago: 'Escriba el horario en que se realizará el pago. Ej: horario bancario / horario de oficina de lunes a viernes de 8am a 5pm / cualquier hora del día hábil.',
  forma_pago: 'Describa cómo y cuándo se pagará. Ej: 50% al firmar el contrato y 50% al entregar el trabajo terminado / pagos mensuales de $500.000 los días 5 de cada mes / pago único al finalizar el servicio.',
  garantia_pago: 'Escriba cómo se garantiza o instrumenta el pago. Ej: cheque posfechado a nombre del contratista / transferencia bancaria a cuenta Bancolombia No. 123456789 / pagaré firmado por el contratante / pago en efectivo contra recibo.',
  mecanismo_controversias: 'Escriba cómo se resolverán los conflictos entre las partes. Ej: mediación ante la Cámara de Comercio de la ciudad / amigable composición entre las partes / decisión del juez civil competente.',
  // Minuta 23 — Contrato de prestación de servicios profesionales de abogado
  nombre_mandante: 'Escriba el nombre o razón social de quien contrata al abogado. Si es empresa escriba el nombre completo. Si es persona natural escriba su nombre completo tal como aparece en la cédula.',
  descripcion_mandante: 'Describa al mandante. Si es empresa escriba: sociedad legalmente constituida. Si es persona natural escriba: persona natural mayor de edad.',
  ciudad_mandante: 'Escriba la ciudad donde tiene domicilio el mandante. Ej: El Cerrito, Cali, Bogotá.',
  nombre_representante: 'Escriba el nombre completo de quien firma por el mandante. Si es empresa, es el representante legal o gerente. Si es persona natural, es el mismo mandante.',
  ciudad_representante: 'Escriba la ciudad donde vive el representante del mandante. Ej: El Cerrito, Cali.',
  cargo_representante: 'Escriba el cargo de quien firma. Ej: Gerente General, Representante Legal, Presidente, propietario.',
  nombre_mandatario: 'Escriba el nombre completo del abogado que prestará los servicios, tal como aparece en su tarjeta profesional.',
  ciudad_mandatario: 'Escriba la ciudad donde vive el abogado. Ej: El Cerrito, Cali, Bogotá.',
  tarjeta_profesional: 'Escriba el número de tarjeta profesional del abogado. Lo encuentras en el carné del Consejo Superior de la Judicatura. Ej: 123456-A.',
  cedula_mandatario: 'Escriba el número de cédula del abogado. Solo los números.',
  expedicion_mandatario: 'Escriba la ciudad donde fue expedida la cédula del abogado. Ej: Cali, El Cerrito.',
  asuntos_encargados: 'Describa los asuntos jurídicos que el abogado manejará. Ej: representar al mandante en el proceso ejecutivo No. 2024-0123 ante el Juzgado Civil del Circuito / asesorar en la constitución de la sociedad / elaborar y revisar contratos comerciales.',
  honorarios_letras: 'Escriba el valor de los honorarios en letras. Ej: dos millones de pesos mensuales / cinco millones de pesos por la gestión total.',
  honorarios_numeros: 'Escriba el valor de los honorarios en números. Ej: $2.000.000 mensuales / $5.000.000.',
  forma_pago_honorarios: 'Describa cómo y cuándo se pagarán los honorarios. Ej: mensualmente dentro de los primeros cinco días de cada mes / el 50% al firmar y el 50% al concluir / en tres cuotas iguales mensuales de $500.000.',
  obligaciones_mandatario: 'Liste las obligaciones del abogado. Ej: obrar con diligencia en los asuntos encomendados, absolver las consultas del mandante, rendir informes periódicos del estado de los negocios, guardar reserva profesional sobre la información recibida, actuar conforme al Código Disciplinario del Abogado.',
  obligaciones_mandante: 'Liste las obligaciones del mandante. Ej: cancelar los honorarios en la forma pactada, suministrar al abogado toda la información y documentos que requiera, cubrir los gastos adicionales que la gestión conlleve como notificaciones, copias y desplazamientos.',
  plazo_aviso: 'Escriba el plazo de aviso para terminar el contrato anticipadamente. Ej: quince (15) días / treinta (30) días / un (1) mes.',
  // Minuta 24 — Poder General
  departamento: 'Escriba el nombre del departamento donde se otorga la escritura. Ej: Valle del Cauca, Antioquia, Cundinamarca.',
  notario: 'Escriba el nombre o número de la Notaría sin escribir la palabra Notaría. Ej: Única, Primera, Segunda, Tercera.',
  circulo: 'Escriba la ciudad del Círculo Notarial donde se otorga la escritura. Ej: El Cerrito, Cali, Bogotá.',
  nombre_poderdante: 'Escriba el nombre completo de la persona que otorga el poder, tal como aparece en su cédula de ciudadanía.',
  domicilio_poderdante: 'Escriba la ciudad donde vive y reside el poderdante. Ej: El Cerrito, Cali, Bogotá.',
  estado_civil_poderdante: 'Escriba el estado civil del poderdante. Opciones: soltero, casado, divorciado, viudo.',
  cedula_poderdante: 'Escriba el número de cédula del poderdante. Solo los números.',
  expedicion_poderdante: 'Escriba la ciudad donde fue expedida la cédula del poderdante. Ej: Cali, El Cerrito.',
  nombre_apoderado: 'Escriba el nombre completo de la persona que recibe el poder y actuará en nombre del poderdante.',
  domicilio_apoderado: 'Escriba la ciudad donde vive y reside el apoderado. Ej: El Cerrito, Cali, Bogotá.',
  cedula_apoderado: 'Escriba el número de cédula del apoderado. Solo los números.',
  expedicion_apoderado: 'Escriba la ciudad donde fue expedida la cédula del apoderado. Ej: Cali, El Cerrito.',
  facultades: 'Describa todas las facultades que se le otorgan al apoderado separadas por punto y coma. Ej: a) Administración: administrar todos los bienes muebles e inmuebles del poderdante y recaudar sus productos; b) Venta: vender los bienes inmuebles del poderdante; c) Cobros: cobrar y percibir judicial o extrajudicialmente los créditos adeudados al poderdante; d) Representación: representar al poderdante ante cualquier autoridad judicial o administrativa.',
  honorarios: 'Escriba cómo se remunerará al apoderado. Ej: el equivalente al diez por ciento (10%) del valor de cada negocio gestionado / la suma de quinientos mil pesos ($500.000) mensuales / sin remuneración, el presente mandato es gratuito.',
  // Minuta 25 — Poder Especial para Venta de Inmueble
  ciudad_poderdante: 'Escriba la ciudad donde vive y reside el poderdante. Ej: El Cerrito, Cali, Bogotá.',
  ciudad_apoderado: 'Escriba la ciudad donde vive y reside el apoderado. Ej: El Cerrito, Cali, Bogotá.',
  precio_letras: 'Escriba el precio de venta del inmueble en letras. Ej: ciento veinte millones de pesos.',
  precio_numeros: 'Escriba el precio de venta en números con puntos. Ej: 120.000.000.',
  descripcion_inmueble: 'Describa el tipo y ubicación del inmueble. Ej: una casa de habitación distinguida con el No. 2A-56 de la Calle 4 Sur, Barrio Villa del Carmen, ciudad de El Cerrito.',
  lindero_norte: 'Escriba el lindero norte con extensión en metros y con qué colinda. Ej: diez (10) metros con la Calle 4 Sur.',
  lindero_sur: 'Escriba el lindero sur con extensión en metros y con qué colinda. Ej: diez (10) metros con el predio de Roberto Salcedo Muñoz.',
  lindero_oriente: 'Escriba el lindero oriente con extensión en metros y con qué colinda. Ej: doce (12) metros con la Carrera 2A.',
  lindero_occidente: 'Escriba el lindero occidente con extensión en metros y con qué colinda. Ej: doce (12) metros con el predio de Patricia Londoño Vera.',
  matricula_inmobiliaria: 'Es el número que identifica el inmueble en el registro. Lo encuentra en el certificado de tradición y libertad expedido por la Oficina de Registro de Instrumentos Públicos. Ej: 370-123456.',
  // Minuta 28 — Contrato de Aparcería
  nombre_propietario: 'Escriba el nombre completo del propietario del predio rural, tal como aparece en su cédula.',
  cedula_propietario: 'Escriba el número de cédula del propietario. Solo los números.',
  expedicion_propietario: 'Escriba la ciudad donde fue expedida la cédula del propietario. Ej: El Cerrito, Cali.',
  domicilio_propietario: 'Escriba la ciudad donde vive el propietario. Ej: El Cerrito, Cali.',
  nombre_aparcero: 'Escriba el nombre completo del aparcero — la persona que va a cultivar y explotar el predio, tal como aparece en su cédula.',
  cedula_aparcero: 'Escriba el número de cédula del aparcero. Solo los números.',
  expedicion_aparcero: 'Escriba la ciudad donde fue expedida la cédula del aparcero. Ej: El Cerrito, Cali.',
  domicilio_aparcero: 'Escriba la ciudad donde vive el aparcero. Ej: El Cerrito, Cali.',
  hectareas: 'Escriba el número de hectáreas de la parcela en letras y números. Ej: cinco (5), diez (10), veinte (20).',
  municipio: 'Escriba el municipio donde está ubicada la parcela. Ej: El Cerrito, Palmira, Tuluá.',
  nombre_predio: 'Escriba el nombre con que se conoce el predio o finca. Ej: La Esperanza, El Paraíso, La Florida.',
  linderos_generales: 'Describa los linderos del predio completo por los cuatro puntos cardinales. Ej: Norte: con el río Cauca; Sur: con la finca La Palmera; Oriente: con la carretera panamericana; Occidente: con el predio de Roberto García.',
  linderos_especiales: 'Describa los linderos de la porción específica que se entrega al aparcero. Ej: Norte: con el camino interno de la finca; Sur: con el lote No. 2; Oriente: con el caño La Esperanza; Occidente: con el potrero principal.',
  dia_entrega: 'Escriba el día en que se entregará la parcela al aparcero. Solo el número. Ej: 1, 15.',
  mes_entrega: 'Escriba el mes de entrega de la parcela. Ej: mayo, junio.',
  anio_entrega: 'Escriba el año de entrega de la parcela. Ej: 2026.',
  gastos_explotacion_letras: 'Escriba en letras el valor mensual para gastos de explotación (semillas, abonos, herramientas). Ej: quinientos mil pesos, un millón de pesos.',
  gastos_explotacion_numeros: 'Escriba ese valor en números. Ej: 500.000, 1.000.000.',
  dias_anticipo: 'Escriba dentro de cuántos días del mes se pagará el anticipo al aparcero. Ej: cinco (5), diez (10).',
  anticipo_letras: 'Escriba en letras el valor del anticipo mensual al aparcero. Debe equivaler al salario mínimo por 30 días. Ej: un millón cuatrocientos mil pesos.',
  anticipo_numeros: 'Escriba ese valor en números. Ej: 1.400.000.',
  duracion_anos: 'Escriba la duración en años en letras y números. La ley exige mínimo 3 años. Ej: tres (3), cinco (5).',
  dia_inicio: 'Escriba el día de inicio del contrato. Solo el número. Ej: 1, 15.',
  mes_inicio: 'Escriba el mes de inicio del contrato. Ej: mayo, junio.',
  anio_inicio: 'Escriba el año de inicio del contrato. Ej: 2026.',
  anos_prorroga: 'Escriba cuántos años se prorroga automáticamente si no se avisa la terminación. Ej: uno (1), dos (2).',
  meses_aviso: 'Escriba cuántos meses de anticipación se requieren para avisar la terminación. Ej: tres (3), seis (6).',
  ciudad_firma: 'Escriba la ciudad donde se firma el contrato. Ej: El Cerrito, Cali, Palmira.',
  dia_firma: 'Escriba el día de firma. Solo el número. Ej: 21.',
  mes_firma: 'Escriba el mes de firma. Ej: abril, mayo.',
  anio_firma: 'Escriba el año de firma. Ej: 2026.',
  // Minuta 26 — Revocatoria de Poder General
  ciudad_otorgamiento: 'Escribe el nombre de la ciudad donde se firma la escritura de revocación. Ej: El Cerrito, Cali.',
  numero_notario: 'Escribe el nombre o número del Notario ante quien se otorga esta escritura. Ej: Única, Primera, Segunda.',
  circulo_notarial_actual: 'Escribe la ciudad del círculo notarial donde se hace la revocación. Ej: El Cerrito.',
  cc_poderdante: 'Escribe el número de cédula de ciudadanía del poderdante (quien revoca).',
  ciudad_expedicion_cc_poderdante: 'Escribe la ciudad donde fue expedida la cédula del poderdante. Ej: El Cerrito.',
  cc_apoderado: 'Escribe el número de cédula de ciudadanía del apoderado (a quien se le revoca el poder).',
  ciudad_expedicion_cc_apoderado: 'Escribe la ciudad donde fue expedida la cédula del apoderado. Ej: Cali.',
  clausulas_poder: 'Escribe el número de las cláusulas del poder original que se están revocando. Ej: 1, 2 y 3.',
  numero_escritura_poder: 'Escribe el número de la escritura pública donde consta el poder original que se revoca. Ej: 1245.',
  fecha_escritura_poder: 'Escribe la fecha de la escritura del poder original. Ej: 10 de marzo de 2022.',
  numero_notaria_poder: 'Escribe el nombre o número de la notaría donde se otorgó el poder original. Ej: Única, Primera.',
  circulo_notaria_poder: 'Escribe la ciudad de la notaría donde se otorgó el poder original. Ej: Palmira, Cali.',
  documentos_paz_salvo: '(Opcional) Documentos que prueban el pago de honorarios. Ej: recibo de transferencia Nº. 00456 del Banco de Bogotá.',
  // Minuta 27 — Contrato Civil de Obra
  numero_contrato: 'Escribe el número o código del contrato. Ej: 001-2026, CO-2026-001.',
  numero_obra: 'Escribe el número de identificación de la obra. Ej: 001, OB-2026-01.',
  fecha_iniciacion: 'Escribe la fecha en que comenzará la ejecución de la obra. Ej: 1 de mayo de 2026.',
  fecha_terminacion: 'Escribe la fecha estimada en que terminará la obra. Ej: 31 de octubre de 2026.',
  cedula_representante: 'Escribe el número de cédula del representante legal del contratante.',
  expedicion_representante: 'Escribe la ciudad donde fue expedida la cédula del representante legal.',
  camara_comercio: 'Escribe la ciudad de la Cámara de Comercio donde está registrada la empresa contratante. Ej: Cali, El Cerrito.',
  plazo_ejecucion: 'Escribe el plazo total para ejecutar la obra. Ej: seis (6) meses, ciento ochenta (180) días calendario.',
  fecha_entrega: 'Escribe la fecha exacta en que el contratista debe entregar la obra terminada. Ej: 31 de octubre de 2026.',
  multa_mora_letras: 'Escribe el número de salarios mínimos diarios de multa por cada día de retraso, en letras. Ej: dos (2).',
  multa_mora_numeros: 'Escribe ese número en cifras. Ej: 2.',
  bonificacion_letras: 'Escribe el número de salarios mínimos diarios de bonificación por cada día de entrega anticipada, en letras. Ej: uno (1).',
  bonificacion_numeros: 'Escribe ese número en cifras. Ej: 1.',
  garantia_anticipo: 'Describe la garantía que cubre el manejo del anticipo entregado. Ej: póliza de seguros por el valor del anticipo con vigencia igual al plazo del contrato más seis meses.',
  garantia_cumplimiento: 'Describe la garantía de cumplimiento del contrato. Ej: póliza de seguros por el 20% del valor total del contrato.',
  garantia_responsabilidad: 'Describe la garantía de responsabilidad civil por daños a terceros. Ej: póliza de responsabilidad civil extracontractual por valor de $50.000.000.',
  garantia_estabilidad: 'Describe la garantía de estabilidad de la obra ya terminada. Ej: póliza de estabilidad por cinco (5) años contados desde la entrega definitiva.',
  seguro_vida: 'Describe el seguro de vida para el personal que trabaja en la obra. Ej: póliza colectiva de vida por $20.000.000 por trabajador.',
  garantia_salarios: 'Describe la garantía de pago de salarios y prestaciones del personal. Ej: póliza por el equivalente a tres (3) meses de nómina total.',
  notificacion_contratante: 'Escribe la dirección completa del contratante donde recibirá notificaciones legales. Ej: Carrera 8 # 12-34, Piso 3, El Cerrito.',
  notificacion_contratista: 'Escribe la dirección completa del contratista donde recibirá notificaciones legales. Ej: Calle 10 # 5-20, Barrio El Prado, Cali.',
  // Carta de Primera y Segunda Convocatoria
  ciudad_fecha: 'Escriba la ciudad y la fecha completa de la carta. Ej: El Cerrito, 5 de abril de 2026.',
  interior_apartamento: 'Escriba el número del interior o apartamento del destinatario. Si es una carta circular para todos los propietarios escriba: Circular.',
  tipo_asamblea: 'Escriba en MAYÚSCULA el tipo de asamblea. Escriba: ORDINARIA si es la reunión anual. Escriba: EXTRAORDINARIA si es por necesidad urgente.',
  tipo_asamblea_lower: 'Escriba en minúscula el tipo de asamblea. Escriba: ordinaria o extraordinaria.',
  fecha_asamblea: 'Escriba la fecha completa en que se realizará la asamblea. Ej: el día martes 21 de abril de 2026.',
  hora_asamblea: 'Escriba la hora de inicio de la asamblea. Ej: 7:00 p.m., 8:00 p.m.',
  lugar_asamblea: 'Escriba el lugar exacto donde se realizará la asamblea. Ej: el salón comunal del conjunto, ubicado en el primer piso del edificio.',
  articulo_reglamento: 'Escriba el número del artículo del reglamento de propiedad horizontal del conjunto que regula las convocatorias a asamblea. Lo encuentra en el reglamento. Ej: 27, 35.',
  orden_del_dia: 'Escriba los puntos del orden del día numerados. Ej: 1. Verificación del quórum. 2. Lectura del acta anterior. 3. Aprobación del orden del día. 4. Elección del presidente y secretario. 5. Informes del administrador y revisor fiscal. 6. Aprobación del balance. 7. Aprobación del presupuesto. 8. Nombramientos. 9. Otros asuntos.',
  porcentaje_quorum: 'Escriba el porcentaje mínimo de coeficientes de copropiedad que deben estar presentes para que la asamblea pueda sesionar en primera convocatoria. Según la Ley 675 de 2001 es el 51%. Ej: 51, 70.',
  nombre_administrador: 'Escriba el nombre completo del administrador o administradora que firma la convocatoria.',
  fecha_primera_convocatoria: 'Escriba la fecha en que se realizó la primera asamblea que fracasó por falta de quórum. Ej: el 21 de abril de 2026.',
  // Estatutos Fundación Gobernación
  nombre_entidad: 'Fundación Semillas de Esperanza',
  duracion_fundacion: 'indefinida',
  descripcion_patrimonio_inicial: 'la suma de cinco millones de pesos ($5.000.000) aportada por Carlos Eduardo Pérez Ríos, y la suma de cinco millones de pesos ($5.000.000) aportada por María Fernanda García López',
  num_miembros_asamblea: 'cinco (5)',
  quien_designa_miembros: 'los fundadores en reunión conjunta, designando cada uno a su delegado personal',
  ciudad_reuniones: 'El Cerrito',
  dias_reunion: 'diez (10)',
  mes_reunion: 'marzo',
  periodo_revisor: 'dos (2) años',
  quorum_consejo: 'la mayoría absoluta de sus miembros',
  votos_disolucion: 'las dos terceras partes',
  entidad_remanente: 'la entidad de beneficencia sin ánimo de lucro de fines similares que determine la asamblea de delegatarios con domicilio en el municipio de El Cerrito',
  quien_nombra_secretario: 'el consejo de administración',
  // Carta de Primera Convocatoria
  unidad_privada: 'apartamento 101',
  tipo_asamblea_lower: 'ordinaria',
  articulo_reglamento: '27',
  fecha_asamblea: 'viernes 25 de abril de 2026',
  hora_asamblea: '7:00 p.m.',
  lugar_asamblea: 'salón comunal del conjunto, ubicado en el primer piso del edificio',
  porcentaje_quorum: '51',
  telefono_administrador: '315 123 4567',
  // Carta de Segunda Convocatoria
  fecha_primera_convocatoria: 'el 8 de abril de 2026',
  // Poder especial asamblea
  tipo_unidad: 'apartamento',
  numero_unidad: '101',
  interior_unidad: 'no aplica',
  numero_convocatoria: 'primera',
  fecha_carta_citacion: '5 de abril de 2026',
  dia_firma: 20,
  mes_firma: 'abril',
  anio_firma: 2026,
  // Acta de Asamblea General de Propietarios
  numero_acta: 'Escriba el número consecutivo del acta. Ej: 001, 015. Las actas deben numerarse en orden cronológico en el libro de actas registrado en la Alcaldía.',
  tipo_asamblea: 'Escriba ORDINARIA si es la asamblea anual de los primeros tres meses del año. Escriba EXTRAORDINARIA si fue convocada por necesidad urgente o imprevista.',
  nombre_conjunto: 'Escriba el nombre completo del edificio o conjunto tal como figura en el reglamento de propiedad horizontal. Ej: Conjunto Residencial Los Nogales.',
  hora: 'Escriba la hora de inicio de la asamblea. Ej: 7:00 p.m., 9:00 a.m.',
  convocante: 'Escriba quién convocó la asamblea. Puede ser el administrador, el revisor fiscal, el consejo de administración, o un grupo de propietarios que representen al menos el 20% de los coeficientes de copropiedad.',
  fecha_convocatoria: 'Escriba la fecha en que se envió la convocatoria. La ley exige que sea con mínimo 15 días de anticipación para asambleas ordinarias.',
  lugar_reunion: 'Escriba el lugar exacto donde se realizó la asamblea. Ej: salón comunal del conjunto, ubicado en el primer piso del edificio.',
  secretario_lectura: 'Escriba el nombre de quien leyó el orden del día al inicio de la reunión.',
  orden_del_dia: 'Escriba todos los puntos del orden del día tal como fueron enviados en la convocatoria. Numérelos del 1 en adelante.',
  lista_asistentes: 'Escriba el nombre de cada propietario asistente, su unidad privada y su coeficiente de copropiedad. Ej: 1. Jhon Brandon Martínez Vélez - Apto 101 - Coeficiente 5.2%.',
  nombre_presidente: 'Escriba el nombre completo del propietario elegido como presidente de la asamblea.',
  cedula_presidente: 'Escriba el número de cédula del presidente de la asamblea.',
  inmueble_presidente: 'Escriba el número del apartamento o unidad del presidente. Ej: apartamento 301.',
  postulados_presidente: 'Escriba los nombres de todos los propietarios que fueron postulados para la presidencia, incluyendo al elegido.',
  nombre_secretario: 'Escriba el nombre completo del propietario elegido como secretario de la asamblea.',
  cedula_secretario: 'Escriba el número de cédula del secretario de la asamblea.',
  inmueble_secretario: 'Escriba el número del apartamento o unidad del secretario. Ej: apartamento 202.',
  postulados_secretario: 'Escriba los nombres de todos los propietarios postulados para secretario.',
  nombre_administrador: 'Escriba el nombre completo del administrador del conjunto que presentó el informe.',
  resumen_informe_administrador: 'Resuma el informe del administrador: actividades realizadas, estado de la cartera de morosos, mantenimientos efectuados, novedades del período.',
  informe_revisor_fiscal: 'Resuma el informe del revisor fiscal. Si el conjunto no tiene revisor fiscal escriba: El conjunto no cuenta con revisor fiscal para el presente período.',
  fecha_inicio_balance: 'Escriba la fecha de inicio del período del balance. Ej: 1 de enero de 2025.',
  fecha_fin_balance: 'Escriba la fecha de cierre del período del balance. Ej: 31 de diciembre de 2025.',
  resultado_balance: 'Escriba el resultado de la votación sobre el balance. Ej: El balance fue aprobado por unanimidad / aprobado con 8 votos a favor y 2 en contra.',
  valor_presupuesto: 'Escriba el valor total del presupuesto aprobado en letras y números. Ej: cuarenta y ocho millones de pesos ($48.000.000) para la vigencia 2026.',
  resultado_presupuesto: 'Escriba el resultado de la votación del presupuesto y la cuota mensual aprobada. Ej: aprobado por unanimidad con cuota mensual de $200.000 por unidad.',
  nombramientos: 'Describa todos los nombramientos realizados: administrador, consejo de administración, revisor fiscal si aplica.',
  propuestas_observaciones: 'Describa las propuestas y comentarios de los asistentes. Si no hubo escriba: Los asistentes no presentaron propuestas adicionales.',
  hora_cierre: 'Escriba la hora de cierre de la asamblea. Ej: 9:30 p.m.',

  // Reglamento de Propiedad Horizontal
  nombre_apoderado: 'Escriba el nombre completo de la persona que comparece ante el Notario como apoderado de los propietarios del edificio.',
  cedula_apoderado: 'Escriba el número de cédula del apoderado.',
  expedicion_apoderado: 'Escriba la ciudad donde fue expedida la cédula del apoderado.',
  domicilio_apoderado: 'Escriba la ciudad donde vive el apoderado.',
  nombre_edificio: 'Escriba el nombre completo del edificio o conjunto. Ej: Edificio Los Nogales, Conjunto Residencial El Refugio.',
  direccion_edificio: 'Escriba la dirección completa del edificio. Ej: Carrera 10 # 25-40.',
  ciudad_edificio: 'Escriba la ciudad donde está ubicado el edificio.',
  numero_lote: 'Escriba el número del lote de terreno sobre el que se construyó el edificio. Lo encuentra en los planos urbanísticos o en la escritura del lote.',
  manzana: 'Escriba el número o letra de la manzana donde está el lote. Ej: A, 5, 12-B.',
  nombre_urbanizacion: 'Escriba el nombre de la urbanización o barrio donde está el edificio.',
  area_lote: 'Escriba el área total del lote en metros cuadrados. Solo el número. Ej: 800, 1200.',
  num_pisos: 'Escriba el número de pisos del edificio en letras y número. Ej: cinco (5), ocho (8).',
  num_unidades: 'Escriba el número total de unidades privadas del edificio — apartamentos más garajes — en letras y número. Ej: veinte (20).',
  propietario_anterior: 'Escriba el nombre completo de la persona o empresa que era dueña del lote antes de construir el edificio.',
  cedula_propietario_anterior: 'Escriba el número de cédula del propietario anterior del lote.',
  expedicion_propietario_anterior: 'Escriba la ciudad donde fue expedida la cédula del propietario anterior.',
  escritura_anterior: 'Escriba solo el número de la escritura pública con que se adquirió el lote. Ej: 1245.',
  descripcion_unidades: 'Describa en general cómo está compuesta cada unidad privada. Ej: sala-comedor, tres alcobas, dos baños, cocina, balcón y garaje.',
  destinacion_inmueble: 'Escriba para qué están destinados los inmuebles. Ej: habitacional, comercial, mixta.',
  dias_pago: 'Escriba los primeros días de cada mes para pagar las expensas comunes. Ej: cinco (5), diez (10).',
  quien_nombra_administrador: 'Escriba quién nombra al administrador. Ej: la asamblea general de propietarios / el consejo de administración.',
  periodo_administrador: 'Escriba el período del administrador. Ej: un (1) año / dos (2) años.',
  porcentaje_fondo: 'Escriba el porcentaje de la cuota mensual que irá al fondo de reserva e imprevistos. Ej: diez (10).',
  num_miembros_comite: 'Escriba el número de miembros del comité de convivencia. Debe ser un número impar. Ej: tres (3), cinco (5).',
  // DERECHO DE FAMILIA
  // Disolución y Liquidación de Sociedad Conyugal -
  nombre_conyuge1: 'Escriba el nombre completo del esposo tal como aparece en su cédula.',
  cedula_conyuge1: 'Escriba el número de cédula del esposo. Solo los números.',
  expedicion_conyuge1: 'Escriba la ciudad donde fue expedida la cédula del esposo.',
  domicilio_conyuge1: 'Escriba la ciudad donde vive actualmente el esposo.',
  nombre_conyuge2: 'Escriba el nombre completo de la esposa tal como aparece en su cédula.',
  cedula_conyuge2: 'Escriba el número de cédula de la esposa. Solo los números.',
  expedicion_conyuge2: 'Escriba la ciudad donde fue expedida la cédula de la esposa.',
  domicilio_conyuge2: 'Escriba la ciudad donde vive actualmente la esposa.',
  tipo_matrimonio: 'Escriba: civil / católico según cómo se casaron.',
  fecha_matrimonio: 'Escriba la fecha completa del matrimonio. Ej: el 15 de junio de 2010.',
  lugar_matrimonio: 'Escriba el nombre de la parroquia, notaría o juzgado donde se casaron. Ej: Notaría Segunda de Cali / Parroquia San Pedro.',
  ciudad_matrimonio: 'Escriba la ciudad donde se celebró el matrimonio.',
  apellidos_sociedad: 'Escriba los apellidos de ambos cónyuges unidos con guion. Ej: Martínez-García.',
  activo_bruto: 'Describa cada bien numerado con su valor. Ej: 1. Casa ubicada en Calle 4 Sur # 2A-56, El Cerrito, matrícula 370-123456, avaluada en cien millones de pesos ($100.000.000). 2. Vehículo Chevrolet Spark, placa ABC123, avaluado en treinta millones de pesos ($30.000.000).',
  total_activo_bruto_letras: 'Escriba la suma total de todos los bienes en letras. Ej: ciento treinta millones de pesos.',
  total_activo_bruto_numeros: 'Escriba esa suma en números. Ej: 130.000.000.',
  pasivo_externo: 'Describa cada deuda con su acreedor y valor. Ej: 1. Obligación a favor del Banco Bancolombia por diez millones de pesos ($10.000.000). Si no hay deudas escriba: No existen pasivos externos.',
  total_pasivo_externo_letras: 'Escriba la suma total de todas las deudas en letras. Si no hay deudas escriba: cero pesos.',
  total_pasivo_externo_numeros: 'Escriba esa suma en números. Si no hay deudas escriba: 0.',
  total_liquidacion_letras: 'Escriba el resultado de restar el pasivo al activo, en letras. Ej: ciento veinte millones de pesos.',
  total_liquidacion_numeros: 'Escriba ese resultado en números. Ej: 120.000.000.',
  gananciales_letras: 'Escriba la mitad del total liquidado en letras. Es el total dividido en dos. Ej: sesenta millones de pesos.',
  gananciales_numeros: 'Escriba esa mitad en números. Ej: 60.000.000.',
  igualaciones: 'Explique si un cónyuge le pagará algo al otro para igualar lo que reciben. Si no hay igualaciones escriba: No se requieren igualaciones entre los cónyuges.',
  hijuela1_conyuge: 'Escriba el nombre completo del cónyuge que recibe la primera parte de los bienes.',
  hijuela1_descripcion: 'Describa cada bien que recibe este cónyuge con su valor. Ej: A. Casa ubicada en Calle 4 Sur # 2A-56, adjudicada en cien millones de pesos ($100.000.000).',
  hijuela1_total_letras: 'Escriba el valor total de todos los bienes de esta hijuela en letras.',
  hijuela1_total_numeros: 'Escriba ese valor total en números.',
  hijuela2_conyuge: 'Escriba el nombre completo del cónyuge que recibe la segunda parte de los bienes.',
  hijuela2_descripcion: 'Describa cada bien que recibe este cónyuge con su valor.',
  hijuela2_total_letras: 'Escriba el valor total de todos los bienes de esta hijuela en letras.',
  hijuela2_total_numeros: 'Escriba ese valor total en números.',
  conyuge_asume_pasivo: 'Escriba el nombre completo del cónyuge que se compromete a pagar todas las deudas de la sociedad.',
  // Disolución Sin Bienes Comunes -
  lugar_registro_matrimonio: 'Escriba el nombre de la notaría o alcaldía donde quedó inscrito el matrimonio. Ej: Notaría Única de El Cerrito / Alcaldía Municipal de Palmira.',
  hijos: 'Escriba los nombres y fechas de nacimiento de los hijos comunes. Ej: De dicha unión matrimonial nacieron: Juan Pablo Martínez García el 10 de marzo de 2012 en Cali, y Valentina Martínez García el 5 de agosto de 2015 en El Cerrito. Si no tuvieron hijos escriba: No tuvieron hijos comunes de esta unión.',
  // Sociedad Patrimonial Unión Marital -
  nombre_companero1: 'Escriba el nombre completo del compañero permanente, tal como aparece en su cédula.',
  cedula_companero1: 'Escriba el número de cédula del compañero permanente. Solo los números.',
  expedicion_companero1: 'Escriba la ciudad donde fue expedida su cédula.',
  domicilio_companero1: 'Escriba la ciudad donde vive actualmente el compañero permanente.',
  nombre_companero2: 'Escriba el nombre completo de la compañera permanente, tal como aparece en su cédula.',
  cedula_companero2: 'Escriba el número de cédula de la compañera permanente. Solo los números.',
  expedicion_companero2: 'Escriba la ciudad donde fue expedida su cédula.',
  domicilio_companero2: 'Escriba la ciudad donde vive actualmente la compañera permanente.',
  fecha_sentencia: 'Escriba la fecha completa de la sentencia judicial que declaró la unión marital. Ej: el 15 de enero de 2024.',
  juzgado_sentencia: 'Escriba el nombre completo del juzgado que declaró la unión marital. Ej: Juzgado Primero de Familia de Cali.',
  activo_social: 'Describa cada bien numerado con su valor. Ej: 1. Apartamento ubicado en Calle 10 # 5-20, matrícula 370-654321, avaluado en ochenta millones de pesos ($80.000.000). 2. Vehículo Renault Logan, placa XYZ789, avaluado en veinte millones de pesos ($20.000.000).',
  pasivo_social: 'Describa cada deuda de la sociedad patrimonial numerada con su acreedor y valor. Ej: 1. Obligación a favor del Banco Bancolombia por diez millones de pesos ($10.000.000) a cargo del señor Carlos Torres. Si no hay deudas escriba exactamente: No existen pasivos sociales.',
  total_pasivo_letras: 'Escriba la suma total de todas las deudas en letras. Si no hay escriba: cero pesos.',
  total_pasivo_numeros: 'Escriba esa suma en números. Si no hay escriba: 0.',
  total_activo_liquido_letras: 'Escriba el activo bruto menos el pasivo, en letras.',
  total_activo_liquido_numeros: 'Escriba ese resultado en números.',
  hijuela1_companero: 'Escriba el nombre completo del compañero que recibe la primera parte de los bienes.',
  hijuela1_descripcion: 'Describa cada bien que recibe con su valor.',
  hijuela2_companero: 'Escriba el nombre completo del compañero que recibe la segunda parte de los bienes.',
  hijuela2_descripcion: 'Describa cada bien que recibe con su valor.',

  // Capitulaciones Matrimoniales
  nombre_contrayente1: 'Escriba el nombre completo del primer contrayente tal como aparece en su cédula.',
  cedula_contrayente1: 'Escriba el número de cédula del primer contrayente. Solo los números.',
  expedicion_contrayente1: 'Escriba la ciudad donde fue expedida la cédula del primer contrayente.',
  estado_civil_contrayente1: 'Escriba el estado civil del primer contrayente. Ej: soltero, divorciado, viudo.',
  domicilio_contrayente1: 'Escriba la ciudad donde vive el primer contrayente.',
  nombre_contrayente2: 'Escriba el nombre completo del segundo contrayente tal como aparece en su cédula.',
  cedula_contrayente2: 'Escriba el número de cédula del segundo contrayente. Solo los números.',
  expedicion_contrayente2: 'Escriba la ciudad donde fue expedida la cédula del segundo contrayente.',
  estado_civil_contrayente2: 'Escriba el estado civil del segundo contrayente. Ej: soltera, divorciada, viuda.',
  domicilio_contrayente2: 'Escriba la ciudad donde vive el segundo contrayente.',
  tipo_matrimonio: 'Escriba el tipo de matrimonio que van a celebrar. Ej: matrimonio civil / matrimonio católico.',
  fecha_matrimonio: 'Escriba la fecha completa del matrimonio. Ej: el 15 de mayo de 2026.',
  ciudad_matrimonio: 'Escriba la ciudad donde se celebrará el matrimonio. Ej: El Cerrito, Cali.',
  bienes_propios_contrayente1: 'Describa los bienes del primer contrayente que quedan FUERA de la sociedad conyugal. Si tiene inmuebles inclúyalos con su matrícula y escritura. Si no tiene escriba: Ninguno.',
  bienes_propios_contrayente2: 'Describa los bienes del segundo contrayente que quedan FUERA de la sociedad conyugal. Si no tiene escriba: Ninguno.',
  pasivos_contrayente1: 'Describa las deudas actuales del primer contrayente. Incluya acreedor, monto y vencimiento. Si no tiene escriba: Ninguno.',
  pasivos_contrayente2: 'Describa las deudas actuales del segundo contrayente. Si no tiene escriba: Ninguno.',
  bienes_aporte_contrayente1: 'Describa los bienes del primer contrayente que SÍ entran a la sociedad conyugal con su valor estimado. Si no tiene escriba: Ninguno.',
  bienes_aporte_contrayente2: 'Describa los bienes del segundo contrayente que SÍ entran a la sociedad conyugal con su valor estimado. Si no tiene escriba: Ninguno.',
  // Poder para Contraer Matrimonio
  nombre_poderdante: 'Escriba el nombre completo de quien otorga el poder para que otro lo represente en el matrimonio.',
  cedula_poderdante: 'Escriba el número de cédula de quien otorga el poder.',
  expedicion_poderdante: 'Escriba la ciudad donde fue expedida la cédula de quien otorga el poder.',
  domicilio_poderdante: 'Escriba la ciudad donde vive quien otorga el poder.',
  estado_civil_poderdante: 'Escriba el estado civil de quien otorga el poder. Ej: soltero, divorciado, viudo.',
  nombre_contrayente: 'Escriba el nombre completo de la persona con quien se va a casar.',
  cedula_contrayente: 'Escriba la cédula de la persona con quien se va a casar.',
  expedicion_contrayente: 'Escriba la ciudad de expedición de la cédula de esa persona.',
  honorarios_apoderado: 'Escriba si el apoderado recibirá honorarios o no. Ej: el presente mandato es gratuito / se pagarán honorarios de quinientos mil pesos ($500.000).',
  // Solicitud Matrimonio Notario
  ciudad_nacimiento1: 'Escriba la ciudad de nacimiento del primer contrayente.',
  profesion1: 'Escriba la profesión u ocupación del primer contrayente. Ej: abogado, comerciante, agricultor, ingeniero.',
  padre1: 'Escriba el nombre completo del padre del primer contrayente.',
  madre1: 'Escriba el nombre completo de la madre del primer contrayente.',
  estado_civil1: 'Escriba el estado civil del primer contrayente. Ej: soltero, divorciado, viudo.',
  ciudad_nacimiento2: 'Escriba la ciudad de nacimiento del segundo contrayente.',
  profesion2: 'Escriba la profesión u ocupación del segundo contrayente.',
  padre2: 'Escriba el nombre completo del padre del segundo contrayente.',
  madre2: 'Escriba el nombre completo de la madre del segundo contrayente.',
  estado_civil2: 'Escriba el estado civil del segundo contrayente. Ej: soltera, divorciada, viuda.',
  parrafo_hijos: 'Si van a legitimar hijos comunes no reconocidos escriba: Así mismo, manifestamos que es nuestra voluntad legitimar a nuestros hijos (nombres y edades de los hijos). Si no aplica escriba: no aplica.',
  anexos_adicionales: 'Escriba los documentos adicionales que se acompañan. Ej: 3. Copia del registro civil de divorcio. Si no hay adicionales escriba: no aplica.',
  dia_firma: 'Escriba el día en que se presenta la solicitud. Solo el número. Ej: 21.',
  mes_firma: 'Escriba el mes en que se presenta. Ej: abril, mayo.',
  anio_firma: 'Escriba el año. Ej: 2026.',
  // Solicitud Matrimonio - anexos condicionales
  anexo_estado_civil1: 'Según el estado civil del PRIMER contrayente: Si es SOLTERO escriba exactamente: nada — Si es DIVORCIADO escriba: 3. Copia del registro civil de matrimonio anterior y de la sentencia de divorcio de [nombre completo]. — Si es VIUDO escriba: 3. Copia del registro civil de defunción del cónyuge anterior de [nombre completo].',
  anexo_estado_civil2: 'Según el estado civil del SEGUNDO contrayente: Si es SOLTERA escriba exactamente: nada — Si es DIVORCIADA escriba: 4. Copia del registro civil de matrimonio anterior y de la sentencia de divorcio de [nombre completo]. — Si es VIUDA escriba: 4. Copia del registro civil de defunción del cónyuge anterior de [nombre completo].',
  // Matrimonio Civil ante Notario
  fecha_nacimiento1: 'Escriba la fecha de nacimiento del primer contrayente. Ej: 15 de marzo de 1990.',
  fecha_nacimiento2: 'Escriba la fecha de nacimiento del segundo contrayente. Ej: 10 de junio de 1992.',
  fecha_solicitud: 'Escriba la fecha en que se presentó la solicitud de matrimonio ante la Notaría. Ej: el 5 de abril de 2026.',

}

const DATOS_PRUEBA = {
  // DERECHO DE FAMILIA — datos de prueba -
  nombre_notario: 'Carlos Alberto Gómez Herrera',
  numero_notaria: 'Única',
  circulo_notarial: 'El Cerrito',
  nombre_contrayente1: 'Jhon Brandon Martínez Vélez',
  cedula_contrayente1: '1234567890',
  expedicion_contrayente1: 'El Cerrito',
  estado_civil_contrayente1: 'soltero',
  domicilio_contrayente1: 'El Cerrito',
  nombre_contrayente2: 'Diana Patricia Ruiz Morales',
  cedula_contrayente2: '0987654322',
  expedicion_contrayente2: 'El Cerrito',
  estado_civil_contrayente2: 'soltera',
  domicilio_contrayente2: 'El Cerrito',
  tipo_matrimonio: 'matrimonio civil',
  fecha_matrimonio: 'el 15 de mayo de 2026',
  ciudad_matrimonio: 'El Cerrito',
  bienes_propios_contrayente1: '1. Casa de habitación ubicada en la Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito, con matrícula inmobiliaria 370-123456, adquirida por escritura pública No. 1245 de la Notaría Única de El Cerrito del 15 de mayo de 2018, valorada en cien millones de pesos ($100.000.000). 2. Vehículo Chevrolet Spark, modelo 2022, placa ABC123, valorado en treinta millones de pesos ($30.000.000).',
  bienes_propios_contrayente2: 'Ninguno.',
  pasivos_contrayente1: 'Ninguno.',
  pasivos_contrayente2: 'Ninguno.',
  bienes_aporte_contrayente1: 'Ninguno.',
  bienes_aporte_contrayente2: 'Ninguno.',
  honorarios_apoderado: 'el presente mandato es gratuito',
  nombre_contrayente: 'Diana Patricia Ruiz Morales',
  cedula_contrayente: '0987654322',
  expedicion_contrayente: 'El Cerrito',
  ciudad_nacimiento1: 'El Cerrito',
  profesion1: 'abogado',
  domicilio1: 'El Cerrito',
  padre1: 'Roberto Martínez Gómez',
  madre1: 'Ana Lucia Vélez de Martínez',
  estado_civil1: 'soltero',
  ciudad_nacimiento2: 'El Cerrito',
  profesion2: 'contadora pública',
  domicilio2: 'El Cerrito',
  padre2: 'Carlos Ruiz Torres',
  madre2: 'Patricia Morales de Ruiz',
  estado_civil2: 'soltera',
  anexo_estado_civil1: 'nada',
  anexo_estado_civil2: 'nada',

  ciudad_firma: 'El Cerrito',
  fecha_nacimiento1: '15 de marzo de 1990',
  fecha_nacimiento2: '10 de junio de 1992',
  fecha_solicitud: 'el 5 de abril de 2026',
  ciudad: 'El Cerrito', dia: 21, mes: 'abril', anio: 2026,
  nombre_vendedor: 'Jhon Brandon Martínez Vélez', nombre_comprador: 'Alexander García López',
  estado_civil_vendedor: 'soltero', estado_civil_comprador: 'casado',
  sociedad_conyugal_vendedor: 'sin sociedad conyugal', sociedad_conyugal_comprador: 'con sociedad conyugal vigente',
  sociedad_conyugal: 'con sociedad conyugal vigente',
  tipo_inmueble: 'casa de habitación', barrio: 'Villa del Carmen',
  direccion_inmueble: 'Calle 4 Sur # 2A-56', metros: 120,
  registro_catastral: '762480002000000020546', folio_matricula: '370-123456',
  fecha_adquisicion: '15 de mayo de 2018', numero_escritura: '1245',
  fecha_escritura: '15 de mayo de 2018', notaria: 'Única', circulo: 'El Cerrito',
  hora_escritura: '10:00 AM', dia_escritura: 25, mes_escritura: 'mayo', anio_escritura: 2026,
  notaria_escritura: 'Única', circulo_escritura: 'El Cerrito',
  valor_letras: 'cien millones de pesos m/cte', valor_numeros: '100.000.000',
  pago_inicial_letras: 'veinte millones de pesos m/cte', pago_inicial_numeros: '20.000.000',
  saldo_letras: 'ochenta millones de pesos m/cte', saldo_numeros: '80.000.000',
  telefono: '3163793069', multa_letras: 'diez millones de pesos m/cte', multa_numeros: '10.000.000',
  nombre_donante: 'Carlos Eduardo Pérez Ríos', nombre_donatario: 'María Fernanda Pérez Ríos',
  descripcion_bien: 'apartamento ubicado en la Calle 10 # 5-20, Barrio El Prado, El Cerrito',
  forma_adquisicion: 'compra', documento_adquisicion: 'escritura pública No. 890 de la Notaría Única de El Cerrito',
  destinacion_bien: 'vivienda familiar', plazo_no_venta: 5,
  responsable_gastos: 'ambos por partes iguales',
  nombre_parte1: 'Luis Fernando Gómez Torres', nombre_parte2: 'Diana Patricia Ruiz Morales',
  estado_civil_parte1: 'casado', estado_civil_parte2: 'soltera',
  tipo_inmueble1: 'casa', barrio1: 'Los Pinos', direccion1: 'Carrera 8 # 12-34', metros1: 95,
  registro_catastral1: '762480001000000010234', numero_escritura1: '567',
  fecha_escritura1: '10 de marzo de 2015', notaria1: 'Única', circulo1: 'El Cerrito',
  folio_matricula1: '370-654321', vendedor_original1: 'Roberto Salcedo Muñoz',
  tipo_inmueble2: 'apartamento', barrio2: 'El Jardín', direccion2: 'Calle 15 # 7-89', metros2: 68,
  registro_catastral2: '762480003000000030789', vendedor_original2: 'Patricia Londoño Vera',
  numero_escritura2: '1102', fecha_escritura2: '5 de junio de 2019',
  notaria2: 'Única', circulo2: 'El Cerrito', folio_matricula2: '370-789012',
  ciudad_comprador: 'El Cerrito', ciudad_vendedor: 'Cali',
  nombre_empresa: 'no aplica', domicilio_empresa: 'no aplica',
  ciudad_pago: 'El Cerrito', forma_pago: 'cuotas mensuales de $500.000 durante 20 meses pagaderas los días 5 de cada mes',
  cedula_vendedor: '1234567890', expedicion_cedula_vendedor: 'Cali',
  cedula_comprador: '0987654321', expedicion_cedula_comprador: 'El Cerrito',
  clase_vehiculo: 'automóvil', marca_vehiculo: 'Chevrolet', tipo_vehiculo: 'sedan',
  color_vehiculo: 'blanco', modelo_vehiculo: '2020', numero_motor: 'ABC123456',
  numero_serie: 'VIN987654321', placa_vehiculo: 'ABC123', linea_vehiculo: 'Spark',
  cilindraje: '1200 cc', servicio_vehiculo: 'particular', carroceria: 'sedan',
  numero_puertas: '4', capacidad: '5 pasajeros',
  documento_aduana: 'no requiere documento de aduana',
  estado_vehiculo: 'perfecto estado de funcionamiento',
  forma_pago_saldo: '15 cuotas mensuales de $1.000.000 pagaderas los días 5 de cada mes',
  departamento: 'Valle del Cauca',
  nombre_deudor: 'Andrés Felipe Castillo Mora', nombre_acreedor: 'Isabel Cristina Vargas Pinto',
  cedula_deudor: '1122334455', cedula_acreedor: '5544332211',
  expedicion_cedula_deudor: 'El Cerrito', expedicion_cedula_acreedor: 'Cali',
  plazo_anos: 2, dia_inicio: 1, mes_inicio: 'mayo', anio_inicio: 2026,
  dia_deuda: 15, mes_deuda: 'enero', anio_deuda: 2025,
  valor_deuda_letras: 'diez millones de pesos m/cte', valor_deuda_numeros: '10.000.000',
  interes_mensual: '2', periodos_mora: 3, tipo_explotacion: 'arrendamiento',
  nombre_propietario: 'Jhon Brandon Martínez Vélez', ciudad_propietario: 'El Cerrito',
  cedula_propietario: '1234567890', expedicion_cedula_propietario: 'El Cerrito',
  nombre_usufructuario: 'Alexander García López', ciudad_usufructuario: 'Cali',
  cedula_usufructuario: '0987654321', expedicion_cedula_usufructuario: 'Cali',
  descripcion_inmueble: 'casa de habitación de dos pisos, área de 120 metros cuadrados, registro catastral 762480002000000020546, matrícula inmobiliaria 370-123456',
  uso_inmueble: 'vivienda familiar', plazo_maximo: 10,
  facultades_adicionales: 'arrendar el inmueble con autorización previa y escrita del propietario',
  nombre_comodante: 'Jhon Brandon Martínez Vélez', nombre_comodatario: 'Alexander García López',
  descripcion_bienes: 'un computador portátil marca Dell modelo Inspiron 15, serial ABC123456, color negro, con su respectivo cargador',
  direccion_bienes: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen', ciudad_bienes: 'El Cerrito',
  fines_uso: 'uso exclusivo en actividades académicas y de investigación',
  obligaciones_comodatario: 'cuidar y mantener los bienes en perfecto estado, responder por cualquier daño, deterioro o pérdida, asegurar los bienes por su valor total y restituirlos al terminar el contrato',
  duracion: '6 meses',
  ciudad_firma: 'Cali', dia_firma: '22', mes_firma: 'abril', año_firma: '2026',
  vecino_vendedor: 'Cali', expedida_vendedor: 'Cali',
  vecino_comprador: 'Bogotá', expedida_comprador: 'Bogotá',
  ubicacion_inmueble: 'Calle 15 # 8-42, barrio El Peñón', ciudad_inmueble: 'Cali',
  linderos: 'Norte: con la calle 15; Sur: con el predio de María García; Oriente: con la carrera 8; Occidente: con el predio de Juan Torres',
  vendedor_anterior: 'María Cecilia Torres Vargas', numero_escritura_anterior: '1245',
  notaria_anterior: 'Primera', circulo_anterior: 'Cali',
  dia_escritura_anterior: '10', mes_escritura_anterior: 'marzo', año_escritura_anterior: '2018',
  ciudad_registro: 'Cali', dia_registro: '15', mes_registro: 'abril', año_registro: '2018',
  precio_compraventa: 'ciento veinte millones de pesos ($120.000.000)',
  plazo_retroventa: 'dos (2) años', precio_retroventa: 'ciento veinte millones de pesos ($120.000.000)',
  plazo_aviso: 'treinta (30) días',
  nombre_fallecido: 'José Arturo Martínez Ríos', dia_fallecido: '10',
  mes_fallecido: 'enero', año_fallecido: '2024',
  juzgado: 'Primero Civil del Circuito', ciudad_juzgado: 'Cali', condicion_vendedor: 'hijo',
  descripcion_bienes: 'A. Casa ubicada en la Calle 5 # 3-20, barrio El Prado, ciudad de Cali, con matrícula inmobiliaria número 370-12345. B. Lote ubicado en la Carrera 8 # 10-15, barrio Los Pinos, ciudad de Cali, con matrícula inmobiliaria número 370-67890.',
  precio_cesion: 'cincuenta millones de pesos ($50.000.000)',
  nombre_fundacion: 'Fundación Semillas de Esperanza',
  municipio_domicilio: 'El Cerrito',
  departamento_domicilio: 'Valle del Cauca',
  objeto_fundacion: 'promover la educación de niños y jóvenes en situación de vulnerabilidad mediante programas de becas, talleres formativos y actividades culturales y deportivas',
  bienes_iniciales: 'A. La suma de cinco millones de pesos ($5.000.000) aportada por Carlos Eduardo Pérez Ríos. B. La suma de cinco millones de pesos ($5.000.000) aportada por María Fernanda García López.',
  ciudad_asamblea: 'El Cerrito',
  dias_reunion_ordinaria: 'diez (10)',
  mes_reunion_ordinaria: 'marzo',
  num_miembros_consejo: 'cinco (5)',
  periodo_consejo: 'dos (2) años',
  cuantia_contratos: 'cinco millones de pesos ($5.000.000)',
  porcentaje_disolucion: 'setenta (70)',
  revisor_fiscal: 'Luis Fernando Gómez Torres',
  suplente_revisor: 'Diana Patricia Ruiz Morales',
  secretario: 'Ana María Salcedo Vera',
  nominador_secretario: 'la asamblea de fundadores',
  director_principal: 'Jhon Brandon Martínez Vélez',
  director_suplente: 'Alexander García López',
  miembros_consejo_principales: 'Carlos Eduardo Pérez Ríos; María Fernanda García López; Luis Fernando Gómez Torres; Diana Patricia Ruiz Morales; Andrés Felipe Castillo Mora',
  miembros_consejo_suplentes: 'Isabel Cristina Vargas Pinto; Roberto Salcedo Muñoz; Patricia Londoño Vera; Ana María Salcedo Vera; Jorge Enrique Morales Gil',
  // Minuta 14 — Contrato de construcción sin suministro de materiales
  nombre_contratante: 'Carlos Eduardo Pérez Ríos',
  nombre_contratista: 'Roberto Salcedo Muñoz',
  ciudad_domicilio: 'El Cerrito',
  cedula_contratante: '1234567890',
  cedula_contratista: '0987654321',
  expedicion_contratante: 'El Cerrito',
  expedicion_contratista: 'Cali',
  descripcion_obra: 'una casa de dos pisos con tres habitaciones, dos baños, sala, comedor, cocina y garaje',
  descripcion_lote: 'lote de doscientos (200) metros cuadrados, matrícula inmobiliaria 370-654321',
  ubicacion_lote: 'Carrera 8 # 12-34, Barrio Los Pinos',
  ciudad_obra: 'El Cerrito',
  nombre_arquitecto: 'Luis Fernando Gómez Torres',
  plazo_obra: 'seis (6) meses',
  porcentaje_honorarios: 'quince (15)',
  costo_obra_letras: 'cincuenta millones de pesos',
  costo_obra_numeros: '$50.000.000',
  honorarios_letras: 'siete millones quinientos mil pesos',
  honorarios_numeros: '$7.500.000',
  anticipo_letras: 'un millón quinientos mil pesos',
  anticipo_numeros: '$1.500.000',
  porcentaje_anticipo: 'veinte (20)',
  forma_pago_saldo: 'pagos semanales de quinientos mil pesos ($500.000)',
  dia_pago: 'todos los viernes',
  condicion_pago: 'sin condición adicional',
  porcentaje_retencion: 'diez (10)',
  plazo_retencion: 'treinta (30)',
  sucesor_contratista: 'la persona que el contratista designe mediante escrito o, en su defecto, el profesional que acuerden las partes de común acuerdo',
  penalizacion_letras: 'doscientos mil pesos',
  penalizacion_numeros: '$200.000',
  unidad_penalizacion: 'día de retraso injustificado',
  mecanismo_divergencias: 'mediación ante la Cámara de Comercio de la ciudad, y de no llegarse a acuerdo, por el juez ordinario competente',
  ciudad_jurisdiccion: 'El Cerrito',
  num_ejemplares: 'dos (2)',
  // Minuta 15 — Contrato de construcción con suministro de materiales
  ubicacion_terreno: 'Carrera 8 # 12-34, Barrio Los Pinos, ciudad de El Cerrito, Valle del Cauca',
  suministrador_materiales: 'el contratista',
  precio_total_letras: 'ochenta millones de pesos',
  precio_total_numeros: '$80.000.000',
  porcentaje_anticipo: 'treinta (30)',
  porcentaje_pago_b: 'veinte (20)',
  condicion_pago_b: 'al terminar la cimentación y la estructura',
  porcentaje_pago_c: 'veinte (20)',
  condicion_pago_c: 'al terminar muros, cubierta e instalaciones',
  porcentaje_saldo: 'treinta (30)',
  porcentaje_retencion: 'diez (10)',
  meses_retencion: 'seis (6)',
  plazo_inicio: 'diez (10) días',
  plazo_entrega: 'seis (6) meses',
  multa_letras: 'doscientos mil pesos',
  multa_numeros: '$200.000',
  unidad_multa: 'día',
  dias_rescision: 'treinta (30) días',
  responsable_gastos: 'en partes iguales por ambas partes',
  domicilio_contratante: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito',
  domicilio_contratista: 'Carrera 8 # 12-34, Barrio Los Pinos, El Cerrito',
  ciudad_jurisdiccion: 'El Cerrito',
  // Minuta 16 — Contrato de depósito
  nombre_depositante: 'Carlos Eduardo Pérez Ríos',
  nombre_depositario: 'Jhon Brandon Martínez Vélez',
  descripcion_bienes: 'A. Un televisor Samsung 55 pulgadas, serial TV-ABC123, color negro. B. Una nevera LG 350 litros, serial NV-XYZ456, color gris. C. Un equipo de sonido Sony de cinco piezas, serial SO-789012, color negro.',
  direccion_custodia: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen',
  ciudad_custodia: 'El Cerrito',
  duracion: 'seis (6) meses',
  remuneracion_letras: 'cincuenta mil pesos',
  remuneracion_numeros: '$50.000',
  periodicidad_pago: 'mensuales',
  ciudad_firma: 'El Cerrito',
  dia: 21,
  mes: 'abril',
  anio: 2026,
  // Minuta 17 — Cesión o venta de derechos litigiosos
  nombre_cedente: 'Carlos Eduardo Pérez Ríos',
  nombre_cesionario: 'Jhon Brandon Martínez Vélez',
  ciudad_domicilio: 'El Cerrito',
  tipo_proceso: 'ordinario civil',
  demandante: 'Carlos Eduardo Pérez Ríos',
  demandado: 'Roberto Salcedo Muñoz',
  juzgado: 'Primero Civil del Circuito',
  ciudad_juzgado: 'Cali',
  dia_notificacion: '10',
  mes_notificacion: 'enero',
  anio_notificacion: '2023',
  precio_letras: 'cinco millones de pesos',
  precio_numeros: '$5.000.000',
  forma_pago: 'de contado al momento de la firma del presente contrato',
  ciudad_firma: 'El Cerrito',
  dia: 21,
  mes: 'abril',
  // Minuta 18 — Arrendamiento de vivienda urbana
  nombre_arrendatario1: 'Alexander García López',
  nombre_arrendatario2_texto: 'no aplica',
  ciudad_arrendatarios: 'El Cerrito',
  cedula_arrendatario1: '0987654321',
  cedula_arrendatario2_texto: 'no aplica',
  nombre_arrendador: 'Jhon Brandon Martínez Vélez',
  cedula_arrendador: '1234567890',
  expedicion_arrendador: 'El Cerrito',
  direccion_inmueble: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen',
  numero_inmueble: '2A-56',
  ciudad_inmueble: 'El Cerrito',
  linderos_inmueble: 'Norte: con la calle 4 Sur; Sur: con el predio de Roberto Salcedo; Oriente: con la carrera 2A; Occidente: con el predio de Patricia Londoño',
  duracion_meses: 'doce (12)',
  dia_inicio: '1',
  mes_inicio: 'mayo',
  anio_inicio: '2026',
  periodo_prorroga: 'un (1) año',
  canon_letras: 'un millón doscientos mil pesos',
  canon_numeros: '$1.200.000',
  lugar_pago: 'la cuenta de ahorros Bancolombia número 123-456789-00 a nombre del arrendador',
  pago_energia: 'el arrendatario',
  pago_gas: 'el arrendatario',
  pago_agua: 'el arrendatario',
  pago_telefono: 'el arrendatario',
  porcentaje_reajuste: 'cien (100)',
  direccion_notificacion_arrendador: 'Carrera 8 # 12-34, Barrio Los Pinos, El Cerrito',
  direccion_notificacion_arrendatario: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito',
  // Minuta 19 — Arrendamiento de inmueble con muebles
  nombre_arrendador: 'Jhon Brandon Martínez Vélez',
  cedula_arrendador: '1234567890',
  expedicion_arrendador: 'El Cerrito',
  nombre_arrendatario: 'Alexander García López',
  cedula_arrendatario: '0987654321',
  expedicion_arrendatario: 'Cali',
  ubicacion_inmueble: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito',
  comodidades_inmueble: 'sala, comedor, tres habitaciones, dos baños completos, cocina integral, garaje y patio interior',
  destinacion_inmueble: 'vivienda familiar',
  canon_letras: 'un millón quinientos mil pesos',
  canon_numeros: '$1.500.000',
  dia_pago_inicio: '1',
  dia_pago_fin: '5',
  lugar_pago: 'la cuenta de ahorros Bancolombia número 123-456789-00 a nombre del arrendador',
  duracion: 'doce (12) meses',
  fecha_inicio: 'el 1 de mayo de 2026',
  multa_diaria_letras: 'cien mil pesos',
  multa_diaria_numeros: '$100.000',
  clausula_penal_letras: 'dos millones de pesos',
  clausula_penal_numeros: '$2.000.000',
  plazo_nueva_garantia: 'diez (10)',
  forma_reajuste: 'anualmente conforme al índice de precios al consumidor (IPC) certificado por el DANE para el año calendario inmediatamente anterior',
  domicilio_arrendador: 'Carrera 8 # 12-34, Barrio Los Pinos, El Cerrito',
  nombre_fiador: 'Carlos Eduardo Pérez Ríos',
  cedula_fiador: '1122334455',
  expedicion_fiador: 'El Cerrito',
  // Minuta 20 — Cesión de contrato de arrendamiento
  nombre_cedente: 'Jhon Brandon Martínez Vélez',
  ciudad_cedente: 'El Cerrito',
  cedula_cedente: '1234567890',
  expedicion_cedente: 'El Cerrito',
  nombre_cesionario: 'Carlos Eduardo Pérez Ríos',
  ciudad_cesionario: 'Cali',
  cedula_cesionario: '1122334455',
  expedicion_cesionario: 'Cali',
  dia_contrato: '1',
  mes_contrato: 'mayo',
  anio_contrato: '2025',
  nombre_arrendatario: 'Alexander García López',
  ubicacion_inmueble: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito',
  destinacion_inmueble: 'vivienda familiar',
  numero_escritura: '1245',
  fecha_escritura: '15 de marzo de 2026',
  notaria: 'Única',
  circulo_notarial: 'El Cerrito',
  ciudad_registro: 'El Cerrito',
  fecha_registro: '20 de marzo de 2026',
  folio_matricula: '370-123456',
  ciudad_firma: 'El Cerrito',
  dia: 21,
  mes: 'abril',
  anio: 2026,
  // Minuta 21 — Notificación privada de cesión del contrato de arrendamiento
  ciudad_fecha: 'El Cerrito, 21 de abril de 2026',
  nombre_arrendatario: 'Alexander García López',
  direccion_arrendatario: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito',
  nombre_cesionario: 'Carlos Eduardo Pérez Ríos',
  ciudad_cesionario: 'Cali',
  cedula_cesionario: '1122334455',
  expedicion_cesionario: 'Cali',
  numero_escritura: '1245',
  notaria: 'Única',
  circulo_notarial: 'El Cerrito',
  fecha_escritura: '15 de marzo de 2026',
  nombre_vendedor: 'Jhon Brandon Martínez Vélez',
  ubicacion_inmueble: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito',
  tipo_contrato: 'escrito',
  destinacion_inmueble: 'vivienda urbana',
  fecha_cesion: '20 de marzo de 2026',
  datos_pago: 'cuenta de ahorros Bancolombia número 123-456789-00 a nombre de Carlos Eduardo Pérez Ríos',
  folio_matricula: '370-123456',
  // Minuta 22 — Contrato de prestación de servicios profesionales
  nombre_contratista: 'Luis Fernando Gómez Torres',
  profesion_contratista: 'abogado',
  estado_civil_contratista: 'casado',
  identificacion_contratista: 'cédula de ciudadanía No. 0987654321 expedida en Cali',
  domicilio_contratista: 'Carrera 8 # 12-34, Barrio Los Pinos, El Cerrito',
  nombre_contratante: 'Carlos Eduardo Pérez Ríos',
  estado_civil_contratante: 'soltero',
  identificacion_contratante: 'cédula de ciudadanía No. 1122334455 expedida en El Cerrito',
  domicilio_contratante: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito',
  objeto_contrato: 'asesorar jurídicamente y representar al contratante en el proceso de sucesión del señor José Arturo Pérez Ríos ante el Juzgado Primero Civil del Circuito de Cali',
  tareas_especificas: '1. Revisar y organizar los documentos de la sucesión. 2. Elaborar y radicar la demanda. 3. Representar al contratante en todas las audiencias. 4. Gestionar la expedición de las hijuelas. 5. Entregar informe escrito de resultados.',
  honorarios_letras: 'tres millones de pesos',
  honorarios_numeros: '$3.000.000',
  ciudad_pago: 'El Cerrito',
  horario_pago: 'horario bancario de lunes a viernes de 8:00 AM a 3:00 PM',
  forma_pago: 'el cincuenta por ciento (50%) al momento de la firma del presente contrato, y el cincuenta por ciento (50%) restante al concluir el proceso y hacerse entrega de las hijuelas',
  garantia_pago: 'transferencia bancaria a la cuenta de ahorros Bancolombia No. 123-456789-00 a nombre de Luis Fernando Gómez Torres',
  mecanismo_controversias: 'mediación ante la Cámara de Comercio de la ciudad y, de no llegarse a acuerdo, por el juez civil competente',
  // Minuta 23 — Contrato de prestación de servicios profesionales de abogado
  nombre_mandante: 'Comercializadora El Cerrito S.A.S.',
  descripcion_mandante: 'sociedad legalmente constituida',
  ciudad_mandante: 'El Cerrito',
  nombre_representante: 'Carlos Eduardo Pérez Ríos',
  ciudad_representante: 'El Cerrito',
  cargo_representante: 'Gerente General',
  nombre_mandatario: 'Luis Fernando Gómez Torres',
  ciudad_mandatario: 'Cali',
  tarjeta_profesional: '123456-A',
  cedula_mandatario: '0987654321',
  expedicion_mandatario: 'Cali',
  asuntos_encargados: 'asesorar jurídicamente a la sociedad mandante en asuntos de derecho comercial y contractual, revisar y elaborar contratos con proveedores y clientes, y representarla en cualquier proceso judicial o administrativo que sea necesario durante la vigencia del contrato',
  honorarios_letras: 'dos millones de pesos mensuales',
  honorarios_numeros: '$2.000.000 mensuales',
  forma_pago_honorarios: 'mensualmente, dentro de los primeros cinco (5) días hábiles de cada mes, mediante transferencia bancaria a la cuenta del mandatario',
  obligaciones_mandatario: 'obrar con diligencia en los asuntos encomendados, absolver oportunamente las consultas que le formule el mandante, rendir informes mensuales de los negocios a su cargo, guardar reserva y confidencialidad sobre la información recibida, y actuar conforme a las normas éticas y al Código Disciplinario del Abogado',
  obligaciones_mandante: 'cancelar los honorarios en la forma pactada en la cláusula segunda, suministrar al mandatario toda la información y documentos que requiera para el normal desempeño de su labor, y cubrir los gastos adicionales que la gestión conlleve, distintos de los honorarios, tales como costas judiciales, copias, notificaciones y desplazamientos',
  plazo_aviso: 'treinta (30) días',
  // Minuta 24 — Poder General
  departamento: 'Valle del Cauca',
  notario: 'Única',
  circulo: 'El Cerrito',
  nombre_poderdante: 'Jhon Brandon Martínez Vélez',
  domicilio_poderdante: 'El Cerrito',
  estado_civil_poderdante: 'soltero',
  cedula_poderdante: '1234567890',
  expedicion_poderdante: 'El Cerrito',
  nombre_apoderado: 'Luis Fernando Gómez Torres',
  domicilio_apoderado: 'Cali',
  cedula_apoderado: '0987654321',
  expedicion_apoderado: 'Cali',
  facultades: 'a) Administración: administrar todos los bienes muebles e inmuebles del poderdante, recaudar sus productos y celebrar los contratos pertinentes a su administración; b) Venta: vender los bienes inmuebles y muebles de propiedad del poderdante; c) Cobros: cobrar y percibir judicial o extrajudicialmente el valor de los créditos que se adeuden al poderdante, expedir los recibos y hacer las cancelaciones correspondientes; d) Pagos: pagar a los acreedores del poderdante y hacer con ellos las transacciones que considere convenientes; e) Representación: representar al poderdante ante cualquier corporación, entidad, funcionario o empleado de las ramas ejecutiva, judicial y legislativa del poder público, en cualquier petición, actuación, diligencia o proceso',
  honorarios: 'el equivalente al diez por ciento (10%) del valor de cada negocio gestionado exitosamente',
  // Minuta 25 — Poder Especial para Venta de Inmueble
  ciudad_poderdante: 'El Cerrito',
  ciudad_apoderado: 'Cali',
  precio_letras: 'ciento veinte millones de pesos',
  precio_numeros: '120.000.000',
  descripcion_inmueble: 'una casa de habitación distinguida con el No. 2A-56 de la Calle 4 Sur, Barrio Villa del Carmen, ciudad de El Cerrito',
  lindero_norte: 'diez (10) metros con la Calle 4 Sur',
  lindero_sur: 'diez (10) metros con el predio de Roberto Salcedo Muñoz',
  lindero_oriente: 'doce (12) metros con la Carrera 2A',
  lindero_occidente: 'doce (12) metros con el predio de Patricia Londoño Vera',
  matricula_inmobiliaria: '370-123456',
  // Minuta 28 — Contrato de Aparcería
  nombre_propietario: 'Jhon Brandon Martínez Vélez',
  cedula_propietario: '1234567890',
  expedicion_propietario: 'El Cerrito',
  domicilio_propietario: 'El Cerrito',
  nombre_aparcero: 'Andrés Felipe Castillo Mora',
  cedula_aparcero: '1122334455',
  expedicion_aparcero: 'El Cerrito',
  domicilio_aparcero: 'El Cerrito',
  hectareas: 'cinco (5)',
  municipio: 'El Cerrito',
  departamento: 'Valle del Cauca',
  nombre_predio: 'La Esperanza',
  linderos_generales: 'Norte: con el río Zabaletas; Sur: con la finca El Paraíso de Roberto Salcedo Muñoz; Oriente: con la carretera que conduce a El Cerrito; Occidente: con el predio de Patricia Londoño Vera',
  linderos_especiales: 'Norte: con el camino interno de la finca La Esperanza; Sur: con el lote No. 2 reservado para el propietario; Oriente: con el caño La Esperanza; Occidente: con el potrero principal de la finca',
  dia_entrega: 1,
  mes_entrega: 'mayo',
  anio_entrega: 2026,
  gastos_explotacion_letras: 'quinientos mil pesos',
  gastos_explotacion_numeros: '500.000',
  dias_anticipo: 'cinco (5)',
  anticipo_letras: 'un millón cuatrocientos mil pesos',
  anticipo_numeros: '1.400.000',
  duracion_anos: 'tres (3)',
  dia_inicio: 1,
  mes_inicio: 'mayo',
  anio_inicio: 2026,
  anos_prorroga: 'uno (1)',
  meses_aviso: 'tres (3)',
  ciudad_firma: 'El Cerrito',
  dia_firma: 21,
  mes_firma: 'abril',
  anio_firma: 2026,
  // Minuta 26 — Revocatoria de Poder General
  ciudad_otorgamiento: 'El Cerrito',
  numero_notario: 'Única',
  circulo_notarial_actual: 'El Cerrito',
  cc_poderdante: '1234567890',
  ciudad_expedicion_cc_poderdante: 'El Cerrito',
  cc_apoderado: '0987654321',
  ciudad_expedicion_cc_apoderado: 'Cali',
  clausulas_poder: '1, 2 y 3',
  numero_escritura_poder: '1245',
  fecha_escritura_poder: '5 de enero de 2023',
  numero_notaria_poder: 'Segunda',
  circulo_notaria_poder: 'Palmira',
  forma_pago_honorarios: 'transferencia bancaria por valor de $2.000.000 al Banco de Bogotá cuenta Nº. 456789123',
  documentos_paz_salvo: 'recibo de transferencia Nº. 00456 de fecha 8 de abril de 2025',
  // Minuta 27 — Contrato Civil de Obra
  numero_contrato: 'CO-001-2026',
  numero_obra: 'OB-001-2026',
  fecha_iniciacion: '1 de mayo de 2026',
  fecha_terminacion: '31 de octubre de 2026',
  cedula_representante: '1122334455',
  expedicion_representante: 'El Cerrito',
  camara_comercio: 'El Cerrito',
  plazo_ejecucion: 'seis (6) meses',
  fecha_entrega: '31 de octubre de 2026',
  multa_mora_letras: 'dos (2)',
  multa_mora_numeros: '2',
  bonificacion_letras: 'uno (1)',
  bonificacion_numeros: '1',
  garantia_anticipo: 'póliza de seguros por el valor total del anticipo, con vigencia igual al plazo del contrato más seis (6) meses adicionales',
  garantia_cumplimiento: 'póliza de seguros equivalente al veinte por ciento (20%) del valor total del contrato',
  garantia_responsabilidad: 'póliza de responsabilidad civil extracontractual por valor mínimo de cincuenta millones de pesos ($50.000.000)',
  garantia_estabilidad: 'póliza de estabilidad de la obra por un término de cinco (5) años contados a partir de la entrega definitiva',
  seguro_vida: 'póliza colectiva de vida por valor de veinte millones de pesos ($20.000.000) por cada trabajador vinculado a la obra',
  garantia_salarios: 'póliza por valor equivalente a tres (3) meses de la nómina total del personal vinculado a la obra',
  notificacion_contratante: 'Carrera 8 # 12-34, Barrio Los Pinos, El Cerrito, Valle del Cauca',
  notificacion_contratista: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito, Valle del Cauca',

  // Carta de Primera y Segunda Convocatoria
  ciudad_fecha: 'Escriba la ciudad y la fecha completa de la carta. Ej: El Cerrito, 5 de abril de 2026.',
  interior_apartamento: 'Escriba el número del interior o apartamento del destinatario. Si es una carta circular para todos los propietarios escriba: Circular.',
  tipo_asamblea: 'Escriba en MAYÚSCULA el tipo de asamblea. Escriba: ORDINARIA si es la reunión anual. Escriba: EXTRAORDINARIA si es por necesidad urgente.',
  tipo_asamblea_lower: 'Escriba en minúscula el tipo de asamblea. Escriba: ordinaria o extraordinaria.',
  fecha_asamblea: 'Escriba la fecha completa en que se realizará la asamblea. Ej: el día martes 21 de abril de 2026.',
  hora_asamblea: 'Escriba la hora de inicio de la asamblea. Ej: 7:00 p.m., 8:00 p.m.',
  lugar_asamblea: 'Escriba el lugar exacto donde se realizará la asamblea. Ej: el salón comunal del conjunto, ubicado en el primer piso del edificio.',
  articulo_reglamento: 'Escriba el número del artículo del reglamento de propiedad horizontal del conjunto que regula las convocatorias a asamblea. Lo encuentra en el reglamento. Ej: 27, 35.',
  orden_del_dia: 'Escriba los puntos del orden del día numerados. Ej: 1. Verificación del quórum. 2. Lectura del acta anterior. 3. Aprobación del orden del día. 4. Elección del presidente y secretario. 5. Informes del administrador y revisor fiscal. 6. Aprobación del balance. 7. Aprobación del presupuesto. 8. Nombramientos. 9. Otros asuntos.',
  porcentaje_quorum: 'Escriba el porcentaje mínimo de coeficientes de copropiedad que deben estar presentes para que la asamblea pueda sesionar en primera convocatoria. Según la Ley 675 de 2001 es el 51%. Ej: 51, 70.',
  nombre_administrador: 'Escriba el nombre completo del administrador o administradora que firma la convocatoria.',
  fecha_primera_convocatoria: 'Escriba la fecha en que se realizó la primera asamblea que fracasó por falta de quórum. Ej: el 21 de abril de 2026.',
  // Estatutos Fundación Gobernación
  nombre_entidad: 'Fundación Semillas de Esperanza',
  duracion_fundacion: 'Escriba la duración de la fundación. Ej: diez (10) años / indefinida / hasta la extinción total de su patrimonio.',
  descripcion_patrimonio_inicial: 'Describa el patrimonio inicial: quién aporta y cuánto. Ej: la suma de cinco millones de pesos ($5.000.000) aportada por Carlos Pérez Ríos, y la suma de cinco millones de pesos ($5.000.000) aportada por María García López.',
  num_miembros_asamblea: 'Escriba el número de miembros de la asamblea de delegatarios en letras y número. Ej: cinco (5), tres (3).',
  quien_designa_miembros: 'Escriba quién designa a los miembros de la asamblea de delegatarios. Ej: los fundadores en reunión conjunta / cada fundador designa un delegado.',
  ciudad_reuniones: 'Escriba la ciudad donde se realizarán las reuniones ordinarias de la asamblea. Ej: El Cerrito, Cali.',
  dias_reunion: 'Escriba los primeros días del mes para la reunión ordinaria, en letras y número. Ej: diez (10), quince (15).',
  mes_reunion: 'Escriba el mes del año en que se realizará la reunión ordinaria anual. Ej: marzo, febrero.',
  periodo_revisor: 'Escriba el período del revisor fiscal en letras y número. Ej: dos (2) años, un (1) año.',
  quorum_consejo: 'Escriba el quórum requerido para las reuniones del consejo. Ej: la mayoría absoluta / tres (3) de sus miembros.',
  votos_disolucion: 'Escriba los votos requeridos para disolver la fundación. Ej: las dos terceras partes / la mayoría absoluta / la totalidad de sus miembros.',
  entidad_remanente: 'Escriba a qué entidad pasarán los bienes sobrantes al liquidarse. Ej: la entidad de beneficencia que determine la asamblea de delegatarios con domicilio en el municipio.',
  quien_nombra_secretario: 'Escriba quién nombra al secretario. Ej: el consejo de administración / la asamblea de delegatarios / el director.',
  // Carta de Primera Convocatoria
  tipo_asamblea_lower: 'Escriba el tipo de asamblea en minúsculas. Ej: ordinaria o extraordinaria.',
  articulo_reglamento: 'Escriba el número del artículo del reglamento de propiedad horizontal que regula las convocatorias. Generalmente está entre el artículo 25 y 40. Consúltelo en su reglamento específico.',
  fecha_asamblea: 'Escriba la fecha completa de la asamblea incluyendo el día de la semana. Ej: viernes 25 de abril de 2026.',
  hora_asamblea: 'Escriba la hora de inicio. Ej: 7:00 p.m., 8:00 p.m., 9:00 a.m.',
  lugar_asamblea: 'Escriba el lugar exacto donde se realizará la asamblea. Ej: salón comunal del conjunto, ubicado en el primer piso del edificio.',
  porcentaje_quorum: 'Escriba el porcentaje de coeficientes requerido para el quórum. Normalmente es 51. Verifique en su reglamento.',
  telefono_administrador: 'Escriba el teléfono de contacto de la administración. Ej: 315 123 4567.',
  // Carta de Segunda Convocatoria
  fecha_primera_convocatoria: 'Escriba la fecha en que se realizó la primera reunión que no pudo sesionar por falta de quórum. Ej: el 8 de abril de 2026.',
  // Poder especial asamblea
  tipo_unidad: 'Escriba el tipo de unidad privada del propietario que da el poder. Ej: apartamento / local / oficina / garaje.',
  numero_unidad: 'Escriba el número del apartamento o unidad. Ej: 101, 302-A, 5.',
  interior_unidad: 'Escriba el número del interior si aplica. Si no aplica escriba: no aplica.',
  numero_convocatoria: 'Escriba si es la primera o la segunda convocatoria. Escriba: primera o segunda.',
  fecha_carta_citacion: 'Escriba la fecha de la carta de convocatoria que recibió el propietario. Ej: 5 de abril de 2026.',
  dia_firma: 'Escriba el día en que el propietario firma el poder. Solo el número. Ej: 20.',
  mes_firma: 'Escriba el mes en que firma el poder. Ej: abril, mayo.',
  anio_firma: 'Escriba el año en que firma el poder. Ej: 2026.',
  // Carta de Primera Convocatoria
  ciudad_fecha: 'El Cerrito, 5 de abril de 2026',
  interior_apartamento: 'Circular',
  tipo_asamblea: 'ORDINARIA',
  tipo_asamblea_lower: 'ordinaria',
  fecha_asamblea: 'el día martes 21 de abril de 2026',
  hora_asamblea: '7:00 p.m.',
  lugar_asamblea: 'el salón comunal del conjunto, ubicado en el primer piso del edificio',
  articulo_reglamento: '27',
  orden_del_dia: '1. Verificación del quórum. 2. Lectura del acta anterior de la asamblea celebrada el pasado 15 de marzo de 2025. 3. Lectura y aprobación del orden del día. 4. Elección del presidente y secretario de la asamblea. 5. Presentación de informes por parte del administrador y el revisor fiscal. 6. Presentación y aprobación del balance de la vigencia 2025. 7. Presentación y aprobación del proyecto de presupuesto para la vigencia 2026. 8. Nombramiento del administrador y revisor fiscal. 9. Otros asuntos.',
  porcentaje_quorum: '51',
  nombre_administrador: 'Patricia Londoño Vera',
  // Carta de Segunda Convocatoria
  fecha_primera_convocatoria: 'el 21 de abril de 2026',
  // Estatutos Fundación Gobernación
  nombre_entidad: 'Fundación Semillas de Esperanza',
  duracion_fundacion: 'indefinida',
  descripcion_patrimonio_inicial: 'la suma de cinco millones de pesos ($5.000.000) aportada por Carlos Eduardo Pérez Ríos, y la suma de cinco millones de pesos ($5.000.000) aportada por María Fernanda García López',
  num_miembros_asamblea: 'cinco (5)',
  quien_designa_miembros: 'los fundadores en reunión conjunta, designando cada uno a su delegado personal',
  ciudad_reuniones: 'El Cerrito',
  dias_reunion: 'diez (10)',
  mes_reunion: 'marzo',
  periodo_revisor: 'dos (2) años',
  quorum_consejo: 'la mayoría absoluta de sus miembros',
  votos_disolucion: 'las dos terceras partes',
  entidad_remanente: 'la entidad de beneficencia sin ánimo de lucro de fines similares que determine la asamblea de delegatarios con domicilio en el municipio de El Cerrito',
  quien_nombra_secretario: 'el consejo de administración',
  // Carta de Primera Convocatoria
  unidad_privada: 'apartamento 101',
  tipo_asamblea_lower: 'ordinaria',
  articulo_reglamento: '27',
  fecha_asamblea: 'viernes 25 de abril de 2026',
  hora_asamblea: '7:00 p.m.',
  lugar_asamblea: 'salón comunal del conjunto, ubicado en el primer piso del edificio',
  porcentaje_quorum: '51',
  telefono_administrador: '315 123 4567',
  // Carta de Segunda Convocatoria
  fecha_primera_convocatoria: 'el 8 de abril de 2026',
  // Poder especial asamblea
  tipo_unidad: 'apartamento',
  numero_unidad: '101',
  interior_unidad: 'no aplica',
  numero_convocatoria: 'primera',
  fecha_carta_citacion: '5 de abril de 2026',
  dia_firma: 20,
  mes_firma: 'abril',
  anio_firma: 2026,
  // Acta de Asamblea General de Propietarios
  numero_acta: '001',
  tipo_asamblea: 'ORDINARIA',
  nombre_conjunto: 'Conjunto Residencial Los Nogales',
  hora: '7:00 p.m.',
  convocante: 'el administrador',
  fecha_convocatoria: '5 de abril de 2026',
  lugar_reunion: 'salón comunal del conjunto, ubicado en el primer piso del edificio',
  secretario_lectura: 'Alexander García López',
  orden_del_dia: '1. Verificación del quórum. 2. Nombramiento del presidente y secretario. 3. Informe del administrador. 4. Informe del revisor fiscal. 5. Presentación y aprobación del balance vigencia 2025. 6. Presentación y aprobación del presupuesto vigencia 2026. 7. Nombramiento del administrador y consejo de administración. 8. Propuestas, observaciones y comentarios de los asistentes.',
  lista_asistentes: '1. Jhon Brandon Martínez Vélez - Apto 101 - Coeficiente 5.2%. 2. Alexander García López - Apto 202 - Coeficiente 4.8%. 3. Carlos Eduardo Pérez Ríos - Apto 303 - Coeficiente 5.5%. 4. Diana Patricia Ruiz Morales - Apto 404 - Coeficiente 4.9%. 5. Roberto Salcedo Muñoz - Apto 505 - Coeficiente 5.1%.',
  nombre_presidente: 'Jhon Brandon Martínez Vélez',
  cedula_presidente: '1234567890',
  inmueble_presidente: 'apartamento 101',
  postulados_presidente: 'Jhon Brandon Martínez Vélez y Carlos Eduardo Pérez Ríos',
  nombre_secretario: 'Alexander García López',
  cedula_secretario: '0987654321',
  inmueble_secretario: 'apartamento 202',
  postulados_secretario: 'Alexander García López y Diana Patricia Ruiz Morales',
  nombre_administrador: 'Patricia Londoño Vera',
  resumen_informe_administrador: 'La administradora informó sobre el mantenimiento realizado a la planta eléctrica, la reparación de la cubierta del quinto piso, el estado de la cartera con tres unidades en mora por valor de $1.800.000, y la renovación del contrato de vigilancia con la empresa Seguridad Total Ltda.',
  informe_revisor_fiscal: 'El revisor fiscal Andrés Felipe Castillo Mora presentó informe favorable sobre el manejo de los recursos de la copropiedad durante la vigencia 2025, con observación sobre la necesidad de actualizar el libro de contabilidad antes del 30 de mayo de 2026.',
  fecha_inicio_balance: '1 de enero de 2025',
  fecha_fin_balance: '31 de diciembre de 2025',
  resultado_balance: 'El balance fue aprobado por unanimidad con nueve (9) votos a favor y ninguno en contra.',
  valor_presupuesto: 'cuarenta y ocho millones de pesos ($48.000.000) para la vigencia 2026',
  resultado_presupuesto: 'El presupuesto fue aprobado por mayoría con ocho (8) votos a favor y uno (1) en contra, quedando establecida una cuota mensual de administración de doscientos mil pesos ($200.000) por unidad.',
  nombramientos: 'Se ratificó como administradora a Patricia Londoño Vera por el período 2026-2027. Se eligió el nuevo consejo de administración integrado por: Principal 1: Jhon Brandon Martínez Vélez. Principal 2: Carlos Eduardo Pérez Ríos. Principal 3: Diana Patricia Ruiz Morales. Suplente 1: Roberto Salcedo Muñoz. Suplente 2: Ana María Salcedo Vera.',
  propuestas_observaciones: 'El propietario Carlos Eduardo Pérez Ríos propuso instalar cámaras de seguridad adicionales en el parqueadero, propuesta que fue aprobada por mayoría y quedará incluida en el presupuesto del segundo semestre de 2026.',
  hora_cierre: '9:30 p.m.',
  // Reglamento de Propiedad Horizontal
  nombre_apoderado: 'Luis Fernando Gómez Torres',
  cedula_apoderado: '0987654321',
  expedicion_apoderado: 'Cali',
  domicilio_apoderado: 'El Cerrito',
  nombre_edificio: 'Edificio Los Nogales',
  direccion_edificio: 'Carrera 10 # 25-40',
  ciudad_edificio: 'El Cerrito',
  numero_lote: '5',
  manzana: 'A',
  nombre_urbanizacion: 'Urbanización El Refugio',
  area_lote: '800',
  lindero_norte: 'diez (10) metros con la Calle 4 Sur',
  lindero_sur: 'diez (10) metros con el predio de Roberto Salcedo Muñoz',
  lindero_oriente: 'doce (12) metros con la Carrera 2A',
  lindero_occidente: 'doce (12) metros con el predio de Patricia Londoño Vera',
  num_pisos: 'cinco (5)',
  num_unidades: 'veinte (20)',
  propietario_anterior: 'Carlos Eduardo Pérez Ríos',
  cedula_propietario_anterior: '1122334455',
  expedicion_propietario_anterior: 'El Cerrito',
  escritura_anterior: '1245',
  fecha_escritura_anterior: '10 de marzo de 2019',
  notaria_anterior: 'Segunda',
  circulo_anterior: 'El Cerrito',
  ciudad_registro: 'Cali',
  fecha_registro: '20 de mayo de 2018',
  folio_matricula: '370-123456',
  descripcion_unidades: 'sala-comedor, tres alcobas, dos baños, cocina integral, balcón y garaje',
  destinacion_inmueble: 'habitacional',
  dias_pago: 'cinco (5)',
  num_miembros_consejo: 'tres (3)',
  quien_nombra_administrador: 'la asamblea general de propietarios',
  periodo_administrador: 'un (1) año',
  porcentaje_fondo: 'diez (10)',
  num_miembros_comite: 'tres (3)',
  // Minuta 29 — Fianza Abierta
  nombre_representante_fiador: 'Carlos Eduardo Pérez Ríos',
  cedula_representante_fiador: '1122334455',
  expedicion_representante_fiador: 'El Cerrito',
  nombre_fiador: 'Comercializadora El Cerrito S.A.S.',
  camara_comercio_fiador: 'El Cerrito',
  nit_fiador: '900.123.456-7',
  nombre_acreedor: 'Luis Fernando Gómez Torres',
  cedula_acreedor: '0987654321',
  expedicion_acreedor: 'Cali',
  nombre_deudor: 'Alexander García López',
  cuantia_letras: 'cincuenta millones de pesos',
  cuantia_numeros: '50.000.000',
  plazo_letras: 'dos',
  plazo_numeros: '2',
  num_ejemplares: 'dos',
  num_ejemplares_numeros: '2',
  // Minuta 30 — Prenda Abierta Sin Tenencia del Acreedor
  nombre_representante_acreedor: 'Carlos Eduardo Pérez Ríos',
  cedula_representante_acreedor: '1122334455',
  expedicion_representante_acreedor: 'El Cerrito',
  domicilio_representante_acreedor: 'El Cerrito',
  nombre_acreedor: 'Cooperativa de Ahorro y Crédito El Cerrito Ltda.',
  domicilio_acreedor: 'El Cerrito',
  escritura_acreedor: '567',
  notaria_acreedor: 'Única',
  circulo_acreedor: 'El Cerrito',
  fecha_escritura_acreedor: '10 de enero de 2010',
  nombre_deudor: 'Alexander García López',
  cedula_deudor: '0987654321',
  expedicion_deudor: 'El Cerrito',
  domicilio_deudor: 'El Cerrito',
  valor_prestamo_letras: 'veinte millones de pesos',
  valor_prestamo_numeros: '20.000.000',
  fecha_contrato_prestamo: '21 de abril de 2026',
  numero_pagare: '001-2026',
  fecha_pagare: '21 de abril de 2026',
  vencimiento_pagare: '21 de abril de 2028',
  descripcion_bien_prendado: 'un vehículo automotor clase automóvil, marca Chevrolet, línea Spark, modelo 2022, color blanco, placa ABC123, No. de motor ABC123456, No. de serie VIN987654321, de servicio particular',
  direccion_bienes: 'Calle 4 Sur # 2A-56',
  barrio_bienes: 'Villa del Carmen',
  ciudad_bienes: 'El Cerrito',
  dias_aviso_inspeccion: 'tres (3)',
  clausula_penal_letras: 'dos millones de pesos',
  clausula_penal_numeros: '2.000.000',
  duracion: 'veinticuatro (24) meses',
  dias_aviso_perdida: 'tres (3)',
  // Minuta 31 — Contrato de Pignoración de Rentas
  descripcion_credito_pignorado: 'los cánones de arrendamiento del inmueble ubicado en Calle 4 Sur # 2A-56, Barrio Villa del Carmen, ciudad de El Cerrito, que el arrendatario Alexander García López se obligó a pagar según contrato de arrendamiento del 1 de mayo de 2025, por valor de un millón doscientos mil pesos ($1.200.000) mensuales, durante doce (12) meses',
  fecha_contrato: '21 de abril de 2026',
  numero_pagare: '001-2026',
  fecha_pagare: '21 de abril de 2026',
  vencimiento_pagare: '21 de abril de 2028',
  fecha_limite_notificacion: 'el 30 de abril de 2026',
  descripcion_titulo: 'contrato de arrendamiento de fecha 1 de mayo de 2025, suscrito entre Jhon Brandon Martínez Vélez como arrendador y Alexander García López como arrendatario, sobre el inmueble ubicado en Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito',
  mecanismo_controversias: 'mediación ante la Cámara de Comercio de la ciudad y, de no llegarse a acuerdo, por el juez civil competente',
  // Minuta 32 — Hipoteca Abierta
  nombre_hipotecante: 'Jhon Brandon Martínez Vélez',
  domicilio_hipotecante: 'El Cerrito',
  cedula_hipotecante: '1234567890',
  expedicion_hipotecante: 'El Cerrito',
  estado_civil_hipotecante: 'soltero',
  grado_hipoteca: 'primer',
  cuantia_hipoteca_letras: 'cien millones de pesos',
  cuantia_hipoteca_numeros: '100.000.000',
  descripcion_inmueble: 'casa de habitación ubicada en la Calle 4 Sur # 2A-56, Barrio Villa del Carmen, ciudad de El Cerrito, con área aproximada de ciento veinte (120) metros cuadrados, cuyos linderos son: Norte: con la Calle 4 Sur, en extensión de diez (10) metros; Sur: con el predio de Roberto Salcedo Muñoz, en extensión de diez (10) metros; Oriente: con la Carrera 2A, en extensión de doce (12) metros; Occidente: con el predio de Patricia Londoño Vera, en extensión de doce (12) metros',
  folio_matricula: '370-123456',
  fecha_certificado: '15 de abril de 2026',
  ciudad_registro: 'El Cerrito',
  nombre_vendedor_anterior: 'Carlos Eduardo Pérez Ríos',
  numero_escritura_anterior: '1245',
  fecha_escritura_anterior: '15 de mayo de 2018',
  notaria_anterior: 'Única',
  circulo_anterior: 'El Cerrito',
  fecha_registro: '20 de mayo de 2018',
  hipotecas_anteriores: 'el inmueble no soporta hipotecas anteriores y se encuentra libre de todo gravamen hipotecario',
  ciudad_cumplimiento: 'El Cerrito',
  // Minuta 33 — Contrato de Mutuo Civil Garantizado con Hipoteca
  nombre_mutuante: 'Carlos Eduardo Pérez Ríos',
  cedula_mutuante: '1122334455',
  expedicion_mutuante: 'El Cerrito',
  domicilio_mutuante: 'El Cerrito',
  nombre_mutuario: 'Jhon Brandon Martínez Vélez',
  cedula_mutuario: '1234567890',
  expedicion_mutuario: 'El Cerrito',
  domicilio_mutuario: 'El Cerrito',
  valor_prestamo_letras: 'veinte millones de pesos',
  valor_prestamo_numeros: '20.000.000',
  forma_entrega_dinero: 'cheque de gerencia No. 00123 del Banco de Bogotá, sucursal El Cerrito',
  fecha_vencimiento: 'el veintiuno (21) de abril de 2028',
  forma_pago_cuotas: 'veinticuatro (24) cuotas mensuales iguales de ochocientos cincuenta mil pesos ($850.000) cada una, pagaderas los días 21 de cada mes',
  interes_corriente: '1.5',
  periodicidad_interes: 'mensual',
  interes_mora: '2',
  periodicidad_mora: 'mensual',
  plazo_pago_anticipado: 'la mitad',
  descripcion_inmueble_hipotecado: 'casa de habitación ubicada en la Calle 4 Sur # 2A-56, Barrio Villa del Carmen, ciudad de El Cerrito, con área aproximada de ciento veinte (120) metros cuadrados',
  linderos_inmueble: 'Norte: con la Calle 4 Sur, en extensión de diez (10) metros; Sur: con el predio de Roberto Salcedo Muñoz, en extensión de diez (10) metros; Oriente: con la Carrera 2A, en extensión de doce (12) metros; Occidente: con el predio de Patricia Londoño Vera, en extensión de doce (12) metros',
  situacion_gravamenes: 'no soporta ningún gravamen, embargo, demanda civil inscrita ni limitación del dominio',
  responsable_gastos: 'ambas partes por partes iguales',
  // Minuta 34 — Constitución de Hipoteca para Garantizar Saldo
  nombre_hipotecante: 'Jhon Brandon Martínez Vélez',
  domicilio_hipotecante: 'El Cerrito',
  cedula_hipotecante: '1234567890',
  expedicion_hipotecante: 'El Cerrito',
  nombre_acreedor: 'Carlos Eduardo Pérez Ríos',
  domicilio_acreedor: 'El Cerrito',
  cedula_acreedor: '1122334455',
  expedicion_acreedor: 'El Cerrito',
  descripcion_inmueble: 'casa de habitación ubicada en la Calle 4 Sur # 2A-56, Barrio Villa del Carmen, ciudad de El Cerrito, con área aproximada de ciento veinte (120) metros cuadrados, cuyos linderos son: Norte: con la Calle 4 Sur en extensión de diez (10) metros; Sur: con el predio de Roberto Salcedo Muñoz en diez (10) metros; Oriente: con la Carrera 2A en doce (12) metros; Occidente: con el predio de Patricia Londoño Vera en doce (12) metros',
  folio_matricula: '370-123456',
  fecha_certificado: '15 de abril de 2026',
  ciudad_registro: 'El Cerrito',
  nombre_vendedor_anterior: 'Carlos Eduardo Pérez Ríos',
  numero_escritura_anterior: '1245',
  fecha_escritura_anterior: '15 de mayo de 2018',
  notaria_anterior: 'Única',
  circulo_anterior: 'El Cerrito',
  plazo_garantia: 'un (1) año',
  cuantia_letras: 'cincuenta millones de pesos',
  cuantia_numeros: '50.000.000',
  interes_corriente: '1.5',
  interes_mora: '2',
  // Minuta 35 — Ampliación de Hipoteca
  numero_escritura_hipoteca: '1245',
  fecha_escritura_hipoteca: '15 de mayo de 2024',
  notaria_hipoteca: 'Única',
  circulo_hipoteca: 'El Cerrito',
  fecha_inscripcion: '20 de mayo de 2024',
  grado_hipoteca: 'primer',
  cuantia_original_letras: 'cincuenta millones de pesos',
  cuantia_original_numeros: '50.000.000',
  direccion_inmueble: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito',
  linderos_inmueble: 'Norte: con la Calle 4 Sur en extensión de diez (10) metros; Sur: con el predio de Roberto Salcedo Muñoz en diez (10) metros; Oriente: con la Carrera 2A en doce (12) metros; Occidente: con el predio de Patricia Londoño Vera en doce (12) metros',
  fecha_registro_anterior: '20 de mayo de 2018',
  descripcion_obligacion_original: 'el saldo del precio de compraventa del inmueble por valor de cincuenta millones de pesos ($50.000.000)',
  cuantia_ampliada_letras: 'cien millones de pesos',
  cuantia_ampliada_numeros: '100.000.000',
  nuevo_plazo_letras: 'tres',
  nuevo_plazo_numeros: '3',
  clausula_modificada: 'tercera',
  nueva_redaccion_clausula: 'Esta hipoteca garantiza todas y cada una de las obligaciones que el exponente contraiga con el acreedor dentro del término de tres (3) años contados desde la fecha de la presente escritura y hasta la cantidad de cien millones de pesos ($100.000.000) moneda corriente, por capital, intereses, costos y gastos de cobranza si fuere el caso.',
  // Minuta 36 — Cancelación de Hipoteca
  nombre_acreedor: 'Carlos Eduardo Pérez Ríos',
  cedula_acreedor: '1122334455',
  expedicion_acreedor: 'El Cerrito',
  nombre_deudor: 'Jhon Brandon Martínez Vélez',
  cedula_deudor: '1234567890',
  expedicion_deudor: 'El Cerrito',
  domicilio_deudor: 'El Cerrito',
  numero_escritura_hipoteca: '1245',
  fecha_escritura_hipoteca: '15 de mayo de 2024',
  notaria_hipoteca: 'Única',
  circulo_hipoteca: 'El Cerrito',
  fecha_inscripcion: '20 de mayo de 2024',
  direccion_inmueble: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito',
  clausulas_hipoteca: 'primera y segunda',
  cuantia_letras: 'cincuenta millones de pesos',
  cuantia_numeros: '50.000.000',
  // Minuta 37 — Compraventa bajo Propiedad Horizontal
  nombre_vendedor: 'Carlos Eduardo Pérez Ríos',
  cedula_vendedor: '1122334455',
  expedicion_vendedor: 'El Cerrito',
  estado_civil_vendedor: 'soltero',
  domicilio_vendedor: 'Cali',
  nombre_comprador: 'Jhon Brandon Martínez Vélez',
  cedula_comprador: '1234567890',
  expedicion_comprador: 'El Cerrito',
  estado_civil_comprador: 'soltero',
  domicilio_comprador: 'El Cerrito',
  numero_apartamento: '301',
  nombre_edificio: 'Edificio Los Nogales',
  ciudad_inmueble: 'Cali',
  direccion_edificio: 'Carrera 10 # 25-40',
  cedula_catastral_edificio: '76001000100001',
  numero_lote: '5',
  nombre_urbanizacion: 'Urbanización El Refugio',
  area_lote: '800',
  linderos_generales_edificio: 'Norte: con la Carrera 10 en extensión de veinte (20) metros; Sur: con el predio de Luis Fernando Gómez en veinte (20) metros; Oriente: con la Calle 25 en cuarenta (40) metros; Occidente: con el predio de Diana Patricia Ruiz en cuarenta (40) metros',
  ubicacion_apartamento: 'tercer piso, costado norte',
  acceso_apartamento: 'el corredor del tercer piso, escalera principal',
  area_privada: '68',
  linderos_especiales_apartamento: 'Norte: con la fachada del edificio en extensión de siete (7) metros; Sur: con el apartamento 302 en siete (7) metros; Oriente: con el corredor común del tercer piso en nueve (9) metros; Occidente: con la fachada posterior del edificio en nueve (9) metros',
  dependencias_apartamento: 'sala-comedor, dos alcobas, un baño completo, cocina, zona de ropas y balcón',
  licencia_construccion: 'LC-2014-1234',
  entidad_licencia: 'Curaduría Urbana No. 1 de Cali',
  escritura_reglamento: '2341',
  fecha_escritura_reglamento: '15 de enero de 2015',
  notaria_reglamento: 'Segunda',
  ciudad_registro: 'Cali',
  folio_edificio: '370-100000',
  folio_apartamento: '370-123456',
  nombre_vendedor_anterior: 'Constructora El Refugio S.A.S.',
  numero_escritura_anterior: '1890',
  fecha_escritura_anterior: '10 de marzo de 2019',
  notaria_anterior: 'Segunda',
  cedula_catastral_apartamento: '76001000100301',
  precio_letras: 'ciento cincuenta millones de pesos',
  precio_numeros: '150.000.000',
  forma_pago: 'de contado, en este acto, mediante cheque de gerencia No. 00456 del Banco de Bogotá, sucursal Cali',
  mes_paz_salvo_administracion: 'abril de 2026',
  // Disolución y Liquidación de Sociedad Conyugal -
  nombre_conyuge1: 'Jhon Brandon Martínez Vélez',
  cedula_conyuge1: '1234567890',
  expedicion_conyuge1: 'El Cerrito',
  domicilio_conyuge1: 'El Cerrito',
  nombre_conyuge2: 'Diana Patricia García López',
  cedula_conyuge2: '0987654321',
  expedicion_conyuge2: 'Cali',
  domicilio_conyuge2: 'Cali',
  tipo_matrimonio: 'civil',
  fecha_matrimonio: 'el 15 de junio de 2010',
  lugar_matrimonio: 'Notaría Única de El Cerrito',
  ciudad_matrimonio: 'El Cerrito',
  apellidos_sociedad: 'Martínez-García',
  activo_bruto: '1. Casa de habitación ubicada en la Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito, con matrícula inmobiliaria 370-123456, avaluada en cien millones de pesos ($100.000.000). 2. Vehículo automotor Chevrolet Spark, modelo 2020, placas ABC123, avaluado en treinta millones de pesos ($30.000.000). 3. Saldo en cuenta de ahorros Bancolombia número 123-456789-00, por valor de cinco millones de pesos ($5.000.000).',
  total_activo_bruto_letras: 'ciento treinta y cinco millones de pesos',
  total_activo_bruto_numeros: '135.000.000',
  pasivo_externo: '1. Obligación a favor del Banco Bancolombia, por quince millones de pesos ($15.000.000) moneda legal colombiana, a cargo del señor Jhon Brandon Martínez Vélez.',
  total_pasivo_externo_letras: 'quince millones de pesos',
  total_pasivo_externo_numeros: '15.000.000',
  total_liquidacion_letras: 'ciento veinte millones de pesos',
  total_liquidacion_numeros: '120.000.000',
  gananciales_letras: 'sesenta millones de pesos',
  gananciales_numeros: '60.000.000',
  igualaciones: 'La cónyuge Diana Patricia García López se obliga a pagar a su cónyuge Jhon Brandon Martínez Vélez la suma de cinco millones de pesos ($5.000.000) a título de igualación, en compensación por el mayor valor de los bienes que recibe.',
  hijuela1_conyuge: 'Diana Patricia García López',
  hijuela1_descripcion: 'A. Casa de habitación ubicada en la Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito, con matrícula inmobiliaria 370-123456, adjudicada en la suma de cien millones de pesos ($100.000.000). B. Saldo en cuenta de ahorros Bancolombia número 123-456789-00, adjudicado en la suma de cinco millones de pesos ($5.000.000).',
  hijuela1_total_letras: 'ciento cinco millones de pesos',
  hijuela1_total_numeros: '105.000.000',
  hijuela2_conyuge: 'Jhon Brandon Martínez Vélez',
  hijuela2_descripcion: 'A. Vehículo automotor Chevrolet Spark, modelo 2020, placas ABC123, motor ABC123456, adjudicado en la suma de treinta millones de pesos ($30.000.000).',
  hijuela2_total_letras: 'treinta millones de pesos',
  hijuela2_total_numeros: '30.000.000',
  conyuge_asume_pasivo: 'Jhon Brandon Martínez Vélez',
  // Disolución Sin Bienes Comunes -
  lugar_registro_matrimonio: 'Notaría Única de El Cerrito',
  hijos: 'De dicha unión matrimonial nació: Santiago Martínez García el 10 de marzo de 2015 en El Cerrito, Valle del Cauca, siendo su nacimiento inscrito en el registro civil de nacimientos de la Notaría Única del Círculo de El Cerrito.',
  // Sociedad Patrimonial Unión Marital -
  nombre_companero1: 'Carlos Andrés Torres Salcedo',
  cedula_companero1: '1122334455',
  expedicion_companero1: 'Palmira',
  domicilio_companero1: 'Cali',
  nombre_companero2: 'Marcela Ruiz Ospina',
  cedula_companero2: '5544332211',
  expedicion_companero2: 'Cali',
  domicilio_companero2: 'Cali',
  fecha_sentencia: 'el 20 de febrero de 2024',
  juzgado_sentencia: 'Juzgado Primero de Familia de Cali',
  activo_social: '1. Apartamento ubicado en la Carrera 8 # 12-34, Barrio Los Pinos, Cali, con matrícula inmobiliaria 370-654321, avaluado en ochenta millones de pesos ($80.000.000). 2. Vehículo automotor Renault Logan, modelo 2019, placas XYZ789, motor XYZ789012, avaluado en veinte millones de pesos ($20.000.000). 3. Saldo en cuenta de ahorros Davivienda número 456-789012-11 a nombre del señor Carlos Andrés Torres Salcedo, por valor de diez millones de pesos ($10.000.000).',
  pasivo_social: 'No existen pasivos sociales.',
  total_pasivo_letras: 'cero pesos',
  total_pasivo_numeros: '0',
  total_activo_liquido_letras: 'ciento diez millones de pesos',
  total_activo_liquido_numeros: '110.000.000',
  hijuela1_companero: 'Marcela Ruiz Ospina',
  hijuela1_descripcion: 'A. Apartamento ubicado en la Carrera 8 # 12-34, Barrio Los Pinos, Cali, con matrícula inmobiliaria 370-654321, adjudicado en la suma de ochenta millones de pesos ($80.000.000).',
  hijuela2_companero: 'Carlos Andrés Torres Salcedo',
  hijuela2_descripcion: 'A. Vehículo automotor Renault Logan, modelo 2019, placas XYZ789, adjudicado en la suma de veinte millones de pesos ($20.000.000). B. Saldo en cuenta de ahorros Davivienda número 456-789012-11, adjudicado en la suma de diez millones de pesos ($10.000.000).',

}

const PASOS_SIGUIENTE = {
  'capitulaciones-matrimoniales': {
    titulo: 'Capitulaciones Matrimoniales',
    pasos: [
      { num: 1, titulo: 'Deben otorgarse ANTES del matrimonio', descripcion: 'Las capitulaciones matrimoniales son irrevocables desde el día de la celebración del matrimonio. Una vez casados no pueden alterarse, ni siquiera con el consentimiento de ambos cónyuges. Por eso deben firmarse antes de la boda.' },
      { num: 2, titulo: 'Escritura pública si hay inmuebles — documento privado si no', descripcion: 'Si alguno de los bienes que se incluyen es inmueble, la escritura pública ante Notario es obligatoria. Si solo hay bienes muebles y el valor total no supera los límites legales, puede hacerse por documento privado firmado ante tres testigos.' },
      { num: 3, titulo: 'El Notario inscribe en el Registro de Varios', descripcion: 'El Notario debe inscribir las capitulaciones en el "registro de varios" que lleva como encargado del registro del estado civil. También hará anotaciones en los registros civiles de nacimiento de los contrayentes.' },
      { num: 4, titulo: 'Si hay inmuebles: también registrar en Instrumentos Públicos', descripcion: 'Si las capitulaciones afectan bienes inmuebles, deben inscribirse adicionalmente en la Oficina de Registro de Instrumentos Públicos de la ciudad donde están ubicados esos inmuebles.' },
      { num: 5, titulo: 'Guardar copia de la escritura', descripcion: 'Cada contrayente debe conservar una copia auténtica de la escritura de capitulaciones. Este documento es la prueba legal del régimen de bienes acordado y puede necesitarse años después en caso de separación o divorcio.' },
    ]
  },
  'poder-contraer-matrimonio': {
    titulo: 'Poder para Contraer Matrimonio',
    pasos: [
      { num: 1, titulo: 'El poder debe ser escritura pública obligatoriamente', descripcion: 'A diferencia de otros poderes, el poder para contraer matrimonio debe extenderse por escritura pública ante Notario según el artículo 11 de la Ley 57 de 1887. No es válido como documento privado.' },
      { num: 2, titulo: 'El poder puede revocarse — pero con límite', descripcion: 'El poder es revocable, pero la revocación NO surte efectos si es notificada al otro contrayente después de celebrado el matrimonio. Para revocar eficazmente debe notificarse antes de la ceremonia.' },
      { num: 3, titulo: 'El apoderado debe mencionar expresamente con quién se casa', descripcion: 'En el poder debe figurar el nombre completo de la persona con quien se va a contraer matrimonio. Un poder en blanco sin nombre del otro contrayente no es válido para este efecto.' },
      { num: 4, titulo: 'Presentar el poder original ante el Notario del matrimonio', descripcion: 'El apoderado debe presentar el poder original o copia auténtica ante el Notario que va a celebrar el matrimonio, antes del inicio de la diligencia.' },
    ]
  },
  'solicitud-matrimonio-notario': {
    titulo: 'Solicitud de Celebración de Matrimonio ante Notario',
    pasos: [
      { num: 1, titulo: 'Presentarla ante el Notario del domicilio de cualquiera de los contrayentes', descripcion: 'La solicitud puede presentarse ante el Notario del círculo del domicilio de cualquiera de los dos contrayentes, a elección de ellos.' },
      { num: 2, titulo: 'El Notario fija un edicto por 5 días hábiles', descripcion: 'Recibida la solicitud con sus anexos, el Notario fija un edicto por cinco días hábiles en la secretaría de su despacho. Durante ese tiempo cualquier persona puede presentar oposición al matrimonio por impedimento legal.' },
      { num: 3, titulo: 'Documentos que deben acompañar la solicitud', descripcion: 'Siempre: registros civiles de nacimiento de ambos contrayentes (expedidos máximo un mes antes) y fotocopias de cédulas autenticadas. Además: si alguno es DIVORCIADO debe llevar copia del registro civil del matrimonio anterior y de la sentencia de divorcio. Si alguno es VIUDO debe llevar copia del registro civil de defunción del cónyuge anterior. Si hay hijos de matrimonio anterior, también se requiere inventario solemne de bienes.' },
      { num: 4, titulo: 'Si algún contrayente es de otro municipio', descripcion: 'Si el primer contrayente es vecino de otro municipio o lleva menos de seis meses en el municipio donde se casará, el Notario debe oficiar a su similar del domicilio del contrayente para que fije edicto adicional por quince días.' },
      { num: 5, titulo: 'Después del edicto viene la escritura pública', descripcion: 'Desfijado el edicto sin oposición y agregado a la solicitud, se procede al otorgamiento de la escritura pública de matrimonio con la cual queda perfeccionado el vínculo.' },
    ]
  },
  'matrimonio-civil-notario': {
    titulo: 'Matrimonio Civil ante Notario',
    pasos: [
      { num: 1, titulo: 'El matrimonio se solemniza mediante escritura pública', descripcion: 'El matrimonio civil ante Notario se perfecciona con el otorgamiento de la escritura pública. No es válido sin este requisito. La escritura se inscribe en el registro civil de matrimonios que lleva la Notaría.' },
      { num: 2, titulo: 'El Notario comunica el matrimonio al día siguiente', descripcion: 'El Notario debe comunicar a los funcionarios del registro civil la celebración del matrimonio, a más tardar al día siguiente, para que hagan las respectivas notas marginales en los registros civiles de nacimiento de los contrayentes.' },
      { num: 3, titulo: 'La escritura protocoliza todos los documentos', descripcion: 'Con la escritura se protocolizan la solicitud, los registros civiles de nacimiento, las fotocopias de cédulas autenticadas y el edicto. Todos quedan incorporados al instrumento notarial.' },
      { num: 4, titulo: 'El matrimonio forma la sociedad conyugal desde ese momento', descripcion: 'Salvo que haya capitulaciones matrimoniales previas, desde el momento de celebrar el matrimonio se forma automáticamente la sociedad conyugal de bienes entre los cónyuges.' },
      { num: 5, titulo: 'Solicitar copia auténtica del registro civil de matrimonio', descripcion: 'Después del matrimonio, solicite a la Notaría una copia auténtica del registro civil de matrimonio. Este documento es el que acredita legalmente el vínculo matrimonial y lo necesitará para trámites futuros.' },
    ]
  },

  1: { titulo: 'Promesa de Compraventa de Inmueble', pasos: [{ num: 1, titulo: 'Firmar el documento', descripcion: 'Reúnase con la otra parte y firmen el contrato ante dos testigos mayores de edad. Cada parte se queda con una copia original firmada.' }, { num: 2, titulo: 'Autenticar las firmas (opcional pero recomendado)', descripcion: 'Lleven el documento a cualquier Notaría con sus cédulas de ciudadanía. El notario verificará su identidad y autenticará las firmas. Costo aproximado: entre $15.000 y $30.000 por firma.' }, { num: 3, titulo: 'Guardar el documento en lugar seguro', descripcion: 'Conserve su copia en un lugar seguro. Este documento es prueba legal del acuerdo entre las partes.' }, { num: 4, titulo: 'En la fecha acordada: ir a la Notaría', descripcion: 'El día pactado en el contrato, ambas partes deben ir a la Notaría acordada con: cédulas de ciudadanía, certificado de tradición y libertad del inmueble (vigente, máximo 30 días), paz y salvo de impuesto predial, paz y salvo de valorización, paz y salvo de servicios públicos.' }, { num: 5, titulo: 'Firma de la Escritura Pública', descripcion: 'El Notario redactará y leerá la escritura de compraventa. Ambas partes la firman. El vendedor recibe el pago acordado.' }, { num: 6, titulo: 'Pagar los impuestos de la transacción', descripcion: 'Deben pagarse: el impuesto de registro (aproximadamente 1% del valor del inmueble) y los derechos notariales. Estos gastos se pagan en la Notaría o en el banco autorizado.' }, { num: 7, titulo: 'Registrar la Escritura', descripcion: 'Lleven la escritura a la Oficina de Registro de Instrumentos Públicos de su ciudad. Allí registran el cambio de propietario. A partir de ese momento el comprador es el nuevo dueño legal del inmueble.' }] },
  2: { titulo: 'Promesa de Donación', pasos: [{ num: 1, titulo: 'Firmar el documento', descripcion: 'Reúnanse donante y donatario y firmen el contrato ante dos testigos. Cada parte conserva una copia.' }, { num: 2, titulo: 'Solicitar la Insinuación Notarial', descripcion: 'Deben ir a una Notaría a solicitar la insinuación. Lleven: cédulas de ciudadanía, el contrato de promesa de donación firmado, documentos del bien a donar (escritura, certificado de tradición). El Notario autorizará la donación mediante acto notarial.' }, { num: 3, titulo: 'Firma de la Escritura Pública de Donación', descripcion: 'Una vez aprobada la insinuación, el Notario elabora la escritura de donación. Ambas partes la firman en la Notaría.' }, { num: 4, titulo: 'Pagar los impuestos', descripcion: 'Se deben pagar los derechos notariales y el impuesto de registro. El responsable es quien acordaron en el contrato.' }, { num: 5, titulo: 'Registrar la Escritura', descripcion: 'Lleven la escritura a la Oficina de Registro de Instrumentos Públicos. Allí quedará registrado el nuevo propietario del bien donado.' }] },
  3: { titulo: 'Compraventa de Inmueble', pasos: [{ num: 1, titulo: 'Este contrato debe elevarse a Escritura Pública', descripcion: 'En Colombia, la compraventa de inmuebles SIEMPRE debe hacerse mediante Escritura Pública ante Notario. Este documento es el borrador del acuerdo.' }, { num: 2, titulo: 'Ir a la Notaría', descripcion: 'Ambas partes deben ir a la Notaría acordada con: cédulas de ciudadanía, certificado de tradición y libertad del inmueble (vigente), paz y salvo de impuesto predial, paz y salvo de valorización, paz y salvo de servicios públicos.' }, { num: 3, titulo: 'Firma de la Escritura Pública', descripcion: 'El Notario redacta y lee la escritura. Ambas partes la firman. El vendedor recibe el pago. El comprador recibe la copia de la escritura.' }, { num: 4, titulo: 'Pagar los impuestos', descripcion: 'Se pagan: impuesto de registro (1% del valor), derechos notariales y retención en la fuente si aplica.' }, { num: 5, titulo: 'Registrar la Escritura', descripcion: 'Lleven la escritura a la Oficina de Registro de Instrumentos Públicos. Una vez registrada, el comprador es el propietario legal.' }] },
  4: { titulo: 'Contrato de Permuta', pasos: [{ num: 1, titulo: 'Firmar el documento', descripcion: 'Ambas partes firman el contrato ante dos testigos. Cada parte conserva una copia.' }, { num: 2, titulo: 'Ir a la Notaría para elevar a Escritura Pública', descripcion: 'La permuta de inmuebles debe hacerse por Escritura Pública. Lleven: cédulas de ciudadanía, certificados de tradición de ambos inmuebles, paz y salvos de impuestos de ambos inmuebles.' }, { num: 3, titulo: 'Firma de la Escritura Pública', descripcion: 'El Notario redacta la escritura de permuta. Ambas partes la firman. Se entregan mutuamente los inmuebles.' }, { num: 4, titulo: 'Pagar los impuestos', descripcion: 'Cada parte paga los impuestos correspondientes al inmueble que recibe: impuesto de registro y derechos notariales.' }, { num: 5, titulo: 'Registrar la Escritura', descripcion: 'Lleven la escritura a la Oficina de Registro de Instrumentos Públicos para registrar el cambio de propietario de cada inmueble.' }] },
  5: { titulo: 'Compraventa de Bien Mueble con Reserva de Dominio', pasos: [{ num: 1, titulo: 'Firmar el documento', descripcion: 'Vendedor y comprador firman el contrato ante dos testigos. Cada parte conserva una copia original.' }, { num: 2, titulo: 'Registrar el contrato si el bien es identificable', descripcion: 'Si el bien mueble es identificable (como una máquina industrial con serial), se recomienda registrar el contrato en la Cámara de Comercio para proteger los derechos del vendedor frente a terceros.' }, { num: 3, titulo: 'Entregar el bien al comprador', descripcion: 'El vendedor entrega físicamente el bien al comprador. El comprador es responsable del bien pero no es propietario hasta pagar la última cuota.' }, { num: 4, titulo: 'Realizar los pagos acordados', descripcion: 'El comprador debe pagar las cuotas en las fechas acordadas. Guarde todos los comprobantes de pago.' }, { num: 5, titulo: 'Al pagar la última cuota', descripcion: 'Una vez pagada la totalidad del precio, el vendedor debe entregar al comprador un documento escrito confirmando que recibió el pago total y que el comprador es el nuevo propietario.' }] },
  6: { titulo: 'Compraventa de Vehículo Automotor', pasos: [{ num: 1, titulo: 'Firmar el documento', descripcion: 'Vendedor y comprador firman el contrato. Cada parte conserva una copia.' }, { num: 2, titulo: 'Verificar que el vehículo no tenga problemas legales', descripcion: 'Antes de pagar, verifique en la página de la RUNT (www.runt.com.co) que el vehículo no tenga multas, embargos ni prendas.' }, { num: 3, titulo: 'Realizar el traspaso en el organismo de tránsito', descripcion: 'Ambas partes deben ir al organismo de tránsito donde está registrado el vehículo. Lleven: cédulas de ciudadanía, contrato de compraventa, tarjeta de propiedad original, SOAT vigente, revisión técnico-mecánica vigente.' }, { num: 4, titulo: 'Pagar los derechos de traspaso', descripcion: 'Se pagan los derechos de traspaso en el organismo de tránsito. El costo varía según el municipio.' }, { num: 5, titulo: 'Recibir la nueva tarjeta de propiedad', descripcion: 'El organismo de tránsito expide una nueva tarjeta de propiedad a nombre del comprador. A partir de ese momento el comprador es el propietario legal.' }] },
  7: { titulo: 'Compraventa de Vehículo con Reserva de Dominio', pasos: [{ num: 1, titulo: 'Firmar el documento', descripcion: 'Vendedor y comprador firman el contrato ante dos testigos. Cada parte conserva una copia.' }, { num: 2, titulo: 'Registrar la reserva de dominio en tránsito', descripcion: 'El vendedor debe ir al organismo de tránsito a registrar la reserva de dominio sobre el vehículo. Esto protege al vendedor e impide que el comprador venda el vehículo antes de pagar.' }, { num: 3, titulo: 'Realizar los pagos acordados', descripcion: 'El comprador paga las cuotas en las fechas acordadas. Guarde todos los comprobantes de pago.' }, { num: 4, titulo: 'Al pagar la última cuota', descripcion: 'Una vez pagada la totalidad, el vendedor debe ir con el comprador al organismo de tránsito a levantar la reserva de dominio y hacer el traspaso definitivo.' }, { num: 5, titulo: 'Recibir la tarjeta de propiedad', descripcion: 'El organismo de tránsito expide la tarjeta de propiedad a nombre del comprador sin reserva de dominio. A partir de ese momento es el propietario pleno.' }] },
  8: { titulo: 'Contrato de Anticresis', pasos: [{ num: 1, titulo: 'Firmar el documento', descripcion: 'Deudor y acreedor firman el contrato ante dos testigos. Cada parte conserva una copia.' }, { num: 2, titulo: 'Autenticar las firmas en Notaría', descripcion: 'Lleven el contrato a una Notaría con sus cédulas para autenticar las firmas. Esto le da mayor validez legal al documento.' }, { num: 3, titulo: 'Entregar el bien al acreedor', descripcion: 'El deudor entrega físicamente el bien inmueble al acreedor. El acreedor podrá usarlo o arrendarlo para cobrar los intereses de la deuda.' }, { num: 4, titulo: 'El acreedor administra el bien', descripcion: 'El acreedor recibe los frutos del bien (arriendos, cosechas, etc.) y los imputa primero a los intereses y luego al capital de la deuda.' }, { num: 5, titulo: 'Al pagar la deuda total', descripcion: 'Una vez pagada la totalidad de la deuda e intereses, el acreedor debe devolver el bien al deudor en el mismo estado en que lo recibió.' }, { num: 6, titulo: 'Si el deudor no paga', descripcion: 'Si el deudor incumple, el acreedor puede acudir a un juez para solicitar la venta judicial del bien y cobrar su deuda con el producido de esa venta.' }] },
  9: { titulo: 'Contrato de Usufructo', pasos: [{ num: 1, titulo: 'Firmar el documento', descripcion: 'Propietario y usufructuario firman el contrato ante dos testigos. Cada parte conserva una copia.' }, { num: 2, titulo: 'Elevar a Escritura Pública', descripcion: 'Como el contrato lo indica, ambas partes deben ir a una Notaría a elevar el contrato a escritura pública. Lleven: cédulas de ciudadanía, el contrato firmado y los documentos del inmueble (certificado de tradición y libertad vigente).' }, { num: 3, titulo: 'Registrar la Escritura', descripcion: 'Lleven la escritura pública a la Oficina de Registro de Instrumentos Públicos para registrar el usufructo. A partir de ese momento el usufructuario tiene derecho real sobre el bien.' }, { num: 4, titulo: 'Pagar los impuestos', descripcion: 'Se deben pagar los derechos notariales y el impuesto de registro correspondiente al valor del usufructo.' }, { num: 5, titulo: 'Elaborar el inventario', descripcion: 'Como lo indica el contrato, ambas partes deben hacer un inventario detallado de todos los muebles, accesorios y estado del inmueble, firmarlo y adjuntarlo al contrato.' }, { num: 6, titulo: 'Al terminar el plazo', descripcion: 'Cuando venza el plazo del usufructo, el usufructuario debe devolver el inmueble al propietario en el mismo estado en que lo recibió, según el inventario firmado.' }] },
  10: { titulo: 'Contrato de Comodato', pasos: [{ num: 1, titulo: 'Firmar el documento', descripcion: 'Comodante y comodatario firman el contrato en dos ejemplares. Cada parte conserva uno. Este contrato se perfecciona con la entrega física de los bienes.' }, { num: 2, titulo: 'Entregar los bienes', descripcion: 'El comodante entrega físicamente los bienes al comodatario en el momento de firmar. El comodatario debe revisar que los bienes estén en perfecto estado antes de recibirlos.' }, { num: 3, titulo: 'Autenticar las firmas (recomendado)', descripcion: 'Aunque no es obligatorio, se recomienda llevar el contrato a una Notaría para autenticar las firmas. Esto da mayor validez legal al documento en caso de un incumplimiento.' }, { num: 4, titulo: 'Asegurar los bienes', descripcion: 'Si el valor de los bienes es significativo, el comodatario debe asegurarlos tal como lo indica el contrato. Guarde la póliza de seguro y endósela a favor del comodante.' }, { num: 5, titulo: 'Al terminar el plazo', descripcion: 'Cuando venza el plazo del contrato, el comodatario debe devolver los bienes en perfecto estado de funcionamiento al comodante. Se recomienda hacer una revisión conjunta de los bienes al momento de la devolución.' }, { num: 6, titulo: 'Si el comodatario no devuelve los bienes', descripcion: 'Si el comodatario no restituye los bienes al terminar el contrato, el comodante puede exigir judicialmente la devolución o el pago del valor estimado establecido en la cláusula octava del contrato.' }] },
  'compraventa-retroventa': {
    titulo: 'Compraventa con Pacto de Retroventa',
    pasos: [
      { num: 1, titulo: 'Elevar a Escritura Pública', descripcion: 'Lleve el contrato firmado a una Notaría para elevarlo a escritura pública. Ambas partes deben estar presentes o representadas con poder notarial.' },
      { num: 2, titulo: 'Pagar el impuesto de registro', descripcion: 'Pague el impuesto de registro ante la Gobernación o la ventanilla de rentas del departamento. Equivale aproximadamente al 1% del valor del inmueble.' },
      { num: 3, titulo: 'Registrar la escritura', descripcion: 'Registre la escritura en la Oficina de Registro de Instrumentos Públicos de la ciudad donde está el inmueble.' },
      { num: 4, titulo: 'Solicitar certificado de tradición', descripcion: 'Solicite un nuevo certificado de tradición y libertad para verificar que el comprador quedó registrado como nuevo propietario.' },
      { num: 5, titulo: 'Verificar el pacto de retroventa en la escritura', descripcion: 'El pacto de retroventa debe quedar expresamente consignado en la escritura pública. Verifique que el notario lo incluya claramente en el texto.' },
      { num: 6, titulo: 'Si el vendedor ejerce la retroventa', descripcion: 'El vendedor debe dar el aviso con el plazo acordado y pagar el precio estipulado al momento de recibir el inmueble de vuelta.' },
      { num: 7, titulo: 'Guardar los documentos', descripcion: 'Guarde una copia de la escritura y del certificado de tradición. Son los documentos más importantes de esta operación.' },
    ]
  },
  'cesion-derechos-hereditarios': {
    titulo: 'Cesión o Venta de Derechos Hereditarios',
    pasos: [
      { num: 1, titulo: 'Elevar a Escritura Pública', descripcion: 'La cesión de derechos hereditarios debe hacerse mediante Escritura Pública ante Notario. Ambas partes deben ir a la Notaría con sus cédulas y el contrato firmado.' },
      { num: 2, titulo: 'Registrar la escritura', descripcion: 'Lleve la escritura a la Oficina de Registro de Instrumentos Públicos de la ciudad donde están ubicados los inmuebles de la sucesión.' },
      { num: 3, titulo: 'Notificar al juzgado', descripcion: 'Presente una copia de la escritura de cesión ante el juzgado donde cursa el proceso de sucesión para que el comprador-cesionario quede reconocido.' },
      { num: 4, titulo: 'Solicitar formación de hijuela', descripcion: 'El comprador-cesionario puede solicitar al juzgado que se forme la hijuela correspondiente a su nombre con los bienes adquiridos.' },
      { num: 5, titulo: 'Pagar los impuestos', descripcion: 'Se deben pagar los derechos notariales y el impuesto de registro. Consulte en la Notaría el valor exacto.' },
      { num: 6, titulo: 'Guardar todos los documentos', descripcion: 'Conserve la escritura de cesión, el certificado de registro y las actuaciones del juzgado.' },
    ]
  },
  'estatutos-fundacion-gobernacion': {
    titulo: 'Estatutos de Fundación o Institución de Utilidad Común',
    pasos: [
      { num: 1, titulo: 'Reunir a los fundadores y firmar el acta de constitución', descripcion: 'Los fundadores deben reunirse, aprobar los estatutos y firmar el acta de constitución. Esta acta es previa a los estatutos e incluye los nombramientos iniciales del director, consejo de administración, revisor fiscal y secretario.' },
      { num: 2, titulo: 'El documento puede ser privado — no necesita escritura pública', descripcion: 'A partir del Decreto 2150 de 1995, la constitución de fundaciones no requiere escritura pública obligatoriamente. Puede hacerse mediante documento privado debidamente reconocido ante notario.' },
      { num: 3, titulo: 'Registrar en la Cámara de Comercio del domicilio', descripcion: 'La fundación adquiere personería jurídica a partir de su registro en la Cámara de Comercio del lugar de su domicilio principal. Sin este registro no existe legalmente.' },
      { num: 4, titulo: 'Obtener el NIT ante la DIAN', descripcion: 'Con el certificado de existencia de la Cámara de Comercio, solicite el NIT de la fundación ante la DIAN para cumplir sus obligaciones tributarias como entidad sin ánimo de lucro.' },
      { num: 5, titulo: 'Inscribir los dignatarios', descripcion: 'El nombramiento del director y demás administradores debe inscribirse en la Cámara de Comercio. Sin esta inscripción el director no puede actuar como representante legal.' },
      { num: 6, titulo: 'Abrir cuenta bancaria a nombre de la fundación', descripcion: 'Abra una cuenta bancaria exclusivamente a nombre de la fundación para manejar el patrimonio. Los fondos de la fundación no pueden mezclarse con recursos personales de los fundadores.' },
      { num: 7, titulo: 'Reformas estatutarias', descripcion: 'Cualquier reforma a estos estatutos debe adoptarse conforme lo disponen los mismos estatutos y luego inscribirse en la Cámara de Comercio. También debe informarse a la Gobernación del departamento.' },
    ]
  },
  'estatutos-fundacion': {
    titulo: 'Estatutos de Constitución de Fundación',
    pasos: [
      { num: 1, titulo: 'Reunir a los fundadores y firmar el acta de constitución', descripcion: 'Los fundadores deben reunirse, aprobar los estatutos y firmar el acta de constitución de la fundación. Esta acta debe incluir los nombramientos iniciales de director, consejo de administración, revisor fiscal y secretario.' },
      { num: 2, titulo: 'Autenticar las firmas ante Notario', descripcion: 'Lleven el acta de constitución y los estatutos a una Notaría para autenticar las firmas de todos los fundadores. Cada fundador debe presentar su cédula de ciudadanía.' },
      { num: 3, titulo: 'Determinar la entidad competente para reconocer la personería', descripcion: 'Según el objeto de la fundación, la entidad que otorga la personería jurídica puede ser: el Ministerio del Interior, la Alcaldía o Gobernación, u otro ministerio según la actividad.' },
      { num: 4, titulo: 'Radicar la solicitud de personería jurídica', descripcion: 'Presente ante la entidad competente: solicitud escrita, acta de constitución autenticada, estatutos, relación del patrimonio inicial con soportes, cédulas de los fundadores y nombramientos.' },
      { num: 5, titulo: 'Esperar el reconocimiento de personería jurídica', descripcion: 'La entidad estudia la solicitud y si cumple los requisitos expide el acto administrativo de reconocimiento. Sin este la fundación no existe legalmente.' },
      { num: 6, titulo: 'Inscribir en Cámara de Comercio', descripcion: 'Con la personería jurídica otorgada, registre la fundación en la Cámara de Comercio del municipio donde tiene su domicilio.' },
      { num: 7, titulo: 'Obtener el NIT', descripcion: 'Solicite el NIT de la fundación ante la DIAN para poder abrir cuentas bancarias y cumplir las obligaciones tributarias como entidad sin ánimo de lucro.' },
    ]
  },
  'contrato-construccion': {
    titulo: 'Contrato de Construcción sin Suministro de Materiales',
    pasos: [
      { num: 1, titulo: 'Firmar el contrato ante testigos', descripcion: 'Contratante y contratista firman el contrato en dos ejemplares ante dos testigos mayores de edad. Cada parte conserva un ejemplar original.' },
      { num: 2, titulo: 'Autenticar las firmas en Notaría (recomendado)', descripcion: 'Lleven el contrato firmado a una Notaría con sus cédulas para autenticar las firmas. Esto da mayor seguridad jurídica a ambas partes en caso de incumplimiento.' },
      { num: 3, titulo: 'Entregar el anticipo al contratista', descripcion: 'El contratante entrega el anticipo acordado en el contrato. Guarde el comprobante de pago. El contratista puede comenzar a coordinar el personal y el inicio de obra.' },
      { num: 4, titulo: 'Verificar licencia de construcción', descripcion: 'Antes de iniciar la obra, verifique que tiene la licencia de construcción vigente expedida por la Curaduría Urbana o la Oficina de Planeación del municipio. Sin licencia la obra puede ser demolida.' },
      { num: 5, titulo: 'Elaborar el acta de inicio de obra', descripcion: 'Al iniciar la construcción firmen un acta de inicio de obra con la fecha exacta de comienzo. Esto es el punto de partida para contar el plazo acordado.' },
      { num: 6, titulo: 'Realizar los pagos según lo acordado', descripcion: 'El contratante debe pagar en las fechas y condiciones acordadas en el contrato. Guarde todos los comprobantes de pago. Si se acordó informe de avance, exíjalo antes de cada pago.' },
      { num: 7, titulo: 'Hacer seguimiento semanal a la obra', descripcion: 'Visite la obra regularmente para verificar el avance y que se está construyendo conforme al plano y pliego de condiciones del arquitecto. Cualquier cambio debe acordarse por escrito.' },
      { num: 8, titulo: 'Acta de entrega y recibo de la obra', descripcion: 'Al terminar la obra, el contratista hace entrega formal al contratante mediante un acta de entrega firmada por ambos. En esa acta se registran los detalles de la entrega y cualquier observación.' },
      { num: 9, titulo: 'Liberar la retención de garantía', descripcion: 'Transcurrido el plazo acordado después de la entrega sin defectos imputables al contratista, el contratante debe liberar y pagar la retención de garantía retenida.' },
    ]
  },
  'contrato-construccion-materiales': {
    titulo: 'Contrato de Construcción con Suministro de Materiales (Todo Costo)',
    pasos: [
      { num: 1, titulo: 'Firmar el contrato ante testigos', descripcion: 'Contratante y contratista firman el contrato en los ejemplares acordados ante dos testigos mayores de edad. Cada parte conserva un ejemplar original firmado.' },
      { num: 2, titulo: 'Autenticar las firmas en Notaría (recomendado)', descripcion: 'Lleven el contrato firmado a una Notaría con sus cédulas para autenticar las firmas. Esto da mayor seguridad jurídica y facilita el cobro ejecutivo en caso de incumplimiento.' },
      { num: 3, titulo: 'Entregar el anticipo al contratista', descripcion: 'El contratante entrega el porcentaje de anticipo acordado para el acopio de materiales. Guarde el comprobante de pago con fecha y descripción del concepto.' },
      { num: 4, titulo: 'Verificar la licencia de construcción', descripcion: 'Antes de iniciar la obra verifique que tiene la licencia de construcción vigente expedida por la Curaduría Urbana o la Oficina de Planeación del municipio. Sin licencia la obra puede ser ordenada demoler.' },
      { num: 5, titulo: 'Firmar el acta de inicio de obra', descripcion: 'Al iniciar la construcción firmen un acta de inicio con la fecha exacta de comienzo. Esta fecha es el punto de partida para contar el plazo de entrega acordado en el contrato.' },
      { num: 6, titulo: 'Realizar los pagos según las etapas acordadas', descripcion: 'El contratante debe pagar cada porcentaje en la etapa o fecha acordada, descontando siempre el porcentaje de retención de garantía. Guarde todos los comprobantes de pago.' },
      { num: 7, titulo: 'Verificar calidad de materiales y avance de obra', descripcion: 'El contratante tiene derecho a inspeccionar la obra en cualquier momento. Verifique que los materiales utilizados corresponden a las especificaciones del pliego de condiciones. Cualquier cambio debe autorizarse por escrito.' },
      { num: 8, titulo: 'Liquidar trabajos extras por escrito', descripcion: 'Si se requiere algún trabajo adicional no contemplado en el contrato, autoricelo por escrito antes de ejecutarlo y acuerden el valor adicional. Sin autorización escrita el contratante no está obligado a pagar extras.' },
      { num: 9, titulo: 'Acta de entrega y recibo final de la obra', descripcion: 'Al terminar la obra el contratista hace entrega formal mediante un acta firmada por ambas partes. Inspeccione detalladamente la obra antes de firmar. Si hay defectos, déjelos consignados en el acta.' },
      { num: 10, titulo: 'Liberar la retención de garantía', descripcion: 'Transcurridos los meses acordados desde la entrega final sin que aparezcan defectos o vicios imputables al contratista, el contratante debe devolver el fondo de garantía retenido.' },
    ]
  },
  'contrato-deposito': {
    titulo: 'Contrato de Depósito',
    pasos: [
      { num: 1, titulo: 'Firmar el contrato y entregar los bienes', descripcion: 'Depositante y depositario firman el contrato en dos ejemplares. En ese mismo momento el depositante entrega físicamente los bienes al depositario. El contrato de depósito se perfecciona con la entrega real de los bienes.' },
      { num: 2, titulo: 'Verificar el estado de los bienes al recibirlos', descripcion: 'El depositario debe revisar detalladamente cada bien antes de recibirlo, verificando que corresponda a la descripción del contrato y que esté en buen estado. Si hay algún daño previo, déjelo anotado por escrito antes de firmar.' },
      { num: 3, titulo: 'Autenticar las firmas en Notaría (recomendado)', descripcion: 'Lleven el contrato firmado a una Notaría con sus cédulas para autenticar las firmas. Esto facilita el cobro ejecutivo y la reclamación judicial en caso de que el depositario no devuelva los bienes.' },
      { num: 4, titulo: 'Guardar los bienes en la dirección acordada', descripcion: 'El depositario debe mantener los bienes en la dirección indicada en el contrato. No puede cambiarlos de lugar sin autorización escrita del depositante. Cualquier cambio de ubicación sin autorización es incumplimiento del contrato.' },
      { num: 5, titulo: 'Pagar la remuneración puntualmente', descripcion: 'El depositante debe pagar la remuneración acordada en las fechas pactadas. Guarde todos los comprobantes de pago. El depositario tiene derecho a retener los bienes hasta que se le pague lo adeudado.' },
      { num: 6, titulo: 'No usar los bienes depositados', descripcion: 'El depositario está expresamente prohibido de usar los bienes. Si los usa sin autorización comete una infracción contractual y puede ser demandado por daños y perjuicios.' },
      { num: 7, titulo: 'Al vencer el plazo: devolver los bienes', descripcion: 'Al terminar el contrato el depositario debe devolver todos los bienes en el mismo estado en que los recibió. Hagan una revisión conjunta al momento de la devolución y firmen un acta de recibo conforme.' },
      { num: 8, titulo: 'Si el depositario no devuelve los bienes', descripcion: 'Si al vencerse el contrato el depositario se niega a devolver los bienes, el depositante puede acudir a un juez para exigir la restitución mediante acción judicial. El contrato autenticado es su principal prueba.' },
    ]
  },
  'cesion-derechos-litigiosos': {
    titulo: 'Cesión o Venta de Derechos Litigiosos',
    pasos: [
      { num: 1, titulo: 'Firmar el contrato ante testigos', descripcion: 'Cedente y cesionario firman el contrato en dos ejemplares ante dos testigos mayores de edad. Cada parte conserva una copia original firmada.' },
      { num: 2, titulo: 'Autenticar las firmas en Notaría', descripcion: 'Lleven el contrato a una Notaría con sus cédulas para autenticar las firmas. Este paso es muy importante porque da mayor validez probatoria al acuerdo frente al juzgado.' },
      { num: 3, titulo: 'Notificar la cesión al juzgado', descripcion: 'Presente una copia auténtica del contrato ante el juzgado donde cursa el proceso. Solicite que se notifique al demandado de la cesión conforme al artículo 1969 del Código Civil. Sin esta notificación la cesión no produce efectos frente al demandado ni al juzgado.' },
      { num: 4, titulo: 'Solicitar el reconocimiento del cesionario como parte', descripcion: 'El cesionario debe presentar memorial ante el juzgado solicitando ser reconocido como parte del proceso en lugar del cedente. Adjunte el contrato de cesión debidamente autenticado.' },
      { num: 5, titulo: 'Pagar el precio acordado', descripcion: 'El cesionario debe pagar el precio en la forma acordada en el contrato. Guarde todos los comprobantes de pago. Recuerde que este es un contrato aleatorio — el cedente no responde por el resultado del proceso.' },
      { num: 6, titulo: 'Atender el proceso como nueva parte', descripcion: 'Una vez reconocido por el juzgado, el cesionario debe contratar un abogado para continuar el proceso judicial a su nombre. Todas las decisiones judiciales futuras recaerán sobre el cesionario.' },
      { num: 7, titulo: 'Guardar todos los documentos', descripcion: 'Conserve el contrato de cesión autenticado, los comprobantes de pago y las actuaciones judiciales. Son sus principales pruebas en caso de cualquier controversia.' },
    ]
  },
  'arrendamiento-vivienda-urbana': {
    titulo: 'Contrato de Arrendamiento de Vivienda Urbana',
    pasos: [
      { num: 1, titulo: 'Firmar el contrato en dos ejemplares', descripcion: 'Arrendador y arrendatario firman el contrato en dos ejemplares originales. Cada parte conserva uno. El arrendador tiene la obligación legal de entregar copia al arrendatario dentro de los diez (10) días siguientes a la firma.' },
      { num: 2, titulo: 'Elaborar el inventario del inmueble', descripcion: 'Al momento de la entrega firmen un inventario detallado del estado del inmueble: paredes, pisos, puertas, ventanas, enchapes, sanitarios, lavamanos, y todos los elementos que entrega el arrendador. Este inventario es parte del contrato y sirve para determinar responsabilidades al terminar.' },
      { num: 3, titulo: 'Entregar las llaves y el inmueble', descripcion: 'El arrendador hace entrega formal del inmueble en buen estado de servicio y sanidad. El arrendatario debe verificar que todos los servicios funcionen antes de recibir. Si hay defectos, déjelos anotados en el inventario.' },
      { num: 4, titulo: 'Registrar el contrato ante la empresa de servicios públicos', descripcion: 'Para proteger al arrendador, el arrendatario debe presentar garantías ante las empresas de servicios públicos o el arrendador puede denunciar el contrato ante dichas empresas. Así el inmueble no queda afecto al pago de deudas del arrendatario en servicios.' },
      { num: 5, titulo: 'Pagar el canon puntualmente', descripcion: 'El arrendatario debe pagar el canon dentro de los primeros cinco (5) días de cada mes. Si el arrendador se niega a recibir el pago, el arrendatario puede consignarlo en la entidad bancaria autorizada del municipio a favor del arrendador.' },
      { num: 6, titulo: 'Reajuste anual del canon', descripcion: 'Cada doce (12) meses el arrendador puede reajustar el canon según el porcentaje acordado, que no puede exceder el 100% del IPC del año anterior. El arrendador debe notificar el reajuste por escrito con anticipación suficiente.' },
      { num: 7, titulo: 'Para terminar el contrato: dar preaviso por escrito', descripcion: 'Cualquiera de las partes que quiera terminar el contrato debe dar aviso escrito con al menos tres (3) meses de anticipación, enviado por correo certificado. Sin este preaviso el contrato se prorroga automáticamente.' },
      { num: 8, titulo: 'Entrega del inmueble al terminar', descripcion: 'Al vencer el contrato el arrendatario debe devolver el inmueble en el mismo estado que lo recibió según el inventario, salvo el deterioro normal por el uso. Hagan una revisión conjunta y firmen un acta de entrega.' },
      { num: 9, titulo: 'Si el arrendatario no paga o no entrega', descripcion: 'Si el arrendatario incumple con el pago del canon o no entrega el inmueble al vencer el contrato, el arrendador puede iniciar proceso de restitución de inmueble arrendado ante el juez civil competente. El contrato es título ejecutivo.' },
    ]
  },
  'arrendamiento-inmueble-muebles': {
    titulo: 'Contrato de Arrendamiento de Inmueble con Muebles',
    pasos: [
      { num: 1, titulo: 'Elaborar el inventario detallado de muebles', descripcion: 'Antes de firmar elaboren un inventario completo de todos los muebles, accesorios e instalaciones que se entregan junto con el inmueble. Descríbalo con detalle: marca, modelo, color, estado. Este inventario debe firmarse junto con el contrato y es parte integrante del mismo.' },
      { num: 2, titulo: 'Firmar el contrato en tres ejemplares', descripcion: 'Arrendador, arrendatario y fiador firman el contrato en tres ejemplares. Cada uno conserva el suyo. Verifique que el fiador firme personalmente y presente su cédula.' },
      { num: 3, titulo: 'Autenticar las firmas en Notaría (recomendado)', descripcion: 'Lleven el contrato a una Notaría con las cédulas de las tres partes para autenticar las firmas. Esto facilita el cobro ejecutivo en caso de incumplimiento, tanto del arrendatario como del fiador.' },
      { num: 4, titulo: 'Revisar el estado de los muebles al entregar', descripcion: 'Al momento de la entrega hagan una revisión conjunta de cada mueble del inventario. Si alguno tiene defecto, anótelo. El arrendatario es responsable de devolver todo en el mismo estado que lo recibió.' },
      { num: 5, titulo: 'Pagar el canon dentro del plazo acordado', descripcion: 'El arrendatario debe pagar el canon dentro de los días acordados en la cláusula cuarta. El incumplimiento del plazo activa automáticamente la cláusula penal y puede dar lugar a la terminación del contrato.' },
      { num: 6, titulo: 'No modificar el inmueble ni los muebles', descripcion: 'El arrendatario no puede hacer modificaciones al inmueble ni a los muebles sin autorización escrita del arrendador. Si lo hace sin permiso, el arrendador puede exigir la restitución al estado original o dar por terminado el contrato.' },
      { num: 7, titulo: 'Al vencer el contrato: restituir inmueble y muebles', descripcion: 'Al vencer el plazo el arrendatario debe devolver el inmueble y todos los muebles del inventario en el mismo estado que los recibió. Si no lo hace queda obligado a pagar la multa diaria acordada en la cláusula sexta.' },
      { num: 8, titulo: 'Si el fiador falla: presentar nuevo fiador', descripcion: 'Si el fiador fallece, quiebra o se vuelve insolvente, el arrendatario tiene el plazo acordado en la cláusula décima primera para presentar un nuevo fiador. Si no lo hace en ese plazo, el arrendador puede dar por terminado el contrato.' },
      { num: 9, titulo: 'Cobro de multas por vía ejecutiva', descripcion: 'Las multas pactadas en las cláusulas sexta y novena son exigibles por vía ejecutiva. El arrendador puede demandar ejecutivamente presentando el contrato y la prueba del incumplimiento, sin necesidad de proceso ordinario.' },
    ]
  },
  'cesion-contrato-arrendamiento': {
    titulo: 'Cesión de Contrato de Arrendamiento',
    pasos: [
      { num: 1, titulo: 'Firmar el documento en dos ejemplares', descripcion: 'Cedente y cesionario firman la cesión en dos ejemplares. Cada parte conserva uno. Este documento prueba que el nuevo propietario asumió el contrato de arrendamiento existente.' },
      { num: 2, titulo: 'Autenticar las firmas en Notaría (recomendado)', descripcion: 'Lleven el documento a una Notaría con sus cédulas para autenticar las firmas. Esto da mayor validez legal frente al arrendatario y ante cualquier juzgado en caso de controversia.' },
      { num: 3, titulo: 'Notificar al arrendatario por escrito', descripcion: 'El cesionario debe notificarle al arrendatario la cesión, informándole que a partir de esa fecha debe pagar el canon al nuevo arrendador. Esta notificación debe hacerse por escrito, idealmente por correo certificado, para dejar constancia.' },
      { num: 4, titulo: 'El arrendatario reconoce al nuevo arrendador', descripcion: 'A partir de la notificación el arrendatario queda obligado a pagar el canon al cesionario y a cumplir con él todas las obligaciones del contrato original. Las condiciones del contrato no cambian.' },
      { num: 5, titulo: 'El cesionario asume las obligaciones del cedente', descripcion: 'El nuevo arrendador (cesionario) asume todas las obligaciones del contrato original: mantener el inmueble en buen estado, respetar los términos del contrato y no modificar las condiciones pactadas sin el consentimiento del arrendatario.' },
      { num: 6, titulo: 'Guardar los documentos', descripcion: 'Conserve la escritura de compraventa del inmueble, la cesión del contrato de arrendamiento autenticada y la constancia de notificación al arrendatario. Son los tres documentos que prueban la cadena completa de la operación.' },
    ]
  },
  'notificacion-cesion-arrendamiento': {
    titulo: 'Notificación Privada de Cesión del Contrato de Arrendamiento',
    pasos: [
      { num: 1, titulo: 'Firmar la carta y autenticar la firma en Notaría', descripcion: 'El cesionario firma la carta y lleva el documento a una Notaría para autenticar su firma. Esta autenticación es importante porque le da plena validez legal a la notificación frente al arrendatario.' },
      { num: 2, titulo: 'Enviar la carta al arrendatario', descripcion: 'Envíe la carta al arrendatario por correo certificado a la dirección del inmueble arrendado. Guarde el comprobante de envío y el acuse de recibo. Este es el momento en que la cesión produce efectos frente al arrendatario.' },
      { num: 3, titulo: 'Adjuntar los documentos indicados en el numeral octavo', descripcion: 'La carta menciona que debe anexarse: original del escrito de cesión del contrato, copia de la escritura pública de compraventa y copia del folio de matrícula inmobiliaria. Asegúrese de incluir todos antes de enviar.' },
      { num: 4, titulo: 'El arrendatario debe reconocer al nuevo arrendador', descripcion: 'A partir de la recepción de esta notificación el arrendatario queda obligado a pagar el canon al cesionario en la dirección o cuenta indicada, y a dirigirle todas las comunicaciones del contrato.' },
      { num: 5, titulo: 'Proponer un contrato escrito si el actual es verbal', descripcion: 'Como lo sugiere el numeral noveno de la carta, si el contrato original es verbal, el nuevo arrendador puede aprovechar este momento para proponer al arrendatario suscribir un contrato escrito que regule claramente los derechos y deberes de ambos.' },
      { num: 6, titulo: 'Si el arrendatario no acepta la notificación', descripcion: 'Si el arrendatario se niega a reconocer al nuevo arrendador o a pagar el canon en la nueva cuenta, el cesionario puede acudir al juez civil competente para hacer valer sus derechos como nuevo propietario y arrendador. La carta notificada y autenticada es la prueba principal.' },
    ]
  },
  'prestacion-servicios-profesionales': {
    titulo: 'Contrato de Prestación de Servicios Profesionales',
    pasos: [
      { num: 1, titulo: 'Firmar el contrato en dos ejemplares', descripcion: 'Contratante y contratista firman el contrato en dos ejemplares. Cada parte conserva uno. Al momento de la firma el contratante debe entregar el primer pago si así lo acordaron.' },
      { num: 2, titulo: 'Autenticar las firmas en Notaría (recomendado)', descripcion: 'Lleven el contrato a una Notaría con sus cédulas para autenticar las firmas. Esto facilita el cobro ejecutivo de los honorarios en caso de que el contratante no pague, y protege al contratante si el contratista no cumple.' },
      { num: 3, titulo: 'Guardar comprobantes de todos los pagos', descripcion: 'El contratante debe guardar el comprobante de cada pago realizado. El contratista debe expedir un recibo por cada pago recibido. Estos comprobantes son la prueba de cumplimiento de la cláusula segunda.' },
      { num: 4, titulo: 'El contratista inicia las tareas acordadas', descripcion: 'El contratista debe ejecutar cada una de las tareas descritas en la cláusula primera, actuando siempre dentro de las normas éticas y legales de su profesión. Si encuentra algún impedimento legal debe informarlo de inmediato al contratante.' },
      { num: 5, titulo: 'Documentar el avance del trabajo', descripcion: 'Se recomienda que el contratista entregue informes periódicos de avance al contratante. Esto evita malentendidos y sirve como prueba del trabajo realizado en caso de controversia.' },
      { num: 6, titulo: 'Al terminar el servicio: acta de entrega', descripcion: 'Al concluir las tareas, el contratista entrega el trabajo al contratante. Se recomienda firmar un acta de entrega y recibo conforme. Este es el momento para hacer el pago final si así se acordó.' },
      { num: 7, titulo: 'Obligaciones tributarias del contratista', descripcion: 'Como contratista independiente, el profesional debe declarar sus honorarios ante la DIAN. Si los honorarios superan el límite legal, el contratante debe practicar retención en la fuente. Consulte con un contador el porcentaje aplicable según el monto.' },
      { num: 8, titulo: 'Si hay incumplimiento', descripcion: 'Si el contratante no paga los honorarios, el contratista puede exigir el pago judicialmente usando el contrato como título ejecutivo. Si el contratista no cumple las tareas, el contratante puede exigir su cumplimiento o la devolución de los pagos realizados, más los perjuicios causados.' },
    ]
  },
  'servicios-abogado': {
    titulo: 'Contrato de Prestación de Servicios Profesionales de Abogado',
    pasos: [
      { num: 1, titulo: 'Firmar el contrato en dos ejemplares', descripcion: 'Mandante y mandatario firman el contrato en dos ejemplares. Cada parte conserva uno. Si el mandante es una empresa, quien firma debe ser el representante legal autorizado. Al momento de la firma el mandante debe entregar el primer pago si así lo acordaron.' },
      { num: 2, titulo: 'Verificar la tarjeta profesional del abogado', descripcion: 'Antes de firmar, verifique que la tarjeta profesional del abogado esté vigente consultando el registro del Consejo Superior de la Judicatura en https://sij.ramajudicial.gov.co. Un abogado sin tarjeta vigente no puede ejercer legalmente.' },
      { num: 3, titulo: 'Autenticar las firmas en Notaría (recomendado)', descripcion: 'Lleven el contrato a una Notaría con sus documentos de identidad para autenticar las firmas. Esto facilita el cobro ejecutivo de los honorarios si el mandante no paga, y protege al mandante si el abogado no cumple.' },
      { num: 4, titulo: 'El abogado inicia los asuntos encomendados', descripcion: 'El mandatario debe actuar con diligencia desde el inicio, dentro de los términos procesales aplicables. Si hay algún impedimento o incompatibilidad legal, debe informarlo de inmediato al mandante para buscar soluciones.' },
      { num: 5, titulo: 'Rendir informes periódicos', descripcion: 'El abogado debe informar periódicamente al mandante sobre el estado de los asuntos a su cargo. Se recomienda que estos informes sean por escrito para tener registro del avance de cada asunto.' },
      { num: 6, titulo: 'Pagar los honorarios puntualmente', descripcion: 'El mandante debe pagar los honorarios en las fechas acordadas. Guarde todos los comprobantes de pago. El mandante también debe cubrir los gastos adicionales del proceso como notificaciones, copias y desplazamientos.' },
      { num: 7, titulo: 'Para terminar el contrato: dar aviso escrito', descripcion: 'Cualquier parte que quiera terminar el contrato debe dar aviso escrito a la otra con el plazo acordado en la cláusula quinta. El abogado debe garantizar que los asuntos urgentes queden atendidos durante el período de aviso para no perjudicar al mandante.' },
      { num: 8, titulo: 'Obligaciones tributarias', descripcion: 'El abogado como profesional independiente debe declarar sus honorarios ante la DIAN. Si los honorarios superan el límite legal, el mandante debe practicar retención en la fuente sobre cada pago. Consulte con un contador el porcentaje vigente.' },
      { num: 9, titulo: 'Si el abogado incumple', descripcion: 'Si el abogado no cumple sus obligaciones, el mandante puede reportarlo al Consejo Seccional de la Judicatura por falta disciplinaria, además de exigir civilmente los perjuicios causados por el incumplimiento del contrato.' },
    ]
  },
  'poder-general': {
    titulo: 'Poder General',
    pasos: [
      { num: 1, titulo: 'Ir a la Notaría con los documentos', descripcion: 'El poderdante debe ir personalmente a la Notaría indicada en el documento con su cédula de ciudadanía original. El poder general SIEMPRE debe otorgarse mediante escritura pública — no puede hacerse por documento privado.' },
      { num: 2, titulo: 'El Notario redacta y lee la escritura', descripcion: 'El Notario redacta la escritura con los datos suministrados, la lee en voz alta al poderdante y verifica que corresponda exactamente a su voluntad. Si hay errores, deben corregirse antes de firmar.' },
      { num: 3, titulo: 'Firma del poderdante y del apoderado', descripcion: 'Idealmente ambos firman en la misma Notaría. Si el apoderado no puede asistir, puede firmar después en la misma Notaría o en otra, mediante la figura de la aceptación posterior. El Notario da fe de las firmas.' },
      { num: 4, titulo: 'Pagar los derechos notariales', descripcion: 'Los derechos notariales se pagan en la misma Notaría según la tarifa oficial vigente. El costo depende de la cuantía de los bienes incluidos en el poder y de la Notaría.' },
      { num: 5, titulo: 'Retirar las copias de la escritura', descripcion: 'La Notaría expide las copias de la escritura. El poderdante debe conservar una copia y entregar otra al apoderado. La primera copia con nota de ser primera tiene especial valor probatorio.' },
      { num: 6, titulo: 'El apoderado puede actuar desde ese momento', descripcion: 'Una vez firmada y autorizada la escritura, el apoderado puede actuar en nombre del poderdante presentando copia de la escritura ante quien corresponda.' },
      { num: 7, titulo: 'Para revocar el poder', descripcion: 'Si en algún momento desea revocar este poder, debe hacerlo también mediante escritura pública de revocatoria en cualquier Notaría, y notificar al apoderado y a quienes estén actuando con él.' },
      { num: 8, titulo: 'Aviso importante sobre el apoderado', descripcion: 'Si el poder incluye facultades judiciales (representar en procesos), el apoderado debe ser abogado con tarjeta profesional vigente. Para actos notariales o administrativos puede ser cualquier persona mayor de edad capaz.' },
    ]
  },
  'poder-especial-venta-inmueble': {
    titulo: 'Poder Especial para Venta de Inmueble',
    pasos: [
      { num: 1, titulo: 'Firmar el documento ante el Notario', descripcion: 'El poderdante debe ir personalmente a la Notaría indicada y firmar el documento en presencia del Notario, quien autenticará su firma y verificará su identidad con la cédula. No se requiere escritura pública completa — basta con el reconocimiento de firma.' },
      { num: 2, titulo: 'El apoderado también debe firmar', descripcion: 'El apoderado puede firmar en la misma diligencia o en una diferente. Lo importante es que el Notario deje constancia de la autenticación de ambas firmas para que el poder tenga plena validez.' },
      { num: 3, titulo: 'Pagar los derechos notariales', descripcion: 'Se pagan los derechos por autenticación de firma ante el Notario. El costo es mucho menor que una escritura pública completa. Consulte la tarifa vigente en la Notaría.' },
      { num: 4, titulo: 'El apoderado gestiona la venta', descripcion: 'Con el poder autenticado, el apoderado puede negociar y firmar la escritura pública de compraventa en nombre del poderdante. Debe presentar el poder original o copia auténtica ante el Notario que elabore la escritura.' },
      { num: 5, titulo: 'El poder es solo para este inmueble', descripcion: 'Este poder es especial — solo autoriza vender el inmueble descrito en el documento y por el precio indicado. El apoderado no puede usarlo para vender otros bienes ni por un precio diferente al autorizado.' },
      { num: 6, titulo: 'Verificar que el inmueble no esté afectado a vivienda familiar', descripcion: 'Si el poderdante es casado y el inmueble fue adquirido después del 17 de enero de 1996, debe verificar si está afectado a vivienda familiar. En ese caso se requiere la firma del cónyuge para poder venderlo.' },
      { num: 7, titulo: 'Para revocar el poder', descripcion: 'Si decide no vender o cambiar de apoderado, debe revocar el poder mediante escrito ante Notario y notificarlo al apoderado antes de que firme la escritura de venta.' },
    ]
  },
  'revocatoria-poder-general': {
    titulo: 'Revocatoria de Poder General (Escritura Pública)',
    pasos: [
      { num: 1, titulo: 'Ir a la Notaría con los documentos', descripcion: 'El poderdante debe ir personalmente a la Notaría con su cédula de ciudadanía original y la copia de la escritura pública del poder original que va a revocar. La revocatoria SIEMPRE debe hacerse por escritura pública.' },
      { num: 2, titulo: 'El Notario redacta y autoriza la escritura', descripcion: 'El Notario redacta la escritura de revocatoria, la lee al poderdante y verifica que corresponda a su voluntad. Ambas partes firman en la Notaría.' },
      { num: 3, titulo: 'Pagar los derechos notariales', descripcion: 'Se pagan los derechos notariales correspondientes. Consulte la tarifa vigente en la Notaría.' },
      { num: 4, titulo: 'Notificar personalmente al apoderado', descripcion: 'Notifique de inmediato al apoderado sobre la revocación del poder. Esto es fundamental para que no siga actuando en su nombre. Guarde constancia de esta notificación.' },
      { num: 5, titulo: 'Informar a entidades donde se usó el poder', descripcion: 'Si el poder original fue presentado ante bancos, entidades públicas u otras instituciones, infórmeles la revocación presentando copia auténtica de la escritura de revocatoria.' },
      { num: 6, titulo: 'Guardar copia auténtica de la escritura', descripcion: 'Conserve una copia auténtica de la escritura de revocación. Es su prueba legal de que el poder fue revocado y el apoderado ya no puede actuar en su nombre.' },
      { num: 7, titulo: 'Actos realizados después de la revocación', descripcion: 'Si el apoderado realiza actos en su nombre DESPUÉS de ser notificado de la revocación, esos actos no lo obligan a usted. Sin embargo, los actos realizados antes de la notificación siguen siendo válidos.' },
    ]
  },
  'contrato-civil-obra': {
    titulo: 'Contrato Civil de Obra',
    pasos: [
      { num: 1, titulo: 'Firmar el contrato en dos ejemplares ante testigos', descripcion: 'Contratante y contratista firman el contrato en dos ejemplares ante dos testigos hábiles. Cada parte conserva un ejemplar original.' },
      { num: 2, titulo: 'Constituir las garantías y pólizas antes de iniciar', descripcion: 'Antes de dar inicio a la obra, el contratista debe constituir todas las garantías pactadas en la cláusula quinta: manejo de anticipo, cumplimiento, responsabilidad civil, estabilidad, seguro colectivo de vida y garantía de salarios. Sin estas garantías el contratante puede negarse a entregar el anticipo.' },
      { num: 3, titulo: 'Afiliar al personal a seguridad social', descripcion: 'El contratista debe afiliar a todo el personal de la obra a la EPS, AFP y ARL correspondientes antes del inicio de actividades. Solicite las planillas de pago periódicamente durante la ejecución.' },
      { num: 4, titulo: 'Firmar el acta de inicio de obra', descripcion: 'Al comenzar la ejecución, firmen un acta de inicio con la fecha exacta de comienzo. Este documento es el punto de partida para calcular el plazo y las posibles penalizaciones por mora.' },
      { num: 5, titulo: 'Realizar seguimiento y pagos por avance', descripcion: 'El contratante debe realizar los pagos según el avance acordado. Se recomienda firmar actas de avance parcial antes de cada pago para documentar el estado de la obra.' },
      { num: 6, titulo: 'Acta de entrega y recibo final de la obra', descripcion: 'Al terminar la obra, el contratista hace entrega formal al contratante mediante un acta de entrega y recibo definitivo firmada por ambas partes. Esta acta activa la vigencia de la garantía de estabilidad.' },
      { num: 7, titulo: 'Liquidación final del contrato', descripcion: 'Después de la entrega definitiva, las partes deben hacer la liquidación final del contrato, en la que se establecen los saldos pendientes, los descuentos por retención de garantía y cualquier ajuste económico.' },
      { num: 8, titulo: 'Liberar la retención de garantía', descripcion: 'Transcurrido el plazo de garantía acordado desde la entrega definitiva, sin que se hayan presentado defectos imputables al contratista, el contratante debe liberar y pagar el saldo retenido como garantía.' },
    ]
  },
  'contrato-aparceria': {
    titulo: 'Contrato de Aparcería',
    pasos: [
      { num: 1, titulo: 'Firmar el contrato en dos ejemplares ante testigos', descripcion: 'Propietario y aparcero firman el contrato en dos ejemplares ante dos testigos. Cada parte conserva un ejemplar original. Es muy recomendable autenticar las firmas ante Notario para darle mayor validez legal al documento.' },
      { num: 2, titulo: 'Verificar el plazo mínimo legal', descripcion: 'Recuerde que la Ley 6ª de 1975 establece que el contrato de aparcería no puede ser inferior a tres (3) años. En cultivos permanentes o semipermanentes, ese plazo se cuenta desde que el cultivo entre en producción.' },
      { num: 3, titulo: 'Hacer entrega formal de la parcela', descripcion: 'En la fecha acordada, el propietario hace entrega física de la parcela al aparcero. Se recomienda firmar un acta de entrega describiendo el estado del terreno, las plantaciones existentes y los elementos que se entregan.' },
      { num: 4, titulo: 'Registrar el contrato ante el INCODER o entidad competente', descripcion: 'Para mayor protección legal de ambas partes, especialmente del aparcero, se recomienda inscribir el contrato ante la entidad agraria competente de su municipio o departamento.' },
      { num: 5, titulo: 'Pagar el anticipo mensual puntualmente', descripcion: 'El propietario debe pagar el anticipo al aparcero dentro de los días acordados en la cláusula segunda. Este anticipo es imputable a las utilidades del aparcero — si no hay utilidades por causas ajenas al aparcero, no debe devolverse.' },
      { num: 6, titulo: 'Distribución de utilidades al cosechar', descripcion: 'Al momento de la cosecha, sigan el procedimiento de la cláusula quinta: primero se descuentan los gastos del aparcero, luego los del propietario, y el remanente se divide según los porcentajes del Ministerio de Agricultura vigentes para ese cultivo y región.' },
      { num: 7, titulo: 'Para terminar el contrato: aviso escrito con anticipación', descripcion: 'Cualquier parte que quiera terminar el contrato al vencimiento debe dar aviso escrito a la otra con la anticipación pactada. Sin este aviso el contrato se prorroga automáticamente por el período acordado.' },
      { num: 8, titulo: 'Si hay frutos pendientes al terminar', descripcion: 'Si al vencimiento del contrato hay cosecha pendiente de recolectar, el contrato se entiende prorrogado automáticamente por el tiempo necesario para recolectar y beneficiar esa cosecha. El aparcero no pierde su participación en esos frutos.' },
      { num: 9, titulo: 'Si el propietario incumple', descripcion: 'Si el contrato termina por incumplimiento del propietario, el aparcero queda eximido de devolver los anticipos recibidos y tiene derecho a recibir del propietario un valor igual al anticipo como indemnización adicional, más los demás derechos que le otorga la Ley 6ª de 1975.' },
    ]
  },
  'fianza-abierta': {
    titulo: 'Fianza Abierta',
    pasos: [
      { num: 1, titulo: 'Firmar el contrato en los ejemplares acordados', descripcion: 'El representante legal del fiador y el acreedor firman el contrato en el número de ejemplares pactado. Cada parte conserva el suyo. La fianza es un contrato consensual — no requiere escritura pública ni solemnidad especial, pero se recomienda autenticar las firmas ante Notario.' },
      { num: 2, titulo: 'Verificar la representación legal del fiador', descripcion: 'El acreedor debe verificar que el certificado de existencia y representación de la empresa fiadora esté vigente (máximo 30 días de expedición) y que el firmante tenga facultades para constituir garantías. Sin esto la fianza puede ser impugnable.' },
      { num: 3, titulo: 'Guardar los documentos del deudor', descripcion: 'El acreedor debe conservar todos los documentos donde consten las obligaciones del deudor — contratos, pagarés, facturas, títulos valores — pues son la prueba de las obligaciones garantizadas por la fianza.' },
      { num: 4, titulo: 'El fiador tiene el beneficio de excusión', descripcion: 'Antes de cobrarle al fiador, el acreedor debe intentar cobrarle primero al deudor. El fiador puede exigir esto señalando bienes del deudor para que el acreedor los persiga primero. Solo si el deudor no paga puede ejecutarse la fianza.' },
      { num: 5, titulo: 'Respetar el límite de la cuantía pactada', descripcion: 'El fiador solo responde hasta el valor máximo pactado en la cláusula segunda. Si la deuda del deudor supera esa suma, el exceso es responsabilidad exclusiva del deudor y no puede cobrarse al fiador.' },
      { num: 6, titulo: 'Para solicitar el relevo de la fianza', descripcion: 'Si el fiador quiere desvincularse antes del plazo, debe solicitarle al acreedor la concesión del relevo. El acreedor debe aceptar si en ese momento no existen obligaciones pendientes del deudor. Se recomienda hacer esta solicitud por escrito.' },
      { num: 7, titulo: 'Al vencimiento del plazo', descripcion: 'Al cumplirse el plazo pactado en la cláusula séptima, cesa la responsabilidad del fiador por obligaciones futuras. Sin embargo, el fiador sigue respondiendo por las obligaciones que el deudor haya contraído antes de ese vencimiento, dentro del límite de cuantía acordado.' },
    ]
  },
  'prenda-abierta': {
    titulo: 'Prenda Abierta Sin Tenencia del Acreedor',
    pasos: [
      { num: 1, titulo: 'Firmar el contrato en dos ejemplares', descripcion: 'El representante legal del acreedor y el deudor prendario firman el contrato en dos ejemplares. Cada parte conserva el suyo. Se recomienda autenticar las firmas ante Notario para darle mayor fuerza probatoria al documento.' },
      { num: 2, titulo: 'Inscribir la prenda en el Registro Mercantil', descripcion: 'Para que la prenda produzca efectos frente a terceros, debe inscribirse en el Registro Mercantil de la Cámara de Comercio de la ciudad donde estén los bienes prendados. Sin este registro, la garantía solo vale entre las partes pero no es oponible a otros acreedores.' },
      { num: 3, titulo: 'El deudor conserva el bien pero no puede venderlo', descripcion: 'A diferencia de otras garantías, el deudor se queda con el bien y puede seguir usándolo. Sin embargo, no puede venderlo, donarlo, gravarlo ni trasladarlo sin autorización escrita del acreedor. Si lo hace, el acreedor puede exigir el pago inmediato de toda la deuda.' },
      { num: 4, titulo: 'Mantener el bien en perfecto estado', descripcion: 'El deudor está obligado a mantener el bien en buen estado de funcionamiento. Si el bien se deteriora o pierde valor significativo, el acreedor puede exigir una garantía adicional o declarar vencida la deuda anticipadamente.' },
      { num: 5, titulo: 'Permitir las inspecciones del acreedor', descripcion: 'El acreedor tiene derecho a inspeccionar el bien cuando lo considere necesario, dando el aviso previo acordado. El deudor debe facilitar estas inspecciones — negarlas es un incumplimiento del contrato.' },
      { num: 6, titulo: 'Avisar inmediatamente si el bien sufre algún problema', descripcion: 'Si el bien es objeto de embargos, demandas de terceros, accidentes, robos o cualquier daño, el deudor debe avisar al acreedor dentro del plazo acordado en la cláusula duodécima. El silencio puede activar la cláusula aceleratoria.' },
      { num: 7, titulo: 'Al pagar la deuda: solicitar cancelación de la prenda', descripcion: 'Una vez pagada la totalidad de la deuda, el deudor debe solicitar al acreedor que firme el documento de cancelación de la prenda y que se inscriba esa cancelación en el Registro Mercantil. Sin esto, la prenda sigue apareciendo registrada sobre el bien.' },
    ]
  },
  'pignoracion-rentas': {
    titulo: 'Contrato de Pignoración de Rentas',
    pasos: [
      { num: 1, titulo: 'Firmar el contrato en dos ejemplares', descripcion: 'Deudor y acreedor prendario firman el contrato en dos ejemplares. Cada parte conserva el suyo. Se recomienda autenticar las firmas ante Notario para mayor seguridad jurídica.' },
      { num: 2, titulo: 'Entregar el título del crédito al acreedor', descripcion: 'El deudor prendario debe hacer entrega física al acreedor del título o documento que acredita el crédito pignorado — por ejemplo el contrato de arrendamiento original. Sin esta entrega la prenda no se perfecciona legalmente.' },
      { num: 3, titulo: 'Notificar al arrendatario o pagador de las rentas', descripcion: 'El deudor prendario debe notificar por escrito al arrendatario o deudor del crédito pignorado que a partir de ese momento debe pagar directamente al acreedor prendario. Esta notificación debe hacerse antes de la fecha límite pactada en la cláusula tercera.' },
      { num: 4, titulo: 'El acreedor recauda las rentas directamente', descripcion: 'A partir de la notificación, el acreedor prendario es quien cobra y recibe los cánones de arrendamiento. Debe abrir una cuenta especial para custodiar esos dineros y aplicarlos al pago de la deuda en las fechas de vencimiento.' },
      { num: 5, titulo: 'El deudor debe completar si las rentas no alcanzan', descripcion: 'Si en algún período los cánones recibidos no cubren la cuota de capital e intereses, el deudor prendario debe completar la diferencia directamente al acreedor. La pignoración no lo exime de su obligación de pago.' },
      { num: 6, titulo: 'Al pagar la deuda: liberar la pignoración', descripcion: 'Una vez pagada la totalidad de la deuda, el acreedor debe devolver al deudor el título del crédito pignorado y expedir un documento escrito de cancelación de la pignoración. Las rentas vuelven a ser recibidas directamente por el deudor prendario.' },
      { num: 7, titulo: 'El acreedor debe devolver el exceso de rentas', descripcion: 'Si las rentas recibidas durante la vigencia del contrato superan el valor total de la deuda, el acreedor prendario está obligado a devolver al deudor la diferencia. Guarde todos los comprobantes de pago de los cánones.' },
    ]
  },
  'hipoteca-abierta': {
    titulo: 'Hipoteca Abierta (Escritura Pública)',
    pasos: [
      { num: 1, titulo: 'Ir a la Notaría con todos los documentos', descripcion: 'Acreedor y parte hipotecante deben ir personalmente a la Notaría con sus cédulas originales, el certificado de tradición y libertad vigente del inmueble (máximo 30 días), paz y salvo de impuesto predial y valorización, y la escritura con que la parte hipotecante adquirió el inmueble.' },
      { num: 2, titulo: 'El Notario redacta y lee la escritura', descripcion: 'El Notario redacta la escritura de hipoteca, la lee a ambas partes y verifica que todo corresponda a su voluntad. Si hay errores deben corregirse antes de firmar — especialmente en la descripción del inmueble, linderos y cuantía de la hipoteca.' },
      { num: 3, titulo: 'Ambas partes firman la escritura', descripcion: 'Acreedor y parte hipotecante firman la escritura en presencia del Notario. La hipoteca solo existe legalmente desde el momento de su inscripción en el registro — no desde la firma.' },
      { num: 4, titulo: 'Pagar los derechos notariales', descripcion: 'Los gastos del otorgamiento de la escritura son de cargo de la parte hipotecante según la cláusula décima. El costo depende de la cuantía de la hipoteca y de la tarifa vigente de la Notaría.' },
      { num: 5, titulo: 'CRÍTICO: Registrar la escritura dentro de 90 días', descripcion: 'La escritura de hipoteca DEBE registrarse en la Oficina de Registro de Instrumentos Públicos dentro de los noventa (90) días siguientes a su otorgamiento. Sin este registro la hipoteca no tiene ningún valor legal. Se recomienda registrarla en los primeros días para mayor seguridad.' },
      { num: 6, titulo: 'Contratar el seguro de incendio y terremoto', descripcion: 'Una vez registrada la hipoteca, la parte hipotecante debe contratar inmediatamente la póliza de seguro contra incendio y terremoto sobre el inmueble, y endosarla a favor del acreedor. Guardar copia de la póliza y renovarla antes de cada vencimiento.' },
      { num: 7, titulo: 'Verificar el registro en el certificado de tradición', descripcion: 'Después de registrar, solicite un nuevo certificado de tradición y libertad del inmueble para verificar que la hipoteca quedó inscrita correctamente con el grado y cuantía acordados.' },
      { num: 8, titulo: 'Para cancelar la hipoteca', descripcion: 'Una vez pagada la totalidad de las obligaciones, el acreedor debe otorgar escritura pública de cancelación de hipoteca y la parte hipotecante debe registrarla en la Oficina de Registro de Instrumentos Públicos. Sin este trámite la hipoteca sigue apareciendo inscrita sobre el inmueble.' },
    ]
  },
  'mutuo-civil-hipoteca': {
    titulo: 'Contrato de Mutuo Civil Garantizado con Hipoteca',
    pasos: [
      { num: 1, titulo: 'Ir a la Notaría con todos los documentos', descripcion: 'Mutuante y mutuario deben ir personalmente a la Notaría con sus cédulas originales, el certificado de tradición y libertad del inmueble vigente (máximo 30 días), el paz y salvo de impuesto predial y el dinero o el comprobante de la transferencia del préstamo.' },
      { num: 2, titulo: 'El Notario redacta y lee la escritura', descripcion: 'El Notario redacta la escritura de mutuo con hipoteca, la lee a ambas partes y verifica que todo corresponda a lo acordado. Revise especialmente: el valor del préstamo, las tasas de interés, la fecha de vencimiento y la descripción del inmueble hipotecado.' },
      { num: 3, titulo: 'Ambas partes firman la escritura', descripcion: 'Mutuante y mutuario firman la escritura ante el Notario. Recuerde que la hipoteca solo produce efectos legales desde su inscripción en el registro — no desde la firma de la escritura.' },
      { num: 4, titulo: 'CRÍTICO: Registrar la escritura dentro de 90 días', descripcion: 'La escritura debe registrarse en la Oficina de Registro de Instrumentos Públicos dentro de los noventa (90) días siguientes a su otorgamiento. Sin este registro la hipoteca no tiene valor legal. Se recomienda registrarla en los primeros días.' },
      { num: 5, titulo: 'El mutuario paga las cuotas en las fechas acordadas', descripcion: 'El mutuario debe pagar las cuotas de capital e intereses en las fechas pactadas en la cláusula segunda. Guarde todos los comprobantes de pago — son la prueba de cumplimiento del contrato.' },
      { num: 6, titulo: 'Si el mutuario no paga: proceso ejecutivo hipotecario', descripcion: 'Si el mutuario incumple el pago de una cuota o intereses, el mutuante puede iniciar proceso ejecutivo hipotecario ante el juez civil competente. En este proceso el inmueble hipotecado puede ser embargado, secuestrado y rematado para pagar la deuda.' },
      { num: 7, titulo: 'Al pagar la totalidad: cancelar la hipoteca', descripcion: 'Una vez pagada toda la deuda con sus intereses, el mutuante debe otorgar escritura pública de cancelación de hipoteca. El mutuario debe registrar esa cancelación en la Oficina de Registro. Sin este trámite la hipoteca sigue inscrita sobre el inmueble.' },
    ]
  },
  'hipoteca-garantizar-saldo': {
    titulo: 'Constitución de Hipoteca para Garantizar Saldo',
    pasos: [
      { num: 1, titulo: 'Ir a la Notaría con todos los documentos', descripcion: 'La parte hipotecante y el acreedor deben ir a la Notaría con sus cédulas originales, el certificado de tradición y libertad del inmueble vigente (máximo 30 días), el paz y salvo de impuesto predial y la escritura con que la parte hipotecante adquirió el inmueble.' },
      { num: 2, titulo: 'El Notario redacta y lee la escritura', descripcion: 'El Notario redacta la escritura de hipoteca, la lee a las partes y verifica que todo sea correcto. Revise especialmente: la descripción del inmueble, el folio de matrícula, la cuantía garantizada, las tasas de interés y el plazo.' },
      { num: 3, titulo: 'Ambas partes firman la escritura', descripcion: 'La parte hipotecante y el acreedor firman la escritura ante el Notario. Sin el registro posterior esta hipoteca no tiene ningún efecto legal frente a terceros.' },
      { num: 4, titulo: 'CRÍTICO: Registrar la escritura dentro de 90 días', descripcion: 'La escritura debe registrarse en la Oficina de Registro de Instrumentos Públicos dentro de los noventa (90) días siguientes a su otorgamiento. Sin este registro la hipoteca no vale. Se recomienda registrarla en los primeros días para mayor seguridad.' },
      { num: 5, titulo: 'La hipoteca se exige si hay mora en dos cuotas consecutivas', descripcion: 'Según la cláusula quinta, el acreedor puede exigir el pago total del saldo si el deudor deja de pagar dos mensualidades consecutivas de intereses, o si el inmueble hipotecado es perseguido por otro acreedor.' },
      { num: 6, titulo: 'Al pagar el saldo: cancelar la hipoteca', descripcion: 'Una vez pagado el saldo garantizado, el acreedor debe otorgar escritura pública de cancelación de hipoteca. La parte hipotecante debe registrar esa cancelación en la Oficina de Registro. Sin este trámite la hipoteca sigue apareciendo inscrita sobre el inmueble.' },
      { num: 7, titulo: 'Conviene otorgar la cancelación en la misma Notaría', descripcion: 'El libro Legis recomienda que la cancelación de la hipoteca se otorgue en la misma Notaría donde se constituyó — esto ahorra tiempo y reduce costos, pues el Notario ya tiene antecedentes del instrumento.' },
    ]
  },
  'ampliacion-hipoteca': {
    titulo: 'Ampliación de Hipoteca',
    pasos: [
      { num: 1, titulo: 'Verificar el valor actual del inmueble antes de ampliar', descripcion: 'Antes de otorgar la escritura de ampliación, el acreedor debe verificar que el valor comercial actual del inmueble sea suficiente para respaldar la nueva cuantía ampliada. Se recomienda que el crédito total no supere el 70% del valor del inmueble.' },
      { num: 2, titulo: 'Ir a la Notaría con todos los documentos', descripcion: 'Acreedor y deudor deben ir a la Notaría con sus cédulas, el certificado de tradición y libertad vigente del inmueble (máximo 30 días), la copia de la escritura original de hipoteca y el paz y salvo de impuesto predial.' },
      { num: 3, titulo: 'Puede ser la misma Notaría o una diferente', descripcion: 'La ampliación puede otorgarse en cualquier Notaría, no necesariamente la misma donde se constituyó la hipoteca original. Sin embargo, si es la misma Notaría se ahorra tiempo porque ya tienen antecedentes del instrumento.' },
      { num: 4, titulo: 'CRÍTICO: Registrar la escritura dentro de 90 días', descripcion: 'La escritura de ampliación de hipoteca debe registrarse en la Oficina de Registro de Instrumentos Públicos dentro de los noventa (90) días siguientes a su otorgamiento. Sin este registro la ampliación no produce ningún efecto legal.' },
      { num: 5, titulo: 'Verificar que la ampliación quede inscrita correctamente', descripcion: 'Después del registro, solicite un nuevo certificado de tradición y libertad del inmueble para verificar que la hipoteca ampliada aparezca inscrita con la nueva cuantía y el nuevo plazo. Guarde ese certificado.' },
      { num: 6, titulo: 'El acreedor debe ser beneficiario del seguro', descripcion: 'Si el inmueble tiene póliza de seguro contra incendio y terremoto, el acreedor debe verificar que figure como beneficiario de esa póliza por el valor total de la hipoteca ampliada. Si no figura, solicitar el endoso de la póliza a su favor.' },
    ]
  },
  'cancelacion-hipoteca': {
    titulo: 'Cancelación de Hipoteca',
    pasos: [
      { num: 1, titulo: 'Solo el acreedor puede cancelar la hipoteca', descripcion: 'La cancelación de hipoteca solo puede declararla el acreedor — quien tiene el derecho hipotecario. Es él quien comparece ante el Notario y declara que recibió el pago total y que cancela la hipoteca. El deudor también firma pero la declaración la hace el acreedor.' },
      { num: 2, titulo: 'Ir a la Notaría con todos los documentos', descripcion: 'Acreedor y deudor deben ir a la Notaría con sus cédulas originales, copia de la escritura donde se constituyó la hipoteca y el certificado de tradición y libertad vigente del inmueble para verificar los datos del gravamen.' },
      { num: 3, titulo: 'Puede ser la misma Notaría o una diferente', descripcion: 'La cancelación puede otorgarse ante cualquier Notaría, no necesariamente la misma donde se constituyó la hipoteca. Si es una Notaría diferente, el Notario expedirá certificado adicional para la Notaría donde reposa el original.' },
      { num: 4, titulo: 'CRÍTICO: Registrar la cancelación en el Registro', descripcion: 'La escritura de cancelación debe registrarse en la Oficina de Registro de Instrumentos Públicos. Solo a partir de ese registro el inmueble aparecerá libre del gravamen. Sin el registro, la hipoteca sigue inscrita aunque esté cancelada ante el Notario.' },
      { num: 5, titulo: 'Verificar que el inmueble quede libre en el certificado', descripcion: 'Después del registro, solicite un nuevo certificado de tradición y libertad del inmueble para verificar que la hipoteca cancelada ya no aparezca inscrita. Ese certificado es la prueba definitiva de que el inmueble está libre.' },
      { num: 6, titulo: 'El Notario anotará la cancelación en la escritura original', descripcion: 'El Notario que conserva el original de la escritura de hipoteca debe poner una nota diagonal en ese documento, en tinta de color diferente, indicando el número y fecha del instrumento de cancelación. Esto garantiza la consistencia de los registros notariales.' },
    ]
  },
  'carta-primera-convocatoria': {
    titulo: 'Carta de Primera Convocatoria a Asamblea',
    pasos: [
      { num: 1, titulo: 'Enviar con mínimo 15 días de anticipación', descripcion: 'La Ley 675 de 2001 en su artículo 39 exige que la convocatoria a asamblea ordinaria se haga con no menos de quince (15) días calendario de anticipación. Si la convoca con menos tiempo, la asamblea y sus decisiones pueden ser impugnadas.' },
      { num: 2, titulo: 'Enviar a TODOS los propietarios sin excepción', descripcion: 'La convocatoria debe enviarse a cada uno de los propietarios de bienes de dominio particular, a la última dirección registrada ante la administración. Si algún propietario no recibe la convocatoria puede impugnar las decisiones tomadas.' },
      { num: 3, titulo: 'Guardar prueba del envío', descripcion: 'Guarde el comprobante de envío de cada carta — correo certificado, constancia de entrega personal, o acuse de recibo firmado. En caso de impugnación, esa prueba demuestra que la convocatoria fue debidamente realizada.' },
      { num: 4, titulo: 'Incluir la relación de propietarios morosos', descripcion: 'La ley exige que la convocatoria incluya una relación de los propietarios que adeuden contribuciones a las expensas comunes. Adjunte ese listado a cada carta enviada.' },
      { num: 5, titulo: 'Si no hay quórum: convocar segunda asamblea', descripcion: 'Si el día de la asamblea no se reúne el porcentaje de coeficientes requerido, la asamblea no puede sesionar en primera convocatoria. Debe convocarse de inmediato a segunda convocatoria, que sesionará el tercer día hábil siguiente con cualquier número de participantes.' },
      { num: 6, titulo: 'Las decisiones obligan a todos', descripcion: 'Las decisiones adoptadas válidamente en la asamblea obligan a TODOS los propietarios, incluidos quienes no asistieron o votaron en contra. Nadie puede desconocer lo decidido en asamblea debidamente convocada.' },
    ]
  },
  'carta-segunda-convocatoria': {
    titulo: 'Carta de Segunda Convocatoria a Asamblea',
    pasos: [
      { num: 1, titulo: 'La segunda convocatoria debe hacerse el tercer día hábil siguiente', descripcion: 'Según el artículo 41 de la Ley 675 de 2001, si la primera asamblea no pudo sesionar por falta de quórum, la segunda convocatoria debe realizarse el tercer día hábil siguiente. El reglamento de propiedad horizontal puede establecer un plazo diferente.' },
      { num: 2, titulo: 'En segunda convocatoria no hay quórum mínimo', descripcion: 'La asamblea en segunda convocatoria sesiona y decide válidamente con CUALQUIER número plural de propietarios, sin importar el porcentaje de coeficientes representados. Incluso si solo asisten dos propietarios, la asamblea es válida.' },
      { num: 3, titulo: 'El orden del día debe ser el mismo de la primera convocatoria', descripcion: 'No se pueden agregar nuevos temas al orden del día en la segunda convocatoria. Solo se tratan los asuntos que estaban en la convocatoria original.' },
      { num: 4, titulo: 'Guardar prueba del envío', descripcion: 'Al igual que con la primera convocatoria, guarde el comprobante de envío de cada carta. Esto es fundamental para demostrar que la segunda convocatoria fue debidamente notificada a todos los propietarios.' },
      { num: 5, titulo: 'Las decisiones siguen siendo obligatorias para todos', descripcion: 'Las decisiones tomadas en segunda convocatoria tienen exactamente la misma validez que las de primera convocatoria. Obligan a todos los propietarios incluyendo a los ausentes y a los disidentes.' },
    ]
  },
  'carta-primera-convocatoria': {
    titulo: 'Carta de Primera Convocatoria a Asamblea',
    pasos: [
      { num: 1, titulo: 'Enviar con mínimo 15 días de anticipación', descripcion: 'La Ley 675 de 2001 exige que la convocatoria se envíe con una anticipación no inferior a quince (15) días calendario antes de la reunión. Si no se cumple este plazo, las decisiones de la asamblea pueden ser impugnadas.' },
      { num: 2, titulo: 'Enviarla a cada propietario en su última dirección registrada', descripcion: 'Debe enviarse una carta individual a cada propietario a la última dirección que cada uno haya registrado ante la administración. No es suficiente pegar un aviso en la cartelera — aunque eso también puede hacerse adicionalmente.' },
      { num: 3, titulo: 'Guardar constancia del envío', descripcion: 'Guarde el soporte de que cada carta fue enviada o entregada — ya sea la firma de recibido del propietario, el registro de envío por correo certificado o la constancia del mensajero. Esto es fundamental si algún propietario impugna la convocatoria.' },
      { num: 4, titulo: 'Incluir siempre el orden del día completo', descripcion: 'La ley exige que el orden del día figure en la convocatoria. La asamblea no puede tomar decisiones sobre temas que no estén en el orden del día enviado — excepto la elección de presidente y secretario de la reunión.' },
      { num: 5, titulo: 'Indicar la relación de propietarios morosos', descripcion: 'El artículo 39 de la Ley 675 de 2001 exige que la convocatoria contenga una relación de los propietarios que adeuden contribuciones a las expensas comunes. Esta lista se puede adjuntar a la carta.' },
      { num: 6, titulo: 'Si no hay quórum: convocar segunda reunión', descripcion: 'Si transcurrida la hora de inicio no se reúne el quórum requerido, el administrador debe convocar inmediatamente a una segunda reunión que se realizará el tercer día hábil siguiente, a las 8:00 p.m. En esa segunda reunión se decide con cualquier número de propietarios.' },
    ]
  },
  'carta-segunda-convocatoria': {
    titulo: 'Carta de Segunda Convocatoria a Asamblea',
    pasos: [
      { num: 1, titulo: 'La segunda reunión es el tercer día hábil siguiente', descripcion: 'Según el artículo 41 de la Ley 675 de 2001, la segunda reunión debe realizarse el tercer día hábil siguiente al de la primera convocatoria fallida, a las 8:00 p.m. — salvo que el reglamento establezca algo diferente.' },
      { num: 2, titulo: 'En segunda convocatoria se decide con cualquier número de propietarios', descripcion: 'La gran diferencia con la primera convocatoria es que en la segunda NO se requiere quórum mínimo. La asamblea sesiona y decide válidamente con cualquier número plural de propietarios que asistan, independientemente del porcentaje de coeficientes que representen.' },
      { num: 3, titulo: 'El orden del día debe ser el mismo', descripcion: 'No se pueden agregar nuevos puntos al orden del día en la segunda convocatoria. Debe ser exactamente el mismo que se envió en la primera.' },
      { num: 4, titulo: 'Las decisiones también obligan a los ausentes', descripcion: 'Las decisiones que tome la asamblea en segunda convocatoria tienen exactamente la misma validez que las de primera convocatoria — obligan a todos los propietarios, incluso a quienes no asistieron.' },
      { num: 5, titulo: 'Guardar constancia del envío igual que en la primera', descripcion: 'Aunque sea la segunda convocatoria, debe guardarse la misma constancia de envío a cada propietario. Un propietario no puede impugnar una decisión argumentando que no fue convocado si el administrador tiene la prueba de que sí lo fue.' },
    ]
  },
  'poder-asistir-asamblea': {
    titulo: 'Poder Especial para Asistir a Asamblea',
    pasos: [
      { num: 1, titulo: 'El poder debe presentarse al inicio de la asamblea', descripcion: 'El apoderado debe entregar el poder original al administrador o al presidente de la asamblea antes de que esta comience. Sin presentar el poder, el apoderado no puede votar ni participar en nombre del propietario.' },
      { num: 2, titulo: 'Verificar los requisitos del reglamento', descripcion: 'Cada reglamento de propiedad horizontal puede exigir requisitos especiales para el poder — como autenticación de firmas, formato específico, o que el apoderado también sea propietario del conjunto. Lea el reglamento antes de firmar.' },
      { num: 3, titulo: 'El poder es solo para esa asamblea', descripcion: 'Este poder especial es válido únicamente para la reunión indicada. Si el propietario no puede asistir a una asamblea futura, deberá otorgar un nuevo poder específico para esa ocasión.' },
      { num: 4, titulo: 'Los miembros de órganos de administración no pueden ser apoderados', descripcion: 'La Ley 675 de 2001 establece que los miembros del consejo de administración, el administrador y los empleados de la copropiedad NO pueden representar a propietarios en las asambleas mientras ejerzan sus cargos, salvo sus propios derechos.' },
      { num: 5, titulo: 'El apoderado tiene los mismos derechos que el propietario', descripcion: 'El apoderado puede participar en todas las deliberaciones, hacer uso de la palabra y votar en todos los puntos del orden del día, exactamente igual que si fuera el propietario en persona.' },
    ]
  },
  'acta-asamblea-propietarios': {
    titulo: 'Acta de Asamblea General de Propietarios',
    pasos: [
      { num: 1, titulo: 'El acta debe firmarse por el presidente y el secretario', descripcion: 'Una vez terminada la asamblea, el presidente y el secretario deben firmar el acta. Es suficiente con estas dos firmas para acreditar la autenticidad del documento según la Ley 675 de 2001.' },
      { num: 2, titulo: 'Asentar el acta en el libro oficial dentro de 20 días', descripcion: 'El administrador debe asentar el acta en el libro de actas registrado en la Alcaldía municipal dentro de los veinte (20) días hábiles siguientes a la reunión. Pasado este plazo hay incumplimiento legal.' },
      { num: 3, titulo: 'Poner el acta a disposición de los propietarios', descripcion: 'Dentro de los veinte (20) días hábiles siguientes a la reunión, el administrador debe poner a disposición de todos los propietarios copia completa del texto del acta en la sede de la administración, e informar por escrito de esta situación a cada propietario.' },
      { num: 4, titulo: 'Las decisiones son obligatorias para todos', descripcion: 'Las decisiones adoptadas válidamente en la asamblea son de obligatorio cumplimiento para TODOS los propietarios, incluso para los ausentes o disidentes. Quien no asistió no puede desconocer las decisiones tomadas.' },
      { num: 5, titulo: 'Las actas hacen plena prueba y prestan mérito ejecutivo', descripcion: 'Las actas debidamente autenticadas hacen plena prueba de los hechos y actos en ellas contenidos. Sus copias autenticadas prestan mérito ejecutivo para el cobro de cuotas de administración aprobadas.' },
      { num: 6, titulo: 'Impugnar decisiones dentro del mes siguiente', descripcion: 'Si un propietario considera que alguna decisión viola la ley o el reglamento, puede impugnarla ante la jurisdicción civil dentro del mes siguiente a la fecha de comunicación del acta. Pasado ese plazo la decisión queda en firme.' },
    ]
  },
  'reglamento-propiedad-horizontal': {
    titulo: 'Reglamento de Propiedad Horizontal',
    pasos: [
      { num: 1, titulo: 'Contratar un abogado especialista en propiedad horizontal', descripcion: 'Aunque este modelo es una guía completa, el reglamento de propiedad horizontal es un documento muy técnico que creará la persona jurídica de la copropiedad. Se recomienda asesorarse de un abogado especialista para adaptar el reglamento a las características específicas del edificio.' },
      { num: 2, titulo: 'Obtener la licencia de construcción antes de otorgar el reglamento', descripcion: 'El artículo 6° de la Ley 675 de 2001 exige que con la escritura se protocolice la licencia de construcción y los planos aprobados por la autoridad competente. Sin estos documentos el Notario no puede otorgar la escritura.' },
      { num: 3, titulo: 'Calcular los coeficientes de copropiedad', descripcion: 'Antes de ir a la Notaría se deben calcular los coeficientes de copropiedad de cada unidad privada con base en el área privada construida de cada apartamento frente al área total privada del edificio. Estos coeficientes determinan el porcentaje de participación en gastos y votaciones.' },
      { num: 4, titulo: 'Otorgar la escritura pública ante Notario', descripcion: 'El apoderado de los propietarios comparece ante el Notario con el poder, la licencia de construcción, los planos aprobados, el paz y salvo del lote y los demás documentos del edificio. El Notario redacta y autoriza la escritura.' },
      { num: 5, titulo: 'CRÍTICO: Registrar la escritura en Instrumentos Públicos', descripcion: 'La escritura de reglamento de propiedad horizontal debe registrarse en la Oficina de Registro de Instrumentos Públicos. Solo a partir de ese registro surge la persona jurídica de la copropiedad y el edificio queda sometido al régimen de propiedad horizontal. Sin el registro no existe legalmente.' },
      { num: 6, titulo: 'Convocar la primera asamblea de propietarios', descripcion: 'Una vez registrada la escritura, se debe convocar la primera asamblea general de propietarios para elegir el consejo de administración, nombrar al administrador y al revisor fiscal si lo hubiere, y aprobar el presupuesto inicial de administración.' },
      { num: 7, titulo: 'Abrir cuenta bancaria de la copropiedad', descripcion: 'El administrador debe abrir una cuenta bancaria a nombre de la propiedad horizontal para el manejo de los dineros provenientes de expensas comunes, fondo de imprevistos y demás ingresos de la copropiedad.' },
    ]
  },

  'disolucion-liquidacion-sociedad-conyugal': {
    titulo: 'Disolución y Liquidación de Sociedad Conyugal',
    pasos: [
      { num: 1, titulo: 'Ir a la Notaría con todos los documentos', descripcion: 'Ambos cónyuges deben ir personalmente a la Notaría con: cédulas originales, registro civil de matrimonio (expedido máximo un mes antes), documentos de todos los bienes (escrituras, tarjetas de propiedad de vehículos, certificados bancarios) y certificados de las deudas.' },
      { num: 2, titulo: 'El Notario redacta y lee la escritura', descripcion: 'El Notario redacta la escritura con todos los datos, la lee a ambos cónyuges y verifica que el inventario de bienes y deudas sea correcto. Revise especialmente los avalúos y los nombres antes de firmar.' },
      { num: 3, titulo: 'Ambos cónyuges firman la escritura', descripcion: 'Los dos cónyuges deben firmar la escritura en presencia del Notario. No puede firmarla solo uno de ellos.' },
      { num: 4, titulo: 'Pagar los derechos notariales', descripcion: 'Los derechos notariales se calculan sobre el valor total del activo bruto de la sociedad. Consulte la tarifa vigente en la Notaría antes de ir.' },
      { num: 5, titulo: 'CRÍTICO: Registrar la escritura en Instrumentos Públicos', descripcion: 'Si entre los bienes hay inmuebles, la escritura DEBE registrarse en la Oficina de Registro de Instrumentos Públicos de la ciudad donde están ubicados. Sin este registro la disolución no es oponible a terceros.' },
      { num: 6, titulo: 'Inscribir en el Registro de Varios', descripcion: 'El Notario debe inscribir la escritura en el registro de varios a su cargo. Esto hace la disolución oponible frente a terceros.' },
      { num: 7, titulo: 'Si algún cónyuge es comerciante: inscribir en Cámara de Comercio', descripcion: 'Si uno o ambos cónyuges son comerciantes, la liquidación debe inscribirse también en el Registro Mercantil de la Cámara de Comercio correspondiente.' },
      { num: 8, titulo: 'Actualizar los registros de los bienes adjudicados', descripcion: 'Después del registro, tramite el cambio de propietario de cada bien: inmuebles en Instrumentos Públicos, vehículos en tránsito, actualización de cuentas bancarias.' },
    ]
  },
  'disolucion-sociedad-conyugal-sin-bienes': {
    titulo: 'Disolución de Sociedad Conyugal Sin Bienes Comunes',
    pasos: [
      { num: 1, titulo: 'Ir a la Notaría con los documentos', descripcion: 'Ambos cónyuges deben ir personalmente a la Notaría con sus cédulas originales y el registro civil de matrimonio expedido máximo un mes antes.' },
      { num: 2, titulo: 'Llevar los registros civiles de nacimiento de los hijos', descripcion: 'Si tienen hijos comunes, deben llevar las copias de los registros civiles de nacimiento para protocolizarlas con la escritura.' },
      { num: 3, titulo: 'El Notario autoriza la escritura', descripcion: 'Al ser una escritura sin inventario de bienes, es más sencilla y rápida. Aun así, ambos cónyuges deben firmarla en presencia del Notario.' },
      { num: 4, titulo: 'CRÍTICO: Registrar la escritura', descripcion: 'La escritura debe registrarse en el registro de varios del Notario encargado del registro civil. Sin este registro la separación de bienes no es oponible a terceros.' },
      { num: 5, titulo: 'Si hay inmuebles individuales a nombre de cada uno', descripcion: 'Aunque no haya bienes comunes, si uno de los cónyuges tiene inmuebles propios, es recomendable verificar que figuren correctamente a su nombre en el certificado de tradición para evitar confusiones futuras.' },
    ]
  },
  'disolucion-liquidacion-sociedad-patrimonial': {
    titulo: 'Disolución y Liquidación de Sociedad Patrimonial de Unión Marital de Hecho',
    pasos: [
      { num: 1, titulo: 'Requisito previo: sentencia judicial que declare la unión marital', descripcion: 'Antes de hacer esta escritura, los compañeros permanentes deben tener una sentencia judicial ejecutoriada del Juzgado de Familia que haya declarado la existencia de la unión marital de hecho. Sin esa sentencia no es posible otorgar la escritura.' },
      { num: 2, titulo: 'Ir a la Notaría con todos los documentos', descripcion: 'Ambos compañeros deben ir personalmente a la Notaría con: cédulas originales, copia de la sentencia judicial, documentos de todos los bienes (escrituras, tarjetas de propiedad de vehículos, certificados bancarios) y certificados de las deudas.' },
      { num: 3, titulo: 'El Notario redacta y lee la escritura', descripcion: 'El Notario redacta la escritura incluyendo el inventario de bienes, el pasivo y las adjudicaciones. Ambos compañeros deben verificar que todo esté correcto antes de firmar.' },
      { num: 4, titulo: 'Ambos compañeros firman la escritura', descripcion: 'Los dos compañeros permanentes deben firmar en presencia del Notario.' },
      { num: 5, titulo: 'CRÍTICO: Registrar si hay inmuebles', descripcion: 'Si entre los bienes hay inmuebles, la escritura DEBE registrarse en la Oficina de Registro de Instrumentos Públicos de la ciudad donde están ubicados.' },
      { num: 6, titulo: 'Atención al plazo de prescripción', descripcion: 'Las acciones para disolver y liquidar la sociedad patrimonial prescriben en un año contado desde la separación física, el matrimonio con terceros o la muerte de uno de los compañeros. No deje pasar ese plazo.' },
      { num: 7, titulo: 'Actualizar los registros de los bienes adjudicados', descripcion: 'Tramite el cambio de propietario de cada bien adjudicado: inmuebles en Instrumentos Públicos, vehículos en tránsito, actualización de cuentas bancarias.' },
    ]
  },

  'compraventa-propiedad-horizontal': {
    titulo: 'Compraventa de Inmueble bajo Propiedad Horizontal',
    pasos: [
      { num: 1, titulo: 'Documentos que debe llevar el vendedor a la Notaría', descripcion: 'Cédula original, escritura anterior con que adquirió el apartamento, certificado de tradición y libertad vigente (máximo 30 días), paz y salvo de impuesto predial, paz y salvo de servicios públicos y paz y salvo de administración del edificio expedido por el administrador.' },
      { num: 2, titulo: 'Documentos que debe llevar el comprador', descripcion: 'Cédula original. Si va a pagar con crédito hipotecario, llevar la carta de aprobación del banco y coordinarse con el banco para el desembolso el mismo día de la escritura.' },
      { num: 3, titulo: 'El Notario redacta y lee la escritura', descripcion: 'El Notario redacta la escritura incluyendo los datos del reglamento de propiedad horizontal. Verifique especialmente: número del apartamento, área privada, linderos especiales, folio de matrícula y precio.' },
      { num: 4, titulo: 'Pagar los gastos notariales y de registro', descripcion: 'Los gastos notariales los pagan ambas partes por igual. Los gastos de registro (beneficencia, tesorería e impuesto de registro) son a cargo del comprador. La retención en la fuente es a cargo del vendedor.' },
      { num: 5, titulo: 'CRÍTICO: Registrar la escritura en Instrumentos Públicos', descripcion: 'La escritura debe registrarse en la Oficina de Registro de Instrumentos Públicos. Solo a partir del registro el comprador es el nuevo dueño legal del apartamento. El plazo para registrar es de 90 días desde el otorgamiento.' },
      { num: 6, titulo: 'El comprador debe conocer el reglamento de propiedad horizontal', descripcion: 'Al firmar la escritura el comprador declara conocer y aceptar el reglamento de propiedad horizontal. Solicite una copia al vendedor o a la administración del edificio antes de firmar. El reglamento establece las normas de convivencia, cuotas de administración y uso de áreas comunes.' },
      { num: 7, titulo: 'Notificar a la administración del edificio', descripcion: 'Una vez registrada la escritura, el nuevo propietario debe notificar a la administración del edificio el cambio de propietario, presentar copia de la escritura y actualizar sus datos de contacto para el cobro de cuotas de administración.' },
    ]
  },
}

function TooltipField({ field, onChange, value, error }) {
  const [tooltipData, setTooltipData] = useState(null)
  const btnRef = useRef(null)
  const help = FIELD_HELP[field.name]

  const handleMouseEnter = () => {
    if (!btnRef.current || !help) return
    const rect = btnRef.current.getBoundingClientRect()
    const W = 260
    const H = 150
    let left = rect.right + 10
    let top = rect.top - 10
    if (left + W > window.innerWidth - 10) left = rect.left - W - 10
    if (left < 10) left = 10
    if (top + H > window.innerHeight - 10) top = window.innerHeight - H - 10
    if (top < 10) top = 10
    setTooltipData({ top, left })
  }

  const handleMouseLeave = () => setTooltipData(null)

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 'bold', color: error ? '#b8962e' : '#3a6a9a', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          {field.label}
        </label>
        {help && (
          <div ref={btnRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
            style={{
              width: '16px', height: '16px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #c9a030, #b8962e)',
              color: '#fff', fontSize: '10px', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'help', flexShrink: 0,
              boxShadow: '0 1px 0 rgba(255,255,255,0.2) inset, 0 2px 0 #7a6010, 0 3px 6px rgba(0,0,0,0.25)'
            }}>
            ?
          </div>
        )}
      </div>
      <input
        type={field.type}
        placeholder={`Ingrese ${field.label.toLowerCase()}`}
        value={value !== undefined ? value : ''}
        onChange={e => onChange(field.name, e.target.value)}
        className={error ? 'campo-error' : 'input-3d'}
        style={{
          width: '100%', padding: '10px 14px',
          background: value ? 'linear-gradient(160deg, #f0faf0, #e8f5e8)' : 'linear-gradient(160deg, #f8fbff, #f0f6ff)',
          border: `1px solid ${value ? '#4caf50' : '#c8d8e8'}`,
          borderRadius: '6px', fontSize: '13px', color: '#1a3a5c',
          boxSizing: 'border-box', outline: 'none', fontFamily: 'Georgia, serif',
          transition: 'all 0.2s ease'
        }}
      />
      {tooltipData && help && createPortal(
        <div style={{
          position: 'fixed', top: tooltipData.top, left: tooltipData.left,
          background: 'linear-gradient(135deg, #1a3a5c, #0d2240)',
          color: '#e0eaf5', fontSize: '12px', lineHeight: '1.6',
          padding: '10px 14px', borderRadius: '8px', width: '260px',
          zIndex: 999999,
          boxShadow: '0 2px 0 #061528, 0 4px 0 #040e1e, 0 8px 20px rgba(0,0,0,0.5)',
          border: '1px solid #b8962e', pointerEvents: 'none'
        }}>
          <div style={{ color: '#e2b94a', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>¿Cómo llenar este campo?</div>
          {help}
        </div>,
        document.body
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
    ventana.document.write(`<html><head><title>Guía de trámites</title><style>body{font-family:'Times New Roman',serif;margin:2cm;color:#000;}h2{color:#1a3a5c;border-bottom:2px solid #b8962e;padding-bottom:8px;}.paso{margin-bottom:20px;display:flex;gap:14px;}.num{width:28px;height:28px;border-radius:50%;background:#1a3a5c;color:#e2b94a;display:flex;align-items:center;justify-content:center;font-weight:bold;flex-shrink:0;}.tit{font-weight:bold;font-size:14px;color:#1a3a5c;margin-bottom:4px;}.desc{font-size:13px;line-height:1.6;color:#444;}</style></head><body>${contenido}</body></html>`)
    ventana.document.close()
    ventana.print()
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.65)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div className="modal-3d" style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f8fbff 100%)', borderRadius: '14px', width: '680px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #c8d8e8' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #0d2240 100%)', padding: '20px 24px', borderBottom: '3px solid #b8962e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3) inset' }}>
          <div>
            <div style={{ color: '#e2b94a', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Guía de Trámites</div>
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>¿Qué hago ahora?</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid #ffffff44', color: '#fff', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px', boxShadow: '0 2px 0 rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)' }}>✕ Cerrar</button>
        </div>
        <div style={{ overflowY: 'auto', padding: '24px', flex: 1 }} id="pasos-imprimir">
          <h2 style={{ color: '#1a3a5c', fontSize: '16px', marginBottom: '20px', borderBottom: '2px solid #e2b94a', paddingBottom: '10px' }}>Pasos a seguir: {pasos.titulo}</h2>
          {pasos.pasos.map(paso => (
            <div key={paso.num} style={{ marginBottom: '20px', display: 'flex', gap: '14px' }}>
              <div className="paso-num-3d" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a3a5c, #0d2240)', color: '#e2b94a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0, marginTop: '2px' }}>{paso.num}</div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#1a3a5c', fontSize: '14px', marginBottom: '6px' }}>{paso.titulo}</div>
                <div style={{ color: '#4a6a8a', fontSize: '13px', lineHeight: '1.7' }}>{paso.descripcion}</div>
              </div>
            </div>
          ))}
          <div style={{ background: 'linear-gradient(135deg, #fff8e7, #fff3d0)', border: '1px solid #e2b94a', borderBottom: '2px solid #b8962e', borderRadius: '8px', padding: '14px', marginTop: '10px', boxShadow: '0 2px 0 #8a6418, 0 4px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ color: '#b8962e', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>⚠️ Importante</div>
            <div style={{ color: '#5a4a20', fontSize: '12px', lineHeight: '1.6' }}>Esta guía es informativa. Para casos específicos consulte siempre con un abogado titulado. Los costos y requisitos pueden variar según el municipio y la fecha.</div>
          </div>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end', background: '#f8fbff' }}>
          <button onClick={handlePrint} className="btn-green-3d" style={{ padding: '10px 24px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>🖨️ Imprimir guía</button>
          <button onClick={onClose} className="btn-primary-3d" style={{ padding: '10px 24px', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Cerrar</button>
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
  const [historial, setHistorial] = useState([])
  const [showHistorial, setShowHistorial] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [errores, setErrores] = useState({})
  const [expandedSubtitles, setExpandedSubtitles] = useState({})

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
    setErrores({})
    const res = await fetch(`http://localhost:3001/api/minutas/${selectedCategory.id}/${minuta.id}`)
    const data = await res.json()
    setMinutaDetail(data)
  }

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: false }))
  }

  const handleLlenarPrueba = () => {
    if (!minutaDetail) return
    const datosFiltrados = {}
    minutaDetail.fields.forEach(field => {
      if (DATOS_PRUEBA[field.name] !== undefined) datosFiltrados[field.name] = String(DATOS_PRUEBA[field.name])
    })
    setFormData(datosFiltrados)
    setErrores({})
  }

  const validarCampos = () => {
    const nuevosErrores = {}
    minutaDetail.fields.forEach(field => {
      if (field.required && !formData[field.name]) nuevosErrores[field.name] = true
    })
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handlePreview = async () => {
    if (!validarCampos()) {
      setTimeout(() => { document.getElementById('alerta-campos')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, 100)
      return
    }
    setLoading(true)
    const res = await fetch('http://localhost:3001/api/generate/preview', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template: minutaDetail.template, title: minutaDetail.title, data: formData })
    })
    const data = await res.json()
    setPreviewHTML(data.html)
    setLoading(false)
    setHistorial(prev => [{ id: Date.now(), titulo: minutaDetail.title, hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }), html: data.html }, ...prev.slice(0, 9)])
  }

  const handlePrint = () => { document.getElementById('preview-iframe').contentWindow.print() }

  const handleDownloadWord = async () => {
    setLoadingWord(true)
    try {
      const res = await fetch('http://localhost:3001/api/generate/word', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: minutaDetail.template, title: minutaDetail.title, data: formData })
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `${minutaDetail.title}.docx`; a.click()
      URL.revokeObjectURL(url)
    } catch { alert('Error al generar el documento Word.') }
    setLoadingWord(false)
  }

  const camposConError = Object.keys(errores).filter(k => errores[k]).length
  const todasLasMinutas = categories.flatMap(cat => cat.minutas.map(m => ({ ...m, catId: cat.id, catName: cat.name })))
  const minutasFiltradas = busqueda.trim() ? todasLasMinutas.filter(m => m.title.toLowerCase().includes(busqueda.toLowerCase())) : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: 'linear-gradient(135deg, #d8e4f0 0%, #e8f0f8 50%, #d0dcea 100%)', fontFamily: 'Georgia, serif' }}>

      {showPasos && <PanelPasos minutaId={minutaDetail?.id} onClose={() => setShowPasos(false)} />}

      <header className="header-3d" style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #2c5282 100%)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '28px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>⚖️</div>
          <div>
            <div style={{ color: '#e2b94a', fontSize: '30px', fontWeight: 'bold', letterSpacing: '3px', textShadow: '0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.4)' }}>LEXDOC</div>
            <div style={{ color: '#a0bcd8', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>Generador de Minutas Legales · Colombia</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ color: '#e2b94a', fontSize: '16px', letterSpacing: '1px', fontWeight: 'bold', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            {categories.reduce((acc, cat) => acc + cat.minutas.length, 0)} minutas disponibles
          </div>
          {historial.length > 0 && (
            <button onClick={() => setShowHistorial(!showHistorial)} style={{ background: showHistorial ? 'linear-gradient(135deg, #e2b94a, #c9a030)' : 'rgba(255,255,255,0.08)', border: '1px solid #e2b94a66', color: showHistorial ? '#1a3a5c' : '#e2b94a', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', boxShadow: showHistorial ? '0 2px 0 #8a6418, 0 4px 10px rgba(0,0,0,0.3)' : '0 2px 0 rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)' }}>
              🕒 Historial ({historial.length})
            </button>
          )}
        </div>
      </header>

      {showHistorial && historial.length > 0 && (
        <div style={{ background: 'linear-gradient(135deg, #0a1628, #0d1e30)', borderBottom: '1px solid #1e3a5f', padding: '12px 32px', display: 'flex', gap: '10px', overflowX: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.3) inset' }}>
          {historial.map(item => (
            <div key={item.id} className="historial-item-3d" onClick={() => { setPreviewHTML(item.html); setShowHistorial(false) }}
              style={{ background: 'linear-gradient(135deg, #1e3a5c, #162d4a)', border: '1px solid #2c5282', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer', flexShrink: 0, minWidth: '180px' }}>
              <div style={{ color: '#e2b94a', fontSize: '10px', marginBottom: '2px' }}>{item.hora}</div>
              <div style={{ color: '#a0bcd8', fontSize: '11px', lineHeight: '1.3' }}>{item.titulo.replace('Modelo de ', '').replace('Modelo ', '')}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside className="sidebar-3d" style={{ width: '300px', background: 'linear-gradient(180deg, #1e3a5c 0%, #162d4a 100%)', overflowY: 'auto', overflowX: 'hidden', flexShrink: 0 }}>
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <input type="text" placeholder="🔍 Buscar minuta..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
                className="buscar-3d"
                style={{ width: '100%', padding: '8px 12px', background: 'linear-gradient(135deg, #0a1628, #0d1e30)', border: '1px solid #2c5282', borderRadius: '6px', fontSize: '12px', color: '#a0bcd8', boxSizing: 'border-box', outline: 'none' }} />
              {busqueda && minutasFiltradas.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0a1628', border: '1px solid #2c5282', borderRadius: '6px', zIndex: 100, marginTop: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  {minutasFiltradas.map(m => (
                    <div key={m.id} onClick={() => { setSelectedCategory(categories.find(c => c.id === m.catId)); handleSelectMinuta(m); setBusqueda('') }}
                      style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #1e3a5f', color: '#a0bcd8', fontSize: '11px', lineHeight: '1.4' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1e3a5c'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ color: '#e2b94a', fontSize: '10px' }}>{m.catName}</div>
                      {m.title}
                    </div>
                  ))}
                </div>
              )}
              {busqueda && minutasFiltradas.length === 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0a1628', border: '1px solid #2c5282', borderRadius: '6px', zIndex: 100, marginTop: '4px', padding: '10px 12px', color: '#6b8caa', fontSize: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  No se encontraron minutas
                </div>
              )}
            </div>
            <div style={{ color: '#e2b94a', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px', borderBottom: '1px solid #2c5282', paddingBottom: '8px', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>Categorías de Minutas</div>
            {categories.length === 0 && <p style={{ fontSize: '13px', color: '#6b8caa' }}>No hay minutas cargadas aún.</p>}
            {categories.map(cat => (
              <div key={cat.id} style={{ marginBottom: '8px' }}>
                <div onClick={() => setSelectedCategory(selectedCategory?.id === cat.id ? null : cat)}
                  className={selectedCategory?.id === cat.id ? 'cat-btn-active-3d' : 'cat-btn-3d'}
                  style={{ cursor: 'pointer', padding: '10px 14px', background: selectedCategory?.id === cat.id ? 'linear-gradient(135deg, #2c5282, #1e3a5c)' : 'linear-gradient(135deg, #162d4a, #0f2238)', border: `1px solid ${selectedCategory?.id === cat.id ? '#e2b94a' : '#2c5282'}`, borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', color: selectedCategory?.id === cat.id ? '#e2b94a' : '#90b4d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <span>📂 {cat.name}</span>
                  <span style={{ fontSize: '11px', background: '#e2b94a22', color: '#e2b94a', padding: '2px 8px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{cat.minutas.length}</span>
                </div>
                {selectedCategory?.id === cat.id && (
                  <div style={{ marginTop: '6px' }}>
                    {(() => {
                      const subtitleGroups = {}
                      const subtitleOrder = []
                      cat.minutas.forEach(m => {
                        const sub = m.subtitle || 'General'
                        if (!subtitleGroups[sub]) { subtitleGroups[sub] = []; subtitleOrder.push(sub) }
                        subtitleGroups[sub].push(m)
                      })
                      return subtitleOrder.map((sub, idx) => {
                        const key = cat.id + '::' + sub
                        const isExpanded = expandedSubtitles[key] === true
                        return (
                          <div key={sub} style={{ marginBottom: '4px' }}>
                            <div onClick={() => setExpandedSubtitles(prev => ({ ...prev, [key]: !isExpanded }))}
                              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'linear-gradient(135deg, #162d4a, #0f2238)', border: '1px solid #2c5282', borderRadius: '5px', marginBottom: '2px', transition: 'all 0.15s ease', textAlign: 'center' }}>
                              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#e2b94a', letterSpacing: '0.8px', textTransform: 'uppercase' }}>📁 {sub} {isExpanded ? '▲' : '▼'}</span>
                            </div>
                            {isExpanded && (
                              <div style={{ marginLeft: '8px', borderLeft: '2px solid #e2b94a44', paddingLeft: '8px' }}>
                                {subtitleGroups[sub].map(m => (
                                  <div key={m.id} onClick={() => handleSelectMinuta(m)}
                                    style={{ cursor: 'pointer', padding: '7px 10px', background: selectedMinuta?.id === m.id ? 'linear-gradient(135deg, #2c5282, #1e3a5c)' : 'transparent', borderRadius: '4px', fontSize: '13px', color: selectedMinuta?.id === m.id ? '#e2b94a' : '#90b4d0', marginBottom: '2px', lineHeight: '1.4', borderLeft: selectedMinuta?.id === m.id ? '2px solid #e2b94a' : '2px solid transparent', transition: 'all 0.15s ease' }}>
                                    <div style={{ marginBottom: m.tipo_tramite ? '4px' : '0' }}>{m.title}</div>
                                    {m.tipo_tramite && (() => {
                                      const b = getBadgeTramite(m.tipo_tramite)
                                      return (
                                        <span style={{
                                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                                          background: b.bg, border: `1px solid ${b.border}`,
                                          borderRadius: '4px', padding: '2px 7px',
                                          fontSize: '9px', fontWeight: 'bold', color: b.color,
                                          letterSpacing: '0.5px', boxShadow: b.shadow
                                        }}>
                                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: b.dot, boxShadow: `0 0 4px ${b.dot}`, flexShrink: 0 }} />
                                          {b.label}
                                        </span>
                                      )
                                    })()}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <main style={{ flex: 1, overflowY: 'auto', background: 'transparent' }}>
          {!minutaDetail && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>⚖️</div>
              <h1 style={{ color: '#1a3a5c', fontSize: '32px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '12px', textAlign: 'center', textShadow: '0 1px 0 rgba(255,255,255,0.8), 0 2px 6px rgba(0,0,0,0.1)' }}>LEXDOC</h1>
              <p style={{ color: '#5a7a9a', fontSize: '16px', marginBottom: '40px', textAlign: 'center' }}>Generador Profesional de Minutas Legales para Colombia</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '640px', width: '100%' }}>
                {[{ icon: '📋', text: 'Selecciona una categoría del panel izquierdo' }, { icon: '✍️', text: 'Completa el formulario con los datos requeridos' }, { icon: '📄', text: 'Descarga tu documento en Word o imprime en PDF' }].map((item, i) => (
                  <div key={i} className="welcome-card-3d" style={{ background: '#fff', borderRadius: '8px', padding: '24px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', marginBottom: '10px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>{item.icon}</div>
                    <div style={{ color: '#4a6a8a', fontSize: '13px', lineHeight: '1.5' }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {minutaDetail && (
            <div style={{ padding: '28px 36px' }}>
              <div className="card-3d" style={{ borderLeft: '5px solid #b8962e !important', borderRadius: '8px', padding: '18px 24px', marginBottom: '24px' }}>
                <div style={{ color: '#b8962e', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Documento Legal</div>
                <h1 style={{ color: '#1a3a5c', fontSize: '20px', fontWeight: 'bold', margin: 0, textShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>{minutaDetail.title}</h1>
                <div style={{ color: '#7a9ab5', fontSize: '12px', marginTop: '6px' }}>
                  {minutaDetail.fields.length} campos requeridos · Pasa el mouse sobre <span style={{ background: 'linear-gradient(135deg, #c9a030, #b8962e)', color: '#fff', borderRadius: '50%', padding: '0 4px', fontSize: '10px', fontWeight: 'bold', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>?</span> para instrucciones
                </div>
                {minutaDetail.tipo_tramite && (() => {
                  const b = getBadgeTramite(minutaDetail.tipo_tramite)
                  return (
                    <div style={{ marginTop: '10px' }}>
                      <span title={b.tooltip} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '7px',
                        background: b.bg, border: `1px solid ${b.border}`,
                        borderBottom: `2px solid ${b.border}`,
                        borderRadius: '6px', padding: '6px 14px',
                        fontSize: '11px', fontWeight: 'bold', color: b.color,
                        letterSpacing: '1px', cursor: 'help', boxShadow: b.shadow
                      }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: b.dot, boxShadow: `0 0 6px ${b.dot}`, flexShrink: 0 }} />
                        {b.label}
                        <span style={{ marginLeft: '4px', fontSize: '10px', opacity: 0.7, fontWeight: 'normal' }}>ⓘ</span>
                      </span>
                    </div>
                  )
                })()}
              </div>

              {camposConError > 0 && (
                <div id="alerta-campos" className="alerta-campos" style={{ background: 'linear-gradient(160deg, #0f2540 0%, #162d4a 40%, #0a1e35 100%)', border: '1px solid #b8962e', borderTop: '3px solid #e2b94a', borderRadius: '14px', padding: '22px 26px 22px 22px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #1a3a5c, #0a1e35)', border: '2px solid #b8962e', boxShadow: '0 3px 0 #6e5010, 0 6px 12px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginTop: '2px' }}>⚠️</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#e2b94a', fontSize: '15px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px', textTransform: 'uppercase', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                        {camposConError} campo{camposConError > 1 ? 's' : ''} sin completar
                      </div>
                      <div style={{ color: '#a0bcd8', fontSize: '12px', marginBottom: '14px', lineHeight: '1.5' }}>Por favor completa los siguientes campos antes de generar el documento:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {minutaDetail.fields.filter(f => errores[f.name]).map(f => (
                          <span key={f.name} className="campo-faltante-tag">{f.label}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="card-3d" style={{ borderRadius: '8px', padding: '24px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #e2b94a', paddingBottom: '10px' }}>
                  <div style={{ color: '#1a3a5c', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Datos del Documento</div>
                  <button onClick={handleLlenarPrueba} style={{ padding: '6px 16px', background: 'linear-gradient(135deg, #f0f4f8, #e8f0f8)', border: '1px solid #b8962e', borderBottom: '2px solid #8a6418', borderRadius: '6px', color: '#b8962e', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '0.5px', boxShadow: '0 2px 0 #8a6418, 0 4px 8px rgba(0,0,0,0.1)' }}>
                    🧪 Llenar con datos de prueba
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {minutaDetail.fields.map(field => (
                    <TooltipField key={field.name} field={field} onChange={handleChange} value={formData[field.name]} error={errores[field.name]} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={handlePreview} disabled={loading} className="btn-primary-3d"
                  style={{ padding: '12px 28px', background: loading ? '#a0b4c8' : 'linear-gradient(135deg, #1a3a5c, #0d2240)', color: '#fff', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                  {loading ? 'GENERANDO...' : '👁️ PREVISUALIZAR'}
                </button>
                {previewHTML && (
                  <>
                    <button onClick={handlePrint} className="btn-green-3d" style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #2e7d32, #1b5e20)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                      🖨️ IMPRIMIR / PDF
                    </button>
                    <button onClick={handleDownloadWord} disabled={loadingWord} className="btn-blue-3d" style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #1565c0, #0d47a1)', color: '#fff', border: 'none', borderRadius: '6px', cursor: loadingWord ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                      {loadingWord ? 'GENERANDO...' : '📄 DESCARGAR WORD'}
                    </button>
                    <button onClick={() => setShowPasos(true)} className="btn-gold-3d" style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #b8962e, #9a7a20)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                      📋 ¿QUÉ HAGO AHORA?
                    </button>
                  </>
                )}
              </div>

              {previewHTML && (
                <div className="preview-3d" style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #c8d8e8' }}>
                  <div style={{ padding: '12px 20px', borderBottom: '2px solid #e2b94a', background: 'linear-gradient(135deg, #1a3a5c, #0d2240)', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2) inset' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e2b94a', boxShadow: '0 0 6px #e2b94a' }}></div>
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