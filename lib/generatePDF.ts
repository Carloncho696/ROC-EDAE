'use client'

import jsPDF from 'jspdf'
import { FormData, CRITERIOS } from './types'

export async function generatePDF(data: FormData): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = 210
  const margin = 14
  const contentW = pageW - margin * 2
  let y = 0

  const addPage = () => {
    doc.addPage()
    y = 15
  }

  const checkY = (needed: number) => {
    if (y + needed > 275) addPage()
  }

  // --- Header ---
  doc.setFillColor(30, 64, 175) // blue-800
  doc.rect(0, 0, pageW, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('REGISTRO DE OBSERVACIÓN CONDUCTUAL', pageW / 2, 11, { align: 'center' })
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('EDAE — Seguridad Basada en el Comportamiento', pageW / 2, 19, { align: 'center' })
  const fecha = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  doc.text(`Fecha: ${fecha}`, pageW / 2, 25, { align: 'center' })

  y = 36

  // --- Sección 1: Datos del observador ---
  doc.setFillColor(239, 246, 255)
  doc.roundedRect(margin, y, contentW, 7, 2, 2, 'F')
  doc.setTextColor(30, 64, 175)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('DATOS DEL OBSERVADOR', margin + 3, y + 5)
  y += 11

  doc.setTextColor(30, 30, 30)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')

  const field = (label: string, value: string) => {
    checkY(7)
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}:`, margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(value || '—', margin + 55, y)
    y += 6
  }

  field('Observador', data.observadorNombre)
  field('Área', data.observadorArea)
  field('Lugar de observación', data.lugarObservacion)
  field('Nombre de la actividad', data.nombreActividad)
  field('Tipo de actividad', data.tipoActividad)

  y += 4

  // --- Sección 2: Checklist ---
  doc.setFillColor(239, 246, 255)
  doc.roundedRect(margin, y, contentW, 7, 2, 2, 'F')
  doc.setTextColor(30, 64, 175)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('CHECKLIST DE OBSERVACIÓN CONDUCTUAL', margin + 3, y + 5)
  y += 11

  // Table header
  const colW = [8, 110, 42, 22]
  const headers = ['#', 'Criterio', 'Comportamiento', 'Barrera']
  doc.setFillColor(30, 64, 175)
  doc.rect(margin, y, contentW, 7, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  let cx = margin + 2
  headers.forEach((h, i) => { doc.text(h, cx, y + 5); cx += colW[i] })
  y += 7

  data.items.forEach((item, idx) => {
    const criterio = CRITERIOS[idx]
    const lines = doc.splitTextToSize(criterio, colW[1] - 3)
    const rowH = Math.max(lines.length * 4.5 + 3, 9)
    checkY(rowH)

    doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 250 : 255, 255)
    doc.rect(margin, y, contentW, rowH, 'F')
    doc.setDrawColor(200, 210, 230)
    doc.rect(margin, y, contentW, rowH)

    doc.setTextColor(30, 30, 30)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text(String(idx + 1), margin + 2, y + 5.5)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.text(lines, margin + colW[0] + 2, y + 4.5)

    const comp = item.comportamiento || '—'
    const compColor: [number, number, number] =
      item.comportamiento === 'Comportamiento Seguro' ? [22, 163, 74] :
      item.comportamiento === 'Comportamiento Peligroso' ? [220, 38, 38] :
      [107, 114, 128]
    doc.setTextColor(...compColor)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.text(comp, margin + colW[0] + colW[1] + 2, y + 5.5)

    doc.setTextColor(30, 30, 30)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    if (item.barrera) {
      const bLines = doc.splitTextToSize(item.barrera, colW[3] - 2)
      doc.text(bLines, margin + colW[0] + colW[1] + colW[2] + 2, y + 4.5)
    }

    y += rowH
  })

  y += 6

  // --- Sección 3: Retroalimentación ---
  checkY(12)
  doc.setFillColor(239, 246, 255)
  doc.roundedRect(margin, y, contentW, 7, 2, 2, 'F')
  doc.setTextColor(30, 64, 175)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('RETROALIMENTACIÓN', margin + 3, y + 5)
  y += 11

  doc.setTextColor(30, 30, 30)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('Comentarios / Acciones correctivas y Fortalezas:', margin, y)
  y += 5
  doc.setFont('helvetica', 'normal')
  const comentLines = doc.splitTextToSize(data.comentarios || '—', contentW)
  checkY(comentLines.length * 5 + 4)
  doc.setFillColor(250, 250, 255)
  doc.rect(margin, y, contentW, comentLines.length * 5 + 4, 'F')
  doc.setDrawColor(200, 210, 230)
  doc.rect(margin, y, contentW, comentLines.length * 5 + 4)
  doc.text(comentLines, margin + 2, y + 4)
  y += comentLines.length * 5 + 8

  checkY(12)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('Sugerencia de Planes de Acción / condiciones inseguras:', margin, y)
  y += 5
  doc.setFont('helvetica', 'normal')
  const sugLines = doc.splitTextToSize(data.sugerencias || '—', contentW)
  checkY(sugLines.length * 5 + 4)
  doc.setFillColor(250, 250, 255)
  doc.rect(margin, y, contentW, sugLines.length * 5 + 4, 'F')
  doc.setDrawColor(200, 210, 230)
  doc.rect(margin, y, contentW, sugLines.length * 5 + 4)
  doc.text(sugLines, margin + 2, y + 4)
  y += sugLines.length * 5 + 8

  // --- Foto ---
  if (data.foto) {
    checkY(80)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(30, 64, 175)
    doc.text('FOTOGRAFÍA DE EVIDENCIA', margin, y)
    y += 5
    try {
      const imgProps = doc.getImageProperties(data.foto)
      const maxW = contentW
      const maxH = 80
      const ratio = Math.min(maxW / imgProps.width, maxH / imgProps.height)
      const imgW = imgProps.width * ratio
      const imgH = imgProps.height * ratio
      doc.addImage(data.foto, 'JPEG', margin, y, imgW, imgH)
      y += imgH + 6
    } catch {
      doc.setTextColor(150, 150, 150)
      doc.setFont('helvetica', 'normal')
      doc.text('(No se pudo cargar la imagen)', margin, y + 5)
      y += 10
    }
  }

  // Footer on each page
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setDrawColor(200, 210, 230)
    doc.line(margin, 287, pageW - margin, 287)
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('EDAE — Registro de Observación Conductual', margin, 292)
    doc.text(`Pág. ${i} / ${totalPages}`, pageW - margin, 292, { align: 'right' })
  }

  return doc.output('blob')
}
