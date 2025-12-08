import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceData {
  invoiceNumber: string;
  issueDate: Date;
  dueDate?: Date | null;
  taxDate?: Date | null;

  // Supplier (Mùza Hair)
  supplierName: string;
  supplierStreet?: string | null;
  supplierCity?: string | null;
  supplierZipCode?: string | null;
  supplierCountry: string;
  supplierIco?: string | null;
  supplierDic?: string | null;
  supplierEmail?: string | null;
  supplierPhone?: string | null;

  // Customer
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  customerStreet: string;
  customerCity: string;
  customerZipCode: string;
  customerCountry: string;
  customerIco?: string | null;
  customerDic?: string | null;

  // Items
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;

  // Amounts
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;

  // Payment
  paymentMethod?: string | null;
  variableSymbol?: string | null;
  bankAccount?: string | null;
  iban?: string | null;
  swift?: string | null;

  note?: string | null;
}

/**
 * Generate PDF invoice
 * Returns base64 encoded PDF string
 */
export function generateInvoicePDF(data: InvoiceData): string {
  const doc = new jsPDF();

  // Set font
  doc.setFont('helvetica');

  // Header - Invoice Title
  doc.setFontSize(24);
  doc.setTextColor(60, 32, 32); // burgundy
  doc.text('FAKTURA', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`č. ${data.invoiceNumber}`, 105, 28, { align: 'center' });

  // Supplier info (Left side)
  let yPos = 45;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Dodavatel:', 20, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPos += 6;
  doc.text(data.supplierName, 20, yPos);

  if (data.supplierStreet) {
    yPos += 5;
    doc.text(data.supplierStreet, 20, yPos);
  }

  if (data.supplierCity && data.supplierZipCode) {
    yPos += 5;
    doc.text(`${data.supplierZipCode} ${data.supplierCity}`, 20, yPos);
  }

  if (data.supplierIco) {
    yPos += 5;
    doc.text(`IČO: ${data.supplierIco}`, 20, yPos);
  }

  if (data.supplierDic) {
    yPos += 5;
    doc.text(`DIČ: ${data.supplierDic}`, 20, yPos);
  }

  if (data.supplierEmail) {
    yPos += 5;
    doc.text(`Email: ${data.supplierEmail}`, 20, yPos);
  }

  if (data.supplierPhone) {
    yPos += 5;
    doc.text(`Tel: ${data.supplierPhone}`, 20, yPos);
  }

  // Customer info (Right side)
  yPos = 45;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Odběratel:', 110, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPos += 6;
  doc.text(data.customerName, 110, yPos);

  yPos += 5;
  doc.text(data.customerStreet, 110, yPos);

  yPos += 5;
  doc.text(`${data.customerZipCode} ${data.customerCity}`, 110, yPos);

  if (data.customerIco) {
    yPos += 5;
    doc.text(`IČO: ${data.customerIco}`, 110, yPos);
  }

  if (data.customerDic) {
    yPos += 5;
    doc.text(`DIČ: ${data.customerDic}`, 110, yPos);
  }

  yPos += 5;
  doc.text(`Email: ${data.customerEmail}`, 110, yPos);

  if (data.customerPhone) {
    yPos += 5;
    doc.text(`Tel: ${data.customerPhone}`, 110, yPos);
  }

  // Invoice details
  yPos = Math.max(yPos, 100) + 10;

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('cs-CZ');
  };

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);

  const detailsData = [
    ['Datum vystavení:', formatDate(data.issueDate)],
    ['Datum splatnosti:', formatDate(data.dueDate)],
    ['Datum zdanit. plnění:', formatDate(data.taxDate)],
  ];

  if (data.variableSymbol) {
    detailsData.push(['Variabilní symbol:', data.variableSymbol]);
  }

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: detailsData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 50 },
    },
  });

  // Items table
  yPos = (doc as any).lastAutoTable.finalY + 10;

  const itemsData = data.items.map(item => [
    item.name,
    item.quantity.toString(),
    `${item.unitPrice.toLocaleString('cs-CZ')} Kč`,
    `${item.total.toLocaleString('cs-CZ')} Kč`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Položka', 'Množství', 'Jedn. cena', 'Celkem']],
    body: itemsData,
    theme: 'striped',
    headStyles: {
      fillColor: [60, 32, 32], // burgundy
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
  });

  // Summary table
  yPos = (doc as any).lastAutoTable.finalY + 5;

  const summaryData = [
    ['Mezisoučet bez DPH:', `${data.subtotal.toLocaleString('cs-CZ')} Kč`],
    [`DPH ${data.vatRate}%:`, `${data.vatAmount.toLocaleString('cs-CZ')} Kč`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: summaryData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'right', cellWidth: 120 },
      1: { halign: 'right', cellWidth: 35 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 2;

  // Total (highlighted)
  autoTable(doc, {
    startY: yPos,
    head: [],
    body: [['CELKEM K ÚHRADĚ:', `${data.total.toLocaleString('cs-CZ')} Kč`]],
    theme: 'plain',
    styles: {
      fontSize: 12,
      cellPadding: 3,
      fontStyle: 'bold',
    },
    headStyles: {
      fillColor: [60, 32, 32],
    },
    bodyStyles: {
      fillColor: [232, 225, 215], // warm beige
      textColor: [60, 32, 32],
    },
    columnStyles: {
      0: { halign: 'right', cellWidth: 120 },
      1: { halign: 'right', cellWidth: 35 },
    },
  });

  // Payment info
  if (data.bankAccount || data.iban) {
    yPos = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Platební údaje:', 20, yPos);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    if (data.bankAccount) {
      yPos += 5;
      doc.text(`Číslo účtu: ${data.bankAccount}`, 20, yPos);
    }

    if (data.iban) {
      yPos += 5;
      doc.text(`IBAN: ${data.iban}`, 20, yPos);
    }

    if (data.swift) {
      yPos += 5;
      doc.text(`SWIFT: ${data.swift}`, 20, yPos);
    }
  }

  // Note
  if (data.note) {
    yPos = (doc as any).lastAutoTable.finalY + 15;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`Poznámka: ${data.note}`, 20, yPos, { maxWidth: 170 });
  }

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Strana ${i} / ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
  }

  // Return base64 PDF
  return doc.output('datauristring');
}

/**
 * Get next invoice number for the current year
 * Format: YYYY001, YYYY002, etc.
 */
export function generateInvoiceNumber(lastInvoiceNumber?: string | null): string {
  const currentYear = new Date().getFullYear();
  const yearPrefix = currentYear.toString();

  if (!lastInvoiceNumber) {
    return `${yearPrefix}001`;
  }

  // Extract number from last invoice
  const lastNumber = parseInt(lastInvoiceNumber.slice(-3));
  const newNumber = (lastNumber + 1).toString().padStart(3, '0');

  return `${yearPrefix}${newNumber}`;
}
