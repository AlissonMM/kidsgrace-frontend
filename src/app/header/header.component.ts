import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart-page/cart.service';
import { CommonModule } from '@angular/common';
import { AvatarService, Pfp } from '../services/avatar.service';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { BuscaService } from '../services/busca.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class HeaderComponent implements OnInit {
  avatars: Pfp[] = []
  avatarSelecionado: string  = "";
  pfpPath: string = 'assets/avatars/';
  termoBusca = '';

  quantidadeTotal: number = 0;
  quantidadeTiposProdutos = 0;


  isLogin = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private avatarService: AvatarService,
    private userService: UserService,
    private buscaService: BuscaService,
    private authService: AuthService
  ) {
    this.isLogin = this.authService.isLoggedIn();
  }


  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  buscar() {
    if (this.termoBusca.trim()) {
      this.buscaService.atualizarTermoBusca(this.termoBusca.trim());
      this.router.navigate(['/catalogo']);
    }
  }
  getImagePfpId() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.userService.getImagePfp(currentUser.id).subscribe({
    next: (response) => {
      this.avatarSelecionado =  this.pfpPath + this.avatars.filter((a) =>  a.id == parseInt(response))[0].namepfp;
      console.log(this.avatarSelecionado)
    },
    error: (error) => {
      console.error('Erro ao fazer requisição', error);
    }})
  }

  ngOnInit(): void {
    this.avatars = this.avatarService.getAvatars()

    this.getImagePfpId()

    if (this.authService.isLoggedIn()) {
      this.cartService.carregarCarrinho();
    }

    this.cartService.quantidadeTotal$.subscribe(quantidade => {
      this.quantidadeTiposProdutos = quantidade;
    });
  }

  logout(){
    this.authService.logout()
    this.irParaLogin()
    this.cartService.resetCarrinho();
  }

  irParaLogin() {
    this.router.navigate(['login']);
  }
  irParaHome(event: Event) {
    event.preventDefault();
    this.router.navigate(['home']);
  }

  irParaCarrinhoCompra(event: Event) {
    event.preventDefault();
    this.router.navigate(['cart']);
  }
  irParaAdministracao(event: Event){
    event.preventDefault();
    this.router.navigate(['admin']);
  }
  irParaCatalogo(event: Event){
    event.preventDefault();
    this.router.navigate(['catalogo']);
  }
  irParaUser(event: Event){
    event.preventDefault();
    this.router.navigate(['user']);
  }
  irParaMeusPedidos(event: Event){
    event.preventDefault();
    this.router.navigate(['pedidos']);
  }
}