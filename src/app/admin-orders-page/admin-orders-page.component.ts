import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { FooterGenericComponent } from '../footer-generic/footer-generic.component';
import { OrderStatusPtPipe } from '../pipes/order-status-pt.pipe';

@Component({
  selector: 'app-admin-orders-page',
  imports: [CommonModule, FooterGenericComponent, OrderStatusPtPipe],
  templateUrl: './admin-orders-page.component.html',
  styleUrls: ['./admin-orders-page.component.scss']
})
export class AdminOrdersPageComponent implements OnInit {
  pedidos: Order[] = [];
  erro: string | null = null;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit() {
    this.carregar();
  }

  private carregar() {
    this.orderService.listAll().subscribe({
      next: (pedidos) => this.pedidos = pedidos,
      error: (err) => this.erro = err?.error?.message || 'Erro ao carregar pedidos.'
    });
  }

  podeCancelar(pedido: Order): boolean {
    return pedido.status !== 'CANCELLED';
  }

  cancelar(pedido: Order) {
    this.orderService.cancelOrder(pedido.id).subscribe({
      next: () => this.carregar(),
      error: (err) => this.erro = err?.error?.message || 'Erro ao cancelar pedido.'
    });
  }

  irParaAdmin() {
    this.router.navigate(['/admin']);
  }
}
