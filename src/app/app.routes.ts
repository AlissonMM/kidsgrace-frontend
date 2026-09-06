import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AppComponent } from './app.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { AdministratorPageComponent } from './administrator-page/administrator-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import { CatalogoPageComponent } from './catalogo-page/catalogo-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { TeamInfoComponent } from './team-info/team-info.component';
import { DetalheProdutoPageComponent } from './detalhe-produto-page/detalhe-produto-page.component'
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import { MeusPedidosPageComponent } from './meus-pedidos-page/meus-pedidos-page.component';
import { PedidoDetalhePageComponent } from './pedido-detalhe-page/pedido-detalhe-page.component';
import { AdminOrdersPageComponent } from './admin-orders-page/admin-orders-page.component';
import { AdminDashboardPageComponent } from './admin-dashboard-page/admin-dashboard-page.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'cart', component: CartPageComponent, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutPageComponent, canActivate: [authGuard] },
  { path: 'pedidos', component: MeusPedidosPageComponent, canActivate: [authGuard] },
  { path: 'pedidos/:id', component: PedidoDetalhePageComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdministratorPageComponent },
  { path: 'admin/pedidos', component: AdminOrdersPageComponent, canActivate: [adminGuard] },
  { path: 'admin/dashboard', component: AdminDashboardPageComponent, canActivate: [adminGuard] },
  { path: 'edit', component: EditPageComponent },
  { path: 'edit/:id', component: EditPageComponent },
  { path: 'catalogo', component: CatalogoPageComponent },
  { path: 'user', component:ProfilePageComponent },
  { path:'team', component: TeamInfoComponent },
  { path: 'products/:id', component: DetalheProdutoPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false }), BrowserModule, CommonModule, HttpClientModule], 
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }