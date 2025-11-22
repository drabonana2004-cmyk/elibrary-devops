import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService, Book, Category } from '../services/api.service';
import { BookService } from '../services/book.service';
import { BorrowService } from '../services/borrow.service';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Header avec photo utilisateur -->
    <header class="header mb-4">
      <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded">
        <div class="logo">
          <h2 class="mb-0">📚 eLibrary</h2>
        </div>
        <nav class="nav d-flex gap-3">
          <a routerLink="/catalogue" class="text-decoration-none">Catalogue</a>
          <a routerLink="/account" class="text-decoration-none">Mon compte</a>
          <a routerLink="/kiosque" class="text-decoration-none">Kiosque</a>
          <a routerLink="/notifications" class="text-decoration-none position-relative">
            Notifications
            <span class="badge bg-danger position-absolute top-0 start-100 translate-middle" *ngIf="unreadCount > 0">{{unreadCount}}</span>
          </a>
          <a routerLink="/profile" class="text-decoration-none">Profil</a>
          <a routerLink="/help" class="text-decoration-none">Aide</a>
        </nav>
        <div class="user-info d-flex align-items-center gap-2">
          <span class="badge bg-primary" *ngIf="unreadCount > 0">{{unreadCount}}</span>
          <div class="user-photo-container" style="width: 40px; height: 40px; position: relative;">
            <img *ngIf="hasUserPhoto()" 
                 [src]="getUserPhoto()" 
                 alt="Photo de profil" 
                 class="rounded-circle border" 
                 style="width: 40px; height: 40px; object-fit: cover;"
                 (error)="onPhotoError($event)">
            <div *ngIf="!hasUserPhoto()" 
                 class="user-initials"
                 style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(45deg, #4B7688, #2E8B8B); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; border: 2px solid rgba(255,255,255,0.3);">
              {{getUserInitials()}}
            </div>
          </div>
          <span class="fw-bold">{{currentUser?.name || 'Utilisateur'}}</span>
          <span class="badge bg-success" *ngIf="getUserStatus() === 'approved'">Certifié</span>
          <span class="badge bg-warning" *ngIf="getUserStatus() === 'pending'">En attente</span>
          <button class="btn btn-sm btn-outline-primary ms-2" (click)="addTestPhoto()" title="Ajouter photo de test">
            <i class="fas fa-camera"></i>
          </button>
          <button class="btn btn-sm btn-outline-secondary ms-1" (click)="forceReloadPhoto()" title="Recharger photo">
            <i class="fas fa-sync"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Titre de la page -->
    <div class="row">
      <div class="col-12">
        <h3><i class="fas fa-book"></i> Catalogue des livres</h3>
        <p class="text-muted">Recherchez et découvrez nos livres disponibles</p>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-4">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Rechercher titre, auteur, ISBN..." 
                 [(ngModel)]="searchTerm" (keyup.enter)="searchBooks()">
          <button class="btn btn-outline-secondary" type="button" (click)="searchBooks()">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
      <div class="col-md-3">
        <select class="form-select" [(ngModel)]="selectedCategory" (change)="filterByCategory()">
          <option value="">Toutes catégories</option>
          <option *ngFor="let category of categories" [value]="category.id">
            {{category.name}}
          </option>
        </select>
      </div>
      <div class="col-md-3" *ngIf="isAdmin()">
        <button class="btn btn-success me-2" (click)="showCategoryForm = !showCategoryForm">
          <i class="fas fa-tags"></i> Gérer Catégories
        </button>
      </div>
      <div class="col-md-2" *ngIf="isAdmin()">
        <button class="btn btn-primary w-100" (click)="showAddForm = !showAddForm">
          <i class="fas fa-plus"></i> Nouveau Livre
        </button>
      </div>
      <div class="col-md-5" *ngIf="!isAdmin()">
        <div class="alert alert-info mb-0">
          <i class="fas fa-info-circle"></i>
          <span *ngIf="getUserStatus() === 'pending'">Votre compte est en attente de certification. Vous pouvez consulter le catalogue mais pas emprunter de livres.</span>
          <span *ngIf="getUserStatus() === 'approved'">Votre compte est certifié. Vous pouvez emprunter des livres.</span>
        </div>
      </div>
    </div>

    <!-- Formulaire de gestion des catégories -->
    <div class="card mb-4" *ngIf="showCategoryForm">
      <div class="card-header">
        <h5>Gestion des Catégories</h5>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Nom de la catégorie" 
                   [(ngModel)]="newCategory.name">
          </div>
          <div class="col-md-6">
            <input type="text" class="form-control" placeholder="Description" 
                   [(ngModel)]="newCategory.description">
          </div>
          <div class="col-md-2">
            <button class="btn btn-success" (click)="addCategory()">
              <i class="fas fa-plus"></i> Ajouter
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="d-flex flex-wrap gap-2">
              <span *ngFor="let category of categories" class="badge bg-secondary p-2">
                {{category.name}} ({{category.books_count || 0}})
                <button class="btn-close btn-close-white ms-2" (click)="deleteCategory(category.id)"></button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulaire d'ajout -->
    <div class="card mb-4" *ngIf="showAddForm">
      <div class="card-header">
        <h5>Ajouter un Livre</h5>
      </div>
      <div class="card-body">
        <form (ngSubmit)="addBook()">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Titre</label>
                <input type="text" class="form-control" [(ngModel)]="newBook.title" name="title" required>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Auteur</label>
                <input type="text" class="form-control" [(ngModel)]="newBook.author" name="author" required>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">ISBN</label>
                <input type="text" class="form-control" [(ngModel)]="newBook.isbn" name="isbn" required>
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">Catégorie</label>
                <select class="form-select" [(ngModel)]="newBook.category_id" name="category_id" required>
                  <option value="">Sélectionner une catégorie...</option>
                  <option *ngFor="let category of categories" [value]="category.id">
                    {{category.name}}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">Quantité</label>
                <input type="number" class="form-control" [(ngModel)]="newBook.quantity" name="quantity" required min="1">
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-control" [(ngModel)]="newBook.description" name="description" rows="3"></textarea>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success">Ajouter</button>
            <button type="button" class="btn btn-secondary" (click)="cancelAdd()">Annuler</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Liste des livres -->
    <div class="row">
      <div class="col-md-4 mb-4" *ngFor="let book of books">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{book.title}}</h5>
            <p class="card-text">
              <strong>Auteur:</strong> {{book.author}}<br>
              <strong>ISBN:</strong> {{book.isbn}}<br>
              <strong>Catégorie:</strong> {{book.category?.name}}<br>

            </p>
            <p class="card-text" *ngIf="book.description">{{book.description}}</p>
          </div>
          <div class="card-footer">
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge" [class]="book.available_quantity > 0 ? 'bg-success' : 'bg-danger'">
                <span *ngIf="!isAdmin()">{{book.available_quantity > 0 ? 'Disponible' : 'Indisponible'}}</span>
                <span *ngIf="isAdmin()">{{book.available_quantity > 0 ? 'Disponible' : 'Indisponible'}} ({{book.available_quantity}}/{{book.quantity}})</span>
              </span>
              <div class="btn-group" *ngIf="!isAdmin()">
                <button 
                  *ngIf="canBorrow() && book.available_quantity > 0" 
                  class="btn btn-primary btn-sm"
                  (click)="borrowBook(book.id)">
                  <i class="fas fa-hand-paper"></i> Emprunter
                </button>
                <button 
                  *ngIf="!canBorrow()" 
                  class="btn btn-secondary btn-sm" 
                  disabled
                  title="Compte non certifié">
                  <i class="fas fa-lock"></i> Certification requise
                </button>
              </div>
            </div>
            
            <!-- Message de statut pour utilisateurs non certifiés -->
            <div *ngIf="!canBorrow() && !isAdmin()" class="alert alert-warning mt-2 p-2">
              <small><i class="fas fa-info-circle"></i> Votre compte doit être certifié pour emprunter des livres.</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="books.length === 0" class="text-center py-5">
      <i class="fas fa-book fa-3x text-muted mb-3"></i>
      <p class="text-muted">Aucun livre trouvé</p>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-2px);
    }
  `]
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  categories: Category[] = [];
  searchTerm = '';
  selectedCategory = '';
  showAddForm = false;
  showCategoryForm = false;
  newBook: Partial<Book> = {};
  newCategory: Partial<Category> = {};
  currentUser: User | null = null;
  userPhotoUrl: string = 'assets/default-avatar.svg';
  unreadCount: number = 4;

  constructor(
    private apiService: ApiService,
    private bookService: BookService,
    private borrowService: BorrowService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadBooks();
    this.loadCategories();
  }

  loadUserData() {
    // Charger depuis localStorage d'abord
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.name) {
      this.currentUser = storedUser;
    }
    
    // Écouter les changements du service
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  loadBooks() {
    const params: any = {};
    if (this.searchTerm) params.search = this.searchTerm;
    if (this.selectedCategory) params.category_id = this.selectedCategory;

    this.apiService.getBooks(params).subscribe({
      next: (response) => this.books = response.data || response,
      error: (error) => console.error('Erreur lors du chargement des livres:', error)
    });
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Erreur lors du chargement des catégories:', error)
    });
  }

  searchBooks() {
    this.loadBooks();
  }

  filterByCategory() {
    this.loadBooks();
  }

  addBook() {
    if (this.newBook.title && this.newBook.author && this.newBook.isbn) {
      this.apiService.createBook(this.newBook).subscribe({
        next: () => {
          this.loadBooks();
          this.cancelAdd();
        },
        error: (error) => console.error('Erreur lors de l\'ajout du livre:', error)
      });
    }
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newBook = {};
  }

  addCategory() {
    if (this.newCategory.name) {
      this.apiService.createCategory(this.newCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.newCategory = {};
        },
        error: (error) => console.error('Erreur lors de l\'ajout de la catégorie:', error)
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('Supprimer cette catégorie ?')) {
      this.apiService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (error) => console.error('Erreur:', error)
      });
    }
  }

  // Nouvelles méthodes pour la gestion des emprunts et permissions
  borrowBook(bookId: number) {
    this.borrowService.requestBorrow(bookId).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Demande d\'emprunt envoyée avec succès!');
          this.loadBooks();
        }
      },
      error: (error) => {
        alert(error.error?.message || 'Erreur lors de la demande d\'emprunt');
      }
    });
  }

  canBorrow(): boolean {
    return this.bookService.canBorrow();
  }

  canAddBooks(): boolean {
    return this.isAdmin();
  }

  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  }

  getUserStatus(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.status || 'pending';
  }

  hasUserPhoto(): boolean {
    const photoUrl = this.getUserPhoto();
    return photoUrl && photoUrl !== 'assets/default-avatar.svg' && photoUrl.trim() !== '';
  }

  getUserPhoto(): string {
    const user = this.currentUser || JSON.parse(localStorage.getItem('user') || '{}');
    
    // 1. Photo du user actuel
    if (user.photo_url && user.photo_url !== 'assets/default-avatar.svg') {
      return user.photo_url;
    }
    
    // 2. Photo stockée séparément
    const storedPhoto = localStorage.getItem('userPhoto_' + user.email);
    if (storedPhoto && storedPhoto !== 'assets/default-avatar.svg') {
      return storedPhoto;
    }
    
    // 3. Photo dans registeredUsers
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const registeredUser = registeredUsers.find((u: any) => u.email === user.email);
    if (registeredUser?.photo_url && registeredUser.photo_url !== 'assets/default-avatar.svg') {
      return registeredUser.photo_url;
    }
    
    return '';
  }

  getUserInitials(): string {
    const user = this.currentUser || JSON.parse(localStorage.getItem('user') || '{}');
    const name = user?.name || 'User';
    
    const initials = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
    
    return initials || 'U';
  }

  onPhotoError(event: any) {
    // Cacher l'image et afficher les initiales
    event.target.style.display = 'none';
    // Forcer le re-render pour afficher les initiales
    setTimeout(() => {
      const container = event.target.parentElement;
      if (container) {
        container.innerHTML = `
          <div class="user-initials"
               style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(45deg, #4B7688, #2E8B8B); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; border: 2px solid rgba(255,255,255,0.3);">
            ${this.getUserInitials()}
          </div>
        `;
      }
    }, 10);
  }

  // Méthode pour forcer le rechargement de la photo
  forceReloadPhoto() {
    if (this.currentUser) {
      // Recharger depuis toutes les sources
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const storedPhoto = localStorage.getItem('userPhoto_' + this.currentUser.email);
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const registeredUser = registeredUsers.find((u: any) => u.email === this.currentUser?.email);
      
      const photoUrl = registeredUser?.photo_url || storedUser.photo_url || storedPhoto;
      
      if (photoUrl && photoUrl !== 'assets/default-avatar.svg') {
        this.userPhotoUrl = photoUrl;
        console.log('Photo rechargée:', photoUrl);
      } else {
        console.log('Aucune photo trouvée pour:', this.currentUser.email);
      }
    }
  }

  // Méthode pour ajouter une photo de test
  addTestPhoto() {
    // Essayer plusieurs URLs de test
    const testPhotos = [
      'https://ui-avatars.com/api/?name=' + (this.currentUser?.name || 'User') + '&background=4B7688&color=fff&size=40',
      'https://via.placeholder.com/40x40/4B7688/FFFFFF?text=' + (this.currentUser?.name?.charAt(0) || 'U'),
      'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Ccircle cx="20" cy="20" r="20" fill="%234B7688"/%3E%3Ctext x="20" y="26" text-anchor="middle" fill="white" font-size="14" font-family="Arial"%3E' + (this.currentUser?.name?.charAt(0) || 'U') + '%3C/text%3E%3C/svg%3E'
    ];
    
    const testPhotoUrl = testPhotos[0]; // Utiliser la première option
    
    if (this.currentUser) {
      console.log('Avant mise à jour - Photo actuelle:', this.userPhotoUrl);
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.photo_url = testPhotoUrl;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userPhoto_' + this.currentUser.email, testPhotoUrl);
      
      // Forcer la mise à jour immédiate
      this.userPhotoUrl = testPhotoUrl;
      
      console.log('Après mise à jour - Nouvelle photo:', this.userPhotoUrl);
      console.log('LocalStorage user:', localStorage.getItem('user'));
      console.log('LocalStorage photo:', localStorage.getItem('userPhoto_' + this.currentUser.email));
      
      // Mettre à jour le service auth aussi
      this.authService.updateCurrentUser(user);
      
      alert('Photo mise à jour ! Vérifiez la console pour les détails.');
    }
  }
}