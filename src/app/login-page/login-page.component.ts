import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FooterGenericComponent } from '../footer-generic/footer-generic.component';
import { CartService } from '../cart-page/cart.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, FooterGenericComponent],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  usuarioData = {
    username: '',
    password: ''
  };

  constructor(private router: Router, private authService: AuthService, private cartService: CartService) {}

  login() {
    console.log(this.usuarioData);

    this.authService.login(this.usuarioData).subscribe({
      next: (response) => {
        console.log('Login realizado com sucesso!', response);
        localStorage.setItem('authToken', response.accessToken);
        this.cartService.carregarCarrinho();

        this.irParaHome();
      },
      error: (error) => {
        console.error('Erro ao fazer login', error);
      }
    }
      
    );
  }

  cadastrar() {
    this.router.navigate(['register']);
  }

  irParaHome() {
    this.router.navigate(['home']);
  }
}
