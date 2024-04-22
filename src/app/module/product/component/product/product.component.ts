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
  categories: Category[] = []; // lista de categoryes

  // formulario de registro
  form = this.formBuilder.group({
    name: ["", [Validators.required, Validators.pattern("^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ ]+$")]],
    surname: ["", [Validators.required, Validators.pattern("^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ ]+$")]],
    rfc: ["", [Validators.required, Validators.pattern("^[ñA-Z]{3,4}[0-9]{6}[0-9A-Z]{3}$")]],
    mail: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    category_id: ["", [Validators.required]],
    address: ["", [Validators.required]],
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

  showProduct(rfc: string){
    this.router.navigate(['product/' + rfc]);
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
