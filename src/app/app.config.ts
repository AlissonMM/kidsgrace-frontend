import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Antes esta lista era uma cópia (incompleta e desatualizada) das rotas de
// app.routes.ts. Como app.config.server.ts só herda daqui (main.server.ts
// nunca vê a lista completa que main.ts monta na mão pro navegador), o SSR
// não conhecia rotas como /catalogo ou /products/:id e respondia 404 para
// qualquer acesso direto a elas. Usar a mesma `routes` em ambos os bootstraps
// (cliente e servidor) elimina essa divergência.
export const appConfig = {
  providers: [
    provideRouter(routes)
  ]
};
