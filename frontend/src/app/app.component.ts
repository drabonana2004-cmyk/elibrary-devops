import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="container-fluid">
      <nav class="navbar navbar-dark bg-primary d-flex justify-content-between">
        <span class="navbar-brand mb-0 h1">📚 eLibrary</span>
        <div class="d-flex align-items-center" *ngIf="currentUser">
          <div class="user-photo-container me-2" style="width: 32px; height: 32px; position: relative;">
            <img *ngIf="hasUserPhoto()" 
                 [src]="getUserPhoto()" 
                 alt="Photo de profil" 
                 class="rounded-circle" 
                 style="width: 32px; height: 32px; object-fit: cover;"
                 (error)="onPhotoError($event)">
            <div *ngIf="!hasUserPhoto()" 
                 class="user-initials"
                 style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(45deg, #4B7688, #2E8B8B); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">
              {{getUserInitials()}}
            </div>
          </div>
          <span class="text-white me-3">{{currentUser.name}}</span>
          <button class="btn btn-outline-light btn-sm" (click)="logout()">Déconnexion</button>
        </div>
      </nav>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit {
  title = 'eLibrary';
  currentUser: User | null = null;
  userPhotoUrl: string = 'assets/default-avatar.png';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        this.userPhotoUrl = storedUser.photo_url || 
                           localStorage.getItem('userPhoto_' + user.email) || 
                           'assets/default-avatar.png';
      }
    });
  }

  hasUserPhoto(): boolean {
    const photoUrl = this.getUserPhoto();
    return photoUrl && photoUrl !== 'assets/default-avatar.png' && photoUrl.trim() !== '';
  }

  getUserPhoto(): string {
    if (!this.currentUser) return '';
    
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // 1. Photo du user stocké
    if (storedUser.photo_url && storedUser.photo_url !== 'assets/default-avatar.png') {
      return storedUser.photo_url;
    }
    
    // 2. Photo séparée
    const storedPhoto = localStorage.getItem('userPhoto_' + this.currentUser.email);
    if (storedPhoto && storedPhoto !== 'assets/default-avatar.png') {
      return storedPhoto;
    }
    
    // 3. Photo dans registeredUsers
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const registeredUser = registeredUsers.find((u: any) => u.email === this.currentUser?.email);
    if (registeredUser?.photo_url && registeredUser.photo_url !== 'assets/default-avatar.png') {
      return registeredUser.photo_url;
    }
    
    return '';
  }

  getUserInitials(): string {
    const name = this.currentUser?.name || 'User';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('') || 'U';
  }

  onPhotoError(event: any) {
    event.target.style.display = 'none';
  }

  logout() {
    this.authService.logout();
  }
}