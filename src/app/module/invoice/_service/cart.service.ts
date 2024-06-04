import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse } from '../../commons/_dto/api-response';
import { api_dwb_uri } from '../../../shared/uri/api-dwb-uri';
import { DtoCartDetails } from '../_dto/dto-cart-details';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private source = "/cart";
  private contadorSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private cartSubject: BehaviorSubject<DtoCartDetails[]> = new BehaviorSubject<DtoCartDetails[]>([]);

  constructor(private http: HttpClient) {
    this.loadInitialCart();
  }

  private loadInitialCart() {
    this.getCart().subscribe(res => {
      this.cartSubject.next(res.body || []);
      this.updateCartCount(res.body || []);
    });
  }

  getCount(): void {
    this.getCart().subscribe(res => {
      let n = 0;
      res.body?.forEach((item) => {
        n += item.quantity!;
      });
      this.contadorSubject.next(n);
    });
  }

  getCountObservable(): Observable<number> {
    return this.contadorSubject.asObservable();
  }

  getCartObservable(): Observable<DtoCartDetails[]> {
    return this.cartSubject.asObservable();
  }

  addToCart(cart: any): Observable<HttpResponse<ApiResponse>> {
    return this.http.post<ApiResponse>(api_dwb_uri + this.source, cart, { observe: 'response' }).pipe(
      tap(() => this.loadInitialCart())
    );
  }

  getCart(): Observable<HttpResponse<DtoCartDetails[]>> {
    return this.http.get<DtoCartDetails[]>(api_dwb_uri + this.source, { observe: 'response' });
  }

  deleteCart(): Observable<HttpResponse<ApiResponse>> {
    return this.http.delete<ApiResponse>(api_dwb_uri + this.source, { observe: 'response' }).pipe(
      tap(() => this.loadInitialCart())
    );
  }

  removeFromCart(cartId: number): Observable<HttpResponse<ApiResponse>> {
    return this.http.delete<ApiResponse>(`${api_dwb_uri + this.source}/${cartId}`, { observe: 'response' }).pipe(
      tap(() => this.loadInitialCart())
    );
  }

  private updateCartCount(cartItems: DtoCartDetails[]): void {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    this.contadorSubject.next(count);
  }
}
