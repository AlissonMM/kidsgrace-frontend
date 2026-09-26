import { Component, OnInit, ChangeDetectorRef, Input, ElementRef, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../cart-page/cart.service';
import { Router } from '@angular/router';
import { Product, ProductService } from '../services/product.service';
import { CardReutComponent } from '../card-reut/card-reut.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, CardReutComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  animatingItem: any = null;
  produtos: (Product & { quantity: number; parcelamento: string })[] = [];

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit(): void {
    this.productService.loadProductsFromServer();

    this.productService.products$.subscribe(list => {
      this.produtos = list
        .filter(p => p.isVisibleInCatalog)
        .map(p => ({
          ...p,
          quantity: 1,
          parcelamento: `Até 10x de R$ ${(Number(p.price) / 10).toFixed(2)} sem juros!`
        }));
    });
  }

  isFeatured(id: number): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const stored = localStorage.getItem('featuredProducts');
    const featured: number[] = stored ? JSON.parse(stored) : [];
    return featured.includes(id);
  }


  goProduct(productId: any){
    this.router.navigate(["/products", productId])
  }

  adicionarItem(produto: any, event: MouseEvent) {
    // Só existe interação de clique/DOM (window/document) no navegador; no SSR
    // este método nunca deveria ser chamado, mas a checagem evita quebrar a
    // renderização caso isso mude no futuro.
    if (isPlatformBrowser(this.platformId)) {
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();

      this.animatingItem = {
        imagem: produto.imageUrl,
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      };

      setTimeout(() => {
        const cartIcon = document.querySelector(".bi-cart") as HTMLElement;
        if (!cartIcon) return;

        const cartRect = cartIcon.getBoundingClientRect();

        this.animatingItem.top = cartRect.top + window.scrollY + 10;
        this.animatingItem.left = cartRect.left + window.scrollX + 10;
      }, 50);
    }

    setTimeout(() => {
      this.animatingItem = null;
      const produtoFormatado = this.formatarProdutoParaCarrinho(produto);
      this.cartService.adicionarProduto(produtoFormatado).subscribe({
        next: () => console.log(produtoFormatado),
        error: (err) => console.error('Erro ao adicionar ao carrinho:', err)
      });
    }, 800);
  }

  private formatarProdutoParaCarrinho(produto: Product): any {
    return {
      id: produto.id,
      nome: produto.name,
      preco: produto.price,
      parcelamento: `Até 10x de R$ ${(Number(produto.price) / 10).toFixed(2)} sem juros!`,
      imagem: produto.imageUrl,
      quantidade: produto.quantity
    };
  }

  aumentarQuantidade(produto: any) {
    produto.quantity++;
  }

  diminuirQuantidade(produto: any) {
    if (produto.quantity > 1) {
      produto.quantity--;
    }
  }
}
