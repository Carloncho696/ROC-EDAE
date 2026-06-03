'use client'

import { useState } from 'react'
import { FormData, CRITERIOS } from '@/lib/types'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

const emptyForm = (): FormData => ({
  observadorNombre: '',
  observadorArea: '',
  lugarObservacion: '',
  nombreActividad: '',
  tipoActividad: '',
  items: CRITERIOS.map(() => ({ comportamiento: '', barrera: '' })),
  foto: null,
  comentarios: '',
  sugerencias: '',
})

const STEPS = ['Datos del Observador', 'Checklist Conductual', 'Retroalimentación']

export default function ObservationForm() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(emptyForm())
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const update = (partial: Partial<FormData>) =>
    setFormData(prev => ({ ...prev, ...partial }))

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const { generatePDF } = await import('@/lib/generatePDF')
      const pdfBlob = await generatePDF(formData)

      const arrayBuffer = await pdfBlob.arrayBuffer()
      const uint8 = new Uint8Array(arrayBuffer)
      let binary = ''
      uint8.forEach(b => (binary += String.fromCharCode(b)))
      const pdfBase64 = btoa(binary)

      // Auto-download PDF
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      const fecha = new Date().toLocaleDateString('es-PE').replace(/\//g, '-')
      a.download = `ROC_${formData.observadorNombre.replace(/\s+/g, '_')}_${fecha}.pdf`
      a.click()
      URL.revokeObjectURL(url)

      // Send email
      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, pdfBase64 }),
      })

      if (!res.ok) throw new Error('Error al enviar el correo')

      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-16 px-4 space-y-4">
        <div className="text-6xl">✅</div>
        <h2 className="text-2xl font-bold text-gray-800">¡Registro enviado!</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          El PDF se descargó automáticamente y se envió una copia por correo al supervisor.
        </p>
        <button
          onClick={() => { setFormData(emptyForm()); setStep(0); setDone(false) }}
          className="mt-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-2.5 rounded-lg text-sm transition-colors"
        >
          Nueva observación
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < step
                    ? 'bg-green-500 text-white'
                    : i === step
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs text-center hidden sm:block ${i === step ? 'text-blue-700 font-semibold' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {step === 0 && <Step1 data={formData} onChange={update} onNext={() => setStep(1)} />}
      {step === 1 && <Step2 data={formData} onChange={update} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && (
        <Step3
          data={formData}
          onChange={update}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </div>
  )
}
