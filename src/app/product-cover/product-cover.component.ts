import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Capa estilizada no lugar de uma foto real de produto (decisão do rebrand
// visual: ainda não temos fotografia real de item de RPG, então cada produto
// ganha uma "capa de livro" gerada a partir do nome/categoria, no estilo do
// Mörk Store Design System — gradiente sóbrio + título em Bebas Neue. Se um
// dia o catálogo passar a ter fotos reais, é só trocar esse componente pelo
// <img> de novo nos dois lugares que o usam (card-reut e detalhe-produto).
const PALETTES: { bg: string; accent: string }[] = [
  { bg: 'linear-gradient(150deg, rgba(255,232,0,.14), transparent 55%), linear-gradient(135deg, #3a0d16, #150507 70%)', accent: 'var(--mork-acid)' },
  { bg: 'linear-gradient(150deg, rgba(255,63,180,.12), transparent 55%), linear-gradient(135deg, #1c1030, #0d0812 70%)', accent: 'var(--mork-toxic)' },
  { bg: 'linear-gradient(150deg, rgba(255,77,109,.12), transparent 55%), linear-gradient(135deg, #351012, #120708 70%)', accent: 'var(--mork-wound)' },
];

@Component({
  selector: 'app-product-cover',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mork-cover" [style.background]="palette.bg">
      <span class="mork-cover-tag" *ngIf="tag">{{ tag }}</span>
      <h4 class="mork-cover-title" [style.color]="'var(--mork-bone)'">{{ name }}</h4>
      <span class="mork-cover-category" *ngIf="category" [style.color]="palette.accent">{{ category }}</span>
    </div>
  `,
  styles: [`
    .mork-cover {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 14px;
      border-bottom: 2px solid var(--mork-border-strong);
      overflow: hidden;
    }
    .mork-cover-tag {
      position: absolute;
      top: 8px;
      left: 8px;
      font-family: var(--font-body);
      font-weight: 700;
      font-size: 10px;
      letter-spacing: .06em;
      text-transform: uppercase;
      padding: 3px 7px;
      background: var(--mork-blood);
      color: var(--mork-bone);
    }
    .mork-cover-title {
      font-family: var(--font-display);
      font-size: 26px;
      line-height: 1;
      letter-spacing: .01em;
      margin: 0;
      text-shadow: 0 2px 6px rgba(0,0,0,.6);
      text-wrap: balance;
    }
    .mork-cover-category {
      display: block;
      margin-top: 6px;
      font-family: var(--font-body);
      font-weight: 700;
      font-size: 11px;
      letter-spacing: .1em;
      text-transform: uppercase;
    }
  `]
})
export class ProductCoverComponent {
  @Input() name = '';
  @Input() category?: string;
  @Input() tag?: string;

  get palette() {
    const idx = this.hash(this.name) % PALETTES.length;
    return PALETTES[idx];
  }

  private hash(value: string): number {
    let h = 0;
    for (let i = 0; i < value.length; i++) {
      h = (h * 31 + value.charCodeAt(i)) >>> 0;
    }
    return h;
  }
}
