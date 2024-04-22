import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './component/category/category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailComponent } from './component/product-detail/product-detail.component';
import { NgxPhotoEditorModule } from 'ngx-photo-editor';
import { ProductComponent } from './component/product/product.component';
@NgModule({
  declarations: [
    CategoryComponent,
    ProductDetailComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPhotoEditorModule
  ]
})
export class ProductModule { }
