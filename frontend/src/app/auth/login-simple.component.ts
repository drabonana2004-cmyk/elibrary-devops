import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-simple',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>eLibrary - Connexion</h2>
        <form (ngSubmit)="login()" #loginForm="ngForm">
          <div class="form-group">
            <label>Email:</label>
            <input type="email" [(ngModel)]="email" name="email" required class="form-control">
          </div>
          <div class="form-group">
            <label>Mot de passe:</label>
            <input type="password" [(ngModel)]="password" name="password" required class="form-control">
          </div>
          <button type="submit" class="btn-login" [disabled]="loading">
            {{loading ? 'Connexion...' : 'Se connecter'}}
          </button>
        </form>
        <div *ngIf="error" class="error">{{error}}</div>
        <div class="admin-info">
          <p><strong>Admin:</strong> admin@gmail.com / admin123</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 400px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 1rem;
    }
    .btn-login {
      width: 100%;
      padding: 0.75rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
    }
    .btn-login:hover {
      background: #5a6fd8;
    }
    .btn-login:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .error {
      color: red;
      margin-top: 1rem;
      text-align: center;
    }
    .admin-info {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 5px;
      text-align: center;
      font-size: 0.9rem;
    }
    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }
  `]
})
export class LoginSimpleComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private router: Router) {}

  login() {
    console.log('Login clicked!', { email: this.email, password: this.password });
    
    if (!this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.error = '';

    // Connexion admin
    if (this.email === 'admin@gmail.com' && this.password === 'admin123') {
      console.log('Admin login successful!');
      
      localStorage.setItem('token', 'admin-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Admin',
        email: 'admin@gmail.com',
        role: 'admin'
      }));

      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/admin']);
      }, 500);
      return;
    }

    // Autres utilisateurs
    setTimeout(() => {
      this.loading = false;
      this.error = 'Identifiants incorrects';
    }, 500);
  }
}