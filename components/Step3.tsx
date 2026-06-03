'use client'

import { useRef, useState } from 'react'
import { FormData } from '@/lib/types'

interface Props {
  data: FormData
  onChange: (data: Partial<FormData>) => void
  onBack: () => void
  onSubmit: () => void
  submitting: boolean
}

export default function Step3({ data, onChange, onBack, onSubmit, submitting }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => onChange({ foto: e.target?.result as string })
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-700 p-4 rounded-r-lg">
        <p className="text-sm font-bold text-blue-800 uppercase tracking-wide">RETROALIMENTACIÓN</p>
        <p className="text-xs text-blue-700 mt-1">Comenta qué acciones se realizaron al finalizar la observación</p>
      </div>

      {/* Comentarios */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Comentarios de la observación: Acciones correctivas y/o Fortalezas a resaltar
          <span className="font-normal text-gray-500"> (descripción de comportamientos peligrosos identificados)</span>
        </label>
        <textarea
          value={data.comentarios}
          onChange={e => onChange({ comentarios: e.target.value })}
          rows={4}
          placeholder="Describe las acciones correctivas tomadas o fortalezas observadas..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Sugerencias */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Sugerencia de Planes de Acción a Implementar y/o condiciones inseguras identificadas.
        </label>
        <textarea
          value={data.sugerencias}
          onChange={e => onChange({ sugerencias: e.target.value })}
          rows={4}
          placeholder="Describe los planes de acción o condiciones inseguras identificadas..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Foto */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Fotografía de evidencia <span className="font-normal text-gray-500">(opcional)</span>
        </label>

        {data.foto ? (
          <div className="relative">
            <img
              src={data.foto}
              alt="Evidencia"
              className="w-full max-h-64 object-contain rounded-xl border border-gray-200 bg-gray-50"
            />
            <button
              onClick={() => onChange({ foto: null })}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold"
            >
              Eliminar
            </button>
          </div>
        ) : (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <div className="text-4xl mb-2">📷</div>
            <p className="text-sm text-gray-600 font-medium">Arrastra una foto aquí o haz clic para seleccionar</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          disabled={submitting}
          className="border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          ← Atrás
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-8 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          {submitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar registro'
          )}
        </button>
      </div>
    </div>
  )
}
