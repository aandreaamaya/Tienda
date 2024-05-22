import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './component/category/category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ProductDetailComponent } from './component/product-detail/product-detail.component';
import { NgxPhotoEditorModule } from 'ngx-photo-editor';
import { ProductComponent } from './component/product/product.component';
import { DetalleComponent } from './component/detalle/detalle.component';
import { AuthenticationModule } from "../authentication/authentication.module";
@NgModule({
  declarations: [
    CategoryComponent,
    // ProductDetailComponent,
    ProductComponent,
    DetalleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPhotoEditorModule,
    AuthenticationModule
  ]
})
export class ProductModule { }
