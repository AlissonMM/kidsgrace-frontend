import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root',
})

export class UserService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    getImagePfp(id: any): Observable<string> {
        return this.http.get<string>(`${this.apiUrl}/imageProfileByUserId/${id}`);
    }

    putImagePfp(id: any, idImage: any): Observable<string> {
        // Delega ao AuthService, que já lida com o SSR (localStorage não existe
        // no Node) - antes esse acesso direto derrubava a renderização.
        const token = this.authService.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.put<string>(`${this.apiUrl}/updateImageProfileById/${id}`,idImage, { headers});
    }
}
