import ObservationForm from '@/components/ObservationForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl font-black">
              E
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">REGISTRO DE OBSERVACIÓN CONDUCTUAL</h1>
              <p className="text-blue-200 text-xs mt-0.5">EDAE — Seguridad Basada en el Comportamiento</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form card */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <ObservationForm />
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          Creado para Veolia — EDAE · {new Date().getFullYear()}
        </p>
      </main>
    </div>
  )
}
