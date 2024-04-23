import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { SwalMessages } from '../../../commons/_dto/swal-messages';
import { ProductService } from '../../_service/product.service';
import { DtoProductList } from '../../_dto/dto-product-list';
import { Category } from '../../_model/category';
import { CategoryService } from '../../_service/category.service';
import { Product } from '../../_model/product';
import { ProductImage } from '../../_model/product-image';
import { ProductImageService } from '../../_service/product-image.service';
import { NgxPhotoEditorService } from 'ngx-photo-editor';

declare var $: any; // JQuery

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  products: DtoProductList[] = []; // lista de clientes
  productToUpdate: number = 0; // product id
  categories: Category[] = []; // lista de categoryes

 // Product form
  form = this.formBuilder.group({
  product: ["", [Validators.required]],
  gtin: ["", [Validators.required, Validators.pattern('^[0-9]{13}$')]],
  description: ["", [Validators.required]],
  price: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
  stock: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
  category_id: [0, [Validators.required]],
});

  submitted = false; // indica si se envió el formulario
  
  swal: SwalMessages = new SwalMessages(); // swal messages

  constructor(
    private productService: ProductService, // servicio product de API
    private formBuilder: FormBuilder, // formulario
    private categoryService: CategoryService, // servicio category de API
    private router: Router, // redirigir a otro componente
  ){}

  // primera función que se ejecuta
  ngOnInit(){
    this.getProducts();
    this.getActiveCategories();
  }

  // CRUD product

  disableProduct(id: number){
    this.swal.confirmMessage.fire({
      title: 'Favor de confirmar la eliminación del cliente',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.productService.disableProduct(id).subscribe({
          next: (v) => {
            this.swal.successMessage(v.body!.message); // show message
            this.getProducts(); // reload products
          },
          error: (e) => {
            console.error(e);
            this.swal.errorMessage(e.error!.message); // show message
          }
        });
      }
    });
  }

  enableProduct(id: number){
    this.swal.confirmMessage.fire({
      title: 'Favor de confirmar la activación del cliente',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.productService.enableProduct(id).subscribe({
          next: (v) => {
            this.swal.successMessage(v.body!.message); // show message
            this.getProducts(); // reload products
          },
          error: (e) => {
            console.error(e);
            this.swal.errorMessage(e.error!.message); // show message
          }
        });
      }
    });
  }
  getProduct(gtin: string){
    this.productService.getProduct(gtin).subscribe({
      next: (v) => {
        return v.body!;
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }

  getProducts(){
    this.productService.getProducts().subscribe({
      next: (v) => {
        this.products = v.body!;
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }

  onSubmit(){
    // valida el formulario
    this.submitted = true;
    if(this.form.invalid) return;
    this.submitted = false;
    if(this.productToUpdate == 0){
      this.onSubmitCreate();
    }else{
      this.onSubmitUpdate();
    }
  }
  onSubmitCreate(){
    this.productService.createProduct(this.form.value).subscribe({
      next: (v) => {
        this.swal.successMessage(v.body!.message); // show message
        this.getProducts(); // reload categorys
        this.hideModalForm(); // close modal
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }

  onSubmitUpdate(){
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
  updateProduct(gtin: string){
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
  showProduct(gtin: string){
    this.router.navigate(['product/' + gtin]);
  }

  // catalogues

  getActiveCategories(){
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

  // modals 

  hideModalForm(){
    $("#modalForm").modal("hide");
  }

  showModalForm(){
    this.form.reset();
    this.submitted = false;
    this.getActiveCategories();
    $("#modalForm").modal("show");
  }
}
