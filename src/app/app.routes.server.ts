import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // O app é quase todo dinâmico (produtos do banco, carrinho, sessão do
  // usuário), então Prerender (geração estática) é o modo errado aqui:
  // ele só descobre rotas rastreando <a>/routerLink reais na página, e
  // navegações feitas via router.navigate() em código (ex.: o menu de
  // categorias no header) nunca são descobertas - qualquer acesso direto
  // a essas rotas (F5, link compartilhado) dava 404. Server renderiza sob
  // demanda a cada requisição, sem depender de descoberta prévia.
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
