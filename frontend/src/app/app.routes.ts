import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};

const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },
  { 
    path: 'user', 
    loadComponent: () => import('./user/user-dashboard.component').then(m => m.UserDashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'kiosk', 
    loadComponent: () => import('./kiosk/kiosk.component').then(m => m.KioskComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'books', 
    loadComponent: () => import('./books/books.component').then(m => m.BooksComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'catalogue', 
    redirectTo: '/books', 
    pathMatch: 'full'
  }
];