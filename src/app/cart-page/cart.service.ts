import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartApiService } from '../services/cart-api.service';
import { Cart } from '../models/cart.model';

export interface ProdutoCarrinho {
  id: number;          // id do brinquedo (Toy)
  cartItemId: number;  // id da linha CartItem no backend — usado para PUT/DELETE
  nome: string;
  preco: number;
  parcelamento: string;
  imagem: string;
  quantidade: number;
}

/**
 * Fachada com estado sobre o CartApiService. Mantém os mesmos nomes públicos
 * que os componentes já usavam quando o carrinho era só local (adicionarProduto,
 * removerProduto, atualizarQuantidade, limparCarrinho, getTotal, resetCarrinho),
 * mas agora cada operação bate no backend e o carrinho é persistido por usuário.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private carrinhoSubject = new BehaviorSubject<ProdutoCarrinho[]>([]);
  carrinho$ = this.carrinhoSubject.asObservable();

  private quantidadeTotalSubject = new BehaviorSubject<number>(0);
  quantidadeTotal$ = this.quantidadeTotalSubject.asObservable();

  constructor(private cartApiService: CartApiService) {}

  private mapCartToProdutos(cart: Cart): ProdutoCarrinho[] {
    return cart.items.map(item => ({
      id: item.toyId,
      cartItemId: item.id,
      nome: item.toyName,
      preco: item.unitPrice,
      parcelamento: `Até 10x de R$ ${(item.unitPrice / 10).toFixed(2)} sem juros!`,
      imagem: item.image ? `data:image/jpeg;base64,${item.image}` : 'assets/default-image.jpg',
      quantidade: item.quantity
    }));
  }

  private aplicarCarrinho(cart: Cart) {
    this.carrinhoSubject.next(this.mapCartToProdutos(cart));
    this.atualizarQuantidadeTotal();
  }

  // Busca o carrinho persistido do usuário logado. Chamar ao entrar na
  // aplicação (se logado) e logo após um login bem-sucedido.
  carregarCarrinho(): void {
    this.cartApiService.getCart().subscribe({
      next: (cart) => this.aplicarCarrinho(cart),
      error: (err) => console.error('Erro ao carregar carrinho:', err)
    });
  }

  adicionarProduto(produto: any): Observable<Cart> {
    return this.cartApiService.addItem(produto.id, produto.quantidade).pipe(
      tap(cart => this.aplicarCarrinho(cart))
    );
  }

  removerProduto(produto: ProdutoCarrinho): Observable<Cart> {
    return this.cartApiService.removeItem(produto.cartItemId).pipe(
      tap(cart => this.aplicarCarrinho(cart))
    );
  }

  atualizarQuantidade(produto: ProdutoCarrinho, quantidade: number): Observable<Cart> {
    return this.cartApiService.updateItem(produto.cartItemId, quantidade).pipe(
      tap(cart => this.aplicarCarrinho(cart))
    );
  }

  limparCarrinho(): Observable<void> {
    return this.cartApiService.clearCart().pipe(
      tap(() => {
        this.carrinhoSubject.next([]);
        this.atualizarQuantidadeTotal();
      })
    );
  }

  getTotal(): number {
    const carrinhoAtual = this.carrinhoSubject.value;
    return carrinhoAtual.reduce((total, item) => total + item.preco * item.quantidade, 0);
  }

  private atualizarQuantidadeTotal() {
    const carrinhoAtual = this.carrinhoSubject.value;
    const quantidadeTiposProdutos = carrinhoAtual.length;
    this.quantidadeTotalSubject.next(quantidadeTiposProdutos);
  }

  // Só limpa o estado LOCAL (nunca chama a API) — usado no logout, para não
  // vazar o carrinho de um usuário para o próximo que logar no mesmo
  // navegador. O carrinho persistido no backend permanece intacto.
  resetCarrinho() {
    this.carrinhoSubject.next([]);
    this.quantidadeTotalSubject.next(0);
  }
}
