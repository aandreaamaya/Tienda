import { Component } from '@angular/core';
import { SwalMessages } from '../../../commons/_dto/swal-messages';
import { DtoInvoiceList } from '../../_dto/dto-invoice-list';
import { InvoiceService } from '../../_service/invoice.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

declare var $: any; // JQuery

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {

  invoices: DtoInvoiceList[] = []; // Invoice list
  isAdmin: boolean = false; // isAdmin
  swal: SwalMessages = new SwalMessages(); // swal messages

  constructor(
    private invoiceService: InvoiceService,
    private location: Location,
    private router: Router
  ){}

  ngOnInit() {
    this.getInvoices();
    if (localStorage.getItem('user')) {
      let user = JSON.parse(localStorage.getItem('user')!);
      if (user.rol == 'ADMIN') {
        this.isAdmin = true;
      } else {
        this.router.navigate(['/']);
        this.isAdmin = false;
      }
      console.log(this.isAdmin);
    }
  }

  getInvoices(){
    this.invoiceService.getInvoices().subscribe({
      next: (v) => {
        this.invoices = v.body!;
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }
  showDetail(id: number) {
    this.router.navigate([`factura/${id}`]);
  }

}
