import { Component, OnInit } from '@angular/core';
import { CartService } from '../invoice/_service/cart.service';
import { Product } from '../product/_model/product';
import { DtoCartDetails } from '../invoice/_dto/dto-cart-details';
import { SwalMessages } from '../commons/_dto/swal-messages';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  cartItems: DtoCartDetails[] = [];
  swal: SwalMessages = new SwalMessages();
  subtotal: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(response => {
      if (response.body) {
        this.cartItems = response.body;
        this.calculateSubtotal(this.cartItems); // Calcular el subtotal utilizando los datos del carrito obtenidos
        console.log(this.cartItems);
      }
    });
  }

  deleteCart(): void {
    this.cartService.deleteCart().subscribe(response => {
      if (response.body) {
        this.cartItems = [];
        this.subtotal = 0;
        this.swal.successMessage("El carrito se vació correctamente!");
        this.cartService.getCount();
      }
    });
  }

  removeFromCart(cartId: number): void {
    this.cartService.removeFromCart(cartId).subscribe(response => {
      if (response.body) {
        this.swal.successMessage("Producto eliminado del carrito!");
        this.cartItems = this.cartItems.filter(item => item.cart_id !== cartId);
        this.calculateSubtotal(this.cartItems); // Recalcular el subtotal después de eliminar un ítem
        this.cartService.getCount();
      }
    });
  }

  calculateSubtotal(cartItems: DtoCartDetails[]): void {
    this.subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }

  buyNow(): void {
    this.swal.successMessage("Dirigiendo a compra");
  }

}
