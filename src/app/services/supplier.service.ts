import { Injectable, signal } from '@angular/core';
import { Supplier } from '../interfaces/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private readonly _suppliers = signal<Supplier[]>([
    { Sid: 1, Sname: 'Distribuidora del Valle', Scontact: 'Jorge Ramírez', Sphone: '02-234-5678', Semail: 'ventas@distvalle.com' },
    { Sid: 2, Sname: 'Comercial Andina', Scontact: 'Paola Suárez', Sphone: '04-345-6789', Semail: 'contacto@comercialandina.com' },
  ]);
  readonly suppliers = this._suppliers.asReadonly();

  add(supplier: Omit<Supplier, 'Sid'>): void {
    const id = Math.max(0, ...this._suppliers().map(s => s.Sid)) + 1;
    this._suppliers.update(list => [...list, { ...supplier, Sid: id }]);
  }

  update(supplier: Supplier): void {
    this._suppliers.update(list => list.map(s => s.Sid === supplier.Sid ? supplier : s));
  }

  remove(id: number): void {
    this._suppliers.update(list => list.filter(s => s.Sid !== id));
  }
}
