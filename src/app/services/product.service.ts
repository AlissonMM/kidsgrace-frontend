import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

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
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/toys`

  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  private currentId = 1;

  generateHeaders(){
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return headers
  }


   
  private mapToyToProduct(toy: any): Product {
    const imageUrl = toy.image ? `data:image/jpeg;base64,${toy.image}` : 'assets/default-image.jpg';
    return {
      id: toy.id,
      name: toy.name,
      type: toy.category,
      description: toy.description,
      brand: toy.brand,
      imageUrl: imageUrl,
      price: toy.value,
      quantity: 1,
      isVisibleInCatalog: toy.visibleInCatalog !== undefined ? toy.visibleInCatalog : true,
    };
  }
  constructor(private http: HttpClient) { }

  addProduct(product: Product, imagem: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('category', product.type);
    formData.append('description', product.description);
    formData.append('brand', product.brand);
    formData.append('value', product.price.toString());
    formData.append('image', imagem);
    formData.append('visibleInCatalog', product.isVisibleInCatalog ? 'true' : 'false'); // Inclui a visibilidade
  
    return this.http.post<string>(`${this.apiUrl}/insert`, formData, { headers: this.generateHeaders() });
  }

  loadProductsFromServer(): void {
    this.http.get<Product[]>(`${this.apiUrl}/findAll`).subscribe({
      next: (toys) => {
        const products = toys.map(this.mapToyToProduct)
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
