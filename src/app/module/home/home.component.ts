import { Component } from '@angular/core';
import { Product } from '../product/_model/product';
import { DtoProductList } from '../product/_dto/dto-product-list';
import { ProductService } from '../product/_service/product.service';
import { SwalMessages } from '../commons/_dto/swal-messages';
import { ProductImageService } from '../product/_service/product-image.service';
import { ProductImage } from '../product/_model/product-image';
import { Router } from '@angular/router';
import { CartService } from '../invoice/_service/cart.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  swal: SwalMessages = new SwalMessages(); // swal messages
  isAdmin: boolean = false; // isAdmin
  loggedIn: boolean = false; // is logged in
  images: ProductImage[] = [];
  products: DtoProductList[] = [];
  productImages: ProductImage[] = []; // product images
  firstImage: ProductImage = new ProductImage();


  constructor(
    private router: Router,
    private productService: ProductService,
    private productImageService: ProductImageService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.loggedIn = true;
    }

    if (localStorage.getItem('user')) {
      let user = JSON.parse(localStorage.getItem('user')!);
      if (user.rol == 'ADMIN') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
      console.log(this.isAdmin);
    }
    this.getProducts();

  }

  getProducts() {
    this.productService.getProductsByCategory(3).subscribe({
      next: (v) => {
        this.products = v.body!;
        console.log(this.products);

        // Llamar al método para obtener la primera imagen de cada producto
        this.products.forEach((product) => {
          this.getFirstImageOfProducts(product.product_id);
        });
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // mostrar mensaje
      }
    });
  }

  getFirstImageOfProducts(product_id: number) {
    this.productImageService.getProductImages(product_id).subscribe({
      next: (v) => {
        const productImages = v.body! || [];
        console.log(productImages);

        // Encuentra el producto y asigna la primera imagen
        const productIndex = this.products.findIndex(product => product.product_id === product_id);
        if (productIndex !== -1 && productImages.length > 0) {
          this.products[productIndex].image = productImages[0].image;
        }
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // mostrar mensaje
      }
    });
  }


  seeMore() {

  }
  showDetailAdmin(gtin: string) {
    //redirect to product detail
    // this.router.navigate(['/product/detail'], { queryParams: { gtin: gtin } });
    console.log(gtin);
    this.router.navigate([`product/${gtin}`]);
  }

  showDetail(gtin: string) {
    this.router.navigate([`producto-detalle/${gtin}`]);
  }

  addToCart(gtin: string) {
    let cart = {
      gtin: gtin,
      quantity: 1
    }

    this.cartService.addToCart(cart).subscribe({
      next: (v) => {
        this.swal.successMessage("Product added to cart");
        this.cartService.getCount();
      },
      error: (e) => {
        this.swal.errorMessage(e.error!.message);
      }
    });

  }
}
