import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { SaleService } from '../../services/sale.service';
import { CashRegisterService } from '../../services/cash-register.service';

@Component({
    selector: 'app-home',
    imports: [RouterLink, DatePipe],
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  private productService = inject(ProductService);
  private customerService = inject(CustomerService);
  private saleService = inject(SaleService);

  readonly products = this.productService.products;
  readonly customers = this.customerService.customers;
  readonly sales = this.saleService.sales;
  readonly cashRegister = inject(CashRegisterService);

  readonly todaySales = computed(() => this.sales().filter(s => this.isToday(s.date)));
  readonly todayRevenue = computed(() => this.todaySales().reduce((sum, s) => sum + s.total, 0));
  readonly lowStockProducts = computed(() => this.products().filter(p => (p.Pstock ?? 0) <= 10));
  readonly recentSales = computed(() => this.sales().slice(0, 5));

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear()
      && date.getMonth() === today.getMonth()
      && date.getDate() === today.getDate();
  }
}
