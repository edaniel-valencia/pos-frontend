export interface CashMovement {
    id: number,
    date: Date,
    type: 'Ingreso' | 'Egreso',
    concept: string,
    amount: number
}
