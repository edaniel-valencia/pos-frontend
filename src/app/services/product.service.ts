import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import { environments } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private myAppUrl: string;
  private myAPIUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environments.endpoint
    this.myAPIUrl = 'api/product';
    
  }

  getProducts(): Observable<Product[]>{
    console.log(`${this.myAppUrl}${this.myAPIUrl}/read`);
    return this.http.get<Product[]>(`${this.myAppUrl}${this.myAPIUrl}/read`);
    
    //USAR PARA LA PRIMERA PARTE

    // const token = localStorage.getItem('token')
    // const headers = new HttpHeaders().set('Authorization', `Bearer  ${token}`)
    // return this.http.get<Product[]>(`${this.myAppUrl}${this.myAPIUrl}/product/getProducts`, {headers: headers});

    // NETWORK - fetch/xhr - getProduc

    
  }
 
  
}
