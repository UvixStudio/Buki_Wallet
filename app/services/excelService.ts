/**
 * Excel Export Service
 * Handles exporting wallet data to Excel format with separate sheets per child
 */

import * as XLSX from 'xlsx';
import type { Child } from '../context/WalletContext';

/**
 * Export all children data to Excel file
 * Creates one sheet per child with all their transactions
 */
export const exportToExcel = (children: Child[]): void => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  children.forEach((child) => {
    // Prepare data for this child's sheet
    const sheetData: any[] = [];

    // Header row
    sheetData.push([
      'תאריך',
      'שעה',
      'סוג',
      'סכום (₪)',
      'תיאור',
      'נוסף על ידי',
      'יתרה שוטפת',
    ]);

    // Calculate running balance
    let runningBalance = 0;

    // Add transaction rows
    child.transactions.forEach((transaction) => {
      const date = new Date(transaction.timestamp);
      const dateStr = date.toLocaleDateString('he-IL');
      const timeStr = date.toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const type = transaction.type === 'income' ? 'הכנסה' : 'הוצאה';
      const amount =
        transaction.type === 'income'
          ? transaction.amount
          : -transaction.amount;

      runningBalance += amount;

      const createdBy = transaction.createdBy === 'yuval'
        ? 'יובל'
        : transaction.createdBy === 'einav'
        ? 'עינב'
        : 'אורח';

      sheetData.push([
        dateStr,
        timeStr,
        type,
        amount,
        transaction.description,
        createdBy,
        runningBalance,
      ]);
    });

    // Add summary row
    sheetData.push([]);
    sheetData.push(['יתרה סופית:', '', '', '', '', '', runningBalance]);

    // Create worksheet from data
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Set RTL (Right-to-Left) for Hebrew
    if (!worksheet['!views']) worksheet['!views'] = [{}];
    worksheet['!views'][0] = { rightToLeft: true };

    // Set column widths
    worksheet['!cols'] = [
      { wch: 12 }, // תאריך
      { wch: 8 },  // שעה
      { wch: 10 }, // סוג
      { wch: 12 }, // סכום
      { wch: 30 }, // תיאור
      { wch: 12 }, // נוסף על ידי
      { wch: 12 }, // יתרה שוטפת
    ];

    // Style header row
    const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      
      worksheet[cellAddress].s = {
        fill: {
          fgColor: { rgb: child.color.replace('#', '') },
        },
        font: {
          color: { rgb: 'FFFFFF' },
          bold: true,
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
      };
    }

    // Add worksheet to workbook with child's name
    XLSX.utils.book_append_sheet(workbook, worksheet, child.name);
  });

  // Generate filename with current date
  const date = new Date();
  const dateStr = date.toLocaleDateString('he-IL').replace(/\./g, '-');
  const timeStr = date.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/:/g, '-');
  const filename = `ארנק-בוקי-גיבוי-${dateStr}-${timeStr}.xlsx`;

  // Write and download file
  XLSX.writeFile(workbook, filename);
};

/**
 * Get summary data for all children
 */
export const getSummaryData = (children: Child[]): {
  totalTransactions: number;
  totalBalance: number;
  childrenSummary: Array<{ name: string; balance: number; transactions: number }>;
} => {
  let totalTransactions = 0;
  let totalBalance = 0;

  const childrenSummary = children.map((child) => {
    const balance = child.transactions.reduce((acc, t) => {
      return acc + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);

    totalTransactions += child.transactions.length;
    totalBalance += balance;

    return {
      name: child.name,
      balance,
      transactions: child.transactions.length,
    };
  });

  return {
    totalTransactions,
    totalBalance,
    childrenSummary,
  };
};
