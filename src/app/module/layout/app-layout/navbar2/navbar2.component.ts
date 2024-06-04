import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../authentication/_service/authentication.service';
import { CategoryService } from '../../../product/_service/category.service';
import { CartService } from '../../../invoice/_service/cart.service';
import { Category } from '../../../product/_model/category';
import { DtoCartDetails } from '../../../invoice/_dto/dto-cart-details';
import { SwalMessages } from '../../../commons/_dto/swal-messages';

declare var $: any; // JQuery

@Component({
  selector: 'app-navbar2',
  templateUrl: './navbar2.component.html',
  styleUrls: ['./navbar2.component.css']
})
export class Navbar2Component implements OnInit {

  categories: Category[] = [];
  loggedIn = false;
  isAdmin = false;
  cartItems: DtoCartDetails[] = [];
  totalItems: number = 0;
  swal: SwalMessages = new SwalMessages();

  constructor(
    private categoryService: CategoryService,
    private authenticationService: AuthenticationService,
    private cartService: CartService // Inyectar el servicio del carrito
  ) {}

  ngOnInit() {
    this.checkLoginStatus();
    this.getCategories();
    this.subscribeToCartUpdates();
  }

  checkLoginStatus() {
    this.loggedIn = !!localStorage.getItem("token");
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
    this.isAdmin = user && user.rol === "ADMIN";
  }

  getCategories() {
    this.categoryService.getActiveCategories().subscribe({
      next: (response) => {
        this.categories = response.body!;
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message);
      }
    });
  }

  subscribeToCartUpdates() {
    this.cartService.getCartObservable().subscribe(cartItems => {
      this.cartItems = cartItems;
      this.totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    });
  }

  logout() {
    this.authenticationService.logOut();
    this.loggedIn = false;
    window.location.reload();
  }

  showLoginModal() {
    $("#loginModal").modal("show");
  }

  showRegisterModal() {
    $("#registerModal").modal("show");
  }

  closeRegistrationModal() {
    $("#registerModal").modal("hide");
  }

  handleRegistrationSuccess(event: boolean) {
    if (event) {
      this.closeRegistrationModal();
    }
  }
}
