import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FooterGenericComponent } from '../footer-generic/footer-generic.component';
@Component({
  selector: 'app-home',
  imports: [HeaderComponent, CatalogoComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
constructor(router: Router, @Inject(PLATFORM_ID) private platformId: Object){}

// Página de vitrine: liga o visual "intenso" (grão + acento magenta) do
// Mörk Store Design System enquanto o usuário está aqui.
// `document` global não existe durante o SSR (Node) - sem essa checagem
// essa era a rota padrão ('' e '/home') e derrubava toda renderização.
ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    document.body.classList.add('mork-intense');
  }
}

ngOnDestroy() {
  if (isPlatformBrowser(this.platformId)) {
    document.body.classList.remove('mork-intense');
  }
}
}
