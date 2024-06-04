import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceComponent } from './component/invoice/invoice.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    InvoiceComponent,
    InvoiceDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule // Si estás utilizando navegación
  ],
  exports: [
    InvoiceComponent,
    InvoiceDetailsComponent
  ]
})
export class InvoiceModule { }
