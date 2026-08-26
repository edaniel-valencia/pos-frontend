import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Customer } from '../../interfaces/customer';
import { CustomerService } from '../../services/customer.service';

@Component({
    selector: 'app-customers',
    imports: [FormsModule],
    templateUrl: './customers.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersComponent {

  private customerService = inject(CustomerService);
  private toastr = inject(ToastrService);

  readonly customers = this.customerService.customers;
  readonly search = signal('');
  readonly showModal = signal(false);
  readonly editingId = signal<number | null>(null);

  readonly filteredCustomers = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.customers();
    return this.customers().filter(c =>
      c.CUname.toLowerCase().includes(term) || c.CUemail.toLowerCase().includes(term)
    );
  });

  form = this.emptyForm();

  private emptyForm() {
    return { CUname: '', CUemail: '', CUphone: '', CUaddress: '' };
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.showModal.set(true);
  }

  openEdit(customer: Customer): void {
    this.editingId.set(customer.CUid);
    this.form = {
      CUname: customer.CUname,
      CUemail: customer.CUemail,
      CUphone: customer.CUphone,
      CUaddress: customer.CUaddress,
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  save(): void {
    if (!this.form.CUname.trim()) {
      this.toastr.error('El nombre es obligatorio', 'Error');
      return;
    }

    const editingId = this.editingId();
    if (editingId !== null) {
      this.customerService.update({ CUid: editingId, ...this.form });
      this.toastr.success('Cliente actualizado', 'Éxito');
    } else {
      this.customerService.add(this.form);
      this.toastr.success('Cliente creado', 'Éxito');
    }
    this.showModal.set(false);
  }

  remove(customer: Customer): void {
    if (!confirm(`¿Eliminar al cliente "${customer.CUname}"?`)) return;
    this.customerService.remove(customer.CUid);
    this.toastr.success('Cliente eliminado', 'Éxito');
  }
}
