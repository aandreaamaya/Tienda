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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProductModule,
    AuthenticationModule, 
    CommonsModule,     
    NgxPhotoEditorModule,
    CommonModule
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }