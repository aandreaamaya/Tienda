import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './module/product/component/category/category.component';
import { LoginComponent } from './module/product/authentication/login/login.component';
import { SecuredComponent } from './module/product/authentication/secured/secured.component';
import { authenticationGuard } from './module/product/authentication/_guard/authentication.guard';

const routes: Routes = [
  {path: "category", component: CategoryComponent},
  {path: 'login', component: LoginComponent},
  {path: 'secured', component: SecuredComponent, canActivate : [authenticationGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }