import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
    selector: 'app-dashboard',
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: './dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  readonly sidebarOpen = signal(false);
  readonly userMenuOpen = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Inicio', route: '/dashboard', icon: 'home' },
    { label: 'Ventas', route: '/dashboard/ventas', icon: 'cart' },
    { label: 'Productos', route: '/dashboard/productos', icon: 'box' },
    { label: 'Categorías', route: '/dashboard/categorias', icon: 'tag' },
    { label: 'Clientes', route: '/dashboard/clientes', icon: 'users' },
    { label: 'Proveedores', route: '/dashboard/proveedores', icon: 'truck' },
    { label: 'Caja', route: '/dashboard/caja', icon: 'cash' },
    { label: 'Reportes', route: '/dashboard/reportes', icon: 'chart' },
    { label: 'Usuarios', route: '/dashboard/usuarios', icon: 'user-cog' },
  ];

  constructor(private router: Router, private toastr: ToastrService) {}

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
  }

  logout(): void {
    localStorage.removeItem('myToken');
    this.toastr.success('Sesión cerrada', 'Hasta luego');
    this.router.navigate(['/signin']);
  }
}
