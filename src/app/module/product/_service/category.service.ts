import { Injectable } from '@angular/core';
import { Category } from '..//_model/category'
import { HttpClient, HttpResponse } from '@angular/common/http';
import { api_dwb_uri } from '../../../shared/uri/api-dwb-uri';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  private source = "/category";

  constructor(
    private http: HttpClient
  ) { }

  getCategories(): Observable<HttpResponse<Category[]>>{
    return this.http.get<Category[]>(api_dwb_uri + this.source, { observe: 'response' });
  }

  createCategory(category: any): Observable<HttpResponse<any>> {
    return this.http.post(api_dwb_uri + this.source, category, { observe: 'response' });
  }

}