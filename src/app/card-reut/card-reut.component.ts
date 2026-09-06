import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
@Component({
  selector: 'app-card-reut',
  imports: [CommonModule],
  templateUrl: './card-reut.component.html',
  styleUrl: './card-reut.component.scss'
})
export class CardReutComponent {
  @Input() produto: any;
  @Output() diminuir = new EventEmitter<void>();
  @Output() aumentar = new EventEmitter<void>();
  @Output() adicionar = new EventEmitter<MouseEvent>();

  constructor(
    private router: Router,
    private productService: ProductService
  ){}
  diminuirQuantidade(event: Event) {
    event.stopPropagation();
    if (this.produto.quantity > 1) {
      this.diminuir.emit();
    }
  }

  aumentarQuantidade(event: Event) {
    event.stopPropagation();
    this.aumentar.emit();
  }

  adicionarItem(event: MouseEvent) {
    event.stopPropagation();
    this.adicionar.emit(event);
  }
  irParaDetalheProduto(productId: any){
    this.router.navigate(["/products", productId])  }
}
