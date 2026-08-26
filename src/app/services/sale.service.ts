import { Injectable, signal } from '@angular/core';
import { Sale, SaleItem } from '../interfaces/sale';
import { breakdownFromTotal } from '../utils/tax';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private readonly _sales = signal<Sale[]>([
    {
      id: 1,
      date: new Date(Date.now() - 1000 * 60 * 60 * 26),
      customer: 'María Pérez',
      paymentMethod: 'Efectivo',
      items: [
        { Pid: 1, Pname: 'Gaseosa 500ml', Pprice: 1.5, quantity: 3 },
        { Pid: 2, Pname: 'Papas fritas', Pprice: 2.25, quantity: 2 },
      ],
      ...breakdownFromTotal(9),
    },
    {
      id: 2,
      date: new Date(Date.now() - 1000 * 60 * 60 * 3),
      customer: 'Carlos Gómez',
      paymentMethod: 'Tarjeta',
      items: [
        { Pid: 3, Pname: 'Pan integral', Pprice: 1.8, quantity: 1 },
      ],
      ...breakdownFromTotal(1.8),
    },
  ]);
  readonly sales = this._sales.asReadonly();

  registerSale(customer: string, paymentMethod: Sale['paymentMethod'], items: SaleItem[]): Sale {
    const total = items.reduce((sum, item) => sum + item.Pprice * item.quantity, 0);
    const id = Math.max(0, ...this._sales().map(s => s.id)) + 1;
    const sale: Sale = { id, date: new Date(), customer, paymentMethod, items, ...breakdownFromTotal(total) };
    this._sales.update(list => [sale, ...list]);
    return sale;
  }
}
