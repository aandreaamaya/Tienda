import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { FooterComponent } from './app-layout/footer/footer.component';
import { RouterModule } from '@angular/router';
import { AppLayoutRoutes } from './app-layout/app-layout.routing';
import { Navbar2Component } from './app-layout/navbar2/navbar2.component';
import { ProductModule } from '../product/product.module';
import { AuthenticationModule } from '../authentication/authentication.module';



@NgModule({
  declarations: [
    AppLayoutComponent,
    FooterComponent,
    Navbar2Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AppLayoutRoutes),
    ProductModule,
    AuthenticationModule
  ]
})
export class LayoutModule { }
