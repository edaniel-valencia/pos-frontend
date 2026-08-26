import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './admin/home/home.component';
import { SalesComponent } from './admin/sales/sales.component';
import { ProductsComponent } from './admin/products/products.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { CustomersComponent } from './admin/customers/customers.component';
import { SuppliersComponent } from './admin/suppliers/suppliers.component';
import { CashRegisterComponent } from './admin/cash-register/cash-register.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { UsersComponent } from './admin/users/users.component';

export const routes: Routes = [
  { path: '', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'ventas', component: SalesComponent },
      { path: 'productos', component: ProductsComponent },
      { path: 'categorias', component: CategoriesComponent },
      { path: 'clientes', component: CustomersComponent },
      { path: 'proveedores', component: SuppliersComponent },
      { path: 'caja', component: CashRegisterComponent },
      { path: 'reportes', component: ReportsComponent },
      { path: 'usuarios', component: UsersComponent },
    ],
  },
];
