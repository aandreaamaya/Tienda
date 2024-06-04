import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductModule } from './module/product/product.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationModule } from './module/authentication/authentication.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LayoutModule } from './module/layout/layout.module';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { CommonsModule } from './module/commons/commons.module'
import { NgxPhotoEditorModule } from 'ngx-photo-editor';
import { HomeComponent } from './module/home/home.component';
import { CommonModule } from '@angular/common'; 

import { MaquillajeComponent } from './module/product/component/ProductosPorCategoria/maquillaje.component';
import { CartComponent } from './module/cart/cart.component';
import { InvoiceModule } from './module/invoice/invoice.module';
import { CompraComponent } from './module/cart/compra/compra.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MaquillajeComponent,
    CartComponent,
    CompraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProductModule,
    AuthenticationModule, 
    CommonsModule,     
    NgxPhotoEditorModule,
    CommonModule,
    ReactiveFormsModule,
    InvoiceModule
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }