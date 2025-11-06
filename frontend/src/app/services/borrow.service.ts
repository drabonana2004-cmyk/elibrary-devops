import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {
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

  // Faire une demande d'emprunt
  requestBorrow(bookId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/borrows/request`, 
      { book_id: bookId }, 
      { headers: this.getHeaders() }
    );
  }

  // Récupérer les emprunts de l'utilisateur
  getUserBorrows(): Observable<any> {
    return this.http.get(`${this.apiUrl}/borrows/user`, { headers: this.getHeaders() });
  }

  // Admin: Récupérer tous les emprunts
  getAllBorrows(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/borrows`, { headers: this.getHeaders() });
  }

  // Admin: Approuver un emprunt
  approveBorrow(borrowId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/borrows/${borrowId}/approve`, 
      {}, 
      { headers: this.getHeaders() }
    );
  }
}