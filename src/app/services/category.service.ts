import { Injectable, signal } from '@angular/core';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly _categories = signal<Category[]>([
    { Cid: 1, Cname: 'Bebidas', Cdescription: 'Bebidas frías y calientes' },
    { Cid: 2, Cname: 'Snacks', Cdescription: 'Botanas y golosinas' },
    { Cid: 3, Cname: 'Limpieza', Cdescription: 'Artículos de limpieza del hogar' },
    { Cid: 4, Cname: 'Panadería', Cdescription: 'Pan y repostería' },
  ]);
  readonly categories = this._categories.asReadonly();

  add(category: Omit<Category, 'Cid'>): void {
    const id = Math.max(0, ...this._categories().map(c => c.Cid)) + 1;
    this._categories.update(list => [...list, { ...category, Cid: id }]);
  }

  update(category: Category): void {
    this._categories.update(list => list.map(c => c.Cid === category.Cid ? category : c));
  }

  remove(id: number): void {
    this._categories.update(list => list.filter(c => c.Cid !== id));
  }
}
