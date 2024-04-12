import { Component } from '@angular/core';
import { Category } from '../../_model/category';
import { CategoryService } from '../../_service/category.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from'sweetalert2';

declare var $: any; // JQuery

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {

  categories: Category[] = [];
// Category form
  form = this.formBuilder.group({
    category: ["", [Validators.required]],
    code: ["", [Validators.required]],
});
  submitted = false; // Form submitted
  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
  ){
  }

  ngOnInit(){
    this.getCategories();
  }

  onSubmit(){
    // validate form
    this.submitted = true;
    if(this.form.invalid) return;
    this.submitted = false;

        // add Category to Category list
        this.categoryService.createCategory(this.form.value).subscribe({
          next: (v) => {
            console.log(v);
    
            // show message
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              toast: true,
              text: v.body!.message,
              background: '#E8F8F8',
              showConfirmButton: false,
              timer: 2000
            });
    
            // reload categories
            this.getCategories();
    
            // close modal
            this.hideModalForm();
          },
          error: (e) => {
            console.error(e);
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              toast: true,
              text: e.error!.message,
              background: '#F8E8F8',
              showConfirmButton: false,
              timer: 2000
            });
          }
        });
    
    
      }
    
      getCategories(){
        this.categoryService.getCategories().subscribe({
          next: (v) => {
            console.log(v);
            this.categories = v.body!
          },
          error: (e) => {
            console.log(e);
          }
        });
    
      }

showModalForm(){
    $("#modalForm").modal("show");
    this.form.reset();
    this.submitted = false;
  }

hideModalForm(){
    $("#modalForm").modal("hide");
  }
} 
