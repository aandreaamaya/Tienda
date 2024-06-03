import { Routes } from '@angular/router';
import { CategoryComponent } from '../../product/component/category/category.component';
// import { RegisterComponent } from '../../authentication/register/register.component';
import { LoginComponent } from '../../authentication/login/login.component';
import { SecuredComponent } from '../../authentication/secured/secured.component';
import { authenticationGuard } from '../../authentication/_guard/authentication.guard';
import { ProductComponent } from '../../product/component/product/product.component';
import { HomeComponent } from '../../home/home.component';
import { InvoiceComponent } from '../../invoice/component/invoice/invoice.component';
import { MaquillajeComponent } from '../../product/component/ProductosPorCategoria/maquillaje.component';
import { DetalleComponent } from '../../product/component/detalle/detalle.component';
import { CartComponent } from '../../cart/cart.component';
import { InvoiceDetailsComponent } from '../../invoice/invoice-details/invoice-details.component';
export const AppLayoutRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'categoria', component: CategoryComponent },
    { path: 'producto', component: ProductComponent },
    { path: "product", component: ProductComponent },
    { path: "product/:gtin", component: ProductComponent },
    { path: 'facturas', component: InvoiceComponent },
    { path: 'producto/categoria/:category_id', component: MaquillajeComponent },
    { path: 'producto-detalle/:gtin', component: DetalleComponent },
    { path: 'carrito', component: CartComponent },
    { path: "factura/:id", component: InvoiceDetailsComponent },
    // {path: 'register', component: RegisterComponent},
    // {path: 'login', component: LoginComponent},
    { path: 'secured', component: SecuredComponent, canActivate: [authenticationGuard] }
];
