import { Component, OnInit } from '@angular/core';
import { CartService } from '../invoice/_service/cart.service';
import { DtoCartDetails } from '../invoice/_dto/dto-cart-details';
import { SwalMessages } from '../commons/_dto/swal-messages';
import { InvoiceService } from '../invoice/_service/invoice.service'; // Import InvoiceService
import { ApiResponse } from '../commons/_dto/api-response'; // Import ApiResponse
import { ProductImageService } from '../product/_service/product-image.service'; // Import ProductImageService
import { ProductImage } from '../product/_model/product-image';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: DtoCartDetails[] = [];
  swal: SwalMessages = new SwalMessages();
  subtotal: number = 0;
  productImages: ProductImage[] = [];
  activeImageIndex = 0;
  productNameImages: string = "";

  constructor(
    private cartService: CartService, 
    private invoiceService: InvoiceService,
    private imageService: ProductImageService // Inject ProductImageService
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(response => {
      if (response.body) {
        this.cartItems = response.body;
        this.calculateSubtotal(this.cartItems); // Calculate the subtotal using the retrieved cart data
        console.log(this.cartItems);
      }
    });
  }

  deleteCart(): void {
    this.cartService.deleteCart().subscribe(response => {
      if (response.body) {
        this.cartItems = [];
        this.subtotal = 0;
        this.swal.successMessage("El carrito se vació correctamente");
        this.cartService.getCount();
      }
    });
  }

  removeFromCart(cartId: number): void {
    this.cartService.removeFromCart(cartId).subscribe(response => {
      if (response.body) {
        this.swal.successMessage("Producto eliminado del carrito");
        this.cartItems = this.cartItems.filter(item => item.cart_id !== cartId);
        this.calculateSubtotal(this.cartItems); // Recalculate the subtotal after removing an item
        this.cartService.getCount();
      }
    });
  }

  calculateSubtotal(cartItems: DtoCartDetails[]): void {
    this.subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }

  buyNow(): void {
    console.log("Attempting to finish purchase");
    this.swal.confirmMessage.fire({
      title: 'Estas a punto de confirmar tu compra',
      background: '#fffff',
      color: 'gray',
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.invoiceService.generateInvoice().subscribe(
          (res) => {
            this.swal.successMessage('Invoice generated successfully');
            this.cartService.deleteCart().subscribe(() => {
              console.log("Cart successfully deleted");
              this.cartService.getCount();
              this.loadCart();
            });
          },
          (err) => {
            this.swal.errorMessage('Error generating invoice');
          }
        );
      }
    });
  }

  // Method to load product images
  getProductImages(product_id: number) {
    this.imageService.getProductImages(product_id).subscribe({
      next: (v) => {
        this.productImages = v.body!;
        console.log(this.productImages);
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  // Method to set active image index
  setActiveImage(index: number): void {
    this.activeImageIndex = index;
  }


}
