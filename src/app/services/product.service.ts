import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Product } from '../interfaces/product';
import { environments } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private myAppUrl: string;
  private myAPIUrl: string;

  private readonly _products = signal<Product[]>([
    { Pid: 1, Pname: 'Gaseosa 500ml', Pdescription: 'Bebida carbonatada', Pprice: 1.5, Pstock: 48, Pcategory: 'Bebidas' },
    { Pid: 2, Pname: 'Papas fritas', Pdescription: 'Snack salado 150g', Pprice: 2.25, Pstock: 30, Pcategory: 'Snacks' },
    { Pid: 3, Pname: 'Pan integral', Pdescription: 'Pan de molde integral', Pprice: 1.8, Pstock: 15, Pcategory: 'Panadería' },
    { Pid: 4, Pname: 'Detergente 1L', Pdescription: 'Detergente líquido para ropa', Pprice: 3.9, Pstock: 5, Pcategory: 'Limpieza' },
  ]);
  readonly products = this._products.asReadonly();

  constructor(private http: HttpClient) {
    this.myAppUrl = environments.endpoint
    this.myAPIUrl = 'api/product';

  }

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.myAppUrl}${this.myAPIUrl}/read`).pipe(
      tap(products => this._products.set(products))
    );
  }

  add(product: Omit<Product, 'Pid'>): void {
    const id = Math.max(0, ...this._products().map(p => p.Pid)) + 1;
    this._products.update(list => [...list, { ...product, Pid: id }]);
  }

  update(product: Product): void {
    this._products.update(list => list.map(p => p.Pid === product.Pid ? product : p));
  }

  remove(id: number): void {
    this._products.update(list => list.filter(p => p.Pid !== id));
  }


}
