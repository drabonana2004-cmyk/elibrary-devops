import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'User-Id': user.id?.toString() || '1',
      'User-Role': user.role || 'user',
      'User-Status': user.status || 'pending'
    });
  }

  // Récupérer tous les livres (public)
  getBooks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/books`);
  }

  // Récupérer un livre par ID
  getBook(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/books/${id}`);
  }

  // Récupérer les catégories
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  // Ajouter un livre (admin et utilisateurs certifiés)
  addBook(book: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/books`, book, { headers: this.getHeaders() });
  }

  // Vérifier si l'utilisateur peut emprunter
  canBorrow(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.status === 'approved';
  }

  // Vérifier si l'utilisateur peut ajouter des livres (admin uniquement)
  canAddBooks(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  }
}