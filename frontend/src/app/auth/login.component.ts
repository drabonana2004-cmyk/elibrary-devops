import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-background"></div>
      <div class="container-fluid h-100">
        <div class="row h-100">
          <!-- Left Panel -->
          <div class="col-lg-6 d-none d-lg-flex align-items-center justify-content-center left-panel">
            <div class="text-center text-white">
              <div class="hero-logo mb-4">
                <div class="custom-logo-large">
                  <div class="wifi-signals-large">
                    <div class="wifi-1-large"></div>
                    <div class="wifi-2-large"></div>
                    <div class="wifi-3-large"></div>
                  </div>
                  <div class="book-3d-large">
                    <div class="book-front-large"></div>
                    <div class="book-pages-large"></div>
                  </div>
                </div>
              </div>
              <h1 class="display-4 fw-bold mb-3">eLibrary</h1>
              <p class="lead mb-4">Votre bibliothèque intelligente connectée</p>
              <div class="features">
                <div class="feature-item">
                  <i class="fas fa-wifi"></i>
                  <span>Technologie IoT</span>
                </div>
                <div class="feature-item">
                  <i class="fas fa-book-open"></i>
                  <span>Catalogue numérique</span>
                </div>
                <div class="feature-item">
                  <i class="fas fa-mobile-alt"></i>
                  <span>Accès mobile</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right Panel -->
          <div class="col-lg-6 d-flex align-items-center justify-content-center right-panel">
            <div class="login-form-container">
              <div class="card professional-card">
                <div class="card-header text-center">
                  <div class="mobile-logo d-lg-none mb-3">
                    <div class="custom-logo">
                      <div class="wifi-signals">
                        <div class="wifi-1"></div>
                        <div class="wifi-2"></div>
                        <div class="wifi-3"></div>
                      </div>
                      <div class="book-3d">
                        <div class="book-front"></div>
                        <div class="book-pages"></div>
                      </div>
                    </div>
                  </div>
                  <h3 class="mb-2">{{showRegister ? 'Création de compte' : 'Connexion'}}</h3>
                  <p class="text-muted">{{showRegister ? 'Rejoignez notre communauté' : 'Accédez à votre espace'}}</p>
                </div>
            <div class="card-body">
              <!-- Connexion -->
              <form *ngIf="!showRegister" (ngSubmit)="login()">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" [(ngModel)]="credentials.email" 
                         name="email" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Mot de passe</label>
                  <input type="password" class="form-control" [(ngModel)]="credentials.password" 
                         name="password" required>
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Se connecter
                  </button>
                </div>
              </form>
              
              <!-- Inscription -->
              <form *ngIf="showRegister" (ngSubmit)="register()">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Nom *</label>
                      <input type="text" class="form-control" [(ngModel)]="registerData.nom" 
                             name="nom" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Prénom *</label>
                      <input type="text" class="form-control" [(ngModel)]="registerData.prenom" 
                             name="prenom" required>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Date de naissance *</label>
                      <input type="date" class="form-control" [(ngModel)]="registerData.date_naissance" 
                             name="date_naissance" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Sexe *</label>
                      <select class="form-select" [(ngModel)]="registerData.sexe" name="sexe" required>
                        <option value="">Sélectionner...</option>
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Photo d'identité *</label>
                  <input type="file" class="form-control" (change)="onFileSelect($event)" 
                         accept="image/*" required>
                  <small class="text-muted">Format photo d'identité (JPG, PNG)</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email *</label>
                  <input type="email" class="form-control" [(ngModel)]="registerData.email" 
                         name="email" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Numéro de téléphone *</label>
                  <input type="tel" class="form-control" [(ngModel)]="registerData.telephone" 
                         name="telephone" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Établissement d'origine *</label>
                  <input type="text" class="form-control" [(ngModel)]="registerData.etablissement" 
                         name="etablissement" placeholder="Université, École, Entreprise..." required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Profession *</label>
                  <select class="form-select" [(ngModel)]="registerData.profession" name="profession" (change)="onProfessionChange()" required>
                    <option value="">Sélectionner...</option>
                    <option value="etudiant">Étudiant</option>
                    <option value="eleve">Élève</option>
                    <option value="entrepreneur">Entrepreneur</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div class="mb-3" *ngIf="registerData.profession">
                  <label class="form-label">{{getProfessionLabel()}} *</label>
                  <input type="text" class="form-control" [(ngModel)]="registerData.profession_detail" 
                         name="profession_detail" [placeholder]="getProfessionPlaceholder()" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Motivations *</label>
                  <textarea class="form-control" [(ngModel)]="registerData.motivations" 
                            name="motivations" rows="3" 
                            placeholder="Pourquoi êtes-vous intéressé(e) par cette application ? Quels sont vos objectifs ?" 
                            required></textarea>
                  <small class="text-muted">Décrivez vos motivations</small>
                </div>
                <div class="mb-3">
                  <label class="form-label">Mot de passe *</label>
                  <input type="password" class="form-control" [(ngModel)]="registerData.password" 
                         name="password" required minlength="6">
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-success" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Créer le compte
                  </button>
                </div>
              </form>
              
              <div *ngIf="error" class="alert alert-danger mt-3">
                {{error}}
              </div>
              
                <div class="card-footer text-center">
                  <p class="mb-2">{{showRegister ? 'Déjà inscrit ?' : 'Pas encore de compte ?'}}</p>
                  <button type="button" class="btn btn-outline-primary" (click)="toggleForm()">
                    {{showRegister ? 'Se connecter' : 'Créer un compte'}}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      position: relative;
    }
    .login-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      z-index: -1;
    }
    .left-panel {
      background: linear-gradient(135deg, #1B365D 0%, #2E8B8B 100%);
      position: relative;
    }
    .left-panel::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
    }
    .right-panel {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
    }
    .professional-card {
      border: none;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      overflow: hidden;
      width: 100%;
      max-width: 500px;
    }
    .card-header {
      background: white;
      border-bottom: 1px solid #f0f0f0;
      padding: 2rem;
    }
    .login-form-container {
      width: 100%;
      max-width: 500px;
      padding: 2rem;
    }
    .features {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 2rem;
    }
    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    .feature-item i {
      font-size: 2rem;
      opacity: 0.9;
    }
    .feature-item span {
      font-size: 0.9rem;
      opacity: 0.8;
    }
    .custom-logo-large {
      width: 150px;
      height: 150px;
      position: relative;
      margin: 0 auto;
    }
    .wifi-signals-large {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .wifi-1-large, .wifi-2-large, .wifi-3-large {
      background: rgba(255,255,255,0.9);
      border-radius: 25px 25px 0 0;
      margin: 3px auto;
    }
    .wifi-1-large { width: 50px; height: 12px; }
    .wifi-2-large { width: 35px; height: 10px; }
    .wifi-3-large { width: 20px; height: 8px; }
    .book-3d-large {
      position: absolute;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);
      width: 90px;
      height: 90px;
    }
    .book-front-large {
      width: 90px;
      height: 90px;
      background: rgba(255,255,255,0.95);
      border-radius: 12px;
      position: relative;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .book-pages-large {
      position: absolute;
      top: 12px;
      left: 12px;
      width: 66px;
      height: 66px;
      background: #1B365D;
      border-radius: 6px;
    }
    .book-pages-large::after {
      content: '';
      position: absolute;
      top: 12px;
      left: 12px;
      right: 12px;
      height: 3px;
      background: rgba(255,255,255,0.8);
      box-shadow: 0 8px 0 rgba(255,255,255,0.8), 0 16px 0 rgba(255,255,255,0.8);
    }
    .form-control, .form-select {
      border-radius: 12px;
      border: 2px solid #e9ecef;
      padding: 15px;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    .form-control:focus, .form-select:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
      transform: translateY(-2px);
    }
    .btn {
      border-radius: 12px;
      padding: 15px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .fade-in {
      animation: fadeInUp 0.8s ease-out;
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .logo-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .custom-logo {
      width: 100px;
      height: 100px;
      position: relative;
      margin: 0 auto;
    }
    .wifi-signals {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .wifi-1, .wifi-2, .wifi-3 {
      width: 30px;
      height: 8px;
      background: #2E8B8B;
      border-radius: 15px 15px 0 0;
      margin: 2px auto;
    }
    .wifi-2 { width: 20px; }
    .wifi-3 { width: 10px; }
    .book-3d {
      position: absolute;
      top: 25px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 60px;
    }
    .book-front {
      width: 60px;
      height: 60px;
      background: #1B365D;
      border-radius: 8px;
      position: relative;
    }
    .book-pages {
      position: absolute;
      top: 8px;
      left: 8px;
      width: 44px;
      height: 44px;
      background: white;
      border-radius: 4px;
    }
    .book-pages::after {
      content: '';
      position: absolute;
      top: 8px;
      left: 8px;
      right: 8px;
      height: 2px;
      background: #1B365D;
      box-shadow: 0 6px 0 #1B365D, 0 12px 0 #1B365D;
    }
  `]
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  registerData = { 
    nom: '', 
    prenom: '', 
    date_naissance: '', 
    sexe: '', 
    email: '', 
    telephone: '', 
    etablissement: '',
    profession: '',
    profession_detail: '',
    motivations: '',
    password: '',
    photo: null as File | null
  };
  loading = false;
  error = '';
  showRegister = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  toggleForm() {
    this.showRegister = !this.showRegister;
    this.error = '';
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.registerData.photo = file;
    }
  }

  login() {
    if (!this.credentials.email || !this.credentials.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials.email, this.credentials.password)
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success && response.user) {
            if (response.user.role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/books']);
            }
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message || 'Identifiants incorrects';
        }
      });
  }



  onProfessionChange() {
    this.registerData.profession_detail = '';
  }

  getProfessionLabel(): string {
    const labels: { [key: string]: string } = {
      'etudiant': 'Année de licence',
      'eleve': 'Classe',
      'entrepreneur': 'Domaine d\'activité',
      'autre': 'Précisez votre profession'
    };
    return labels[this.registerData.profession] || 'Détail';
  }

  getProfessionPlaceholder(): string {
    const placeholders: { [key: string]: string } = {
      'etudiant': 'Ex: L1, L2, L3, M1, M2...',
      'eleve': 'Ex: 6ème, Terminale, BTS...',
      'entrepreneur': 'Ex: Technologie, Commerce, Santé...',
      'autre': 'Précisez votre profession'
    };
    return placeholders[this.registerData.profession] || '';
  }



  register() {
    // Pas de validation spécifique pour les motivations

    if (!this.registerData.nom || !this.registerData.prenom || !this.registerData.email || 
        !this.registerData.password || !this.registerData.date_naissance || !this.registerData.sexe ||
        !this.registerData.telephone || !this.registerData.etablissement || !this.registerData.profession ||
        !this.registerData.profession_detail || !this.registerData.motivations || !this.registerData.photo) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.loading = true;
    this.error = '';

    // Créer FormData pour l'upload de fichier
    const formData = new FormData();
    formData.append('nom', this.registerData.nom);
    formData.append('prenom', this.registerData.prenom);
    formData.append('date_naissance', this.registerData.date_naissance);
    formData.append('sexe', this.registerData.sexe);
    formData.append('email', this.registerData.email);
    formData.append('telephone', this.registerData.telephone);
    formData.append('etablissement', this.registerData.etablissement);
    formData.append('profession', this.registerData.profession);
    formData.append('profession_detail', this.registerData.profession_detail);
    formData.append('motivations', this.registerData.motivations);
    formData.append('password', this.registerData.password);
    if (this.registerData.photo) {
      formData.append('photo', this.registerData.photo);
    }

    this.authService.registerComplete(formData)
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            alert(`Compte créé avec succès !\nMatricule: ${response.matricule}\n\nVous allez être connecté automatiquement.`);
            
            // Créer l'URL de la photo depuis le fichier et la convertir en base64
            let photoUrl = null;
            if (this.registerData.photo) {
              const reader = new FileReader();
              reader.onload = (e) => {
                photoUrl = e.target?.result as string;
                
                // Sauvegarder avec la photo en base64
                const userData = {
                  id: response.user.id,
                  name: response.user.name,
                  email: response.user.email,
                  role: 'user',
                  status: response.user.status,
                  photo_url: photoUrl
                };
                
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('userPhoto_' + response.user.email, photoUrl);
                
                // Mettre à jour le service auth
                this.authService.updateCurrentUser(userData);
                
                console.log('Photo sauvegardée pour:', response.user.email);
              };
              reader.readAsDataURL(this.registerData.photo);
            }
            
            // Connexion automatique directe
            const token = 'fake-jwt-token-' + Date.now();
            localStorage.setItem('token', token);
            
            // Si pas de photo, sauvegarder quand même les données utilisateur
            if (!this.registerData.photo) {
              const userData = {
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
                role: 'user',
                status: response.user.status,
                photo_url: null
              };
              localStorage.setItem('user', JSON.stringify(userData));
              this.authService.updateCurrentUser(userData);
            }
            
            // Redirection vers le catalogue (dashboard utilisateur)
            this.router.navigate(['/books']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Erreur lors de la création du compte';
        }
      });
  }
}