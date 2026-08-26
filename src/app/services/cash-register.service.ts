import { Injectable, computed, signal } from '@angular/core';
import { CashMovement } from '../interfaces/cash-movement';

@Injectable({
  providedIn: 'root'
})
export class CashRegisterService {

  private readonly _isOpen = signal(false);
  private readonly _openingAmount = signal(0);
  private readonly _movements = signal<CashMovement[]>([]);

  readonly isOpen = this._isOpen.asReadonly();
  readonly openingAmount = this._openingAmount.asReadonly();
  readonly movements = this._movements.asReadonly();

  readonly balance = computed(() => {
    const movementsTotal = this._movements().reduce(
      (sum, m) => sum + (m.type === 'Ingreso' ? m.amount : -m.amount),
      0
    );
    return this._openingAmount() + movementsTotal;
  });

  openRegister(amount: number): void {
    this._isOpen.set(true);
    this._openingAmount.set(amount);
    this._movements.set([]);
  }

  closeRegister(): void {
    this._isOpen.set(false);
    this._openingAmount.set(0);
    this._movements.set([]);
  }

  addMovement(type: CashMovement['type'], concept: string, amount: number): void {
    const id = Math.max(0, ...this._movements().map(m => m.id)) + 1;
    this._movements.update(list => [{ id, date: new Date(), type, concept, amount }, ...list]);
  }
}
