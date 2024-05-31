import { Component } from '@angular/core';
import { Product } from '../product/_model/product';
import { DtoProductList } from '../product/_dto/dto-product-list';
import { ProductService } from '../product/_service/product.service';
import { SwalMessages } from '../commons/_dto/swal-messages';
import { ProductImageService } from '../product/_service/product-image.service';
import { ProductImage } from '../product/_model/product-image';
import { Router } from '@angular/router';
import { CartService } from '../invoice/_service/cart.service';
import { FormBuilder, Validators } from '@angular/forms';

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
  product: any = {};
  productImages: ProductImage[] = []; // product images
  firstImage: ProductImage = new ProductImage();

  // Product form
  form = this.formBuilder.group({
    product: ["", [Validators.required]],
    gtin: ["", [Validators.required, Validators.pattern('^[0-9]{13}$')]],
    description: ["", [Validators.required]],
    price: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
    stock: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
    category_id: [0, [Validators.required]],
  });

  constructor(
    private router: Router,
    private productService: ProductService,
    private productImageService: ProductImageService,
    private cartService: CartService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.loggedIn = true;
    }

    if (localStorage.getItem('user')) {
      let user = JSON.parse(localStorage.getItem('user')!);
      this.isAdmin = user.rol == 'ADMIN';
    }

    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe({
      next: (v) => {
        let allProducts = v.body!;
        console.log(allProducts);

        // Filtrar solo el primer producto de cada categoría
        let firstProductsByCategory: { [key: string]: DtoProductList } = {};

        allProducts.forEach((product) => {
          if (!firstProductsByCategory[product.category_id]) {
            firstProductsByCategory[product.category_id] = product;
          }
        });

        this.products = Object.values(firstProductsByCategory);

        // Obtener la primera imagen de cada producto
        this.products.forEach((product) => {
          this.getFirstImageOfProducts(product.product_id);
        });
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message);
        this.swal.errorMessage("Error al conectar con el servidor")
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


  diormDetail(gtin: string): void {
    this.router.navigate([`producto/categoria/1`]);
  }
  diorDetail(gtin: string): void {
    this.router.navigate([`producto-detalle/7506584236956`]);
  }

  chanelDetail(gtin: string): void {
    this.router.navigate([`producto-detalle/5678612876181`]);
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
        this.swal.successMessage("Product añadido al carrito!");
        this.cartService.getCount();
      },
      error: (e) => {
        this.swal.errorMessage(e.error!.message);
      }
    });

  }
}
