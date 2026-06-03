'use client'

import { FormData, AREAS } from '@/lib/types'

interface Props {
  data: FormData
  onChange: (data: Partial<FormData>) => void
  onNext: () => void
}

export default function Step1({ data, onChange, onNext }: Props) {
  const isValid =
    data.observadorNombre.trim() &&
    data.observadorArea &&
    data.lugarObservacion.trim() &&
    data.nombreActividad.trim() &&
    data.tipoActividad

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-700 p-4 rounded-r-lg">
        <p className="text-sm text-blue-800 font-medium">
          Recuerda: Comunicar a supervisor — realizar una correcta observación evaluando todas las
          acciones realizadas por el personal observado de manera eficaz.
        </p>
      </div>

      <div className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Apellidos y Nombres del Observador <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.observadorNombre}
            onChange={e => onChange({ observadorNombre: e.target.value })}
            placeholder="Ingrese apellidos y nombres"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Área */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Área a la que pertenece el Observador <span className="text-red-500">*</span>
          </label>
          <select
            value={data.observadorArea}
            onChange={e => onChange({ observadorArea: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Elegir...</option>
            {AREAS.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Lugar */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Lugar donde se está realizando la observación <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.lugarObservacion}
            onChange={e => onChange({ lugarObservacion: e.target.value })}
            placeholder="Ej: Planta de tratamiento norte"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Actividad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nombre de la Actividad <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.nombreActividad}
            onChange={e => onChange({ nombreActividad: e.target.value })}
            placeholder="Ej: Mantenimiento de válvulas"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tipo de actividad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            La actividad es <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            {(['Rutinaria', 'No rutinaria'] as const).map(tipo => (
              <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipoActividad"
                  value={tipo}
                  checked={data.tipoActividad === tipo}
                  onChange={() => onChange({ tipoActividad: tipo })}
                  className="w-4 h-4 text-blue-700 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{tipo}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
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
