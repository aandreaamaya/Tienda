import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../_service/product.service';
import { CategoryService } from '../../_service/category.service';
import Swal from 'sweetalert2';
import { Category } from '../../_model/category';
import { FormBuilder, Validators } from '@angular/forms';
import { SwalMessages } from '../../../commons/_dto/swal-messages';
import { Location } from '@angular/common';
import { ProductImage } from '../../_model/product-image';
import { CartService } from '../../../invoice/_service/cart.service';
import { ProductImageService } from '../../_service/product-image.service';
import { NgxPhotoEditorService } from 'ngx-photo-editor';
import { Product } from '../../_model/product';

declare var $: any;

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  images: ProductImage[] = [];
  gtin = '0';
  product: any = {};
  category: any = {};
  categories: Category[] = [];
  submitted = false;
  swal: SwalMessages = new SwalMessages();
  id = 0;
  productImages: ProductImage[] = [];
  loggedIn: boolean = false;
  isAdmin: boolean = false;
  productQuantity: number = 1;
  activeImageIndex = 0;
  mostrarDescripcionCompleta: boolean = false;
  limiteCaracteres: number = 300;
  productToUpdate: number = 0;
  productNameImages: string = "";

  constructor(
    private rutaActiva: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private router: Router,
    private location: Location,
    private cartService: CartService,
    private imageService: ProductImageService,
    private ngxService: NgxPhotoEditorService
  ) { }

  form = this.formBuilder.group({
    product: ["", [Validators.required]],
    gtin: ["", [Validators.required, Validators.pattern('^[0-9]{13}$')]],
    description: ["", [Validators.required]],
    price: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
    stock: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
    category_id: [0, [Validators.required]],
  });

  ngOnInit(): void {
    this.gtin = this.rutaActiva.snapshot.params['gtin'];
    console.log(this.gtin);
    this.getProductDetails(this.gtin);

    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.body!;
        console.log(this.categories);
      },
      error: (e) => {
        Swal.fire({
          title: 'Error connecting to the server',
          text: e.error!.message,
          icon: 'error',
          showConfirmButton: true,
          background: '#4d425f',
          color: 'white'
        });
      }
    });

    if (localStorage.getItem('token')) {
      this.loggedIn = true;
    }
    if (localStorage.getItem('user')) {
      let user = JSON.parse(localStorage.getItem('user')!);
      this.isAdmin = user.rol === 'ADMIN';
      console.log(this.isAdmin);
    }
  }

  setActiveImage(index: number): void {
    this.activeImageIndex = index;
  }

  getProductDetails(gtin: string) {
    this.productService.getProduct(gtin).subscribe({
      next: (v) => {
        this.product = v.body;
        this.getProductImages(this.product.product_id);
        this.categoryService.getCategory(this.product.category_id).subscribe({
          next: (v) => {
            this.category = v.body?.category;
          },
          error: (e) => {
            console.log(e);
          }
        });
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

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

  hideModalForm() {
    $("#modalForm").modal("hide");
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.submitted = false;
    this.onSubmitUpdate();
  }

  onSubmitUpdate() {
    console.log(this.form.value);
    this.productService.updateProduct(this.form.value, this.productToUpdate).subscribe({
      next: (v) => {
        this.swal.successMessage(v.body!.message);
        this.getProductDetails(this.gtin);
        this.hideModalForm();
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message);
      }
    });
  }

  updateProduct(gtin: string) {
    this.productService.getProduct(gtin).subscribe({
      next: (v) => {
        let product = v.body!;
        this.productToUpdate = product.product_id;

        this.form.reset();
        this.submitted = false;

        this.form.controls['product'].setValue(product.product);
        this.form.controls['gtin'].setValue(product.gtin);
        this.form.controls['price'].setValue(product.price);
        this.form.controls['stock'].setValue(product.stock);
        this.form.controls['category_id'].setValue(product.category_id);
        this.form.controls['description'].setValue(product.description);

        $("#modalForm").modal("show");
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  quantityUp() {
    this.productQuantity++;
  }

  quantityDown() {
    if (this.productQuantity > 1) {
      this.productQuantity--;
    }
  }

  addToCart() {
    let cart = {
      gtin: this.gtin,
      quantity: this.productQuantity
    };

    this.cartService.addToCart(cart).subscribe({
      next: (v) => {
        let text = this.productQuantity > 1 ? "Productos añadidos al carrito!" : "Producto añadido al carrito!";
        this.swal.successMessage(text);
        this.cartService.getCount();
      },
      error: (e) => {
        this.swal.errorMessage(e.error!.message);
      }
    });
  }

  newImage($event: any) {
    this.ngxService.open($event, {
      aspectRatio: 4 / 3,
      autoCropArea: 1
    }).subscribe((data) => {
      console.log(data.base64);
      this.createProductImage(data.base64!);
    });
  }

  createProductImage(image: string) {
    let productImage = new ProductImage();
    productImage.product_id = this.product.product_id;
    productImage.image = image;
    this.imageService.createProductImage(productImage).subscribe({
      next: (v) => {
        this.swal.successMessage("Imagen añadida");
        this.getProductImages(this.product.product_id);
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message);
      }
    });
  }

  deleteProductImage(productImage: ProductImage) {
    this.swal.confirmMessage.fire({
      title: 'Favor de confirmar la eliminación de la imagen',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.imageService.deleteProductImage(productImage.product_image_id).subscribe({
          next: (v) => {
            this.swal.successMessage(v.body!.message);
            this.getProductImages(productImage.product_id);
          },
          error: (e) => {
            console.error(e);
            this.swal.errorMessage(e.error!.message);
          }
        });
      }
    });
  }

  fileChangeHandler($event: any) {
    this.ngxService.open($event, {
      aspectRatio: 7 / 8,
      autoCropArea: 1,
      resizeToWidth: 315,
      resizeToHeight: 360,
    }).subscribe(data => {
      this.createProductImage(data.base64!);
    });
  }

  showModalForm() {
    $("#modalForm").modal("show");
    this.form.reset();
    this.submitted = false;
    this.productToUpdate = 0;
  }

  showProductModal(gtin: string) {

    this.product = new Product();
    this.productService.getProduct(gtin).subscribe({
      next: (v) => {
        this.product = v.body!;
        $("#productModal").modal("show");
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message);
      }
    });
  }

  showImagesModal(id: number, productName: string) {
    this.productNameImages = productName;
    this.productToUpdate = id;
    this.getProductImages(id);
    $("#productModal").modal("hide");
    $("#imagesModal").modal("show");
  }
  isSpecialProduct(): boolean {
    return this.gtin === '7506584236956';
  }

}
