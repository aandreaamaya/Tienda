import { Component } from '@angular/core';
import { Product } from '../../_model/product';
import { Category } from '../../_model/category';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../_service/product.service';
import { ProductImageService } from '../../_service/product-image.service';
import { CategoryService } from '../../_service/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPhotoEditorService } from 'ngx-photo-editor';
import { SwalMessages } from '../../../commons/_dto/swal-messages';
import { ProductImage } from '../../_model/product-image';

declare var $: any; // JQuery

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {

  product: Product = new Product();
  rfc: string = "";

  categories: Category[] = [];
  category: Category = new Category();

  // formulario de actualización
  form = this.formBuilder.group({
    name: ["", [Validators.required, Validators.pattern("^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ ]+$")]],
    surname: ["", [Validators.required, Validators.pattern("^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ ]+$")]],
    rfc: ["", [Validators.required, Validators.pattern("^[ñA-Z]{3,4}[0-9]{6}[0-9A-Z]{3}$")]],
    mail: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    category_id: [0, [Validators.required]],
    address: ["", [Validators.required]],
  });
  
  swal: SwalMessages = new SwalMessages(); // swal messages

  submitted = false; // indica si se envió el formulario

  constructor(
    private productService: ProductService, // servicio product de API
    private productImageService: ProductImageService, // servicio product image de API
    private formBuilder: FormBuilder, // formulario
    private categoryService: CategoryService, // servicio category de API
    private route: ActivatedRoute, // recupera parámetros de la url
    private router: Router, // redirigir a otro componente

    private service: NgxPhotoEditorService
  ){}

  ngOnInit(){
    this.rfc = this.route.snapshot.paramMap.get('rfc')!;
    if(this.rfc){
      this.getProduct();
      this.getActiveCategories();
    }else{
      this.swal.errorMessage("RFC inválido"); // show message
    }
  }

  // CRUD product

  getProduct(){
    this.productService.getProduct(this.rfc).subscribe({
      next: (v) => {
        this.product = v.body!;
        this.getCategory(this.product.category_id);
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }

  onSubmit(){
    // valida el formulario
    this.submitted = true;
    if(this.form.invalid) return;
    this.submitted = false;

    console.log(this.form.value);
    return;

    this.productService.updateProduct(this.form.value, this.product.product_id).subscribe({
      next: (v) => {
        this.swal.successMessage(v.body!.message); // show message

        // reload product if rfc changes
        if(this.form.controls['rfc'].value != this.rfc){
          this.rfc = this.form.controls['rfc'].value!; // update rfc

          let currentUrl = this.router.url.split("/");
          currentUrl.pop();
          currentUrl.push(this.rfc);
          
          this.redirect(currentUrl); // update url
        }
        
        this.getProduct(); // reload product

        this.hideModalForm(); // close modal

      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }

  updateProduct(){
    this.form.reset();
    this.submitted = false;

    this.form.controls['name'].setValue(this.product.name);
    this.form.controls['surname'].setValue(this.product.surname);
    this.form.controls['rfc'].setValue(this.product.rfc);
    this.form.controls['mail'].setValue(this.product.mail);
    this.form.controls['category_id'].setValue(this.product.category_id);
    this.form.controls['address'].setValue(this.product.address);

    this.showModalForm();
  }

  // product image

  updateProductImage(image: string){
    let productImage: ProductImage = new ProductImage();
    productImage.product_image_id = this.product.image.product_image_id;
    productImage.image = image;

    this.productImageService.updateProductImage(productImage).subscribe({
      next: (v) => {
        this.swal.successMessage(v.body!.message); // show message
        this.getProduct(); // reload product
        this.hideModalForm(); // close modal
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
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

  // auxiliary functions

  getCategory(id: number){
    this.categoryService.getCategory(id).subscribe({
      next: (v) => {
        this.category = v.body!;
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }

  fileChangeHandler($event: any) {
    this.service.open($event, {
      aspectRatio: 1/1,
      autoCropArea: 1,
      resizeToWidth: 360,
      resizeToHeight: 360,
    }).subscribe(data => {
      this.updateProductImage(data.base64!);
    });
  }

  redirect(url: string[]){
    this.router.navigate(url);
  }

  hideModalForm(){
    $("#modalForm").modal("hide")
  }

  showModalForm(){
    $("#modalForm").modal("show")
  }
}
