import { jsPDF } from 'jspdf'

type ReceiptSection = {
  title: string
  rows: Array<{ label: string; value: string }>
}

const sanitizeFilename = (value: string) => value.replace(/[^a-zA-Z0-9\-]+/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '')

export const formatReceiptDate = (value: string) => {
  if (!value) return '-'
  const parsed = new Date(`${String(value).slice(0, 10)}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return String(value)
  return parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export const formatReceiptAmount = (value: number | string | null | undefined) => {
  const amount = Number(value || 0)
  return `PHP ${amount.toLocaleString()}`
}

export const downloadReceiptPdf = ({
  facilityName,
  documentTitle,
  fileName,
  summaryRows,
  sections,
}: {
  facilityName: string
  documentTitle: string
  fileName: string
  summaryRows: Array<{ label: string; value: string }>
  sections: ReceiptSection[]
}) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const left = 14
  const right = pageWidth - 14
  let y = 18

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(documentTitle, pageWidth / 2, y, { align: 'center' })
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(facilityName, pageWidth / 2, y, { align: 'center' })
  y += 10

  doc.setDrawColor(220)
  doc.line(left, y, right, y)
  y += 10

  const writeRows = (rows: Array<{ label: string; value: string }>) => {
    rows.forEach((row) => {
      const label = `${row.label}:`
      const wrappedValue = doc.splitTextToSize(row.value || '-', 120)
      doc.setFont('helvetica', 'bold')
      doc.text(label, left, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wrappedValue, left + 55, y)
      y += Math.max(6, wrappedValue.length * 5)
    })
  }

  doc.setFontSize(11)
  writeRows(summaryRows)

  sections.forEach((section) => {
    y += 4
    doc.setDrawColor(220)
    doc.line(left, y, right, y)
    y += 8
    doc.setFont('helvetica', 'bold')
    doc.text(section.title, left, y)
    y += 7
    writeRows(section.rows)
  })

  y += 6
  doc.setDrawColor(220)
  doc.line(left, y, right, y)
  y += 8
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated on ${new Date().toLocaleString()}`, left, y)
  y += 6
  doc.text('Please keep this receipt for your records.', left, y)

  doc.save(`${sanitizeFilename(fileName)}.pdf`)
}