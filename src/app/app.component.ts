import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from "./home/home.component";
import { TransitionScreenComponent } from './transition-screen/transition-screen.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TransitionScreenComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mork-store';

  mostrarTransicao = true;

  iniciarTransicao(){
    this.mostrarTransicao = true;
    setTimeout(() =>{
      this.mostrarTransicao = false;
    },2000);
  }
}
