/**
 * Export utilities — PNG, SVG, PDF, CSV, clipboard, print
 */

import { toPng, toSvg } from 'html-to-image';
import jsPDF from 'jspdf';
import type { CalculationResult, DifferenceTableRow } from '@/types/calculator';

/** Generate a timestamped filename */
function makeFilename(method: string, targetX: number, ext: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const methodName = method === 'newton-forward' ? 'NewtonForward' : 'NewtonBackward';
  return `${methodName}_x${targetX}_${date}.${ext}`;
}

/** Download a Blob as a file */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Download a data URL as a file */
function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ── Image Exports ──

export async function exportToPng(
  element: HTMLElement,
  method: string,
  targetX: number,
) {
  const dataUrl = await toPng(element, {
    quality: 1,
    pixelRatio: 3,
    backgroundColor: '#ffffff',
  });
  downloadDataUrl(dataUrl, makeFilename(method, targetX, 'png'));
}

export async function exportToSvg(
  element: HTMLElement,
  method: string,
  targetX: number,
) {
  const dataUrl = await toSvg(element, { backgroundColor: '#ffffff' });
  downloadDataUrl(dataUrl, makeFilename(method, targetX, 'svg'));
}

// ── PDF Export ──

export async function exportToPdf(
  element: HTMLElement,
  method: string,
  targetX: number,
) {
  const dataUrl = await toPng(element, {
    quality: 1,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  });

  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve) => (img.onload = resolve));

  const pdf = new jsPDF({
    orientation: img.width > img.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [img.width, img.height],
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
  pdf.save(makeFilename(method, targetX, 'pdf'));
}

// ── CSV Export ──

export function exportDifferenceTableCsv(
  table: DifferenceTableRow[],
  method: string,
  targetX: number,
) {
  if (table.length === 0) return;

  const maxDiffOrder = table[0].differences.length;
  const headers = ['x', 'y'];
  for (let k = 1; k <= maxDiffOrder; k++) {
    const symbol = k === 1 ? 'Δy' : `Δ${k}y`;
    headers.push(symbol);
  }

  const rows = table.map((row) => {
    const cells = [String(row.x), String(row.y)];
    row.differences.forEach((d) => cells.push(d !== null ? String(d) : ''));
    return cells.join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, makeFilename(method, targetX, 'csv'));
}

// ── Full Result CSV ──

export function exportResultCsv(result: CalculationResult) {
  const lines: string[] = [];
  lines.push(`Method,${result.method}`);
  lines.push(`Target x,${result.targetX}`);
  lines.push(`h,${result.h}`);
  lines.push(`u,${result.u}`);
  lines.push(`Derivative,${result.derivative}`);
  lines.push(`Execution Time (ms),${result.executionTimeMs}`);
  lines.push('');
  lines.push('--- Difference Table ---');

  const maxDiffOrder = result.differenceTable[0]?.differences.length || 0;
  const headers = ['x', 'y'];
  for (let k = 1; k <= maxDiffOrder; k++) headers.push(`Δ${k > 1 ? k : ''}y`);
  lines.push(headers.join(','));

  result.differenceTable.forEach((row) => {
    const cells = [String(row.x), String(row.y)];
    row.differences.forEach((d) => cells.push(d !== null ? String(d) : ''));
    lines.push(cells.join(','));
  });

  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, makeFilename(result.method, result.targetX, 'csv'));
}

// ── Clipboard ──

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function formatResultForCopy(result: CalculationResult): string {
  const lines: string[] = [];
  const methodName =
    result.method === 'newton-forward'
      ? "Newton's Forward Difference Method"
      : "Newton's Backward Difference Method";

  lines.push(`═══ ${methodName} ═══`);
  lines.push(`Target x = ${result.targetX}`);
  lines.push(`h = ${result.h}`);
  lines.push(`u = ${result.u}`);
  lines.push(`f'(${result.targetX}) = ${result.derivative}`);
  lines.push(`Execution Time: ${result.executionTimeMs}ms`);

  return lines.join('\n');
}

// ── Print ──

export function printElement(element: HTMLElement) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Numerical Differentiation Result</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css">
        <style>
          body { font-family: 'Inter', -apple-system, sans-serif; padding: 40px; color: #1D1D1F; }
          table { border-collapse: collapse; width: 100%; margin: 16px 0; }
          th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: center; }
          th { background: #f5f5f7; font-weight: 600; }
        </style>
      </head>
      <body>${element.innerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}
