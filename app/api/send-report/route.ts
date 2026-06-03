import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { FormData, CRITERIOS } from '@/lib/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { formData, pdfBase64 }: { formData: FormData; pdfBase64: string } = body

    const destinatario = process.env.REPORT_EMAIL
    if (!destinatario) {
      return NextResponse.json({ error: 'REPORT_EMAIL no configurado' }, { status: 500 })
    }
    const destinatarios = destinatario.split(',').map(e => e.trim())

    const fecha = new Date().toLocaleDateString('es-PE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

    const itemsHTML = formData.items
      .map((item, i) => {
        const color =
          item.comportamiento === 'Comportamiento Seguro' ? '#16a34a' :
          item.comportamiento === 'Comportamiento Peligroso' ? '#dc2626' : '#6b7280'
        const badge = `<span style="color:${color};font-weight:bold">${item.comportamiento || '—'}</span>`
        const barrera = item.barrera
          ? `<br/><span style="color:#6b7280;font-size:12px">↳ ${item.barrera}</span>`
          : ''
        return `
          <tr style="background:${i % 2 === 0 ? '#f8fafc' : '#ffffff'}">
            <td style="padding:6px 8px;border:1px solid #e2e8f0;color:#64748b;font-size:12px">${i + 1}</td>
            <td style="padding:6px 8px;border:1px solid #e2e8f0;font-size:12px">${CRITERIOS[i]}</td>
            <td style="padding:6px 8px;border:1px solid #e2e8f0;font-size:12px">${badge}${barrera}</td>
          </tr>`
      })
      .join('')

    const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family:Arial,sans-serif;background:#f1f5f9;margin:0;padding:20px">
      <div style="max-width:720px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
        <div style="background:#1e40af;padding:24px 32px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:20px">REGISTRO DE OBSERVACIÓN CONDUCTUAL</h1>
          <p style="color:#bfdbfe;margin:6px 0 0;font-size:13px">EDAE — Seguridad Basada en el Comportamiento</p>
          <p style="color:#bfdbfe;margin:4px 0 0;font-size:12px">${fecha}</p>
        </div>
        <div style="padding:24px 32px">
          <h2 style="color:#1e40af;font-size:14px;border-bottom:2px solid #dbeafe;padding-bottom:6px">DATOS DEL OBSERVADOR</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr><td style="padding:5px 0;color:#64748b;font-size:13px;width:180px">Observador:</td><td style="font-size:13px;font-weight:bold">${formData.observadorNombre}</td></tr>
            <tr><td style="padding:5px 0;color:#64748b;font-size:13px">Área:</td><td style="font-size:13px">${formData.observadorArea}</td></tr>
            <tr><td style="padding:5px 0;color:#64748b;font-size:13px">Lugar:</td><td style="font-size:13px">${formData.lugarObservacion}</td></tr>
            <tr><td style="padding:5px 0;color:#64748b;font-size:13px">Actividad:</td><td style="font-size:13px">${formData.nombreActividad}</td></tr>
            <tr><td style="padding:5px 0;color:#64748b;font-size:13px">Tipo:</td><td style="font-size:13px">${formData.tipoActividad}</td></tr>
          </table>
          <h2 style="color:#1e40af;font-size:14px;border-bottom:2px solid #dbeafe;padding-bottom:6px">CHECKLIST CONDUCTUAL</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <thead>
              <tr style="background:#1e40af">
                <th style="padding:8px;color:#fff;font-size:12px;text-align:left;width:30px">#</th>
                <th style="padding:8px;color:#fff;font-size:12px;text-align:left">Criterio</th>
                <th style="padding:8px;color:#fff;font-size:12px;text-align:left;width:200px">Resultado</th>
              </tr>
            </thead>
            <tbody>${itemsHTML}</tbody>
          </table>
          <h2 style="color:#1e40af;font-size:14px;border-bottom:2px solid #dbeafe;padding-bottom:6px">RETROALIMENTACIÓN</h2>
          <p style="color:#374151;font-size:13px;margin-bottom:4px"><strong>Comentarios / Acciones correctivas:</strong></p>
          <p style="color:#374151;font-size:13px;background:#f8fafc;padding:10px;border-radius:6px;border-left:3px solid #1e40af">${formData.comentarios || '—'}</p>
          <p style="color:#374151;font-size:13px;margin-bottom:4px"><strong>Sugerencia de Planes de Acción:</strong></p>
          <p style="color:#374151;font-size:13px;background:#f8fafc;padding:10px;border-radius:6px;border-left:3px solid #1e40af">${formData.sugerencias || '—'}</p>
        </div>
        <div style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0">
          <p style="color:#94a3b8;font-size:11px;margin:0">Este reporte fue generado automáticamente por el sistema de Observación Conductual EDAE.</p>
        </div>
      </div>
    </body>
    </html>`

    const pdfBuffer = Buffer.from(pdfBase64, 'base64')

    await resend.emails.send({
      from: 'Observacion Conductual EDAE <onboarding@resend.dev>',
      to: destinatarios,
      subject: `[ROC] Observación de ${formData.observadorNombre} — ${fecha}`,
      html,
      attachments: [
        {
          filename: `ROC_${formData.observadorNombre.replace(/\s+/g, '_')}_${fecha.replace(/[/: ]/g, '-')}.pdf`,
          content: pdfBuffer,
        },
      ],
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error enviando email' }, { status: 500 })
  }
}
