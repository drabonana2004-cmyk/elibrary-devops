import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    // Simuler la connexion
    const defaultUsers = [
      { id: 1, name: 'Admin', email: 'admin@gmail.com', password: 'admin123', role: 'admin' },
      { id: 2, name: 'Admin', email: 'admin@elibrary.com', password: 'admin123', role: 'admin' },
      { id: 3, name: 'Test User', email: 'user@test.com', password: 'user123', role: 'user', status: 'approved' }
    ];
    
    // Vérifier les utilisateurs inscrits dans localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const allUsers = [...defaultUsers, ...registeredUsers];
    
    const user = allUsers.find(u => u.email === email && u.password === password);
    
    return new Observable(observer => {
      setTimeout(() => {
        if (user) {
          // Récupérer la photo depuis le stockage séparé si elle existe
          const storedPhotoUrl = localStorage.getItem('userPhoto_' + user.email);
          const photoUrl = user.photo_url || storedPhotoUrl;
          
          const token = 'fake-jwt-token-' + Date.now();
          const userWithUpdatedInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as 'admin' | 'user',
            status: user.status || 'pending',
            photo_url: photoUrl
          };
          
          const response: AuthResponse = {
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role as 'admin' | 'user' }
          };
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userWithUpdatedInfo));
          
          // Mettre à jour immédiatement le currentUserSubject avec toutes les infos
          this.currentUserSubject.next(userWithUpdatedInfo as any);
          
          observer.next(response);
        } else {
          observer.error({ message: 'Identifiants incorrects' });
        }
        observer.complete();
      }, 500);
    });
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, userData);
  }

  registerComplete(formData: FormData): Observable<any> {
    // Simuler la création de compte réussie
    const photoFile = formData.get('photo') as File;
    const photoUrl = photoFile ? URL.createObjectURL(photoFile) : null;
    
    const userData = {
      id: Date.now(),
      name: formData.get('nom'),
      surname: formData.get('prenom'),
      email: formData.get('email'),
      password: formData.get('password'),
      etablissement: formData.get('etablissement'),
      profession: formData.get('profession'),
      profession_detail: formData.get('profession_detail'),
      motivations: formData.get('motivations'),
      photo_url: photoUrl,
      status: 'pending'
    };

    const response = {
      success: true,
      matricule: `ELB${Date.now().toString().slice(-6)}`,
      user: userData
    };

    // Notifier l'admin de la nouvelle inscription
    this.notifyAdminNewRegistration(userData);

    // Retourner une Observable simulée
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(response);
        observer.complete();
      }, 1000);
    });
  }

  private notifyAdminNewRegistration(user: any): void {
    // Ajouter à la liste des demandes d'inscription dans le localStorage
    const existingRequests = JSON.parse(localStorage.getItem('registrationRequests') || '[]');
    const newRequest = {
      id: Date.now(),
      name: user.name,
      surname: user.surname,
      email: user.email,
      etablissement: user.etablissement,
      profession: user.profession,
      profession_detail: user.profession_detail,
      motivations: user.motivations,
      photo_url: user.photo_url,
      created_at: new Date(),
      documents_uploaded: true
    };
    existingRequests.push(newRequest);
    localStorage.setItem('registrationRequests', JSON.stringify(existingRequests));
    
    // Ajouter aussi à la liste des utilisateurs inscrits pour permettre la connexion
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredUsers.push({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: 'user',
      status: 'pending',
      photo_url: user.photo_url
    });
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Sauvegarder aussi la photo dans un stockage séparé pour éviter la perte
    localStorage.setItem('userPhoto_' + user.email, user.photo_url);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  updateCurrentUser(user: any): void {
    // Mettre à jour le localStorage aussi
    localStorage.setItem('user', JSON.stringify(user));
    // Forcer la mise à jour du BehaviorSubject
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // Vérifier si l'utilisateur a été certifié depuis la dernière connexion
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const updatedUser = registeredUsers.find((u: any) => u.email === user.email);
        
        if (updatedUser && updatedUser.status !== user.status) {
          // Mettre à jour le statut et la photo
          user.status = updatedUser.status;
          user.photo_url = updatedUser.photo_url || localStorage.getItem('userPhoto_' + user.email);
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        this.currentUserSubject.next(user);
      } catch (e) {
        this.logout();
      }
    }
  }
}