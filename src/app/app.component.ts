import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from "./home/home.component";
import { TransitionScreenComponent } from './transition-screen/transition-screen.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TransitionScreenComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mork-store';

  mostrarTransicao = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Se já existe um token salvo (reload da página), agenda o logout
    // automático para o instante exato em que ele expirar.
    this.authService.scheduleAutoLogout();
  }

  iniciarTransicao(){
    this.mostrarTransicao = true;
    setTimeout(() =>{
      this.mostrarTransicao = false;
    },2000);
  }
}
