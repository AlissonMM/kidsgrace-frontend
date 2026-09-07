import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { authInterceptor } from './interceptors/auth.interceptor';
import { sessionExpiredInterceptor } from './interceptors/session-expired.interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    // appConfig (via app.config.ts) nunca provia HttpClient: só main.ts (bootstrap
    // do browser) fazia isso. Como toda a árvore de componentes é instanciada
    // durante o SSR, qualquer serviço que injeta HttpClient (AuthService,
    // ProductService, UserService, etc.) derrubava a renderização inteira com
    // NullInjectorError - qualquer página dava 500 antes de chegar no navegador.
    // withFetch() evita o aviso de usar o backend HttpClientXhr (indisponível
    // em Node) durante o SSR.
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, sessionExpiredInterceptor]))
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
