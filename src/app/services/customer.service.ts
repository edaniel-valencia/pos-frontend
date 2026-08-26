import { Injectable, signal } from '@angular/core';
import { Customer } from '../interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly _customers = signal<Customer[]>([
    { CUid: 1, CUname: 'María Pérez', CUemail: 'maria.perez@example.com', CUphone: '099-123-4567', CUaddress: 'Av. Siempre Viva 123' },
    { CUid: 2, CUname: 'Carlos Gómez', CUemail: 'carlos.gomez@example.com', CUphone: '098-765-4321', CUaddress: 'Calle Falsa 456' },
    { CUid: 3, CUname: 'Lucía Torres', CUemail: 'lucia.torres@example.com', CUphone: '097-555-1122', CUaddress: 'Av. Amazonas 789' },
  ]);
  readonly customers = this._customers.asReadonly();

  add(customer: Omit<Customer, 'CUid'>): void {
    const id = Math.max(0, ...this._customers().map(c => c.CUid)) + 1;
    this._customers.update(list => [...list, { ...customer, CUid: id }]);
  }

  update(customer: Customer): void {
    this._customers.update(list => list.map(c => c.CUid === customer.CUid ? customer : c));
  }

  remove(id: number): void {
    this._customers.update(list => list.filter(c => c.CUid !== id));
  }
}
