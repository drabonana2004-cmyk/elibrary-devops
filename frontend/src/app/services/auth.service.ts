import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  photo_url?: string;
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
    const defaultUsers = [
      { id: 1, name: 'Admin', email: 'admin@gmail.com', password: 'admin123', role: 'admin' },
      { id: 2, name: 'Admin', email: 'admin@elibrary.com', password: 'admin123', role: 'admin' },
      { id: 3, name: 'Test User', email: 'user@test.com', password: 'user123', role: 'user', status: 'approved' }
    ];
    
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const allUsers = [...defaultUsers, ...registeredUsers];
    const user = allUsers.find(u => u.email === email && u.password === password);
    
    return new Observable(observer => {
      setTimeout(() => {
        if (user) {
          // TOUJOURS récupérer la photo - méthode garantie
          let photoUrl = null;
          
          // 1. Chercher dans registeredUsers (source principale)
          const registeredUser = registeredUsers.find((u: any) => u.email === email);
          if (registeredUser?.photo_url) {
            photoUrl = registeredUser.photo_url;
          }
          
          // 2. Chercher dans le stockage séparé
          if (!photoUrl) {
            photoUrl = localStorage.getItem('userPhoto_' + email);
          }
          
          // 3. Chercher dans l'utilisateur lui-même
          if (!photoUrl && user.photo_url) {
            photoUrl = user.photo_url;
          }
          
          const token = 'fake-jwt-token-' + Date.now();
          const finalUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as 'admin' | 'user',
            status: registeredUser?.status || user.status || 'pending',
            photo_url: photoUrl
          };
          
          // FORCER la sauvegarde de la photo dans TOUS les endroits
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(finalUser));
          if (photoUrl) {
            localStorage.setItem('userPhoto_' + email, photoUrl);
            localStorage.setItem('currentUserPhoto', photoUrl); // Sauvegarde supplémentaire
          }
          
          // Mettre à jour le service
          this.currentUserSubject.next(finalUser as any);
          
          console.log('=== CONNEXION DEBUG ===');
          console.log('Email:', email);
          console.log('Photo trouvée:', photoUrl);
          console.log('Utilisateur final:', finalUser);
          console.log('=====================');
          
          observer.next({
            success: true,
            token,
            user: finalUser as any
          });
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
      photo_file: photoFile, // Garder le fichier pour traitement
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
    // Convertir la photo en base64 si elle existe
    if (user.photo_file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoBase64 = e.target?.result as string;
        
        // Ajouter à la liste des demandes d'inscription
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
          photo_url: photoBase64,
          created_at: new Date(),
          documents_uploaded: true
        };
        existingRequests.push(newRequest);
        localStorage.setItem('registrationRequests', JSON.stringify(existingRequests));
        
        // Ajouter à la liste des utilisateurs inscrits
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        registeredUsers.push({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: 'user',
          status: 'pending',
          photo_url: photoBase64
        });
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        // Sauvegarder la photo séparément
        localStorage.setItem('userPhoto_' + user.email, photoBase64);
        
        console.log('Photo utilisateur sauvegardée en base64 pour:', user.email);
      };
      reader.readAsDataURL(user.photo_file);
    } else {
      // Pas de photo, sauvegarder quand même les données
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
        photo_url: null,
        created_at: new Date(),
        documents_uploaded: true
      };
      existingRequests.push(newRequest);
      localStorage.setItem('registrationRequests', JSON.stringify(existingRequests));
      
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      registeredUsers.push({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: 'user',
        status: 'pending',
        photo_url: null
      });
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
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
        
        // Toujours vérifier et mettre à jour les données utilisateur
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const updatedUser = registeredUsers.find((u: any) => u.email === user.email);
        const storedPhoto = localStorage.getItem('userPhoto_' + user.email);
        
        // Mettre à jour avec les dernières données disponibles
        const finalUser = {
          ...user,
          status: updatedUser?.status || user.status || 'pending',
          photo_url: updatedUser?.photo_url || storedPhoto || user.photo_url
        };
        
        // Sauvegarder les données mises à jour
        localStorage.setItem('user', JSON.stringify(finalUser));
        if (finalUser.photo_url) {
          localStorage.setItem('userPhoto_' + user.email, finalUser.photo_url);
        }
        
        console.log('Chargement depuis storage - Utilisateur final:', finalUser);
        this.currentUserSubject.next(finalUser);
      } catch (e) {
        console.error('Erreur chargement utilisateur:', e);
        this.logout();
      }
    }
  }
}