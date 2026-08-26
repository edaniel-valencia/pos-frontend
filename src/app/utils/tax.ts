export const IVA_RATE = 0.15;

export interface TaxBreakdown {
  subtotal: number;
  iva: number;
  total: number;
}

/** A partir de un precio final (IVA incluido), desglosa base imponible e IVA (15%). */
export function breakdownFromTotal(total: number): TaxBreakdown {
  const subtotal = total / (1 + IVA_RATE);
  return { subtotal, iva: total - subtotal, total };
}
