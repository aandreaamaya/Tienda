import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../commons/_dto/api-response';
import { api_dwb_uri } from '../../../shared/uri/api-dwb-uri';
import { ProductImage } from '../_model/product-image';

@Injectable({
  providedIn: 'root'
})
export class ProductImageService {

  private source = "/product-image";

  constructor(
    private http: HttpClient
  ) { }

  updateProductImage(product_image: ProductImage): Observable<HttpResponse<ApiResponse>> {
    return this.http.put<ApiResponse>(api_dwb_uri + this.source, product_image, { observe: 'response' });
  }
}
