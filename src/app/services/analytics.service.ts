import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AnalyticsAction,
  AnalyticsEntity,
  CategoryRevenue,
  EntityAnalytics,
  EventCount,
  LoginStats,
  TimeSeriesPoint,
  TopEntity
} from '../models/analytics.model';

/**
 * Fala com o morkstore-analytics-service (porta separada da API principal —
 * ver environment.analyticsApiUrl). Exige token de ADMIN; o authInterceptor
 * já anexa o header Authorization em toda requisição HttpClient, mesmo para
 * uma origem diferente da API principal.
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.analyticsApiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getEvents(from?: string, to?: string): Observable<EventCount> {
    return this.http.get<EventCount>(`${this.apiUrl}/events`, { params: this.rangeParams(from, to) });
  }

  getEntities(from?: string, to?: string): Observable<EntityAnalytics> {
    return this.http.get<EntityAnalytics>(`${this.apiUrl}/entities`, { params: this.rangeParams(from, to) });
  }

  // Contagem BRUTA (não percentual) de uma entidade — /analytics/entities
  // devolve proporção (soma ~100), útil para o texto "63,6% dos eventos são
  // de usuário", mas não para um gráfico que deve mostrar "quantos eventos".
  getEntityCount(entity: AnalyticsEntity, from?: string, to?: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/entities/${entity}`, { params: this.rangeParams(from, to) });
  }

  getLoginStats(): Observable<LoginStats> {
    return this.http.get<LoginStats>(`${this.apiUrl}/login-stats`);
  }

  getRevenueByCategory(): Observable<CategoryRevenue[]> {
    return this.http.get<CategoryRevenue[]>(`${this.apiUrl}/revenue-by-category`);
  }

  getTop(entity: AnalyticsEntity, action: AnalyticsAction, limit = 10, orderBy: 'count' | 'value' = 'count'): Observable<TopEntity[]> {
    const params = new HttpParams()
      .set('entity', entity)
      .set('action', action)
      .set('limit', limit)
      .set('orderBy', orderBy);

    return this.http.get<TopEntity[]>(`${this.apiUrl}/top`, { params });
  }

  getTimeSeries(entity: AnalyticsEntity, action: AnalyticsAction, from: string, to: string): Observable<TimeSeriesPoint[]> {
    const params = new HttpParams()
      .set('entity', entity)
      .set('action', action)
      .set('from', from)
      .set('to', to);

    return this.http.get<TimeSeriesPoint[]>(`${this.apiUrl}/timeseries`, { params });
  }

  private rangeParams(from?: string, to?: string): HttpParams {
    let params = new HttpParams();
    if (from && to) {
      params = params.set('from', from).set('to', to);
    }
    return params;
  }
}
