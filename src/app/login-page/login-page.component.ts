import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FooterGenericComponent } from '../footer-generic/footer-generic.component';
import { CartService } from '../cart-page/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, FooterGenericComponent, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  usuarioData = {
    username: '',
    password: ''
  };

  sessionExpired = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.sessionExpired = this.route.snapshot.queryParamMap.get('sessionExpired') === 'true';
  }

  login() {
    console.log(this.usuarioData);

    this.authService.login(this.usuarioData).subscribe({
      next: (response) => {
        console.log('Login realizado com sucesso!', response);
        localStorage.setItem('authToken', response.accessToken);
        this.authService.scheduleAutoLogout();
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
