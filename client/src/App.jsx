import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
}

const DATOS_PRUEBA = {
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
}

const PASOS_SIGUIENTE = {
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
            <div style={{ color: '#e2b94a', fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px', textShadow: '0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.4)' }}>LEXDOC</div>
            <div style={{ color: '#a0bcd8', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>Generador de Minutas Legales · Colombia</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ color: '#a0bcd8', fontSize: '13px', letterSpacing: '1px' }}>
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
            <div style={{ color: '#e2b94a', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px', borderBottom: '1px solid #2c5282', paddingBottom: '8px', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>Categorías de Minutas</div>
            {categories.length === 0 && <p style={{ fontSize: '13px', color: '#6b8caa' }}>No hay minutas cargadas aún.</p>}
            {categories.map(cat => (
              <div key={cat.id} style={{ marginBottom: '8px' }}>
                <div onClick={() => setSelectedCategory(selectedCategory?.id === cat.id ? null : cat)}
                  className={selectedCategory?.id === cat.id ? 'cat-btn-active-3d' : 'cat-btn-3d'}
                  style={{ cursor: 'pointer', padding: '10px 14px', background: selectedCategory?.id === cat.id ? 'linear-gradient(135deg, #2c5282, #1e3a5c)' : 'linear-gradient(135deg, #162d4a, #0f2238)', border: `1px solid ${selectedCategory?.id === cat.id ? '#e2b94a' : '#2c5282'}`, borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', color: selectedCategory?.id === cat.id ? '#e2b94a' : '#90b4d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <span>📂 {cat.name}</span>
                  <span style={{ fontSize: '11px', background: '#e2b94a22', color: '#e2b94a', padding: '2px 8px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{cat.minutas.length}</span>
                </div>
                {selectedCategory?.id === cat.id && (
                  <div style={{ marginLeft: '8px', borderLeft: '2px solid #e2b94a55', paddingLeft: '8px', marginTop: '4px' }}>
                    {cat.minutas.map(m => (
                      <div key={m.id} onClick={() => handleSelectMinuta(m)}
                        style={{ cursor: 'pointer', padding: '8px 10px', background: selectedMinuta?.id === m.id ? 'linear-gradient(135deg, #2c5282, #1e3a5c)' : 'transparent', borderRadius: '4px', fontSize: '12px', color: selectedMinuta?.id === m.id ? '#e2b94a' : '#90b4d0', marginBottom: '2px', lineHeight: '1.4', borderLeft: selectedMinuta?.id === m.id ? '2px solid #e2b94a' : '2px solid transparent', boxShadow: selectedMinuta?.id === m.id ? '0 2px 6px rgba(0,0,0,0.2)' : 'none', transition: 'all 0.15s ease' }}>
                        {m.title}
                      </div>
                    ))}
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