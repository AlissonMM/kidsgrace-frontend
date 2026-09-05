import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '../models/order.model';

const LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pagamento Pendente',
  PAID: 'Pago',
  CANCELLED: 'Cancelado',
};

/**
 * Traduz o status do pedido (valor cru do enum do backend, usado também
 * para a classe CSS via [ngClass]) para um rótulo em português na tela.
 */
@Pipe({
  name: 'orderStatusPt'
})
export class OrderStatusPtPipe implements PipeTransform {
  transform(status: OrderStatus | string): string {
    return LABELS[status as OrderStatus] ?? status;
  }
}
