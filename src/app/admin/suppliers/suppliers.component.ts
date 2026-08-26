import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Supplier } from '../../interfaces/supplier';
import { SupplierService } from '../../services/supplier.service';

@Component({
    selector: 'app-suppliers',
    imports: [FormsModule],
    templateUrl: './suppliers.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuppliersComponent {

  private supplierService = inject(SupplierService);
  private toastr = inject(ToastrService);

  readonly suppliers = this.supplierService.suppliers;
  readonly search = signal('');
  readonly showModal = signal(false);
  readonly editingId = signal<number | null>(null);

  readonly filteredSuppliers = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.suppliers();
    return this.suppliers().filter(s => s.Sname.toLowerCase().includes(term));
  });

  form = this.emptyForm();

  private emptyForm() {
    return { Sname: '', Scontact: '', Sphone: '', Semail: '' };
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.showModal.set(true);
  }

  openEdit(supplier: Supplier): void {
    this.editingId.set(supplier.Sid);
    this.form = {
      Sname: supplier.Sname,
      Scontact: supplier.Scontact,
      Sphone: supplier.Sphone,
      Semail: supplier.Semail,
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  save(): void {
    if (!this.form.Sname.trim()) {
      this.toastr.error('El nombre es obligatorio', 'Error');
      return;
    }

    const editingId = this.editingId();
    if (editingId !== null) {
      this.supplierService.update({ Sid: editingId, ...this.form });
      this.toastr.success('Proveedor actualizado', 'Éxito');
    } else {
      this.supplierService.add(this.form);
      this.toastr.success('Proveedor creado', 'Éxito');
    }
    this.showModal.set(false);
  }

  remove(supplier: Supplier): void {
    if (!confirm(`¿Eliminar al proveedor "${supplier.Sname}"?`)) return;
    this.supplierService.remove(supplier.Sid);
    this.toastr.success('Proveedor eliminado', 'Éxito');
  }
}
