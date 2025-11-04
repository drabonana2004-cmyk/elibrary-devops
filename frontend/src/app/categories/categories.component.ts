import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Category } from '../services/api.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="row">
      <div class="col-12">
        <h2><i class="fas fa-tags"></i> Gestion des Catégories</h2>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h5>Ajouter une Catégorie</h5>
          </div>
          <div class="card-body">
            <form (ngSubmit)="addCategory()">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Nom de la catégorie</label>
                    <input type="text" class="form-control" [(ngModel)]="newCategory.name" name="name" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Description</label>
                    <input type="text" class="form-control" [(ngModel)]="newCategory.description" name="description">
                  </div>
                </div>
              </div>
              <button type="submit" class="btn btn-primary">Ajouter</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5>Liste des Catégories</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Description</th>
                    <th>Nombre de livres</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let category of categories">
                    <td>{{category.name}}</td>
                    <td>{{category.description || 'Aucune description'}}</td>
                    <td>{{category.books_count || 0}}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-danger" (click)="deleteCategory(category.id)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  newCategory: Partial<Category> = {};

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Erreur:', error)
    });
  }

  addCategory() {
    if (this.newCategory.name) {
      this.apiService.createCategory(this.newCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.newCategory = {};
        },
        error: (error) => console.error('Erreur:', error)
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.apiService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (error) => console.error('Erreur:', error)
      });
    }
  }
}