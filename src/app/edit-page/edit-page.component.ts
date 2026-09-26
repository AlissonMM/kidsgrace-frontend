import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterGenericComponent } from '../footer-generic/footer-generic.component';
import { ProductService, Product } from '../services/product.service';
import { PRODUCT_CATEGORIES } from '../shared/product-categories';
import { error } from 'node:console';

@Component({
  selector: 'app-edit-page',
  standalone: true,
  imports: [FooterGenericComponent, FormsModule, CommonModule],
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {
  produto: Product = {
    id: 0,
    name: '',
    type: '',
    description: '',
    brand: '',
    price: 0,
    imageUrl: '',
    quantity: 1,
    stock: 0,
    attributes: {}
  };

  categorias = PRODUCT_CATEGORIES;

  // Editor de atributos livres (chave/valor) do produto — lista local que é
  // convertida para o Record<string,string> de `produto.attributes` antes de
  // salvar. Ex.: sistema=D&D 5e, raridade=rara, para um item de RPG.
  atributos: { chave: string; valor: string }[] = [];

  image!: File;
  imagePreview: string | ArrayBuffer | null | undefined = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      const existing = this.productService.getProductById(id);
      if (existing) {
        this.produto = { ...existing };
        this.imagePreview = existing.imageUrl;
        this.atributos = Object.entries(existing.attributes ?? {}).map(([chave, valor]) => ({ chave, valor }));
      }
    }
  }

  adicionarAtributo() {
    this.atributos.push({ chave: '', valor: '' });
  }

  removerAtributo(index: number) {
    this.atributos.splice(index, 1);
  }

  private montarAttributesMap(): { [key: string]: string } {
    const mapa: { [key: string]: string } = {};
    for (const { chave, valor } of this.atributos) {
      if (chave.trim()) {
        mapa[chave.trim()] = valor;
      }
    }
    return mapa;
  }

  onImageChange(event: any) {
    this.image = event.target.files[0];
    if (this.image) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.produto.imageUrl = this.imagePreview as string;
      };
      reader.readAsDataURL(this.image);
    }
  }

  salvarProduto() {
    this.produto.attributes = this.montarAttributesMap();

    if (this.produto.id != 0) {
      console.log(this.produto)
      console.log(this.image)


      this.productService.updateProduct(this.produto, this.image).subscribe({
        next: (response) => {
          console.log(response)
          this.router.navigate(['/admin']);
        },
        error: (erro) => {
          console.log(erro)
        }
      });
    } else {
      
      this.productService.addProduct(this.produto, this.image ).subscribe({
        next: (response) => {
          console.log(response)
          this.router.navigate(['/admin']);
        },
        error: (erro) => {
          console.log(erro)
        }
      });
    }
    
  }

  cancelar() {
    this.router.navigate(['/admin']);
  }

  irParaHome(event: Event) {
    event.preventDefault();
    this.router.navigate(['home']);
  }
}