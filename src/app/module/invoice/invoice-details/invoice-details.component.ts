import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../_service/invoice.service';
import { Location } from '@angular/common';
import { Invoice } from '../_model/invoice';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalMessages } from '../../commons/_dto/swal-messages';
import { Item } from '../_model/item';

@Component({
  selector: 'invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {

  swal: SwalMessages = new SwalMessages();
  invoiceDetails: Invoice = new Invoice();
  invoiceId: number = 0;
  folio: string = '';
  subtotal: number = 0;

  constructor(
    private invoiceService: InvoiceService,
    private location: Location,
    private rutaActiva: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkUserRole();
    this.invoiceId = this.rutaActiva.snapshot.params['id'];
    this.folio = this.generateRandomString(10);
    this.loadInvoice();
  }

  checkUserRole(): void {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user')!);
      if (user.rol !== 'ADMIN') {
        this.router.navigate(['/']);
      }
    }
  }

  loadInvoice(): void {
    this.invoiceService.getInvoice(this.invoiceId).subscribe({
      next: (response) => {
        this.invoiceDetails = response.body!;
        this.calculateSubtotal(this.invoiceDetails.items);
        console.log(this.invoiceDetails);
      },
      error: (error) => {
        console.error('Error:', error);
        this.swal.errorMessage('Error loading invoice details.');
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    const hyphenPosition = Math.floor(Math.random() * length);

    for (let i = 0; i < length; i++) {
      if (i === hyphenPosition) {
        result += '-';
      } else {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
    }
    return result;
  }

  calculateSubtotal(items: Item[]): void {
    if (items) {
      this.subtotal = items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
    }
  }
}
