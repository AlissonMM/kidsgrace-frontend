import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../cart-page/cart.service';
import { FooterGenericComponent } from '../footer-generic/footer-generic.component';
import { CardReutComponent } from '../card-reut/card-reut.component';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BuscaService } from '../services/busca.service';
import { Subscription } from 'rxjs';
import { PRODUCT_CATEGORIES } from '../shared/product-categories';

@Component({
  selector: 'app-catalogo-page',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterGenericComponent, CardReutComponent],
  templateUrl: './catalogo-page.component.html',
  styleUrls: ['./catalogo-page.component.scss']
})
export class CatalogoPageComponent implements OnInit, AfterViewInit, OnDestroy {
  quantidadeTotal: number = 0;
  quantidadeTiposProdutos = 0;

  todosProdutos: Array<Product & { quantity: number; parcelamento: string }> = [];
  produtosFiltrados: Array<Product & { quantity: number; parcelamento: string }> = [];

  filtroTexto = '';
  filtroCategoria = '';
  filtroPreco = '';

  categorias = PRODUCT_CATEGORIES;

  animatingItem: any = null;

  constructor(
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private buscaService: BuscaService

  ) {}

  ngOnInit() {
    this.productService.loadProductsFromServer();

    this.cartService.quantidadeTotal$.subscribe(quantidade => {
      this.quantidadeTiposProdutos = quantidade;
    });

    this.productService.products$.subscribe(list => {
      this.todosProdutos = list.map(p => ({
        ...p,
        price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
        quantity: 1,
        parcelamento: `Até 10x de R$ ${(Number(p.price) / 10).toFixed(2)} sem juros!`
      })) as (Product & { quantity: number; parcelamento: string })[];

      this.buscaService.termoBusca$.subscribe(termo => {
        this.filtroTexto = termo;
        this.aplicarFiltros();
        this.cdr.detectChanges();
      });

      this.produtosFiltrados = [...this.todosProdutos];
      this.aplicarFiltros();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const cartIcon = document.querySelector(".bi-cart") as HTMLElement;
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        console.log('Posição do ícone do carrinho:', cartRect);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.buscaService.atualizarTermoBusca('');
    this.filtroTexto = '';
    this.filtroCategoria = '';
    this.filtroPreco = '';
  }

  aplicarFiltros() {
    let arr = [...this.todosProdutos];

    if (this.filtroTexto) {
      arr = arr.filter(p =>
        p.name.toLowerCase().includes(this.filtroTexto.toLowerCase())
      );
    }

    if (this.filtroCategoria) {
      arr = arr.filter(p => p.type === this.filtroCategoria);
    }

    if (this.filtroPreco === 'asc') {
      arr.sort((a, b) => a.price - b.price);
    } else if (this.filtroPreco === 'desc') {
      arr.sort((a, b) => b.price - a.price);
    }

    this.produtosFiltrados = arr;
  }

  aumentarQuantidade(produto: any) {
    produto.quantity++;
  }

  diminuirQuantidade(produto: any) {
    if (produto.quantity > 1) {
      produto.quantity--;
    }
  }

  adicionarItem(produto: any, event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
  
    this.animatingItem = {
      imagem: produto.imageUrl,
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    };
  
    setTimeout(() => {
      const cartIcon = document.querySelector(".bi-cart") as HTMLElement;
      if (!cartIcon) {
        console.error("Erro: Ícone do carrinho não encontrado para animação.");
        return;
      }
  
      const cartRect = cartIcon.getBoundingClientRect();
      this.animatingItem.top = cartRect.top + window.scrollY + 10;
      this.animatingItem.left = cartRect.left + window.scrollX + 10;
    }, 50);
  
    setTimeout(() => {
      this.animatingItem = null;
      const produtoFormatado = this.formatarProdutoParaCarrinho(produto);
      this.cartService.adicionarProduto(produtoFormatado).subscribe({
        next: () => console.log('Adicionado ao carrinho:', produtoFormatado),
        error: (err) => console.error('Erro ao adicionar ao carrinho:', err)
      });
    }, 800);
  }
  
  private formatarProdutoParaCarrinho(produto: any) {
    return {
      id: produto.id,
      nome: produto.name,
      preco: produto.price,
      parcelamento: produto.parcelamento,
      imagem: produto.imageUrl,
      quantidade: produto.quantity
    };
  }

  irParaHome(e: Event) {
    e.preventDefault();
    this.router.navigate(['home']);
  }

  irParaCarrinhoCompra(event: Event) {
    event.preventDefault();
    this.router.navigate(['cart']);
  }
}