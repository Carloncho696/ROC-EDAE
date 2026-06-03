'use client'

import { ItemChecklist, Comportamiento, BARRERAS } from '@/lib/types'

interface Props {
  index: number
  criterio: string
  item: ItemChecklist
  onChange: (item: ItemChecklist) => void
}

const COMPORTAMIENTOS: Comportamiento[] = [
  'Comportamiento Seguro',
  'Comportamiento Peligroso',
  'No Aplica',
]

const colorMap: Record<string, string> = {
  'Comportamiento Seguro': 'border-green-500 bg-green-50',
  'Comportamiento Peligroso': 'border-red-500 bg-red-50',
  'No Aplica': 'border-gray-400 bg-gray-50',
  '': 'border-gray-200 bg-white',
}

export default function ObservationItem({ index, criterio, item, onChange }: Props) {
  const handleComp = (comp: Comportamiento) => {
    onChange({
      comportamiento: comp,
      barrera: comp === 'Comportamiento Peligroso' ? item.barrera : '',
    })
  }

  return (
    <div className={`border-2 rounded-xl p-4 transition-all ${colorMap[item.comportamiento]}`}>
      <div className="flex gap-3">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <p className="text-sm text-gray-800 font-medium leading-snug">{criterio}</p>
      </div>

      <div className="mt-3 ml-10">
        <select
          value={item.comportamiento}
          onChange={e => handleComp(e.target.value as Comportamiento)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Elegir comportamiento...</option>
          {COMPORTAMIENTOS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {item.comportamiento === 'Comportamiento Peligroso' && (
          <div className="mt-2">
            <label className="block text-xs font-semibold text-red-700 mb-1">
              Identifica la barrera:
            </label>
            <select
              value={item.barrera}
              onChange={e => onChange({ ...item, barrera: e.target.value as typeof item.barrera })}
              className="w-full border border-red-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            >
              <option value="">Elegir barrera...</option>
              {BARRERAS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}
