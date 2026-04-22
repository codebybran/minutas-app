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
  // Minuta 11 — Compraventa con pacto de retroventa
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
  // Minuta 11 — datos planos
  ciudad_firma: 'Cali',
  dia_firma: '22',
  mes_firma: 'abril',
  año_firma: '2026',
  vecino_vendedor: 'Cali',
  expedida_vendedor: 'Cali',
  vecino_comprador: 'Bogotá',
  expedida_comprador: 'Bogotá',
  ubicacion_inmueble: 'Calle 15 # 8-42, barrio El Peñón',
  ciudad_inmueble: 'Cali',
  linderos: 'Norte: con la calle 15; Sur: con el predio de María García; Oriente: con la carrera 8; Occidente: con el predio de Juan Torres',
  vendedor_anterior: 'María Cecilia Torres Vargas',
  numero_escritura_anterior: '1245',
  notaria_anterior: 'Primera',
  circulo_anterior: 'Cali',
  dia_escritura_anterior: '10',
  mes_escritura_anterior: 'marzo',
  año_escritura_anterior: '2018',
  ciudad_registro: 'Cali',
  dia_registro: '15',
  mes_registro: 'abril',
  año_registro: '2018',
  precio_compraventa: 'ciento veinte millones de pesos ($120.000.000)',
  plazo_retroventa: 'dos (2) años',
  precio_retroventa: 'ciento veinte millones de pesos ($120.000.000)',
  plazo_aviso: 'treinta (30) días',
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
  // CORRECCIÓN: minuta 11 usa el mismo formato { titulo, pasos } que las demás
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
          position: 'fixed',
          top: tooltipData.top,
          left: tooltipData.left,
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