import { bootstrapApplication } from '@angular/platform-browser';
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { sessionExpiredInterceptor } from './app/interceptors/session-expired.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

// appConfig já registra o router com a lista completa de rotas (app.routes.ts).
// Usamos mergeApplicationConfig (em vez de `{...appConfig, providers: [...]}`)
// porque o spread substitui `appConfig.providers` por inteiro ao invés de
// somar - foi exatamente esse spread que, antes, fazia o bootstrap do
// servidor (app.config.server.ts, que faz o merge corretamente) enxergar uma
// lista de rotas completamente diferente da usada aqui no navegador.
const browserConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, sessionExpiredInterceptor])),
    provideCharts(withDefaultRegisterables())
  ]
};

bootstrapApplication(AppComponent, mergeApplicationConfig(appConfig, browserConfig))
  .catch(err => console.error(err));