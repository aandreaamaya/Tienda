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
import { DtoProductList } from '../../_dto/dto-product-list';
declare var $: any;

@Component({
  selector: 'app-maquillaje',
  templateUrl: './maquillaje.component.html',
  styleUrls: ['./maquillaje.component.css']
})
export class MaquillajeComponent implements OnInit {
  isAdmin: boolean = false;
  products: DtoProductList[] = [];
  productToUpdate: number = 0;
  productImages: ProductImage[] = [];
  product_id: number = 0;
  categoryShowing: number = 0;  // As number
  categories: Category[] = [];

  form = this.formBuilder.group({
    product: ["", [Validators.required]],
    gtin: ["", [Validators.required, Validators.pattern('^[0-9]{13}$')]],
    description: ["", [Validators.required]],
    price: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
    stock: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
    category_id: [0, [Validators.required]],
  });

  submitted = false;
  swal: SwalMessages = new SwalMessages();

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productImageService: ProductImageService,
    private ngxService: NgxPhotoEditorService,
    private cartService: CartService,
    private location: Location
  ) { }

  ngOnInit() {
    this.loadUserRole();
    this.route.params.subscribe(params => {
      const category_id = +params['category_id'];  // Convert to number
      if (category_id) {
        this.categoryShowing = category_id;
        this.getProductsByCategory(category_id);
        this.getCategoryName(category_id);
      } else {
        this.getProducts();
        this.getActiveCategories();
      }
    });
  }

  loadUserRole() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.isAdmin = user?.rol === 'ADMIN';
  }

  getCategoryName(category_id: number) {
    this.categoryService.getCategory(category_id).subscribe({
      next: (response) => {
        const category = response.body;
        if (category) {
          this.categoryShowing = category_id;  // Set category ID directly
        }
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  getProducts() {
    this.productService.getProducts().subscribe({
      next: (v) => {
        this.products = v.body!;
        this.products.forEach((product) => {
          this.getFirstImageOfProducts(product.product_id);
        });
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message);
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

  getProductsByCategory(category_id: number) {
    this.productService.getProductsByCategory(category_id).subscribe({
      next: (v) => {
        this.products = v.body!;
        this.products.forEach((product) => {
          this.getFirstImageOfProducts(product.product_id);
        });
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message);
      }
    });
  }

  getProductImages(product_id: number) {
    this.productImageService.getProductImages(product_id).subscribe({
      next: (v) => {
        this.productImages = v.body! || [];
        console.log(this.productImages);
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }

  onSubmit() {
    // validate form
    this.submitted = true;
    if (this.form.invalid) return;
    this.submitted = false;

    if (this.productToUpdate == 0) {
      this.onSubmitCreate();
    } else {
      this.onSubmitUpdate();
    }
  }

  onSubmitCreate() {
    this.productService.createProduct(this.form.value).subscribe({
      next: (v) => {
        this.swal.successMessage(v.body!.message); // show message
        this.getProducts(); // reload products
        this.hideModalForm(); // close modal
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }

  onSubmitUpdate() {
    this.productService.updateProduct(this.form.value, this.productToUpdate).subscribe({
      next: (v) => {
        this.swal.successMessage(v.body!.message); // show message
        this.getProducts(); // reload products
        this.hideModalForm(); // close modal
        this.productToUpdate = 0; // reset product to update
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }

  showDetail(gtin: string) {
    this.router.navigate([`producto-detalle/${gtin}`]);
  }
  showDetailAdmin(gtin: string) {
    //redirect to product detail
    // this.router.navigate(['/product/detail'], { queryParams: { gtin: gtin } });
    console.log(gtin);
    this.router.navigate([`producto-detalle/${gtin}`]);
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
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }

  newImage($event: any) {
    this.ngxService.open($event, {
      aspectRatio: 4 / 3,
      autoCropArea: 1
    }).subscribe((data) => {
      console.log(data.base64)
      this.createProductImage(data.base64!);
    })
  }

  createProductImage(image: string) {
    let productImage = new ProductImage();
    productImage.product_id = this.product_id;
    productImage.image = image;
    this.productImageService.createProductImage(productImage).subscribe({
      next: (v) => {
        this.swal.successMessage("Image created"); // show message
        this.getProductImages(this.product_id); // reload images
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });

  }

  // modals 

  showModalForm() {
    $("#modalForm").modal("show");
    this.form.reset();
    this.submitted = false;
    this.productToUpdate = 0;
  }

  hideModalForm() {
    $("#modalForm").modal("hide");
  }

  showImageModal(product_id: number) {
    this.product_id = product_id;
    this.getProductImages(product_id)
    $("#modalImages").modal("show");
  }

  hideImageModal() {
    $("#modalImages").modal("hide");
  }

  // catalogues 

  getActiveCategories() {
    this.categoryService.getActiveCategories().subscribe({
      next: (v) => {
        this.categories = v.body!;
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }

  addToCart(gtin: string) {
    let cart = {
      gtin: gtin,
      quantity: 1
    }

    this.cartService.addToCart(cart).subscribe({
      next: (v) => {
        this.swal.successMessage("Producto añadido al carrito!");
        this.cartService.getCount();
      },
      error: (e) => {
        this.swal.errorMessage(e.error!.message);
      }
    });

  }

  goBack() {
    this.location.back();
  }
}

