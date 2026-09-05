import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { FooterGenericComponent } from '../footer-generic/footer-generic.component';
import { CommonModule } from '@angular/common';
import { response } from 'express';

@Component({
  selector: 'app-administrator-page',
  templateUrl: './administrator-page.component.html',
  styleUrls: ['./administrator-page.component.scss'],
  imports: [FooterGenericComponent, CommonModule]
})
export class AdministratorPageComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.loadProductsFromServer();

    this.productService.products$.subscribe(products => {
      this.products = products;
      console.log('Produtos:', this.products);
    });
  }

  irParaEditPage(event: Event) {
    event.preventDefault();
    this.router.navigate(['edit']);
  }

  irParaPedidos(event: Event) {
    event.preventDefault();
    this.router.navigate(['admin/pedidos']);
  }

  editProduct(id: any) {
    this.router.navigate(['/edit', id]);
  }

  deleteProduct(id: any) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          console.log(response);
          this.productService.loadProductsFromServer();
        },
        error: (erro) => {
          console.log(erro);
        }
      });
    }
  }

  toggleFeatured(product: Product): void {
    const newVisibility = !product.isVisibleInCatalog;
  
    this.productService.updateProductVisibility(product.id!, newVisibility).subscribe({
      next: () => {
        product.isVisibleInCatalog= newVisibility;
        console.log(`Produto ${product.id} visibilidade atualizada para ${newVisibility}`);
      },
      error: (error) => {
        console.error('Erro ao atualizar visibilidade do produto:', error);
      }
    });
  }
  

  irParaHome() {
    this.router.navigate(['/home']);
  }
}

