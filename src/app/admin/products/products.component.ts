import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { breakdownFromTotal, IVA_RATE } from '../../utils/tax';

@Component({
    selector: 'app-products',
    imports: [FormsModule],
    templateUrl: './products.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private toastr = inject(ToastrService);

  readonly products = this.productService.products;
  readonly categories = this.categoryService.categories;
  readonly ivaRate = IVA_RATE;

  readonly search = signal('');
  readonly showModal = signal(false);
  readonly editingId = signal<number | null>(null);

  readonly filteredProducts = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.products();
    return this.products().filter(p =>
      p.Pname.toLowerCase().includes(term) || (p.Pcategory ?? '').toLowerCase().includes(term)
    );
  });

  form: { Pname: string; Pdescription: string; Pprice: number; Pstock: number; Pcategory: string } = this.emptyForm();

  private emptyForm() {
    return { Pname: '', Pdescription: '', Pprice: 0, Pstock: 0, Pcategory: '' };
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.showModal.set(true);
  }

  openEdit(product: Product): void {
    this.editingId.set(product.Pid);
    this.form = {
      Pname: product.Pname,
      Pdescription: product.Pdescription,
      Pprice: product.Pprice ?? 0,
      Pstock: product.Pstock ?? 0,
      Pcategory: product.Pcategory ?? '',
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  save(): void {
    if (!this.form.Pname.trim()) {
      this.toastr.error('El nombre es obligatorio', 'Error');
      return;
    }

    const editingId = this.editingId();
    if (editingId !== null) {
      this.productService.update({ Pid: editingId, ...this.form });
      this.toastr.success('Producto actualizado', 'Éxito');
    } else {
      this.productService.add(this.form);
      this.toastr.success('Producto creado', 'Éxito');
    }
    this.showModal.set(false);
  }

  remove(product: Product): void {
    if (!confirm(`¿Eliminar el producto "${product.Pname}"?`)) return;
    this.productService.remove(product.Pid);
    this.toastr.success('Producto eliminado', 'Éxito');
  }

  priceBreakdown(price: number | undefined) {
    return breakdownFromTotal(price ?? 0);
  }
}
