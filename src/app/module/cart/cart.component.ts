import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar el Router
import { CartService } from '../invoice/_service/cart.service';
import { DtoCartDetails } from '../invoice/_dto/dto-cart-details';
import { SwalMessages } from '../commons/_dto/swal-messages';
import { InvoiceService } from '../invoice/_service/invoice.service';
import { ApiResponse } from '../commons/_dto/api-response';
import { ProductImageService } from '../product/_service/product-image.service';

declare var bootstrap: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: DtoCartDetails[] = [];
  swal: SwalMessages = new SwalMessages();
  subtotal: number = 0;
  currentDate: string = new Date().toLocaleDateString();

  constructor(
    private cartService: CartService,
    private invoiceService: InvoiceService,
    private productImageService: ProductImageService, // Inyectar ProductImageService
    private router: Router // Inyectar el Router
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(response => {
      if (response.body) {
        this.cartItems = response.body;
        this.calculateSubtotal(this.cartItems); // Calcular el subtotal usando los datos obtenidos del carrito
        console.log('Elementos del carrito:', this.cartItems); // Línea de depuración para verificar los elementos del carrito
        this.cartItems.forEach(item => {
          this.getFirstImageOfProducts(item.product.product_id); // Cargar y asignar la primera imagen de cada producto
        });
      }
    });
  }

  getFirstImageOfProducts(product_id: number) {
    this.productImageService.getProductImages(product_id).subscribe({
      next: (v) => {
        const productImages = v.body! || [];
        console.log(productImages);

        // Encuentra el producto en el carrito y asigna la primera imagen
        const cartItemIndex = this.cartItems.findIndex(item => item.product.product_id === product_id);
        if (cartItemIndex !== -1 && productImages.length > 0) {
          this.cartItems[cartItemIndex].image = productImages[0].image;
        }
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // Mostrar mensaje de error
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
        this.calculateSubtotal(this.cartItems); // Recalcular el subtotal después de eliminar un ítem
        this.cartService.getCount();
      }
    });
  }

  calculateSubtotal(cartItems: DtoCartDetails[]): void {
    this.subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }

  quantityUp(item: DtoCartDetails): void {
    item.quantity++;
    this.calculateSubtotal(this.cartItems);
  }

  quantityDown(item: DtoCartDetails): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateSubtotal(this.cartItems);
    }
  }

  openBuyModal(): void {
    const buyModal = new bootstrap.Modal(document.getElementById('buyModal'));
    buyModal.show();
  }

  hideBuyModal(): void {
    const buyModal = new bootstrap.Modal(document.getElementById('buyModal'));
    buyModal.hide();
  }

  buyNow(): void {
    console.log("Intentando finalizar la compra");
    this.invoiceService.generateInvoice().subscribe(
      (res) => {
        this.cartService.deleteCart()

        this.router.navigate(['compra']); // Redirigir a la página de compra exitosa
        this.hideBuyModal()

      },
      (err) => {
        this.swal.errorMessage('Error al generar la factura');
      }
    );
  }
}
