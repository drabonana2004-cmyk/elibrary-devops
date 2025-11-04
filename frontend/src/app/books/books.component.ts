import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Book, Category } from '../services/api.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="row">
      <div class="col-12">
        <h2><i class="fas fa-books"></i> Catalogue des Livres</h2>
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
      <div class="col-md-3">
        <button class="btn btn-success me-2" (click)="showCategoryForm = !showCategoryForm">
          <i class="fas fa-tags"></i> Gérer Catégories
        </button>
      </div>
      <div class="col-md-2">
        <button class="btn btn-primary w-100" (click)="showAddForm = !showAddForm">
          <i class="fas fa-plus"></i> Nouveau Livre
        </button>
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
              <strong>Disponible:</strong> {{book.available_quantity}}/{{book.quantity}}
            </p>
            <p class="card-text" *ngIf="book.description">{{book.description}}</p>
          </div>
          <div class="card-footer">
            <span class="badge" [class]="book.available_quantity > 0 ? 'bg-success' : 'bg-danger'">
              {{book.available_quantity > 0 ? 'Disponible' : 'Indisponible'}}
            </span>
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

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadBooks();
    this.loadCategories();
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
}