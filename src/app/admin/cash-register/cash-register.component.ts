import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CashMovement } from '../../interfaces/cash-movement';
import { CashRegisterService } from '../../services/cash-register.service';

@Component({
    selector: 'app-cash-register',
    imports: [FormsModule, DatePipe],
    templateUrl: './cash-register.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashRegisterComponent {

  private cashRegisterService = inject(CashRegisterService);
  private toastr = inject(ToastrService);

  readonly isOpen = this.cashRegisterService.isOpen;
  readonly openingAmount = this.cashRegisterService.openingAmount;
  readonly movements = this.cashRegisterService.movements;
  readonly balance = this.cashRegisterService.balance;

  readonly openAmountInput = signal(0);
  readonly movementType = signal<CashMovement['type']>('Ingreso');
  readonly movementConcept = signal('');
  readonly movementAmount = signal(0);

  open(): void {
    if (this.openAmountInput() < 0) {
      this.toastr.error('El monto no puede ser negativo', 'Error');
      return;
    }
    this.cashRegisterService.openRegister(this.openAmountInput());
    this.toastr.success('Caja abierta', 'Éxito');
    this.openAmountInput.set(0);
  }

  close(): void {
    if (!confirm('¿Cerrar la caja? Se perderá el detalle de movimientos actuales.')) return;
    this.cashRegisterService.closeRegister();
    this.toastr.success('Caja cerrada', 'Éxito');
  }

  addMovement(): void {
    if (!this.movementConcept().trim() || this.movementAmount() <= 0) {
      this.toastr.error('Completa el concepto y un monto válido', 'Error');
      return;
    }
    this.cashRegisterService.addMovement(this.movementType(), this.movementConcept(), this.movementAmount());
    this.toastr.success('Movimiento registrado', 'Éxito');
    this.movementConcept.set('');
    this.movementAmount.set(0);
  }
}
