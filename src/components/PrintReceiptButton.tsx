"use client";

import { PrinterIcon } from "@/components/icons";

/**
 * Prints the order page. The heavy lifting is in the `@media print` rules in
 * globals.css, which strip the navigation, footer and buttons so the sheet
 * that comes out is just the receipt.
 */
export default function PrintReceiptButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print flex items-center gap-2 rounded-lg border border-border-strong px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface-hover"
    >
      <PrinterIcon className="h-4 w-4" />
      Print receipt
    </button>
  );
}
