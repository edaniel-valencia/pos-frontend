import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sale } from '../../interfaces/sale';
import { SaleService } from '../../services/sale.service';

@Component({
    selector: 'app-reports',
    imports: [DatePipe, FormsModule],
    templateUrl: './reports.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent {

  private saleService = inject(SaleService);

  readonly sales = this.saleService.sales;
  readonly expandedSaleId = signal<number | null>(null);

  readonly totalRevenue = computed(() => this.sales().reduce((sum, s) => sum + s.total, 0));
  readonly totalSubtotal = computed(() => this.sales().reduce((sum, s) => sum + s.subtotal, 0));
  readonly totalIva = computed(() => this.sales().reduce((sum, s) => sum + s.iva, 0));
  readonly averageTicket = computed(() => this.sales().length ? this.totalRevenue() / this.sales().length : 0);
  readonly itemsSold = computed(() =>
    this.sales().reduce((sum, s) => sum + s.items.reduce((qty, item) => qty + item.quantity, 0), 0)
  );

  toggleDetail(sale: Sale): void {
    this.expandedSaleId.update(id => id === sale.id ? null : sale.id);
  }
}
