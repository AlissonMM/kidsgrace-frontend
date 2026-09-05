import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { FooterGenericComponent } from '../footer-generic/footer-generic.component';
import { OrderStatusPtPipe } from '../pipes/order-status-pt.pipe';

@Component({
  selector: 'app-meus-pedidos-page',
  imports: [CommonModule, FooterGenericComponent, OrderStatusPtPipe],
  templateUrl: './meus-pedidos-page.component.html',
  styleUrls: ['./meus-pedidos-page.component.scss']
})
export class MeusPedidosPageComponent implements OnInit {
  pedidos: Order[] = [];
  erro: string | null = null;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit() {
    this.orderService.listMine().subscribe({
      next: (pedidos) => this.pedidos = pedidos,
      error: (err) => this.erro = err?.error?.message || 'Erro ao carregar seus pedidos.'
    });
  }

  verDetalhe(id: number) {
    this.router.navigate(['/pedidos', id]);
  }

  irParaHome() {
    this.router.navigate(['/home']);
  }
}
