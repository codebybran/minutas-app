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
  precio_cesion: 'Escriba el precio acordado por la cesión en letras y números. Ej: cincuenta millones de pesos ($50.000.000).',
  nombre_fundacion: 'Escriba el nombre completo de la fundación tal como quedará registrado legalmente. Ej: Fundación Semillas de Esperanza.',
  municipio_domicilio: 'Escriba el municipio donde tendrá su sede principal la fundación. Ej: El Cerrito, Cali, Bogotá.',
  departamento_domicilio: 'Escriba el departamento donde está ubicado el municipio sede. Ej: Valle del Cauca, Antioquia.',
  objeto_fundacion: 'Describa detalladamente las actividades que realizará la fundación.',
  bienes_iniciales: 'Describa cada bien o suma que conforman el patrimonio inicial y quién lo aporta.',
  ciudad_asamblea: 'Escriba la ciudad donde se realizarán las asambleas ordinarias de la fundación.',
  dias_reunion_ordinaria: 'Escriba los primeros días del mes en que se realizará la reunión ordinaria. Ej: diez (10).',
  mes_reunion_ordinaria: 'Escriba el mes del año en que se realizará la reunión ordinaria anual. Ej: marzo, febrero.',
  num_miembros_consejo: 'Escriba el número de miembros del consejo de administración. Ej: cinco (5), tres (3).',
  periodo_consejo: 'Escriba el período de duración del consejo de administración. Ej: dos (2) años, un (1) año.',
  cuantia_contratos: 'Escriba el valor máximo de contratos que el director puede celebrar sin autorización del consejo.',
  porcentaje_disolucion: 'Escriba el porcentaje de votos requerido para disolver la fundación. Ej: setenta (70), cien (100).',
  revisor_fiscal: 'Escriba el nombre completo del revisor fiscal principal.',
  suplente_revisor: 'Escriba el nombre completo del suplente del revisor fiscal.',
  secretario: 'Escriba el nombre completo de la persona designada como secretario.',
  nominador_secretario: 'Escriba quién nombra al secretario. Ej: la asamblea de fundadores, el consejo de administración.',
  director_principal: 'Escriba el nombre completo de la persona designada como director principal.',
  director_suplente: 'Escriba el nombre completo del suplente del director.',
  miembros_consejo_principales: 'Escriba los nombres completos de los miembros principales del consejo, separados por punto y coma.',
  miembros_consejo_suplentes: 'Escriba los nombres completos de los miembros suplentes del consejo, separados por punto y coma.',
  nombre_contratante: 'Escriba el nombre completo de la persona que encarga y paga la obra (el dueño del proyecto).',
  nombre_contratista: 'Escriba el nombre completo de la persona que dirigirá y ejecutará la construcción.',
  ciudad_domicilio: 'Escriba la ciudad donde viven ambas partes.',
  cedula_contratante: 'Escriba el número de cédula del contratante. Solo los números.',
  cedula_contratista: 'Escriba el número de cédula del contratista. Solo los números.',
  expedicion_contratante: 'Escriba la ciudad donde fue expedida la cédula del contratante.',
  expedicion_contratista: 'Escriba la ciudad donde fue expedida la cédula del contratista.',
  descripcion_obra: 'Describa qué se va a construir o ejecutar. Ej: construcción de bodega industrial de 500 metros cuadrados con estructura metálica.',
  descripcion_lote: 'Describa el lote donde se construirá. Incluya área y matrícula inmobiliaria si la tiene.',
  ubicacion_lote: 'Escriba la dirección o ubicación exacta del lote.',
  ciudad_obra: 'Escriba la ciudad donde está ubicado el lote de construcción.',
  nombre_arquitecto: 'Escriba el nombre completo del arquitecto que elaboró el plano de la obra.',
  plazo_obra: 'Escriba el tiempo acordado para terminar la obra. Ej: seis (6) meses.',
  porcentaje_honorarios: 'Escriba el porcentaje de honorarios del contratista sobre el costo total de la obra. Solo el número.',
  costo_obra_letras: 'Escriba el costo total estimado de la obra en letras.',
  costo_obra_numeros: 'Escriba el costo total estimado de la obra en números.',
  honorarios_letras: 'Escriba el total de honorarios del contratista en letras.',
  honorarios_numeros: 'Escriba el total de honorarios en números.',
  anticipo_letras: 'Escriba el valor del anticipo que se entrega al firmar el contrato, en letras.',
  anticipo_numeros: 'Escriba el valor del anticipo en números.',
  porcentaje_anticipo: 'Escriba el porcentaje del anticipo sobre el total de honorarios. Solo el número.',
  forma_pago_saldo: 'Describa cómo se pagará el saldo después del anticipo.',
  dia_pago: 'Escriba el día exacto en que se realizarán los pagos.',
  condicion_pago: 'Escriba si hay alguna condición para hacer el pago.',
  porcentaje_retencion: 'Escriba el porcentaje que se retendrá del último pago como garantía. Solo el número.',
  plazo_retencion: 'Escriba cuántos días después de entregar la obra se libera la retención de garantía.',
  sucesor_contratista: 'Escriba quién continuará la obra si el contratista fallece o queda incapacitado.',
  penalizacion_letras: 'Escriba el valor de la multa por incumplimiento de plazos, en letras.',
  penalizacion_numeros: 'Escriba el valor de la multa en números.',
  unidad_penalizacion: 'Escriba cada cuánto tiempo o por qué hecho se cobra la penalización.',
  mecanismo_divergencias: 'Escriba cómo se resolverán las diferencias entre las partes.',
  ciudad_jurisdiccion: 'Escriba la ciudad cuyos jueces serán competentes para resolver conflictos.',
  num_ejemplares: 'Escriba en cuántos ejemplares se firma el contrato. Ej: dos (2), tres (3).',
  ubicacion_terreno: 'Escriba la dirección completa del terreno donde se construirá.',
  suministrador_materiales: 'Escriba quién suministra los materiales.',
  precio_total_letras: 'Escriba el precio total de la obra en letras.',
  precio_total_numeros: 'Escriba el precio total de la obra en números.',
  porcentaje_pago_b: 'Escriba el porcentaje del segundo pago. Solo el número en letras.',
  condicion_pago_b: 'Escriba cuándo se hace el segundo pago.',
  porcentaje_pago_c: 'Escriba el porcentaje del tercer pago. Solo el número en letras.',
  condicion_pago_c: 'Escriba cuándo se hace el tercer pago.',
  porcentaje_saldo: 'Escriba el porcentaje del pago final al recibir la obra terminada.',
  meses_retencion: 'Escriba cuántos meses después de entregar la obra se devuelve la retención.',
  plazo_inicio: 'Escriba el plazo para iniciar la obra desde la firma del contrato.',
  plazo_entrega: 'Escriba el plazo total para entregar la obra terminada.',
  multa_letras: 'Escriba el valor de la multa por retraso en letras.',
  multa_numeros: 'Escriba el valor de la multa por retraso en números.',
  unidad_multa: 'Escriba la unidad de tiempo de la multa. Ej: día / semana.',
  dias_rescision: 'Escriba los días adicionales de retraso que permiten rescindir el contrato.',
  domicilio_contratante: 'Escriba la dirección completa del contratante para notificaciones legales.',
  domicilio_contratista: 'Escriba la dirección completa del contratista para notificaciones legales.',
  nombre_depositante: 'Escriba el nombre completo de la persona que entrega los bienes para su custodia.',
  nombre_depositario: 'Escriba el nombre completo de la persona que recibirá y guardará los bienes.',
  direccion_custodia: 'Escriba la dirección exacta donde permanecerán los bienes durante el depósito.',
  ciudad_custodia: 'Escriba la ciudad donde permanecerán los bienes.',
  remuneracion_letras: 'Escriba el valor que recibirá el depositario por sus servicios de custodia, en letras.',
  remuneracion_numeros: 'Escriba ese valor en números.',
  periodicidad_pago: 'Escriba cada cuánto se pagará esa remuneración.',
  nombre_cedente: 'Escriba el nombre completo de quien cede el derecho o contrato.',
  nombre_cesionario: 'Escriba el nombre completo de quien recibe el derecho o contrato.',
  tipo_proceso: 'Escriba el tipo de proceso judicial. Ej: ordinario civil / de sucesión / ejecutivo / laboral.',
  demandante: 'Escriba el nombre completo de quien demanda en el proceso judicial.',
  demandado: 'Escriba el nombre completo de quien es demandado en el proceso judicial.',
  dia_notificacion: 'Escriba el día en número en que fue notificada la demanda.',
  mes_notificacion: 'Escriba el mes en letras en que fue notificada la demanda.',
  anio_notificacion: 'Escriba el año en que fue notificada la demanda.',
  precio_letras: 'Escriba el precio de la cesión en letras.',
  precio_numeros: 'Escriba el precio de la cesión en números.',
  nombre_arrendatario1: 'Escriba el nombre completo del arrendatario principal.',
  nombre_arrendatario2_texto: 'Si hay un segundo arrendatario escriba su nombre precedido de " y". Si no aplica escriba: no aplica.',
  ciudad_arrendatarios: 'Escriba la ciudad donde viven los arrendatarios.',
  cedula_arrendatario1: 'Escriba el número de cédula del arrendatario principal.',
  cedula_arrendatario2_texto: 'Si hay segundo arrendatario escriba su cédula precedida de " y". Si no aplica escriba: no aplica.',
  nombre_arrendador: 'Escriba el nombre completo del arrendador (dueño del inmueble).',
  cedula_arrendador: 'Escriba el número de cédula del arrendador.',
  expedicion_arrendador: 'Escriba la ciudad donde fue expedida la cédula del arrendador.',
  numero_inmueble: 'Escriba el número de nomenclatura del inmueble. Ej: 2A-56 / apartamento 301 / casa 12.',
  ciudad_inmueble: 'Escriba la ciudad donde está ubicado el inmueble arrendado.',
  linderos_inmueble: 'Describa los linderos del inmueble por los cuatro puntos cardinales.',
  duracion_meses: 'Escriba la duración del contrato en meses en letras y números. Ej: doce (12), seis (6).',
  periodo_prorroga: 'Escriba el período de prórroga automática si ninguna parte avisa.',
  canon_letras: 'Escriba el valor del canon mensual en letras.',
  canon_numeros: 'Escriba el valor del canon mensual en números.',
  lugar_pago: 'Escriba dónde o cómo se paga el canon.',
  pago_energia: 'Escriba quién paga la energía eléctrica.',
  pago_gas: 'Escriba quién paga el gas.',
  pago_agua: 'Escriba quién paga agua y aseo.',
  pago_telefono: 'Escriba quién paga teléfono e internet.',
  porcentaje_reajuste: 'Escriba el porcentaje de reajuste anual del canon. El máximo legal es el 100% del IPC. Escriba: cien (100).',
  direccion_notificacion_arrendador: 'Escriba la dirección completa del arrendador para recibir notificaciones judiciales.',
  direccion_notificacion_arrendatario: 'Escriba la dirección del arrendatario para notificaciones.',
  nombre_arrendatario: 'Escriba el nombre completo del arrendatario.',
  cedula_arrendatario: 'Escriba el número de cédula del arrendatario.',
  expedicion_arrendatario: 'Escriba la ciudad donde fue expedida la cédula del arrendatario.',
  comodidades_inmueble: 'Describa las comodidades del inmueble.',
  destinacion_inmueble: 'Escriba el uso permitido del inmueble.',
  dia_pago_inicio: 'Escriba el día inicial del período de pago. Ej: 1.',
  dia_pago_fin: 'Escriba el día final del período de pago. Ej: 5.',
  fecha_inicio: 'Escriba la fecha de inicio del contrato. Ej: el 1 de mayo de 2026.',
  multa_diaria_letras: 'Escriba la multa diaria por no restituir el inmueble al vencer, en letras.',
  multa_diaria_numeros: 'Escriba la multa diaria en números.',
  clausula_penal_letras: 'Escriba el valor de la cláusula penal por incumplimiento general, en letras.',
  clausula_penal_numeros: 'Escriba el valor de la cláusula penal en números.',
  plazo_nueva_garantia: 'Escriba los días que tiene el arrendatario para presentar nuevo fiador si el actual falla.',
  forma_reajuste: 'Escriba cómo se reajusta el canon anualmente.',
  domicilio_arrendador: 'Escriba la dirección completa del arrendador para notificaciones judiciales.',
  nombre_fiador: 'Escriba el nombre completo del fiador.',
  cedula_fiador: 'Escriba el número de cédula del fiador.',
  expedicion_fiador: 'Escriba la ciudad donde fue expedida la cédula del fiador.',
  ciudad_cedente: 'Escriba la ciudad donde vive el cedente.',
  cedula_cedente: 'Escriba el número de cédula del cedente.',
  expedicion_cedente: 'Escriba la ciudad donde fue expedida la cédula del cedente.',
  ciudad_cesionario: 'Escriba la ciudad donde vive el cesionario.',
  cedula_cesionario: 'Escriba el número de cédula del cesionario.',
  expedicion_cesionario: 'Escriba la ciudad donde fue expedida la cédula del cesionario.',
  dia_contrato: 'Escriba el día en que se celebró el contrato original.',
  mes_contrato: 'Escriba el mes en que se celebró el contrato original.',
  anio_contrato: 'Escriba el año en que se celebró el contrato original.',
  circulo_notarial: 'Escriba la ciudad del círculo notarial.',
  fecha_registro: 'Escriba la fecha en que fue inscrita la escritura en el registro.',
  ciudad_fecha: 'Escriba la ciudad y la fecha completa de la carta. Ej: El Cerrito, 21 de abril de 2026.',
  direccion_arrendatario: 'Escriba la dirección donde se envía la carta al arrendatario.',
  nombre_vendedor: 'Escriba el nombre completo del vendedor.',
  tipo_contrato: 'Escriba si el contrato de arrendamiento es verbal o escrito.',
  fecha_cesion: 'Escriba la fecha del documento de cesión del contrato.',
  datos_pago: 'Escriba la dirección o cuenta bancaria donde el arrendatario debe pagar el canon desde ahora.',
  nombre_contratista: 'Escriba el nombre completo del contratista (quien presta el servicio profesional).',
  profesion_contratista: 'Escriba la profesión u oficio del contratista.',
  estado_civil_contratista: 'Escriba el estado civil del contratista.',
  identificacion_contratista: 'Escriba la identificación completa del contratista.',
  estado_civil_contratante: 'Escriba el estado civil del contratante.',
  identificacion_contratante: 'Escriba la identificación completa del contratante.',
  objeto_contrato: 'Describa para qué se contratan los servicios.',
  tareas_especificas: 'Liste las tareas concretas que realizará el contratista.',
  horario_pago: 'Escriba el horario en que se realizará el pago.',
  garantia_pago: 'Escriba cómo se garantiza o instrumenta el pago.',
  mecanismo_controversias: 'Escriba cómo se resolverán los conflictos entre las partes.',
  nombre_mandante: 'Escriba el nombre o razón social de quien contrata al abogado.',
  descripcion_mandante: 'Describa al mandante. Si es empresa: sociedad legalmente constituida. Si es persona: persona natural mayor de edad.',
  ciudad_mandante: 'Escriba la ciudad donde tiene domicilio el mandante.',
  nombre_representante: 'Escriba el nombre completo de quien firma por el mandante.',
  ciudad_representante: 'Escriba la ciudad donde vive el representante del mandante.',
  cargo_representante: 'Escriba el cargo de quien firma. Ej: Gerente General, Representante Legal.',
  nombre_mandatario: 'Escriba el nombre completo del abogado que prestará los servicios.',
  ciudad_mandatario: 'Escriba la ciudad donde vive el abogado.',
  tarjeta_profesional: 'Escriba el número de tarjeta profesional del abogado.',
  cedula_mandatario: 'Escriba el número de cédula del abogado.',
  expedicion_mandatario: 'Escriba la ciudad donde fue expedida la cédula del abogado.',
  asuntos_encargados: 'Describa los asuntos jurídicos que el abogado manejará.',
  forma_pago_honorarios: 'Describa cómo y cuándo se pagarán los honorarios.',
  obligaciones_mandatario: 'Liste las obligaciones del abogado.',
  obligaciones_mandante: 'Liste las obligaciones del mandante.',
  notario: 'Escriba el nombre o número de la Notaría sin escribir la palabra Notaría. Ej: Única, Primera, Segunda.',
  circulo: 'Escriba la ciudad del Círculo Notarial donde se otorga la escritura.',
  nombre_poderdante: 'Escriba el nombre completo de la persona que otorga el poder.',
  domicilio_poderdante: 'Escriba la ciudad donde vive y reside el poderdante.',
  estado_civil_poderdante: 'Escriba el estado civil del poderdante. Opciones: soltero, casado, divorciado, viudo.',
  cedula_poderdante: 'Escriba el número de cédula del poderdante.',
  expedicion_poderdante: 'Escriba la ciudad donde fue expedida la cédula del poderdante.',
  nombre_apoderado: 'Escriba el nombre completo de la persona que recibe el poder.',
  domicilio_apoderado: 'Escriba la ciudad donde vive y reside el apoderado.',
  cedula_apoderado: 'Escriba el número de cédula del apoderado.',
  expedicion_apoderado: 'Escriba la ciudad donde fue expedida la cédula del apoderado.',
  facultades: 'Describa todas las facultades que se le otorgan al apoderado separadas por punto y coma.',
  honorarios: 'Escriba cómo se remunerará al apoderado.',
  ciudad_poderdante: 'Escriba la ciudad donde vive y reside el poderdante.',
  ciudad_apoderado: 'Escriba la ciudad donde vive y reside el apoderado.',
  lindero_norte: 'Escriba el lindero norte con extensión en metros y con qué colinda.',
  lindero_sur: 'Escriba el lindero sur con extensión en metros y con qué colinda.',
  lindero_oriente: 'Escriba el lindero oriente con extensión en metros y con qué colinda.',
  lindero_occidente: 'Escriba el lindero occidente con extensión en metros y con qué colinda.',
  matricula_inmobiliaria: 'Es el número que identifica el inmueble en el registro. Ej: 370-123456.',
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
  // --- MINUTA 27: Contrato Civil de Obra ---
  numero_contrato: 'Escribe el número o código del contrato. Ej: 001-2026, CO-2026-001.',
  numero_obra: 'Escribe el número de identificación de la obra. Ej: 001, OB-2026-01.',
  fecha_iniciacion: 'Escribe la fecha en que comenzará la ejecución de la obra. Ej: 1 de mayo de 2026.',
  fecha_terminacion: 'Escribe la fecha estimada en que terminará la obra. Ej: 31 de octubre de 2026.',
  cedula_representante: 'Escribe el número de cédula del representante legal del contratante.',
  expedicion_representante: 'Escribe la ciudad donde fue expedida la cédula del representante legal.',
  camara_comercio: 'Escribe la ciudad de la Cámara de Comercio donde está registrada la empresa contratante. Ej: Cali, El Cerrito.',
  domicilio_contratista: 'Escribe la ciudad donde vive o tiene domicilio el contratista. Ej: El Cerrito, Cali.',
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
  ubicacion_terreno: 'Carrera 8 # 12-34, Barrio Los Pinos, ciudad de El Cerrito, Valle del Cauca',
  suministrador_materiales: 'el contratista',
  precio_total_letras: 'ochenta millones de pesos',
  precio_total_numeros: '$80.000.000',
  porcentaje_pago_b: 'veinte (20)',
  condicion_pago_b: 'al terminar la cimentación y la estructura',
  porcentaje_pago_c: 'veinte (20)',
  condicion_pago_c: 'al terminar muros, cubierta e instalaciones',
  porcentaje_saldo: 'treinta (30)',
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
  nombre_depositante: 'Carlos Eduardo Pérez Ríos',
  nombre_depositario: 'Jhon Brandon Martínez Vélez',
  direccion_custodia: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen',
  ciudad_custodia: 'El Cerrito',
  remuneracion_letras: 'cincuenta mil pesos',
  remuneracion_numeros: '$50.000',
  periodicidad_pago: 'mensuales',
  nombre_cedente: 'Carlos Eduardo Pérez Ríos',
  nombre_cesionario: 'Jhon Brandon Martínez Vélez',
  tipo_proceso: 'ordinario civil',
  demandante: 'Carlos Eduardo Pérez Ríos',
  demandado: 'Roberto Salcedo Muñoz',
  dia_notificacion: '10',
  mes_notificacion: 'enero',
  anio_notificacion: '2023',
  precio_letras: 'cinco millones de pesos',
  precio_numeros: '$5.000.000',
  nombre_arrendatario1: 'Alexander García López',
  nombre_arrendatario2_texto: 'no aplica',
  ciudad_arrendatarios: 'El Cerrito',
  cedula_arrendatario1: '0987654321',
  cedula_arrendatario2_texto: 'no aplica',
  nombre_arrendador: 'Jhon Brandon Martínez Vélez',
  cedula_arrendador: '1234567890',
  expedicion_arrendador: 'El Cerrito',
  numero_inmueble: '2A-56',
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
  nombre_arrendatario: 'Alexander García López',
  cedula_arrendatario: '0987654321',
  expedicion_arrendatario: 'Cali',
  comodidades_inmueble: 'sala, comedor, tres habitaciones, dos baños completos, cocina integral, garaje y patio interior',
  destinacion_inmueble: 'vivienda familiar',
  dia_pago_inicio: '1',
  dia_pago_fin: '5',
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
  ciudad_cedente: 'El Cerrito',
  cedula_cedente: '1234567890',
  expedicion_cedente: 'El Cerrito',
  ciudad_cesionario: 'Cali',
  cedula_cesionario: '1122334455',
  expedicion_cesionario: 'Cali',
  dia_contrato: '1',
  mes_contrato: 'mayo',
  anio_contrato: '2025',
  circulo_notarial: 'El Cerrito',
  fecha_registro: '20 de marzo de 2026',
  ciudad_fecha: 'El Cerrito, 21 de abril de 2026',
  direccion_arrendatario: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito',
  nombre_vendedor: 'Jhon Brandon Martínez Vélez',
  tipo_contrato: 'escrito',
  fecha_cesion: '20 de marzo de 2026',
  datos_pago: 'cuenta de ahorros Bancolombia número 123-456789-00 a nombre de Carlos Eduardo Pérez Ríos',
  nombre_contratista: 'Luis Fernando Gómez Torres',
  profesion_contratista: 'abogado',
  estado_civil_contratista: 'casado',
  identificacion_contratista: 'cédula de ciudadanía No. 0987654321 expedida en Cali',
  domicilio_contratista: 'Carrera 8 # 12-34, Barrio Los Pinos, El Cerrito',
  estado_civil_contratante: 'soltero',
  identificacion_contratante: 'cédula de ciudadanía No. 1122334455 expedida en El Cerrito',
  domicilio_contratante: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito',
  objeto_contrato: 'asesorar jurídicamente y representar al contratante en el proceso de sucesión del señor José Arturo Pérez Ríos ante el Juzgado Primero Civil del Circuito de Cali',
  tareas_especificas: '1. Revisar y organizar los documentos de la sucesión. 2. Elaborar y radicar la demanda. 3. Representar al contratante en todas las audiencias. 4. Gestionar la expedición de las hijuelas. 5. Entregar informe escrito de resultados.',
  honorarios_letras: 'tres millones de pesos',
  honorarios_numeros: '$3.000.000',
  horario_pago: 'horario bancario de lunes a viernes de 8:00 AM a 3:00 PM',
  garantia_pago: 'transferencia bancaria a la cuenta de ahorros Bancolombia No. 123-456789-00 a nombre de Luis Fernando Gómez Torres',
  mecanismo_controversias: 'mediación ante la Cámara de Comercio de la ciudad y, de no llegarse a acuerdo, por el juez civil competente',
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
  forma_pago_honorarios: 'mensualmente, dentro de los primeros cinco (5) días hábiles de cada mes, mediante transferencia bancaria a la cuenta del mandatario',
  obligaciones_mandatario: 'obrar con diligencia en los asuntos encomendados, absolver oportunamente las consultas que le formule el mandante, rendir informes mensuales de los negocios a su cargo, guardar reserva y confidencialidad sobre la información recibida, y actuar conforme a las normas éticas y al Código Disciplinario del Abogado',
  obligaciones_mandante: 'cancelar los honorarios en la forma pactada en la cláusula segunda, suministrar al mandatario toda la información y documentos que requiera para el normal desempeño de su labor, y cubrir los gastos adicionales que la gestión conlleve, distintos de los honorarios, tales como costas judiciales, copias, notificaciones y desplazamientos',
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
  ciudad_poderdante: 'El Cerrito',
  ciudad_apoderado: 'Cali',
  lindero_norte: 'diez (10) metros con la Calle 4 Sur',
  lindero_sur: 'diez (10) metros con el predio de Roberto Salcedo Muñoz',
  lindero_oriente: 'doce (12) metros con la Carrera 2A',
  lindero_occidente: 'doce (12) metros con el predio de Patricia Londoño Vera',
  matricula_inmobiliaria: '370-123456',
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
  // --- MINUTA 27: Contrato Civil de Obra ---
  numero_contrato: 'CO-001-2026',
  numero_obra: 'OB-001-2026',
  fecha_iniciacion: '1 de mayo de 2026',
  fecha_terminacion: '31 de octubre de 2026',
  nombre_representante: 'Carlos Eduardo Pérez Ríos',
  cedula_representante: '1122334455',
  expedicion_representante: 'El Cerrito',
  cargo_representante: 'Gerente General',
  camara_comercio: 'El Cerrito',
  domicilio_contratista: 'El Cerrito',
  descripcion_obra: 'construcción de bodega industrial de quinientos (500) metros cuadrados con estructura metálica, cubierta en zinc, piso en concreto y cerramiento perimetral, ubicada en la Zona Industrial de El Cerrito, Valle del Cauca',
  plazo_ejecucion: 'seis (6) meses',
  fecha_entrega: '31 de octubre de 2026',
  multa_mora_letras: 'dos (2)',
  multa_mora_numeros: '2',
  bonificacion_letras: 'uno (1)',
  bonificacion_numeros: '1',
  valor_letras: 'ciento veinte millones de pesos',
  valor_numeros: '$120.000.000',
  forma_pago: 'treinta por ciento (30%) como anticipo al momento de la firma del contrato; cuarenta por ciento (40%) al completar el cincuenta por ciento (50%) de la obra verificado mediante acta de avance; y el treinta por ciento (30%) restante a la entrega definitiva y satisfactoria de la obra',
  garantia_anticipo: 'póliza de seguros por el valor total del anticipo, con vigencia igual al plazo del contrato más seis (6) meses adicionales',
  garantia_cumplimiento: 'póliza de seguros equivalente al veinte por ciento (20%) del valor total del contrato',
  garantia_responsabilidad: 'póliza de responsabilidad civil extracontractual por valor mínimo de cincuenta millones de pesos ($50.000.000)',
  garantia_estabilidad: 'póliza de estabilidad de la obra por un término de cinco (5) años contados a partir de la entrega definitiva',
  seguro_vida: 'póliza colectiva de vida por valor de veinte millones de pesos ($20.000.000) por cada trabajador vinculado a la obra',
  garantia_salarios: 'póliza por valor equivalente a tres (3) meses de la nómina total del personal vinculado a la ejecución de la obra',
  suministrador_materiales: 'el contratista, quien deberá utilizar materiales de primera calidad conforme a las especificaciones técnicas aprobadas',
  ciudad_domicilio: 'El Cerrito',
  notificacion_contratante: 'Carrera 8 # 12-34, Barrio Los Pinos, El Cerrito, Valle del Cauca',
  notificacion_contratista: 'Calle 4 Sur # 2A-56, Barrio Villa del Carmen, El Cerrito, Valle del Cauca',
  ciudad_firma: 'El Cerrito',
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
  9: { titulo: 'Contrato de Usufructo', pasos: [{ num: 1, titulo: 'Firmar el documento', descripcion: 'Propietario y usufructuario firman el contrato ante dos testigos. Cada parte conserva una copia.' }, { num: 2, titulo: 'Elevar a Escritura Pública', descripcion: 'Como el contrato lo indica, ambas partes deben ir a una Notaría a elevar el contrato a escritura pública. Lleven: cédulas de ciudadanía, el contrato firmado y los documentos del inmueble (certificado de tradición y libertad vigente).' }, { num: 3, titulo: 'Registrar la Escritura', descripcion: 'Lleven la escritura pública a la Oficina de Registro de Instrumentos Públicos para registrar el usufructo.' }, { num: 4, titulo: 'Pagar los impuestos', descripcion: 'Se deben pagar los derechos notariales y el impuesto de registro correspondiente al valor del usufructo.' }, { num: 5, titulo: 'Elaborar el inventario', descripcion: 'Como lo indica el contrato, ambas partes deben hacer un inventario detallado de todos los muebles, accesorios y estado del inmueble, firmarlo y adjuntarlo al contrato.' }, { num: 6, titulo: 'Al terminar el plazo', descripcion: 'Cuando venza el plazo del usufructo, el usufructuario debe devolver el inmueble al propietario en el mismo estado en que lo recibió, según el inventario firmado.' }] },
  10: { titulo: 'Contrato de Comodato', pasos: [{ num: 1, titulo: 'Firmar el documento', descripcion: 'Comodante y comodatario firman el contrato en dos ejemplares. Cada parte conserva uno. Este contrato se perfecciona con la entrega física de los bienes.' }, { num: 2, titulo: 'Entregar los bienes', descripcion: 'El comodante entrega físicamente los bienes al comodatario en el momento de firmar. El comodatario debe revisar que los bienes estén en perfecto estado antes de recibirlos.' }, { num: 3, titulo: 'Autenticar las firmas (recomendado)', descripcion: 'Aunque no es obligatorio, se recomienda llevar el contrato a una Notaría para autenticar las firmas.' }, { num: 4, titulo: 'Asegurar los bienes', descripcion: 'Si el valor de los bienes es significativo, el comodatario debe asegurarlos tal como lo indica el contrato.' }, { num: 5, titulo: 'Al terminar el plazo', descripcion: 'Cuando venza el plazo del contrato, el comodatario debe devolver los bienes en perfecto estado de funcionamiento al comodante.' }, { num: 6, titulo: 'Si el comodatario no devuelve los bienes', descripcion: 'Si el comodatario no restituye los bienes al terminar el contrato, el comodante puede exigir judicialmente la devolución o el pago del valor estimado establecido en la cláusula octava del contrato.' }] },
  'compraventa-retroventa': { titulo: 'Compraventa con Pacto de Retroventa', pasos: [{ num: 1, titulo: 'Elevar a Escritura Pública', descripcion: 'Lleve el contrato firmado a una Notaría para elevarlo a escritura pública. Ambas partes deben estar presentes o representadas con poder notarial.' }, { num: 2, titulo: 'Pagar el impuesto de registro', descripcion: 'Pague el impuesto de registro ante la Gobernación o la ventanilla de rentas del departamento. Equivale aproximadamente al 1% del valor del inmueble.' }, { num: 3, titulo: 'Registrar la escritura', descripcion: 'Registre la escritura en la Oficina de Registro de Instrumentos Públicos de la ciudad donde está el inmueble.' }, { num: 4, titulo: 'Verificar el pacto de retroventa en la escritura', descripcion: 'El pacto de retroventa debe quedar expresamente consignado en la escritura pública. Verifique que el notario lo incluya claramente en el texto.' }, { num: 5, titulo: 'Si el vendedor ejerce la retroventa', descripcion: 'El vendedor debe dar el aviso con el plazo acordado y pagar el precio estipulado al momento de recibir el inmueble de vuelta.' }, { num: 6, titulo: 'Guardar los documentos', descripcion: 'Guarde una copia de la escritura y del certificado de tradición.' }] },
  'cesion-derechos-hereditarios': { titulo: 'Cesión o Venta de Derechos Hereditarios', pasos: [{ num: 1, titulo: 'Elevar a Escritura Pública', descripcion: 'La cesión de derechos hereditarios debe hacerse mediante Escritura Pública ante Notario.' }, { num: 2, titulo: 'Registrar la escritura', descripcion: 'Lleve la escritura a la Oficina de Registro de Instrumentos Públicos de la ciudad donde están ubicados los inmuebles de la sucesión.' }, { num: 3, titulo: 'Notificar al juzgado', descripcion: 'Presente una copia de la escritura de cesión ante el juzgado donde cursa el proceso de sucesión.' }, { num: 4, titulo: 'Pagar los impuestos', descripcion: 'Se deben pagar los derechos notariales y el impuesto de registro.' }] },
  'estatutos-fundacion': { titulo: 'Estatutos de Constitución de Fundación', pasos: [{ num: 1, titulo: 'Reunir a los fundadores y firmar el acta de constitución', descripcion: 'Los fundadores deben reunirse, aprobar los estatutos y firmar el acta de constitución de la fundación.' }, { num: 2, titulo: 'Autenticar las firmas ante Notario', descripcion: 'Lleven el acta de constitución y los estatutos a una Notaría para autenticar las firmas de todos los fundadores.' }, { num: 3, titulo: 'Radicar la solicitud de personería jurídica', descripcion: 'Presente ante la entidad competente: solicitud escrita, acta de constitución autenticada, estatutos, relación del patrimonio inicial con soportes.' }, { num: 4, titulo: 'Inscribir en Cámara de Comercio', descripcion: 'Con la personería jurídica otorgada, registre la fundación en la Cámara de Comercio del municipio donde tiene su domicilio.' }, { num: 5, titulo: 'Obtener el NIT', descripcion: 'Solicite el NIT de la fundación ante la DIAN para poder abrir cuentas bancarias y cumplir las obligaciones tributarias.' }] },
  'contrato-construccion': { titulo: 'Contrato de Construcción sin Suministro de Materiales', pasos: [{ num: 1, titulo: 'Firmar el contrato ante testigos', descripcion: 'Contratante y contratista firman el contrato en dos ejemplares ante dos testigos mayores de edad.' }, { num: 2, titulo: 'Verificar licencia de construcción', descripcion: 'Antes de iniciar la obra, verifique que tiene la licencia de construcción vigente expedida por la Curaduría Urbana o la Oficina de Planeación del municipio.' }, { num: 3, titulo: 'Elaborar el acta de inicio de obra', descripcion: 'Al iniciar la construcción firmen un acta de inicio de obra con la fecha exacta de comienzo.' }, { num: 4, titulo: 'Acta de entrega y recibo de la obra', descripcion: 'Al terminar la obra, el contratista hace entrega formal al contratante mediante un acta de entrega firmada por ambos.' }, { num: 5, titulo: 'Liberar la retención de garantía', descripcion: 'Transcurrido el plazo acordado después de la entrega sin defectos imputables al contratista, el contratante debe liberar y pagar la retención de garantía retenida.' }] },
  'contrato-construccion-materiales': { titulo: 'Contrato de Construcción con Suministro de Materiales', pasos: [{ num: 1, titulo: 'Firmar el contrato ante testigos', descripcion: 'Contratante y contratista firman el contrato en los ejemplares acordados ante dos testigos mayores de edad.' }, { num: 2, titulo: 'Verificar la licencia de construcción', descripcion: 'Antes de iniciar la obra verifique que tiene la licencia de construcción vigente.' }, { num: 3, titulo: 'Firmar el acta de inicio de obra', descripcion: 'Al iniciar la construcción firmen un acta de inicio con la fecha exacta de comienzo.' }, { num: 4, titulo: 'Realizar los pagos según las etapas acordadas', descripcion: 'El contratante debe pagar cada porcentaje en la etapa o fecha acordada, descontando siempre el porcentaje de retención de garantía.' }, { num: 5, titulo: 'Acta de entrega y recibo final de la obra', descripcion: 'Al terminar la obra el contratista hace entrega formal mediante un acta firmada por ambas partes.' }, { num: 6, titulo: 'Liberar la retención de garantía', descripcion: 'Transcurridos los meses acordados desde la entrega final sin defectos imputables al contratista, el contratante debe devolver el fondo de garantía retenido.' }] },
  'contrato-deposito': { titulo: 'Contrato de Depósito', pasos: [{ num: 1, titulo: 'Firmar el contrato y entregar los bienes', descripcion: 'Depositante y depositario firman el contrato. En ese mismo momento el depositante entrega físicamente los bienes al depositario.' }, { num: 2, titulo: 'Verificar el estado de los bienes al recibirlos', descripcion: 'El depositario debe revisar detalladamente cada bien antes de recibirlo.' }, { num: 3, titulo: 'No usar los bienes depositados', descripcion: 'El depositario está expresamente prohibido de usar los bienes. Si los usa sin autorización comete una infracción contractual.' }, { num: 4, titulo: 'Al vencer el plazo: devolver los bienes', descripcion: 'Al terminar el contrato el depositario debe devolver todos los bienes en el mismo estado en que los recibió.' }] },
  'cesion-derechos-litigiosos': { titulo: 'Cesión o Venta de Derechos Litigiosos', pasos: [{ num: 1, titulo: 'Firmar el contrato ante testigos', descripcion: 'Cedente y cesionario firman el contrato en dos ejemplares ante dos testigos mayores de edad.' }, { num: 2, titulo: 'Notificar la cesión al juzgado', descripcion: 'Presente una copia auténtica del contrato ante el juzgado donde cursa el proceso. Sin esta notificación la cesión no produce efectos.' }, { num: 3, titulo: 'Solicitar el reconocimiento del cesionario como parte', descripcion: 'El cesionario debe presentar memorial ante el juzgado solicitando ser reconocido como parte del proceso.' }, { num: 4, titulo: 'Atender el proceso como nueva parte', descripcion: 'Una vez reconocido por el juzgado, el cesionario debe contratar un abogado para continuar el proceso judicial a su nombre.' }] },
  'arrendamiento-vivienda-urbana': { titulo: 'Contrato de Arrendamiento de Vivienda Urbana', pasos: [{ num: 1, titulo: 'Firmar el contrato en dos ejemplares', descripcion: 'Arrendador y arrendatario firman el contrato en dos ejemplares originales. El arrendador tiene la obligación legal de entregar copia al arrendatario dentro de los diez (10) días siguientes a la firma.' }, { num: 2, titulo: 'Elaborar el inventario del inmueble', descripcion: 'Al momento de la entrega firmen un inventario detallado del estado del inmueble.' }, { num: 3, titulo: 'Pagar el canon puntualmente', descripcion: 'El arrendatario debe pagar el canon dentro de los primeros cinco (5) días de cada mes.' }, { num: 4, titulo: 'Para terminar el contrato: dar preaviso por escrito', descripcion: 'Cualquiera de las partes que quiera terminar el contrato debe dar aviso escrito con al menos tres (3) meses de anticipación.' }] },
  'arrendamiento-inmueble-muebles': { titulo: 'Contrato de Arrendamiento de Inmueble con Muebles', pasos: [{ num: 1, titulo: 'Elaborar el inventario detallado de muebles', descripcion: 'Antes de firmar elaboren un inventario completo de todos los muebles, accesorios e instalaciones que se entregan junto con el inmueble.' }, { num: 2, titulo: 'Firmar el contrato en tres ejemplares', descripcion: 'Arrendador, arrendatario y fiador firman el contrato en tres ejemplares. Cada uno conserva el suyo.' }, { num: 3, titulo: 'Al vencer el contrato: restituir inmueble y muebles', descripcion: 'Al vencer el plazo el arrendatario debe devolver el inmueble y todos los muebles del inventario en el mismo estado que los recibió.' }] },
  'cesion-contrato-arrendamiento': { titulo: 'Cesión de Contrato de Arrendamiento', pasos: [{ num: 1, titulo: 'Firmar el documento en dos ejemplares', descripcion: 'Cedente y cesionario firman la cesión en dos ejemplares. Cada parte conserva uno.' }, { num: 2, titulo: 'Notificar al arrendatario por escrito', descripcion: 'El cesionario debe notificarle al arrendatario la cesión por escrito, idealmente por correo certificado.' }, { num: 3, titulo: 'Guardar los documentos', descripcion: 'Conserve la escritura de compraventa del inmueble, la cesión del contrato de arrendamiento autenticada y la constancia de notificación al arrendatario.' }] },
  'notificacion-cesion-arrendamiento': { titulo: 'Notificación Privada de Cesión del Contrato de Arrendamiento', pasos: [{ num: 1, titulo: 'Firmar la carta y autenticar la firma en Notaría', descripcion: 'El cesionario firma la carta y lleva el documento a una Notaría para autenticar su firma.' }, { num: 2, titulo: 'Enviar la carta al arrendatario', descripcion: 'Envíe la carta al arrendatario por correo certificado a la dirección del inmueble arrendado. Guarde el comprobante de envío.' }, { num: 3, titulo: 'El arrendatario debe reconocer al nuevo arrendador', descripcion: 'A partir de la recepción de esta notificación el arrendatario queda obligado a pagar el canon al cesionario.' }] },
  'prestacion-servicios-profesionales': { titulo: 'Contrato de Prestación de Servicios Profesionales', pasos: [{ num: 1, titulo: 'Firmar el contrato en dos ejemplares', descripcion: 'Contratante y contratista firman el contrato en dos ejemplares. Cada parte conserva uno.' }, { num: 2, titulo: 'Guardar comprobantes de todos los pagos', descripcion: 'El contratante debe guardar el comprobante de cada pago realizado. El contratista debe expedir un recibo por cada pago recibido.' }, { num: 3, titulo: 'Al terminar el servicio: acta de entrega', descripcion: 'Al concluir las tareas, el contratista entrega el trabajo al contratante. Se recomienda firmar un acta de entrega y recibo conforme.' }, { num: 4, titulo: 'Obligaciones tributarias del contratista', descripcion: 'Como contratista independiente, el profesional debe declarar sus honorarios ante la DIAN.' }] },
  'servicios-abogado': { titulo: 'Contrato de Prestación de Servicios Profesionales de Abogado', pasos: [{ num: 1, titulo: 'Firmar el contrato en dos ejemplares', descripcion: 'Mandante y mandatario firman el contrato en dos ejemplares. Cada parte conserva uno.' }, { num: 2, titulo: 'Verificar la tarjeta profesional del abogado', descripcion: 'Antes de firmar, verifique que la tarjeta profesional del abogado esté vigente consultando el registro del Consejo Superior de la Judicatura.' }, { num: 3, titulo: 'Pagar los honorarios puntualmente', descripcion: 'El mandante debe pagar los honorarios en las fechas acordadas. Guarde todos los comprobantes de pago.' }, { num: 4, titulo: 'Para terminar el contrato: dar aviso escrito', descripcion: 'Cualquier parte que quiera terminar el contrato debe dar aviso escrito a la otra con el plazo acordado en la cláusula quinta.' }] },
  'poder-general': { titulo: 'Poder General', pasos: [{ num: 1, titulo: 'Ir a la Notaría con los documentos', descripcion: 'El poderdante debe ir personalmente a la Notaría indicada en el documento con su cédula de ciudadanía original. El poder general SIEMPRE debe otorgarse mediante escritura pública.' }, { num: 2, titulo: 'El Notario redacta y lee la escritura', descripcion: 'El Notario redacta la escritura con los datos suministrados, la lee en voz alta al poderdante y verifica que corresponda exactamente a su voluntad.' }, { num: 3, titulo: 'Pagar los derechos notariales', descripcion: 'Los derechos notariales se pagan en la misma Notaría según la tarifa oficial vigente.' }, { num: 4, titulo: 'Para revocar el poder', descripcion: 'Si en algún momento desea revocar este poder, debe hacerlo también mediante escritura pública de revocatoria en cualquier Notaría, y notificar al apoderado.' }] },
  'poder-especial-venta-inmueble': { titulo: 'Poder Especial para Venta de Inmueble', pasos: [{ num: 1, titulo: 'Firmar el documento ante el Notario', descripcion: 'El poderdante debe ir personalmente a la Notaría indicada y firmar el documento en presencia del Notario, quien autenticará su firma.' }, { num: 2, titulo: 'El apoderado gestiona la venta', descripcion: 'Con el poder autenticado, el apoderado puede negociar y firmar la escritura pública de compraventa en nombre del poderdante.' }, { num: 3, titulo: 'Para revocar el poder', descripcion: 'Si decide no vender o cambiar de apoderado, debe revocar el poder mediante escrito ante Notario y notificarlo al apoderado antes de que firme la escritura de venta.' }] },
  'revocatoria-poder-general': { titulo: 'Revocatoria de Poder General (Escritura Pública)', pasos: [{ num: 1, titulo: 'Ir a la Notaría con los documentos', descripcion: 'El poderdante debe ir personalmente a la Notaría con su cédula de ciudadanía original y la copia de la escritura pública del poder original que va a revocar. La revocatoria SIEMPRE debe hacerse por escritura pública.' }, { num: 2, titulo: 'El Notario redacta y autoriza la escritura', descripcion: 'El Notario redacta la escritura de revocatoria, la lee al poderdante y verifica que corresponda a su voluntad. Ambas partes firman en la Notaría.' }, { num: 3, titulo: 'Pagar los derechos notariales', descripcion: 'Se pagan los derechos notariales correspondientes por la autorización de la escritura pública de revocatoria. Consulte la tarifa vigente en la Notaría.' }, { num: 4, titulo: 'Notificar personalmente al apoderado', descripcion: 'Notifique de inmediato al apoderado sobre la revocación del poder. Esto es fundamental para que no siga actuando en su nombre. Guarde constancia de esta notificación.' }, { num: 5, titulo: 'Informar a entidades donde se usó el poder', descripcion: 'Si el poder original fue presentado ante bancos, entidades públicas u otras instituciones, infórmeles la revocación presentando copia auténtica de la escritura de revocatoria.' }, { num: 6, titulo: 'Guardar copia auténtica de la escritura', descripcion: 'Conserve una copia auténtica de la escritura de revocación. Es su prueba legal de que el poder fue revocado y el apoderado ya no puede actuar en su nombre.' }, { num: 7, titulo: 'Actos realizados después de la revocación', descripcion: 'Recuerde: si el apoderado realiza actos en su nombre DESPUÉS de ser notificado de la revocación, esos actos no lo obligan a usted. Sin embargo, los actos realizados antes de la notificación siguen siendo válidos.' }] },
  // --- MINUTA 27: Contrato Civil de Obra ---
  'contrato-civil-obra': { titulo: 'Contrato Civil de Obra', pasos: [{ num: 1, titulo: 'Firmar el contrato en dos ejemplares ante testigos', descripcion: 'Contratante y contratista firman el contrato en dos ejemplares ante dos testigos hábiles. Cada parte conserva un ejemplar original.' }, { num: 2, titulo: 'Constituir las garantías y pólizas antes de iniciar', descripcion: 'Antes de dar inicio a la obra, el contratista debe constituir todas las garantías pactadas en la cláusula quinta: manejo de anticipo, cumplimiento, responsabilidad civil, estabilidad, seguro colectivo de vida y garantía de salarios. Sin estas garantías el contratante puede negarse a entregar el anticipo.' }, { num: 3, titulo: 'Afiliar al personal a seguridad social', descripcion: 'El contratista debe afiliar a todo el personal de la obra a la EPS, AFP y ARL correspondientes antes del inicio de actividades. Solicite las planillas de pago periódicamente durante la ejecución.' }, { num: 4, titulo: 'Firmar el acta de inicio de obra', descripcion: 'Al comenzar la ejecución, firmen un acta de inicio con la fecha exacta de comienzo. Este documento es el punto de partida para calcular el plazo y las posibles penalizaciones por mora.' }, { num: 5, titulo: 'Realizar seguimiento y pagos por avance', descripcion: 'El contratante debe realizar los pagos según el avance acordado. Se recomienda firmar actas de avance parcial antes de cada pago para documentar el estado de la obra.' }, { num: 6, titulo: 'Acta de entrega y recibo final de la obra', descripcion: 'Al terminar la obra, el contratista hace entrega formal al contratante mediante un acta de entrega y recibo definitivo firmada por ambas partes. Esta acta activa la vigencia de la garantía de estabilidad.' }, { num: 7, titulo: 'Liquidación final del contrato', descripcion: 'Después de la entrega definitiva, las partes deben hacer la liquidación final del contrato, en la que se establecen los saldos pendientes, los descuentos por retención de garantía y cualquier ajuste económico.' }, { num: 8, titulo: 'Liberar la retención de garantía', descripcion: 'Transcurrido el plazo de garantía acordado desde la entrega definitiva, sin que se hayan presentado defectos imputables al contratista, el contratante debe liberar y pagar el saldo retenido como garantía.' }] },
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