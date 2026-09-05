import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { AuthService } from '../auth/auth.service';
import { Order } from '../models/order.model';
import { FooterGenericComponent } from '../footer-generic/footer-generic.component';

@Component({
  selector: 'app-pedido-detalhe-page',
  imports: [CommonModule, FooterGenericComponent],
  templateUrl: './pedido-detalhe-page.component.html',
  styleUrls: ['./pedido-detalhe-page.component.scss']
})
export class PedidoDetalhePageComponent implements OnInit {
  pedido: Order | null = null;
  erro: string | null = null;
  processando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregar(id);
  }

  private carregar(id: number) {
    this.orderService.getById(id).subscribe({
      next: (pedido) => this.pedido = pedido,
      error: (err) => this.erro = err?.error?.message || 'Pedido não encontrado.'
    });
  }

  podeCancelar(): boolean {
    if (!this.pedido || this.pedido.status === 'CANCELLED') return false;
    if (this.authService.isAdmin()) return true;
    return this.pedido.status === 'PENDING_PAYMENT';
  }

  cancelar() {
    if (!this.pedido) return;

    this.erro = null;
    this.processando = true;

    this.orderService.cancelOrder(this.pedido.id).subscribe({
      next: (pedido) => {
        this.pedido = pedido;
        this.processando = false;
      },
      error: (err) => {
        this.erro = err?.error?.message || 'Erro ao cancelar pedido.';
        this.processando = false;
      }
    });
  }

  irParaPedidos() {
    this.router.navigate(['/pedidos']);
  }
}
