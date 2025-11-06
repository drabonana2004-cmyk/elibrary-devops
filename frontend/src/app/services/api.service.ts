import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category_id: number;
  quantity: number;
  available_quantity: number;
  description?: string;
  category?: Category;
  loans_count?: number;
  borrow_count?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  books_count?: number;
}

export interface Loan {
  id: number;
  user_id: number;
  book_id: number;
  loan_date: string;
  due_date: string;
  return_date?: string;
  status: 'active' | 'returned' | 'overdue';
  user?: any;
  book?: Book;
}

export interface DashboardStats {
  stats: {
    total_books: number;
    total_users: number;
    active_borrows: number;
    overdue_borrows: number;
  };
  popular_books: Book[];
  recent_borrows: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // Dashboard/Statistics (Admin)
  getStatistics(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/statistics`, { headers: this.getHeaders() });
  }

  // Books
  getBooks(params?: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/books`, { params });
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/books/${id}`);
  }

  createBook(book: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(`${this.baseUrl}/books`, book);
  }

  updateBook(id: number, book: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/books/${id}`, book);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/books/${id}`);
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${id}`);
  }

  // Dashboard Stats
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/stats`);
  }

  // Penalties
  getOverdueLoans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/penalties/overdue`);
  }

  // Reports
  getReportStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reports/stats`);
  }

  downloadReport(type: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reports/pdf/${type}`, { responseType: 'blob' });
  }

  // Emprunts
  borrowBook(bookId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/borrow`, { book_id: bookId }, { headers: this.getHeaders() });
  }

  requestBorrow(bookId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/request-borrow`, { book_id: bookId }, { headers: this.getHeaders() });
  }

  getMyBorrows(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my-borrows`, { headers: this.getHeaders() });
  }

  getAllBorrows(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/borrows`, { headers: this.getHeaders() });
  }

  returnBook(borrowId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/return/${borrowId}`, {}, { headers: this.getHeaders() });
  }

  // Notifications
  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications`, { headers: this.getHeaders() });
  }

  markNotificationAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifications/${notificationId}/read`, {}, { headers: this.getHeaders() });
  }

  // Utilisateurs (Admin)
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`, { headers: this.getHeaders() });
  }

  sendReminder(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-reminder`, { user_id: userId }, { headers: this.getHeaders() });
  }
}