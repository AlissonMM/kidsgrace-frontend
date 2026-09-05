import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, ProdutoCarrinho } from '../cart-page/cart.service';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { FooterGenericComponent } from '../footer-generic/footer-generic.component';
import { OrderStatusPtPipe } from '../pipes/order-status-pt.pipe';

@Component({
  selector: 'app-checkout-page',
  imports: [CommonModule, FooterGenericComponent, OrderStatusPtPipe],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent implements OnInit {
  carrinho: ProdutoCarrinho[] = [];
  total = 0;
  pedido: Order | null = null;
  erro: string | null = null;
  processando = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.carrinho$.subscribe(carrinho => {
      this.carrinho = carrinho;
      this.total = this.cartService.getTotal();
    });
    this.cartService.carregarCarrinho();
  }

  finalizarCompra() {
    this.erro = null;
    this.processando = true;

    this.orderService.checkout().subscribe({
      next: (order) => {
        this.pedido = order;
        this.processando = false;
      },
      error: (err) => {
        this.erro = err?.error?.message || 'Erro ao finalizar a compra.';
        this.processando = false;
      }
    });
  }

  confirmarPagamento() {
    if (!this.pedido) return;

    this.erro = null;
    this.processando = true;
    const orderId = this.pedido.id;

    this.orderService.confirmPayment(orderId).subscribe({
      next: () => {
        this.processando = false;
        this.router.navigate(['/pedidos', orderId]);
      },
      error: (err) => {
        this.erro = err?.error?.message || 'Erro ao confirmar pagamento.';
        this.processando = false;
      }
    });
  }

  irParaCarrinho() {
    this.router.navigate(['/cart']);
  }
}
