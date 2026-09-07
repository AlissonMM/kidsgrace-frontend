import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

export interface Product {
  id?: number;
  name: string;
  type: string;
  price: number;
  description: string;
  brand: string;
  imageUrl: string;
  quantity: number;
  featured?: boolean;
  isVisibleInCatalog?: boolean;
  stock?: number;
  attributes?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/products`

  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  private currentId = 1;

  generateHeaders(){
    // Delega a leitura do token ao AuthService, que já lida com o SSR
    // (localStorage não existe no Node) - antes esse acesso direto derrubava
    // qualquer renderização de página de admin no servidor.
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return headers
  }


   
  private mapProductResponseToProduct(product: any): Product {
    const imageUrl = product.image ? `data:image/jpeg;base64,${product.image}` : 'assets/default-image.jpg';
    return {
      id: product.id,
      name: product.name,
      type: product.category,
      description: product.description,
      brand: product.brand,
      imageUrl: imageUrl,
      price: product.value,
      quantity: 1,
      isVisibleInCatalog: product.visibleInCatalog !== undefined ? product.visibleInCatalog : true,
      stock: product.stock ?? 0,
      attributes: product.attributes ?? {},
    };
  }
  constructor(private http: HttpClient, private authService: AuthService) { }

  addProduct(product: Product, imagem: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('category', product.type);
    formData.append('description', product.description);
    formData.append('brand', product.brand);
    formData.append('value', product.price.toString());
    formData.append('image', imagem);
    formData.append('visibleInCatalog', product.isVisibleInCatalog ? 'true' : 'false'); // Inclui a visibilidade
    formData.append('stock', (product.stock ?? 0).toString());
    formData.append('attributesJson', JSON.stringify(product.attributes ?? {}));

    return this.http.post<string>(`${this.apiUrl}/insert`, formData, { headers: this.generateHeaders() });
  }

  loadProductsFromServer(): void {
    this.http.get<Product[]>(`${this.apiUrl}/findAll`).subscribe({
      next: (response) => {
        const products = response.map(this.mapProductResponseToProduct)
        this.productsSubject.next(products)
      },
      error: (err) => console.error('Erro ao carregar produtos:', err)
    });
  }

  deleteProduct(id: number) {
    // const currentProducts = this.productsSubject.getValue();
    // const updatedProducts = currentProducts.filter(p => p.id !== id);
    // this.productsSubject.next(updatedProducts);


    return this.http.delete<string>(`${this.apiUrl}/deleteById/${id}`, { headers: this.generateHeaders()})
  }

  getProductById(id: number): Product | undefined {
    const products = this.productsSubject.getValue();
    return products.find(p => p.id === id);
  }


 updateProduct(updatedProduct: Product, imagem: File) {
    // const currentProducts = this.productsSubject.getValue();
    // const index = currentProducts.findIndex(p => p.id === updatedProduct.id);

    // if (index !== -1) {
    //   updatedProduct.quantity = currentProducts[index].quantity;
    //   currentProducts[index] = updatedProduct;
    //   this.productsSubject.next([...currentProducts]);
    // }

    const formData = new FormData();
    formData.append('name',updatedProduct.name)
    formData.append('category',updatedProduct.type)
    formData.append('description',updatedProduct.description)
    formData.append('brand',updatedProduct.brand)
    formData.append('value', updatedProduct.price.toString())
    formData.append('stock', (updatedProduct.stock ?? 0).toString())
    formData.append('attributesJson', JSON.stringify(updatedProduct.attributes ?? {}))

    if (imagem != null || undefined){
        formData.append('image', imagem)
    }

    return this.http.put<string>(`${this.apiUrl}/update/${updatedProduct.id}`, formData, {  headers: this.generateHeaders() })
  }

  updateProductVisibility(id: number, visibleInCatalog: boolean): Observable<any> {
    const payload = { visibleInCatalog };
    return this.http.patch<any>(`${this.apiUrl}/updateVisibility/${id}`, payload, { headers: this.generateHeaders() });
  }
}
