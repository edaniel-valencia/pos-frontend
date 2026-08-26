export interface SaleItem {
    Pid: number,
    Pname: string,
    Pprice: number,
    quantity: number
}

export interface Sale {
    id: number,
    date: Date,
    customer: string,
    paymentMethod: 'Efectivo' | 'Tarjeta' | 'Transferencia',
    items: SaleItem[],
    subtotal: number,
    iva: number,
    total: number
}
