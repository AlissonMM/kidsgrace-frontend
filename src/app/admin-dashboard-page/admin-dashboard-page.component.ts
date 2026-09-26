import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, TooltipItem } from 'chart.js';
import { AnalyticsService } from '../services/analytics.service';
import { ProductService } from '../services/product.service';
import { FooterGenericComponent } from '../footer-generic/footer-generic.component';
import { LoginStats, AnalyticsEntity, AnalyticsAction } from '../models/analytics.model';

interface TimeSeriesPreset {
  label: string;
  entity: AnalyticsEntity;
  action: AnalyticsAction;
}

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [CommonModule, FormsModule, FooterGenericComponent, BaseChartDirective],
  templateUrl: './admin-dashboard-page.component.html',
  styleUrls: ['./admin-dashboard-page.component.scss']
})
export class AdminDashboardPageComponent implements OnInit {
  erro: string | null = null;

  totalEvents = 0;
  loginStats: LoginStats | null = null;
  totalRevenue = 0;

  entityChartData: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };
  entityChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          // O valor já é percentual (vem de /analytics/entities) — deixa
          // isso explícito no tooltip pra não parecer contagem de eventos.
          label: (item: TooltipItem<'pie'>) => {
            const percentual = item.parsed as number;
            return `${item.label}: ${percentual.toFixed(1)}%`;
          }
        }
      }
    }
  };

  revenueChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Receita (R$)', backgroundColor: '#ffe800' }]
  };
  revenueChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  topProductsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Unidades vendidas', backgroundColor: '#ff3fb4' }]
  };
  topProductsChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true } }
  };

  presets: TimeSeriesPreset[] = [
    { label: 'Vendas por dia', entity: 'PRODUCT', action: 'SALE' },
    { label: 'Logins por dia', entity: 'USER', action: 'LOGIN' },
    { label: 'Novos usuários por dia', entity: 'USER', action: 'REGISTER' },
    { label: 'Produtos cadastrados por dia', entity: 'PRODUCT', action: 'REGISTER' }
  ];
  selectedPreset: TimeSeriesPreset = this.presets[0];

  timeSeriesChartData: ChartData<'line'> = { labels: [], datasets: [{ data: [], label: '' }] };
  timeSeriesChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };

  constructor(
    private analyticsService: AnalyticsService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.loadProductsFromServer();
    this.carregarVisaoGeral();
    this.carregarVendas();
    this.carregarSerieTemporal();
  }

  onPresetChange() {
    this.carregarSerieTemporal();
  }

  private carregarVisaoGeral() {
    this.analyticsService.getEvents().subscribe({
      next: (r) => this.totalEvents = r.totalEvents,
      error: (err) => this.tratarErro(err)
    });

    this.analyticsService.getEntities().subscribe({
      next: (r) => {
        const entries = Object.entries(r.entities);
        this.entityChartData = {
          labels: entries.map(([entity]) => this.traduzirEntidade(entity)),
          datasets: [{
            data: entries.map(([, percentual]) => percentual),
            backgroundColor: ['#ffe800', '#ff3fb4', '#b4122b']
          }]
        };
      },
      error: (err) => this.tratarErro(err)
    });

    this.analyticsService.getLoginStats().subscribe({
      next: (r) => this.loginStats = r,
      error: (err) => this.tratarErro(err)
    });
  }

  private carregarVendas() {
    this.analyticsService.getRevenueByCategory().subscribe({
      next: (categorias) => {
        this.totalRevenue = categorias.reduce((soma, item) => soma + item.totalRevenue, 0);
        this.revenueChartData = {
          labels: categorias.map(c => c.category),
          datasets: [{ data: categorias.map(c => c.totalRevenue), label: 'Receita (R$)', backgroundColor: '#ffe800' }]
        };
      },
      error: (err) => this.tratarErro(err)
    });

    this.analyticsService.getTop('PRODUCT', 'SALE', 5, 'value').subscribe({
      next: (produtos) => {
        this.topProductsChartData = {
          labels: produtos.map(p => this.nomeProduto(p.entityId)),
          datasets: [{ data: produtos.map(p => p.totalCount), label: 'Unidades vendidas', backgroundColor: '#ff3fb4' }]
        };
      },
      error: (err) => this.tratarErro(err)
    });
  }

  private carregarSerieTemporal() {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 29);

    this.analyticsService.getTimeSeries(
      this.selectedPreset.entity,
      this.selectedPreset.action,
      this.formatarData(from),
      this.formatarData(to)
    ).subscribe({
      next: (pontos) => {
        this.timeSeriesChartData = {
          labels: pontos.map(p => this.formatarDataCurta(p.date)),
          datasets: [{
            data: pontos.map(p => p.count),
            label: this.selectedPreset.label,
            borderColor: '#ffe800',
            backgroundColor: 'rgba(255,232,0,0.15)',
            fill: true,
            tension: 0.3
          }]
        };
      },
      error: (err) => this.tratarErro(err)
    });
  }

  private nomeProduto(id: number): string {
    return this.productService.getProductById(id)?.name || `Produto #${id}`;
  }

  private traduzirEntidade(entity: string): string {
    const labels: Record<string, string> = { USER: 'Usuários', PRODUCT: 'Produtos', ORDER: 'Pedidos' };
    return labels[entity] || entity;
  }

  private formatarData(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatarDataCurta(iso: string): string {
    const partes = iso.split('-');
    return `${partes[2]}/${partes[1]}`;
  }

  private tratarErro(err: any) {
    console.error(err);
    this.erro = err?.error?.message || 'Erro ao carregar métricas.';
  }

  irParaAdmin() {
    this.router.navigate(['/admin']);
  }
}
