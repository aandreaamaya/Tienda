import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../_model/invoice';
import { api_dwb_uri } from '../../../shared/uri/api-dwb-uri';
import { DtoInvoiceList } from '../_dto/dto-invoice-list';
import { ApiResponse } from '../../commons/_dto/api-response';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private source = "/invoice";

  constructor(private http: HttpClient) { }

  getInvoice(id: number): Observable<HttpResponse<Invoice>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Invoice>(`${api_dwb_uri}${this.source}/${id}`, { headers, observe: 'response' });
  }

  getInvoices(): Observable<HttpResponse<DtoInvoiceList[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<DtoInvoiceList[]>(`${api_dwb_uri}${this.source}`, { headers, observe: 'response' });
  }

  generateInvoice(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(api_dwb_uri + this.source, { observe: 'response' });
  }
  
  
}
