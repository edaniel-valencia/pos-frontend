import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../interfaces/category';
import { CategoryService } from '../../services/category.service';

@Component({
    selector: 'app-categories',
    imports: [FormsModule],
    templateUrl: './categories.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {

  private categoryService = inject(CategoryService);
  private toastr = inject(ToastrService);

  readonly categories = this.categoryService.categories;
  readonly search = signal('');
  readonly showModal = signal(false);
  readonly editingId = signal<number | null>(null);

  readonly filteredCategories = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.categories();
    return this.categories().filter(c => c.Cname.toLowerCase().includes(term));
  });

  form = this.emptyForm();

  private emptyForm() {
    return { Cname: '', Cdescription: '' };
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.showModal.set(true);
  }

  openEdit(category: Category): void {
    this.editingId.set(category.Cid);
    this.form = { Cname: category.Cname, Cdescription: category.Cdescription };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  save(): void {
    if (!this.form.Cname.trim()) {
      this.toastr.error('El nombre es obligatorio', 'Error');
      return;
    }

    const editingId = this.editingId();
    if (editingId !== null) {
      this.categoryService.update({ Cid: editingId, ...this.form });
      this.toastr.success('Categoría actualizada', 'Éxito');
    } else {
      this.categoryService.add(this.form);
      this.toastr.success('Categoría creada', 'Éxito');
    }
    this.showModal.set(false);
  }

  remove(category: Category): void {
    if (!confirm(`¿Eliminar la categoría "${category.Cname}"?`)) return;
    this.categoryService.remove(category.Cid);
    this.toastr.success('Categoría eliminada', 'Éxito');
  }
}
