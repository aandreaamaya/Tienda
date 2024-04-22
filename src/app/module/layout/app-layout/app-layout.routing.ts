import { Routes } from '@angular/router';
import { CategoryComponent } from '../../product/component/category/category.component';
// import { RegisterComponent } from '../../authentication/register/register.component';
import { LoginComponent } from '../../authentication/login/login.component';
import { SecuredComponent } from '../../authentication/secured/secured.component';
import { authenticationGuard } from '../../authentication/_guard/authentication.guard';
import { ProductComponent } from '../../product/component/product/product.component';
import { ProductDetailComponent } from '../../product/component/product-detail/product-detail.component';



export const AppLayoutRoutes: Routes = [
    {path: '', component: CategoryComponent},
    {path: 'categoria', component: CategoryComponent},
    {path: 'producto', component: ProductComponent},
    { path: "product", component: ProductComponent },
    { path: "product/:rfc", component: ProductDetailComponent },
    // {path: 'register', component: RegisterComponent},
    // {path: 'login', component: LoginComponent},
    {path: 'secured', component: SecuredComponent, canActivate : [authenticationGuard]}
];
