'use client'

import { FormData, CRITERIOS, ItemChecklist } from '@/lib/types'
import ObservationItem from './ObservationItem'

interface Props {
  data: FormData
  onChange: (data: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function Step2({ data, onChange, onNext, onBack }: Props) {
  const updateItem = (index: number, item: ItemChecklist) => {
    const updated = [...data.items]
    updated[index] = item
    onChange({ items: updated })
  }

  const respondidos = data.items.filter(i => i.comportamiento !== '').length
  const isValid = respondidos === CRITERIOS.length

  return (
    <div className="space-y-6">
      {/* Banner de contexto */}
      <div className="bg-blue-700 text-white rounded-xl p-4 space-y-3">
        <p className="font-bold text-sm uppercase tracking-wide">
          ANTES DE REALIZAR EL CHECK LIST — revisa las definiciones y código de barreras para una
          correcta Observación de conducta
        </p>
        <div className="space-y-2 text-xs leading-relaxed text-blue-100">
          <p>
            <span className="font-bold text-white">Conducta Segura:</span> Acción observable y
            medible de una o más personas en relación al cumplimiento de procedimientos y prácticas
            correctas de trabajo. Esta conducta se adecúa a los estándares o normas de seguridad
            establecidos en EDAE y busca minimizar los riesgos de accidentes o lesiones.
          </p>
          <p>
            <span className="font-bold text-white">Conducta Peligrosa:</span> Conducta observable y
            medible de una o más personas que no cumplen con procedimientos y prácticas correctas.
            Por ejemplo: conducción a exceso de velocidad, no usar elementos de protección personal,
            no cumplir los procedimientos de trabajo.
          </p>
          <p>
            <span className="font-bold text-white">Barrera:</span> Elementos o situaciones que se
            encuentran en el ambiente de trabajo y que obstaculizan la aparición de comportamientos
            seguros. Generalmente, cuando asociamos las barreras a las conductas peligrosas,
            identificamos las causas que originan este tipo de comportamientos.
          </p>
        </div>
      </div>

      {/* Código de barreras */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-100 px-4 py-2">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Código de Barreras</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-0 divide-y divide-gray-100">
          {[
            ['B1', 'Ahorro de tiempo'],
            ['B2', 'Incomodidad al ejecutar tarea (espacio, posturas, clima, EPP, etc)'],
            ['B3', 'Procedimiento no actualizado / sin procedimiento'],
            ['B4', 'No recibió entrenamiento / instrucción / capacitación'],
            ['B5', 'Alta presión de trabajo'],
            ['B6', 'Fatiga'],
            ['B7', 'Falta de recursos (personal y/o material)'],
            ['B8', 'Incorrecta identificación de peligros'],
            ['B9', 'Subestima o minimiza el riesgo (exceso de confianza)'],
            ['B10', 'Costumbres peligrosas'],
          ].map(([code, desc]) => (
            <div key={code} className="flex gap-2 px-3 py-1.5 text-xs">
              <span className="font-bold text-blue-700 w-8 flex-shrink-0">{code}</span>
              <span className="text-gray-600">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progreso */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Respondidos: <span className="font-bold text-blue-700">{respondidos} / {CRITERIOS.length}</span></span>
        <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${(respondidos / CRITERIOS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lista de criterios */}
      <div className="space-y-3">
        {CRITERIOS.map((criterio, i) => (
          <ObservationItem
            key={i}
            index={i}
            criterio={criterio}
            item={data.items[i]}
            onChange={item => updateItem(i, item)}
          />
        ))}
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          ← Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-2.5 rounded-lg text-sm transition-colors"
        >
          Siguiente →
        </button>
      </div>
    </div>
  )
}
