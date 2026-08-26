import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private myAppUrl: string;
  private myAPIUrl: string;

  private readonly _users = signal<User[]>([
    { Uname: 'Administrador', Ulastname: 'General', Uemail: 'admin@example.com', Upassword: '', Ucredential: 'Administrador' },
    { Uname: 'Ana', Ulastname: 'Ruiz', Uemail: 'ana.ruiz@example.com', Upassword: '', Ucredential: 'Cajero' },
    { Uname: 'Luis', Ulastname: 'Mendoza', Uemail: 'luis.mendoza@example.com', Upassword: '', Ucredential: 'Vendedor' },
  ]);
  readonly users = this._users.asReadonly();

  constructor(private http: HttpClient) {
    this.myAppUrl = environments.endpoint
    this.myAPIUrl = 'api/user';

  }

  signIn(user: User): Observable<any>{
    return this.http.post(`${this.myAppUrl}${this.myAPIUrl}/register`, user);
  }
  login(user: User): Observable<string>{
    return this.http.post<string>(`${this.myAppUrl}${this.myAPIUrl}/login`, user);
  }

  add(user: User): void {
    this._users.update(list => [...list, user]);
  }

  update(original: User, updated: User): void {
    this._users.update(list => list.map(u => u.Uemail === original.Uemail ? updated : u));
  }

  remove(email: string): void {
    this._users.update(list => list.filter(u => u.Uemail !== email));
  }

}
