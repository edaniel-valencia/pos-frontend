import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-users',
    imports: [FormsModule],
    templateUrl: './users.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {

  private userService = inject(UserService);
  private toastr = inject(ToastrService);

  readonly users = this.userService.users;
  readonly search = signal('');
  readonly showModal = signal(false);
  readonly editingUser = signal<User | null>(null);

  readonly filteredUsers = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.users();
    return this.users().filter(u =>
      u.Uname?.toLowerCase().includes(term) || u.Uemail.toLowerCase().includes(term)
    );
  });

  form = this.emptyForm();

  private emptyForm(): User {
    return { Uname: '', Ulastname: '', Uemail: '', Upassword: '', Ucredential: 'Vendedor' };
  }

  openCreate(): void {
    this.editingUser.set(null);
    this.form = this.emptyForm();
    this.showModal.set(true);
  }

  openEdit(user: User): void {
    this.editingUser.set(user);
    this.form = { ...user };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  save(): void {
    if (!this.form.Uname?.trim() || !this.form.Uemail.trim()) {
      this.toastr.error('Nombre y correo son obligatorios', 'Error');
      return;
    }

    const editingUser = this.editingUser();
    if (editingUser) {
      this.userService.update(editingUser, this.form);
      this.toastr.success('Usuario actualizado', 'Éxito');
    } else {
      this.userService.add(this.form);
      this.toastr.success('Usuario creado', 'Éxito');
    }
    this.showModal.set(false);
  }

  remove(user: User): void {
    if (!confirm(`¿Eliminar al usuario "${user.Uname}"?`)) return;
    this.userService.remove(user.Uemail);
    this.toastr.success('Usuario eliminado', 'Éxito');
  }
}
