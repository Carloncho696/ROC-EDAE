export type Comportamiento = 'Comportamiento Seguro' | 'Comportamiento Peligroso' | 'No Aplica' | ''

export type Barrera =
  | 'B1: Ahorro de tiempo'
  | 'B2: Incomodidad al ejecutar tarea (espacio, posturas, clima, EPP, etc)'
  | 'B3: Procedimiento no actualizado / sin procedimiento'
  | 'B4: No recibió entrenamiento / instrucción / capacitación'
  | 'B5: Alta presión de trabajo'
  | 'B6: Fatiga'
  | 'B7: Falta de recursos (personal y/o material)'
  | 'B8: Incorrecta identificación de peligros'
  | 'B9: Subestima o minimiza el riesgo (exceso de confianza)'
  | 'B10: Costumbres peligrosas'
  | ''

export interface ItemChecklist {
  comportamiento: Comportamiento
  barrera: Barrera
}

export interface FormData {
  // Paso 1
  observadorNombre: string
  observadorArea: string
  lugarObservacion: string
  nombreActividad: string
  tipoActividad: 'Rutinaria' | 'No rutinaria' | ''

  // Paso 2 - 19 items
  items: ItemChecklist[]

  // Foto
  foto: string | null // base64

  // Paso 3
  comentarios: string
  sugerencias: string
}

export const AREAS = [
  'Operaciones PTAR',
  'Operaciones Colectores',
  'Mantenimiento',
  'Administración',
] as const

export const BARRERAS: Barrera[] = [
  'B1: Ahorro de tiempo',
  'B2: Incomodidad al ejecutar tarea (espacio, posturas, clima, EPP, etc)',
  'B3: Procedimiento no actualizado / sin procedimiento',
  'B4: No recibió entrenamiento / instrucción / capacitación',
  'B5: Alta presión de trabajo',
  'B6: Fatiga',
  'B7: Falta de recursos (personal y/o material)',
  'B8: Incorrecta identificación de peligros',
  'B9: Subestima o minimiza el riesgo (exceso de confianza)',
  'B10: Costumbres peligrosas',
]

export const CRITERIOS = [
  'El trabajador realiza una correcta evaluación de riesgos asociados al trabajo (IPERC continuo) y permisos necesarios para realizar el trabajo.',
  'El trabajador utiliza herramientas y equipos inspeccionados y/o calibrados. (cinta de color correspondiente al trimestre)',
  'El trabajador utiliza de manera correcta los EPPs (específico a la actividad)',
  'El trabajador mantiene el orden y limpieza en el lugar de trabajo.',
  'El trabajador identifica, aísla, bloquea y realiza la prueba de ausencia de los equipos o sistemas a intervenir. (LOTOTO)',
  'El trabajador demarca y señaliza su área de trabajo (antes de iniciar sus actividades)',
  'El trabajador registra su ingreso y salida para áreas restringidas y solo hace uso del celular para tomar fotografías del trabajo.',
  'El conductor realiza check list preoperacional antes de operar su unidad vehicular.',
  'El conductor cumple con las medidas de seguridad al operar el vehículo (uso de cinturón de seguridad, uso de conos y tacos, señales de tránsito)',
  'El trabajador asegura herramientas y materiales contra caídas.',
  'El trabajador verifica correcta armado de andamios y que las barreras de protección de caída de altura se encuentren en buen estado.',
  'El trabajador realiza check list de Arnés antes de inicio de su actividad.',
  'El trabajador revisa elementos de izaje antes de iniciar maniobra.',
  'El trabajador respeta la distancia de trabajo de los equipos en movimiento y/o energizados (evita exponerse a la línea de fuego).',
  'El trabajador mantiene productos químicos correctamente almacenados (según FDS)',
  'El trabajador implementa controles antes de ingresar a espacios confinados (medición de gases, comunicación Respuesta a emergencias, coordinación con vigía)',
  'Trabajador verifica y mantiene guardas/protecciones alrededor de las piezas móviles y fuentes de energía potencialmente peligrosas',
  'El trabajador retira guardas solo si tiene la autorización y el equipo está bloqueado.',
  'El trabajador transita por accesos definidos y usa los tres puntos de apoyo en escaleras evitando distraerse (uso de celular, etc).',
] as const
