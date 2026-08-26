import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../interfaces/product';
import { SaleItem, Sale } from '../../interfaces/sale';
import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { SaleService } from '../../services/sale.service';
import { CashRegisterService } from '../../services/cash-register.service';
import { breakdownFromTotal, IVA_RATE } from '../../utils/tax';

@Component({
    selector: 'app-sales',
    imports: [FormsModule],
    templateUrl: './sales.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesComponent {

  private productService = inject(ProductService);
  private customerService = inject(CustomerService);
  private saleService = inject(SaleService);
  private cashRegisterService = inject(CashRegisterService);
  private toastr = inject(ToastrService);

  readonly products = this.productService.products;
  readonly customers = this.customerService.customers;
  readonly cashRegister = this.cashRegisterService;

  readonly search = signal('');
  readonly cart = signal<SaleItem[]>([]);
  readonly customer = signal('Consumidor final');
  readonly paymentMethod = signal<Sale['paymentMethod']>('Efectivo');

  readonly filteredProducts = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.products();
    return this.products().filter(p => p.Pname.toLowerCase().includes(term));
  });

  readonly ivaRate = IVA_RATE;

  readonly total = computed(() =>
    this.cart().reduce((sum, item) => sum + item.Pprice * item.quantity, 0)
  );

  readonly breakdown = computed(() => breakdownFromTotal(this.total()));

  readonly itemCount = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  stockFor(productId: number): number {
    const product = this.products().find(p => p.Pid === productId);
    return product?.Pstock ?? 0;
  }

  addToCart(product: Product): void {
    const inCart = this.cart().find(i => i.Pid === product.Pid);
    const currentQty = inCart?.quantity ?? 0;
    if (currentQty >= (product.Pstock ?? 0)) {
      this.toastr.error('No hay suficiente stock', 'Error');
      return;
    }

    if (inCart) {
      this.cart.update(list => list.map(i => i.Pid === product.Pid ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      this.cart.update(list => [...list, { Pid: product.Pid, Pname: product.Pname, Pprice: product.Pprice ?? 0, quantity: 1 }]);
    }
  }

  incrementItem(item: SaleItem): void {
    if (item.quantity >= this.stockFor(item.Pid)) {
      this.toastr.error('No hay suficiente stock', 'Error');
      return;
    }
    this.cart.update(list => list.map(i => i.Pid === item.Pid ? { ...i, quantity: i.quantity + 1 } : i));
  }

  decrementItem(item: SaleItem): void {
    if (item.quantity <= 1) {
      this.removeItem(item);
      return;
    }
    this.cart.update(list => list.map(i => i.Pid === item.Pid ? { ...i, quantity: i.quantity - 1 } : i));
  }

  removeItem(item: SaleItem): void {
    this.cart.update(list => list.filter(i => i.Pid !== item.Pid));
  }

  clearCart(): void {
    this.cart.set([]);
  }

  checkout(): void {
    if (this.cart().length === 0) {
      this.toastr.error('El carrito está vacío', 'Error');
      return;
    }
    if (!this.cashRegister.isOpen()) {
      this.toastr.error('Debes abrir la caja antes de vender', 'Caja cerrada');
      return;
    }

    const items = this.cart();
    const sale = this.saleService.registerSale(this.customer() || 'Consumidor final', this.paymentMethod(), items);

    for (const item of items) {
      const product = this.products().find(p => p.Pid === item.Pid);
      if (product) {
        this.productService.update({ ...product, Pstock: (product.Pstock ?? 0) - item.quantity });
      }
    }

    if (this.paymentMethod() === 'Efectivo') {
      this.cashRegisterService.addMovement('Ingreso', `Venta #${sale.id}`, sale.total);
    }

    this.toastr.success(`Venta #${sale.id} registrada por $${sale.total.toFixed(2)}`, 'Venta realizada');
    this.clearCart();
    this.customer.set('Consumidor final');
  }
}
