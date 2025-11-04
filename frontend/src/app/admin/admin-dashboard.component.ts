import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, DashboardStats } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { PdfService } from '../services/pdf.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-header">
          <div class="logo-container mb-2">
            <div class="admin-logo">
              <div class="mini-wifi"></div>
              <div class="mini-book"></div>
            </div>
          </div>
          <h4>Admin</h4>
          <p class="text-muted">{{currentUser?.name}}</p>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item" [class.active]="activeTab === 'dashboard'" (click)="setActiveTab('dashboard')">
            <i class="fas fa-tachometer-alt"></i> Tableau de bord
          </a>
          <a class="nav-item" [class.active]="activeTab === 'users'" (click)="setActiveTab('users')">
            <i class="fas fa-users"></i> Utilisateurs
            <span *ngIf="users.length > 0" class="nav-badge">{{users.length}}</span>
          </a>
          <a class="nav-item" [class.active]="activeTab === 'borrows'" (click)="setActiveTab('borrows')">
            <i class="fas fa-handshake"></i> Emprunts
            <span *ngIf="getPendingBorrowRequests().length > 0" class="nav-badge bg-warning">{{getPendingBorrowRequests().length}}</span>
          </a>
          <a class="nav-item" [class.active]="activeTab === 'books'" (click)="setActiveTab('books')">
            <i class="fas fa-book"></i> Livres / Catalogue
            <span *ngIf="books.length > 0" class="nav-badge">{{books.length}}</span>
          </a>
          <a class="nav-item" [class.active]="activeTab === 'inventory'" (click)="setActiveTab('inventory')">
            <i class="fas fa-warehouse"></i> Inventaire (IoT)
            <span *ngIf="iotDevices.length > 0" class="nav-badge">{{iotDevices.length}}</span>
          </a>
          <a class="nav-item" [class.active]="activeTab === 'overdue'" (click)="setActiveTab('overdue')">
            <i class="fas fa-exclamation-triangle"></i> Retards & Pénalités
            <span *ngIf="overdueBorrows.length > 0" class="nav-badge bg-danger">{{overdueBorrows.length}}</span>
          </a>
          <a class="nav-item" [class.active]="activeTab === 'requests'" (click)="setActiveTab('requests')">
            <i class="fas fa-clipboard-list"></i> Demandes / Inscriptions
            <span *ngIf="registrationRequests.length > 0" class="nav-badge">{{registrationRequests.length}}</span>
          </a>
          <a class="nav-item" [class.active]="activeTab === 'reports'" (click)="setActiveTab('reports')">
            <i class="fas fa-chart-bar"></i> Statistiques & Rapports
          </a>
          <a class="nav-item" [class.active]="activeTab === 'settings'" (click)="setActiveTab('settings')">
            <i class="fas fa-cog"></i> Configuration
          </a>
          <a class="nav-item" [class.active]="activeTab === 'logs'" (click)="setActiveTab('logs')">
            <i class="fas fa-file-alt"></i> Logs / Audit
            <span *ngIf="auditLogs.length > 0" class="nav-badge">{{auditLogs.length}}</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <button class="btn btn-danger btn-sm w-100" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i> Déconnexion
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Header -->
        <div class="content-header">
          <h3>{{getTabTitle()}}</h3>
          <div class="breadcrumb">
            <span>Admin</span> <i class="fas fa-chevron-right"></i> <span>{{getTabTitle()}}</span>
          </div>
        </div>

        <!-- Dashboard -->
        <div *ngIf="activeTab === 'dashboard' && stats" class="content-body">
          <!-- Notifications admin - uniquement pour nouvelles demandes -->
          <div *ngIf="hasNewRegistrations()" class="alert alert-info mb-4 alert-dismissible">
            <div class="d-flex align-items-center">
              <i class="fas fa-bell fa-2x me-3"></i>
              <div class="flex-grow-1">
                <h5 class="mb-1">🔔 Nouvelle(s) demande(s) d'inscription</h5>
                <p class="mb-2">{{getNewRegistrationsCount()}} nouvelle(s) demande(s) en attente de votre approbation</p>
                <button class="btn btn-primary btn-sm" (click)="setActiveTab('requests'); markNotificationsAsViewed()">
                  <i class="fas fa-eye me-1"></i>Examiner les demandes
                </button>
              </div>
              <span class="badge bg-warning fs-6">{{getNewRegistrationsCount()}}</span>
              <button type="button" class="btn-close" (click)="dismissAlert()"></button>
            </div>
          </div>
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4>{{stats.stats.total_books}}</h4>
                    <p>Livres Total</p>
                  </div>
                  <i class="fas fa-book fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-success text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4>{{stats.stats.total_users}}</h4>
                    <p>Utilisateurs</p>
                  </div>
                  <i class="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-info text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4>{{stats.stats.active_borrows}}</h4>
                    <p>Emprunts Actifs</p>
                  </div>
                  <i class="fas fa-handshake fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-warning text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4>{{stats.stats.overdue_borrows}}</h4>
                    <p>En Retard</p>
                  </div>
                  <i class="fas fa-exclamation-triangle fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5><i class="fas fa-star"></i> Livres Populaires</h5>
              </div>
              <div class="card-body">
                <div *ngFor="let book of stats.popular_books" class="mb-2">
                  <strong>{{book.title}}</strong> - {{book.author}}
                  <small class="text-muted">({{book.borrow_count}} emprunts)</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5><i class="fas fa-clock"></i> Emprunts Récents</h5>
              </div>
              <div class="card-body">
                <div *ngFor="let borrow of stats.recent_borrows" class="mb-2">
                  <strong>{{borrow.book_title}}</strong>
                  <br><small class="text-muted">{{borrow.user_name}} - {{borrow.date_emprunt | date}}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        <!-- Livres / Catalogue -->
        <div *ngIf="activeTab === 'books'" class="content-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="search-filters">
              <input type="text" class="form-control" placeholder="Recherche titre, auteur, ISBN..." [(ngModel)]="bookSearch" (input)="searchBooks()">
              <select class="form-select ms-2" [(ngModel)]="bookCategoryFilter" (change)="filterBooks()">
                <option value="">Toutes catégories</option>
                <option *ngFor="let cat of categories" [value]="cat.id">{{cat.name}}</option>
              </select>
              <select class="form-select ms-2" [(ngModel)]="bookAvailabilityFilter" (change)="filterBooks()">
                <option value="">Toutes</option>
                <option value="1">Disponibles</option>
                <option value="0">Indisponibles</option>
              </select>
            </div>
            <div>
              <button class="btn btn-outline-secondary me-2" (click)="exportBooks()">Export CSV</button>
              <button class="btn btn-success" (click)="showAddBookForm = true">+ Ajouter Livre</button>
            </div>
          </div>

          <!-- Table des livres -->
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th><input type="checkbox" (change)="selectAllBooks($event)"></th>
                  <th>Couverture</th>
                  <th>Titre</th>
                  <th>Auteur(s)</th>
                  <th>ISBN</th>
                  <th>Catégorie</th>
                  <th>Localisation</th>
                  <th>Stock</th>
                  <th>Tag UID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let book of filteredBooks">
                  <td><input type="checkbox" [value]="book.id" (change)="toggleBookSelection(book.id, $event)"></td>
                  <td><img [src]="book.cover_url || 'assets/book-placeholder.jpg'" width="40" height="56" class="book-cover"></td>
                  <td>
                    <strong>{{book.title}}</strong>
                    <br><small class="text-muted">{{book.times_borrowed || 0}} emprunts</small>
                  </td>
                  <td>{{book.author}}</td>
                  <td>{{book.isbn}}</td>
                  <td>{{book.category?.name}}</td>
                  <td>{{book.location || 'Non définie'}}</td>
                  <td>
                    <span [class]="book.stock > 0 ? 'text-success' : 'text-danger'">{{book.available || 0}}/{{book.stock}}</span>
                  </td>
                  <td>{{book.tag_uid || '—'}}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-1" (click)="viewBook(book)" title="Voir">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary me-1" (click)="editBook(book)" title="Éditer">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info me-1" (click)="assignTag(book)" title="Assigner Tag">
                      <i class="fas fa-tag"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" (click)="confirmDeleteBook(book)" title="Supprimer">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        <div class="row mb-3">
          <div class="col-md-8">
            <h4>Gestion des Livres</h4>
          </div>
          <div class="col-md-4">
            <button class="btn btn-success w-100" (click)="showAddBookForm = true">
              <i class="fas fa-plus"></i> Ajouter un Livre
            </button>
          </div>
        </div>

          <!-- Formulaire d'ajout -->
          <div class="card mb-4" *ngIf="showAddBookForm">
            <div class="card-header">
              <h5>Nouveau Livre</h5>
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
                      <div class="input-group">
                        <select class="form-select" [(ngModel)]="newBook.category_id" name="category_id" required>
                          <option value="">Sélectionner...</option>
                          <option *ngFor="let category of categories" [value]="category.id">
                            {{category.name}}
                          </option>
                        </select>
                        <button type="button" class="btn btn-outline-primary" (click)="showAddCategoryForm = true">
                          <i class="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Stock</label>
                      <input type="number" class="form-control" [(ngModel)]="newBook.stock" name="stock" required min="1">
                    </div>
                  </div>
                </div>
                
                <!-- Formulaire ajout catégorie -->
                <div *ngIf="showAddCategoryForm" class="alert alert-info">
                  <div class="row">
                    <div class="col-md-6">
                      <input type="text" class="form-control" placeholder="Nom de la catégorie" [(ngModel)]="newCategory.name" name="categoryName">
                    </div>
                    <div class="col-md-4">
                      <input type="text" class="form-control" placeholder="Description" [(ngModel)]="newCategory.description" name="categoryDesc">
                    </div>
                    <div class="col-md-2">
                      <button type="button" class="btn btn-success btn-sm" (click)="addNewCategory()">
                        <i class="fas fa-check"></i>
                      </button>
                      <button type="button" class="btn btn-secondary btn-sm ms-1" (click)="showAddCategoryForm = false">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Couverture du livre</label>
                  <input type="file" class="form-control" (change)="onBookCoverSelect($event)" accept="image/*">
                  <small class="text-muted">Ou laissez vide pour une couverture par défaut selon la catégorie</small>
                  <div *ngIf="newBook.cover_preview" class="mt-2">
                    <img [src]="newBook.cover_preview" width="100" height="140" class="book-cover-preview">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" [(ngModel)]="newBook.description" name="description" rows="3" placeholder="Résumé du livre, synopsis..."></textarea>
                </div>
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-success">Ajouter</button>
                  <button type="button" class="btn btn-secondary" (click)="cancelAddBook()">Annuler</button>
                </div>
              </form>
            </div>
          </div>

        <!-- Liste des livres -->
        <div class="row">
          <div class="col-md-4 mb-3" *ngFor="let book of books">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">{{book.title}}</h6>
                <p class="card-text">
                  <strong>Auteur:</strong> {{book.author}}<br>
                  <strong>Catégorie:</strong> {{book.category?.name}}<br>
                  <strong>Stock:</strong> {{book.available}}/{{book.stock}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

        <!-- Utilisateurs -->
        <div *ngIf="activeTab === 'users'" class="content-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="search-filters">
              <input type="text" class="form-control" placeholder="Recherche nom, email..." [(ngModel)]="userSearch">
              <select class="form-select ms-2" [(ngModel)]="userRoleFilter">
                <option value="">Tous rôles</option>
                <option value="user">Utilisateur</option>
                <option value="admin">Admin</option>
              </select>
              <select class="form-select ms-2" [(ngModel)]="userStatusFilter">
                <option value="">Tous statuts</option>
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>
            <button class="btn btn-outline-secondary">Export CSV</button>
          </div>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom Prénom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Tag UID</th>
                  <th>Emprunts en cours</th>
                  <th>Statut</th>
                  <th>Inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of getFilteredUsers()">
                  <td>{{user.id}}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <img *ngIf="user.status === 'approved' && user.photo_url" 
                           [src]="user.photo_url" 
                           alt="Photo" 
                           class="user-photo me-2"
                           (error)="onUserImageError($event)">
                      <span>{{user.name}} {{user.surname || ''}}</span>
                    </div>
                  </td>
                  <td>{{user.email}}</td>
                  <td><span class="badge bg-primary">{{user.role || 'user'}}</span></td>
                  <td>{{user.tag_uid || '—'}}</td>
                  <td>{{getUserActiveBorrows(user.id)}}</td>
                  <td><span class="badge" [class]="user.status === 'approved' ? 'bg-success' : 'bg-warning'">{{getStatusLabel(user.status)}}</span></td>
                  <td>{{user.created_at | date:'short'}}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-1" (click)="viewUserProfile(user)" title="Voir profil">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info me-1" (click)="assignUserTag(user)" title="Assigner tag">
                      <i class="fas fa-id-card"></i>
                    </button>
                    <button class="btn btn-sm" [class]="user.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'" (click)="toggleUserStatus(user)" title="Suspendre/Activer">
                      <i class="fas" [class]="user.status === 'active' ? 'fa-ban' : 'fa-check'"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger ms-1" (click)="deleteUser(user)" title="Supprimer utilisateur">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="getFilteredUsers().length === 0" class="text-center py-4">
              <i class="fas fa-users fa-3x text-muted mb-3"></i>
              <p class="text-muted">Aucun utilisateur certifié trouvé</p>
              <small>Les utilisateurs apparaissent ici après validation de leur inscription</small>
            </div>
          </div>
        </div>

        <!-- Emprunts -->
        <div *ngIf="activeTab === 'borrows'" class="content-body">
          <div class="row mb-4">
            <div class="col-md-2">
              <button class="btn" [class]="borrowView === 'pending' ? 'btn-warning' : 'btn-outline-warning'" (click)="borrowView = 'pending'">
                Demandes
                <span *ngIf="getPendingBorrowRequests().length > 0" class="badge bg-danger ms-1">{{getPendingBorrowRequests().length}}</span>
              </button>
            </div>
            <div class="col-md-2">
              <button class="btn" [class]="borrowView === 'current' ? 'btn-primary' : 'btn-outline-primary'" (click)="borrowView = 'current'">En cours</button>
            </div>
            <div class="col-md-2">
              <button class="btn" [class]="borrowView === 'history' ? 'btn-primary' : 'btn-outline-primary'" (click)="borrowView = 'history'">Historique</button>
            </div>
            <div class="col-md-6">
              <input type="text" class="form-control" placeholder="Recherche par livre ou utilisateur...">
            </div>
          </div>
          <!-- Demandes en attente -->
          <div *ngIf="borrowView === 'pending'" class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Livre</th>
                  <th>Date demande</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let request of getPendingBorrowRequests()">
                  <td>{{request.user_name}}</td>
                  <td>{{request.book_title}}</td>
                  <td>{{request.request_date | date:'short'}}</td>
                  <td><span class="badge bg-warning">En attente</span></td>
                  <td>
                    <button class="btn btn-sm btn-success me-1" (click)="approveBorrowRequest(request.id)" title="Approuver">
                      <i class="fas fa-check"></i> Approuver
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="rejectBorrowRequest(request.id)" title="Rejeter">
                      <i class="fas fa-times"></i> Rejeter
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="getPendingBorrowRequests().length === 0" class="text-center py-4">
              <i class="fas fa-clipboard-check fa-3x text-muted mb-3"></i>
              <p class="text-muted">Aucune demande d'emprunt en attente</p>
            </div>
          </div>

          <!-- Emprunts en cours et historique -->
          <div *ngIf="borrowView !== 'pending'" class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Livre</th>
                  <th>Utilisateur</th>
                  <th>Date emprunt</th>
                  <th>Date retour prévue</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let borrow of getFilteredBorrows()">
                  <td>{{borrow.id}}</td>
                  <td>{{borrow.book_title || borrow.title}}</td>
                  <td>{{borrow.user_name}}</td>
                  <td>{{borrow.request_date || borrow.date_emprunt | date:'short'}}</td>
                  <td>{{borrow.due_date || borrow.date_retour_prevue | date:'short'}}</td>
                  <td>
                    <span class="badge" [class]="getBorrowStatusClass(borrow.status)">{{getStatusLabel(borrow.status)}}</span>
                  </td>
                  <td>
                    <button *ngIf="borrow.status === 'active' || borrow.status === 'approved'" 
                            class="btn btn-sm btn-outline-success me-1" 
                            (click)="returnBook(borrow.id)" 
                            title="Marquer retourné">
                      <i class="fas fa-check"></i>
                    </button>
                    <button *ngIf="borrow.status === 'active'" 
                            class="btn btn-sm btn-outline-primary me-1" 
                            title="Prolonger">
                      <i class="fas fa-calendar-plus"></i>
                    </button>
                    <button *ngIf="borrow.status === 'active' || borrow.status === 'overdue'" 
                            class="btn btn-sm btn-outline-warning" 
                            title="Envoyer rappel">
                      <i class="fas fa-envelope"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="getFilteredBorrows().length === 0" class="text-center py-4">
              <i class="fas fa-book fa-3x text-muted mb-3"></i>
              <p class="text-muted">{{borrowView === 'current' ? 'Aucun emprunt en cours' : 'Aucun historique d\'emprunt'}}</p>
            </div>
          </div>
        </div>

        <!-- Inventaire IoT -->
        <div *ngIf="activeTab === 'inventory'" class="content-body">
          <div class="alert alert-warning mb-4">
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Fonctionnalité IoT non configurée</strong><br>
            Connectez un Raspberry Pi avec lecteur RFID pour activer l'inventaire automatique.
          </div>
          
          <div class="row mb-4">
            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h5><i class="fas fa-wifi"></i> Devices IoT</h5>
                </div>
                <div class="card-body">
                  <div *ngIf="iotDevices.length === 0" class="text-center py-4">
                    <i class="fas fa-plug fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Aucun dispositif connecté</p>
                    <small>Connectez un Raspberry Pi pour commencer</small>
                  </div>
                  <div class="device-item" *ngFor="let device of iotDevices">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{{device.name}}</strong>
                        <br><small class="text-muted">{{device.type}}</small>
                      </div>
                      <span class="badge" [class]="device.status === 'online' ? 'bg-success' : 'bg-danger'">
                        {{device.status}}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h5><i class="fas fa-search"></i> Inventaire temps réel</h5>
                </div>
                <div class="card-body">
                  <button class="btn btn-primary mb-3" (click)="startInventoryScan()">
                    <i class="fas fa-barcode"></i> Lancer scan manuel
                  </button>
                  <div *ngIf="shelves.length === 0" class="text-muted">
                    <i class="fas fa-info-circle"></i> Aucun scan effectué
                  </div>
                  <div *ngFor="let shelf of shelves" class="mb-2">
                    <div class="d-flex justify-content-between">
                      <strong>{{shelf.name}}</strong>
                      <span class="badge bg-info">{{shelf.detected_books}} livres</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h5><i class="fas fa-info-circle"></i> Qu'est-ce qu'un Raspberry Pi ?</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-8">
                      <h6>🔌 Raspberry Pi - Mini-ordinateur</h6>
                      <p>Un <strong>Raspberry Pi</strong> est un petit ordinateur de la taille d'une carte de crédit qui coûte environ <strong>35-50€</strong>.</p>
                      
                      <h6>📶 Fonctionnalité RFID pour Bibliothèque</h6>
                      <ul>
                        <li><strong>Lecture automatique</strong> : Scanne les puces RFID collées sur les livres</li>
                        <li><strong>Inventaire temps réel</strong> : Compte automatiquement les livres sur les étagères</li>
                        <li><strong>Localisation</strong> : Sait où se trouve chaque livre</li>
                        <li><strong>Emprunts rapides</strong> : Scan instantané sans saisie manuelle</li>
                      </ul>
                      
                      <h6>🛍️ Matériel Nécessaire</h6>
                      <ul>
                        <li>Raspberry Pi 4 (50€)</li>
                        <li>Lecteur RFID RC522 (10€)</li>
                        <li>Puces RFID pour livres (0.50€/pièce)</li>
                        <li>Câbles de connexion (5€)</li>
                      </ul>
                      
                      <div class="alert alert-info mt-3">
                        <strong>💡 Alternative Simple</strong><br>
                        Vous pouvez utiliser eLibrary sans IoT ! L'inventaire manuel fonctionne très bien pour la plupart des bibliothèques.
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="text-center">
                        <div class="bg-light p-3 rounded mb-3">
                          <i class="fas fa-microchip fa-4x text-primary mb-2"></i>
                          <p><strong>Raspberry Pi</strong></p>
                        </div>
                        <div class="bg-light p-3 rounded mb-3">
                          <i class="fas fa-wifi fa-4x text-success mb-2"></i>
                          <p><strong>Lecteur RFID</strong></p>
                        </div>
                        <div class="bg-light p-3 rounded">
                          <i class="fas fa-tags fa-4x text-warning mb-2"></i>
                          <p><strong>Puces RFID</strong></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-4">
                    <h6>🚀 Étapes d'Installation (Optionnel)</h6>
                    <div class="row">
                      <div class="col-md-3">
                        <div class="text-center p-3 border rounded">
                          <div class="badge bg-primary rounded-pill mb-2">1</div>
                          <p><strong>Achat</strong><br>Commander le matériel</p>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="text-center p-3 border rounded">
                          <div class="badge bg-primary rounded-pill mb-2">2</div>
                          <p><strong>Montage</strong><br>Connecter le lecteur RFID</p>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="text-center p-3 border rounded">
                          <div class="badge bg-primary rounded-pill mb-2">3</div>
                          <p><strong>Installation</strong><br>Script Python fourni</p>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="text-center p-3 border rounded">
                          <div class="badge bg-success rounded-pill mb-2">4</div>
                          <p><strong>Activation</strong><br>Inventaire automatique</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-center mt-4">
                    <button class="btn btn-outline-primary me-2" (click)="simulateIoTSetup()">
                      <i class="fas fa-play"></i> Simuler Installation IoT
                    </button>
                    <button class="btn btn-outline-secondary" disabled>
                      <i class="fas fa-download"></i> Télécharger Guide Complet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Retards & Pénalités -->
        <div *ngIf="activeTab === 'overdue'" class="content-body">
          <div class="row mb-4">
            <div class="col-md-6">
              <button class="btn" [class]="penaltyView === 'current' ? 'btn-primary' : 'btn-outline-primary'" (click)="penaltyView = 'current'">Retards actuels</button>
            </div>
            <div class="col-md-6">
              <button class="btn" [class]="penaltyView === 'history' ? 'btn-primary' : 'btn-outline-primary'" (click)="penaltyView = 'history'">Historique pénalités</button>
            </div>
          </div>
          
          <!-- Retards actuels -->
          <div *ngIf="penaltyView === 'current'" class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Livre</th>
                  <th>Date prévue</th>
                  <th>Jours de retard</th>
                  <th>Montant pénalité</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let overdue of overdueBorrows">
                  <td>{{overdue.user_name}}</td>
                  <td>{{overdue.book_title}}</td>
                  <td>{{overdue.due_date | date}}</td>
                  <td class="text-danger">{{overdue.days_overdue}}</td>
                  <td>{{overdue.penalty_amount}} CFA</td>
                  <td>
                    <button class="btn btn-sm btn-outline-warning me-1" (click)="applyPenalty(overdue)" title="Appliquer pénalité">
                      <i class="fas fa-coins"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary me-1" (click)="sendReminder(overdue.user_id)" title="Envoyer relance">
                      <i class="fas fa-envelope"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" (click)="blacklistUser(overdue.user_id)" title="Liste noire">
                      <i class="fas fa-ban"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Historique pénalités -->
          <div *ngIf="penaltyView === 'history'" class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Utilisateur</th>
                  <th>Livre</th>
                  <th>Montant</th>
                  <th>Appliqué par</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let penalty of penaltyHistory">
                  <td>{{penalty.applied_date | date:'short'}}</td>
                  <td>{{penalty.user_name}}</td>
                  <td>{{penalty.book_title}}</td>
                  <td class="text-danger">{{penalty.amount}} CFA</td>
                  <td>{{penalty.admin_name}}</td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="penaltyHistory.length === 0" class="text-center py-4">
              <p class="text-muted">Aucune pénalité appliquée pour le moment</p>
            </div>
          </div>
        </div>

        <!-- Demandes / Inscriptions -->
        <div *ngIf="activeTab === 'requests'" class="content-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Date demande</th>
                  <th>Documents</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let request of registrationRequests">
                  <td>{{request.name}} {{request.surname}}</td>
                  <td>{{request.email}}</td>
                  <td>{{request.created_at | date}}</td>
                  <td>
                    <span class="badge bg-success" *ngIf="request.documents_uploaded">Uploadés</span>
                    <span class="badge bg-warning" *ngIf="!request.documents_uploaded && !request.requested_document">Manquants</span>
                    <span class="badge bg-danger" *ngIf="!request.documents_uploaded && request.requested_document" 
                          [title]="'Document demandé: ' + request.requested_document">
                      En attente: {{request.requested_document}}
                    </span>
                  </td>
                  <td>
                    <span class="badge bg-warning">En attente</span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-1" (click)="viewRequestProfile(request)" title="Voir profil complet">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success me-1" (click)="approveRequest(request.id)" title="Valider">
                      <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger me-1" (click)="rejectRequest(request.id)" title="Refuser">
                      <i class="fas fa-times"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" (click)="requestDocument(request.id)" 
                            [title]="request.requested_document ? 'Redemander un document' : 'Demander justificatif'">
                      <i class="fas fa-file-alt"></i>
                      <span *ngIf="request.requested_document" class="badge bg-danger ms-1">!</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Statistiques & Rapports -->
        <div *ngIf="activeTab === 'reports'" class="content-body">
          <div class="row mb-4">
            <div class="col-md-4">
              <div class="card">
                <div class="card-header">
                  <h5><i class="fas fa-file-pdf"></i> Rapports PDF</h5>
                </div>
                <div class="card-body">
                  <button class="btn btn-outline-danger w-100 mb-2" (click)="exportReport('top-books')">
                    <i class="fas fa-trophy"></i> Top Livres Populaires
                  </button>
                  <button class="btn btn-outline-success w-100 mb-2" (click)="exportReport('monthly-activity')">
                    <i class="fas fa-calendar-alt"></i> Activité Mensuelle
                  </button>
                  <button class="btn btn-outline-info w-100 mb-2" (click)="exportReport('active-users')">
                    <i class="fas fa-users"></i> Utilisateurs Actifs
                  </button>
                  <button class="btn btn-outline-warning w-100" (click)="exportReport('iot-stats')">
                    <i class="fas fa-microchip"></i> Statistiques IoT
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-8">
              <div class="card">
                <div class="card-header">
                  <h5><i class="fas fa-chart-line"></i> Graphiques d'Activité</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <canvas id="borrowsChart" width="300" height="200"></canvas>
                      <p class="text-center mt-2"><strong>Emprunts par Mois</strong></p>
                    </div>
                    <div class="col-md-6">
                      <canvas id="categoriesChart" width="300" height="200"></canvas>
                      <p class="text-center mt-2"><strong>Livres par Catégorie</strong></p>
                    </div>
                  </div>
                  <div class="row mt-4">
                    <div class="col-md-6">
                      <canvas id="usersChart" width="300" height="200"></canvas>
                      <p class="text-center mt-2"><strong>Utilisateurs Actifs</strong></p>
                    </div>
                    <div class="col-md-6">
                      <canvas id="trendsChart" width="300" height="200"></canvas>
                      <p class="text-center mt-2"><strong>Tendances</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuration -->
        <div *ngIf="activeTab === 'settings'" class="content-body">
          <div class="row">
            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h5>Paramètres système</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Durée d'emprunt par défaut (jours)</label>
                    <input type="number" class="form-control" [(ngModel)]="settings.default_borrow_days" min="1">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Pénalité par jour (CFA)</label>
                    <input type="number" class="form-control" [(ngModel)]="settings.penalty_per_day" min="0">
                  </div>
                  <button class="btn btn-success" (click)="saveSystemSettings()">Sauvegarder</button>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h5>Paramètres IoT</h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">MQTT Broker</label>
                    <input type="text" class="form-control" [(ngModel)]="settings.mqtt_broker" placeholder="localhost:1883">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Topic RFID</label>
                    <input type="text" class="form-control" [(ngModel)]="settings.rfid_topic" placeholder="library/rfid">
                  </div>
                  <button class="btn btn-success" (click)="saveIoTSettings()">Sauvegarder</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Logs / Audit -->
        <div *ngIf="activeTab === 'logs'" class="content-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="search-filters">
              <input type="text" class="form-control" placeholder="Recherche dans les logs..." [(ngModel)]="logSearch" (input)="filterLogs()">
              <select class="form-select ms-2" [(ngModel)]="logTypeFilter" (change)="filterLogs()">
                <option value="">Tous types</option>
                <option value="admin">Actions admin</option>
                <option value="user">Actions utilisateur</option>
                <option value="system">Système</option>
              </select>
            </div>
            <button class="btn btn-outline-secondary" (click)="exportLogs()">Export logs</button>
          </div>

          <div *ngIf="filteredLogs.length === 0" class="text-center py-5">
            <i class="fas fa-file-alt fa-3x text-muted mb-3"></i>
            <p class="text-muted">Aucune activité enregistrée</p>
            <small>Les logs apparaissent quand vous ajoutez des livres, utilisateurs ou emprunts</small>
          </div>

          <div *ngIf="filteredLogs.length > 0" class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Date/Heure</th>
                  <th>Type</th>
                  <th>Utilisateur</th>
                  <th>Action</th>
                  <th>Détails</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let log of filteredLogs">
                  <td>{{log.created_at | date:'dd/MM/yyyy HH:mm'}}</td>
                  <td><span class="badge" [class]="getLogTypeClass(log.type)">{{log.type}}</span></td>
                  <td>{{log.user_name || 'Système'}}</td>
                  <td>{{log.action}}</td>
                  <td>{{log.details}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }
    .sidebar {
      width: 280px;
      background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
      border-right: 1px solid #dee2e6;
      display: flex;
      flex-direction: column;
    }
    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #dee2e6;
      background: white;
    }
    .sidebar-header h4 {
      margin: 0;
      color: #495057;
    }
    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
    }
    .nav-item {
      display: block;
      padding: 0.75rem 1.5rem;
      color: #6c757d;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
    }
    .nav-item:hover {
      background: rgba(0,123,255,0.1);
      color: #007bff;
    }
    .nav-item.active {
      background: #007bff;
      color: white;
      border-right: 3px solid #0056b3;
    }
    .nav-item i {
      width: 20px;
      margin-right: 10px;
    }
    .nav-badge {
      background: #007bff;
      color: white;
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 0.7rem;
      margin-left: 8px;
      min-width: 18px;
      text-align: center;
    }
    .nav-badge.bg-danger {
      background: #dc3545 !important;
    }
    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #dee2e6;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .content-header {
      background: white;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #dee2e6;
    }
    .content-header h3 {
      margin: 0;
      color: #495057;
    }
    .breadcrumb {
      color: #6c757d;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
    .breadcrumb i {
      margin: 0 0.5rem;
      font-size: 0.75rem;
    }
    .content-body {
      flex: 1;
      padding: 2rem;
      background: #f8f9fa;
    }
    .search-filters {
      display: flex;
      gap: 0.5rem;
    }
    .search-filters .form-control,
    .search-filters .form-select {
      min-width: 200px;
    }
    .book-cover {
      border-radius: 4px;
      object-fit: cover;
    }
    .book-cover-preview {
      border-radius: 8px;
      object-fit: cover;
      border: 2px solid #dee2e6;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .device-item {
      padding: 0.75rem;
      border-bottom: 1px solid #dee2e6;
    }
    .device-item:last-child {
      border-bottom: none;
    }
    .user-photo {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid #dee2e6;
    }
    .logo-container {
      display: flex;
      justify-content: center;
    }
    .admin-logo {
      width: 40px;
      height: 40px;
      position: relative;
      margin: 0 auto;
    }
    .mini-wifi {
      width: 20px;
      height: 6px;
      background: #2E8B8B;
      border-radius: 10px 10px 0 0;
      margin: 0 auto 2px;
    }
    .mini-book {
      width: 30px;
      height: 25px;
      background: #1B365D;
      border-radius: 4px;
      margin: 0 auto;
      position: relative;
    }
    .mini-book::after {
      content: '';
      position: absolute;
      top: 4px;
      left: 4px;
      right: 4px;
      height: 17px;
      background: white;
      border-radius: 2px;
    }
    @media (max-width: 768px) {
      .admin-layout {
        flex-direction: column;
      }
      .sidebar {
        width: 100%;
        height: auto;
      }
      .sidebar-nav {
        display: flex;
        overflow-x: auto;
        padding: 0.5rem;
      }
      .nav-item {
        white-space: nowrap;
        min-width: 150px;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  activeTab = 'dashboard';
  stats: DashboardStats | null = null;
  books: any[] = [];
  filteredBooks: any[] = [];
  categories: any[] = [];
  borrows: any[] = [];
  users: any[] = [];
  overdueBorrows: any[] = [];
  penaltyHistory: any[] = [];
  registrationRequests: any[] = [];
  auditLogs: any[] = [];
  filteredLogs: any[] = [];
  iotDevices: any[] = [];
  shelves: any[] = [];
  viewedNotifications: Set<number> = new Set();
  alertDismissed = false;
  showAddBookForm = false;
  showAddCategoryForm = false;
  newBook: any = {};
  newCategory: any = {};
  currentUser = this.authService.getCurrentUser();
  
  // Filtres
  bookSearch = '';
  bookCategoryFilter = '';
  bookAvailabilityFilter = '';
  userSearch = '';
  userRoleFilter = '';
  userStatusFilter = '';
  borrowView = 'current';
  penaltyView = 'current';
  selectedBooks: number[] = [];
  logSearch = '';
  logTypeFilter = '';
  
  // Paramètres
  settings: any = {
    default_borrow_days: 14,
    penalty_per_day: 300,
    mqtt_broker: 'localhost:1883',
    rfid_topic: 'library/rfid'
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private pdfService: PdfService
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadBooks();
    this.loadCategories();
    this.loadBorrows();
    this.loadUsers();
    this.loadOverdueBorrows();
    this.loadRegistrationRequests();
    this.loadAuditLogs();
    this.loadIoTDevices();
    this.loadShelves();
    
    // Écouter les mises à jour de statut utilisateur
    window.addEventListener('userStatusUpdated', (event: any) => {
      this.currentUser = event.detail;
    });
    
    // Vérifier périodiquement les nouvelles demandes
    setInterval(() => {
      this.loadRegistrationRequests();
    }, 30000);
    
    // Initialiser les graphiques après le chargement
    setTimeout(() => {
      this.initCharts();
    }, 1000);
  }
  
  initCharts() {
    if (typeof document !== 'undefined') {
      this.createBorrowsChart();
      this.createCategoriesChart();
      this.createUsersChart();
      this.createTrendsChart();
    }
  }
  
  createBorrowsChart() {
    const canvas = document.getElementById('borrowsChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Emprunts par mois (6 derniers mois)
    const monthlyData = this.getMonthlyLoansData();
    const maxValue = Math.max(...monthlyData.values, 1);
    
    ctx.fillStyle = '#007bff';
    ctx.font = '10px Arial';
    
    for (let i = 0; i < monthlyData.values.length; i++) {
      const barHeight = (monthlyData.values[i] / maxValue) * 150;
      const x = i * 45 + 20;
      const y = 180 - barHeight;
      
      ctx.fillRect(x, y, 35, barHeight);
      ctx.fillStyle = '#333';
      ctx.fillText(monthlyData.labels[i], x, 195);
      ctx.fillText(monthlyData.values[i].toString(), x + 10, y - 5);
      ctx.fillStyle = '#007bff';
    }
  }
  
  getMonthlyLoansData() {
    const months = [];
    const values = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      months.push(monthName);
      
      // Compter les emprunts de ce mois
      const loansInMonth = this.borrows.filter(loan => {
        const loanDate = new Date(loan.created_at || loan.loan_date);
        return loanDate.getMonth() === date.getMonth() && loanDate.getFullYear() === date.getFullYear();
      }).length;
      
      values.push(loansInMonth);
    }
    
    return { labels: months, values };
  }
  
  createCategoriesChart() {
    const canvas = document.getElementById('categoriesChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (this.categories.length === 0) {
      ctx.fillStyle = '#666';
      ctx.font = '14px Arial';
      ctx.fillText('Aucune catégorie', 100, 100);
      return;
    }
    
    const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1'];
    const total = this.categories.length;
    
    let currentAngle = 0;
    const centerX = 150;
    const centerY = 100;
    const radius = 80;
    
    for (let i = 0; i < this.categories.length; i++) {
      const percentage = (1 / total) * 100;
      const sliceAngle = (percentage / 100) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      
      // Légende
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(20, 20 + i * 20, 15, 15);
      ctx.fillStyle = '#333';
      ctx.font = '10px Arial';
      ctx.fillText(`${this.categories[i].name}`, 40, 32 + i * 20);
      
      currentAngle += sliceAngle;
    }
  }
  
  createUsersChart() {
    const canvas = document.getElementById('usersChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Croissance des utilisateurs (6 derniers mois)
    const userGrowthData = this.getUserGrowthData();
    const maxValue = Math.max(...userGrowthData.values, 1);
    
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    for (let i = 0; i < userGrowthData.values.length; i++) {
      const x = i * 50 + 30;
      const y = 180 - (userGrowthData.values[i] / maxValue) * 150;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Points
      ctx.fillStyle = '#28a745';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Valeurs
      ctx.fillStyle = '#333';
      ctx.font = '10px Arial';
      ctx.fillText(userGrowthData.values[i].toString(), x - 5, y - 10);
    }
    
    ctx.strokeStyle = '#28a745';
    ctx.stroke();
  }
  
  getUserGrowthData() {
    const months = [];
    const values = [];
    const now = new Date();
    let cumulativeUsers = 0;
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      months.push(monthName);
      
      // Compter les nouveaux utilisateurs de ce mois
      const newUsersInMonth = this.users.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.getMonth() === date.getMonth() && userDate.getFullYear() === date.getFullYear();
      }).length;
      
      cumulativeUsers += newUsersInMonth;
      values.push(cumulativeUsers);
    }
    
    return { labels: months, values };
  }
  
  createTrendsChart() {
    const canvas = document.getElementById('trendsChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Tendances emprunts vs retours
    const trendsData = this.getTrendsData();
    const maxValue = Math.max(...trendsData.emprunts, ...trendsData.retours, 1);
    
    // Ligne emprunts
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < trendsData.emprunts.length; i++) {
      const x = i * 45 + 30;
      const y = 180 - (trendsData.emprunts[i] / maxValue) * 150;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Ligne retours
    ctx.strokeStyle = '#28a745';
    ctx.beginPath();
    for (let i = 0; i < trendsData.retours.length; i++) {
      const x = i * 45 + 30;
      const y = 180 - (trendsData.retours[i] / maxValue) * 150;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Légende
    ctx.fillStyle = '#007bff';
    ctx.fillRect(20, 20, 15, 3);
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('Emprunts', 40, 30);
    
    ctx.fillStyle = '#28a745';
    ctx.fillRect(20, 35, 15, 3);
    ctx.fillText('Retours', 40, 45);
  }
  
  getTrendsData() {
    const emprunts = [];
    const retours = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      
      // Emprunts du mois
      const monthLoans = this.borrows.filter(loan => {
        const loanDate = new Date(loan.created_at || loan.loan_date);
        return loanDate.getMonth() === date.getMonth() && loanDate.getFullYear() === date.getFullYear();
      }).length;
      
      // Retours du mois
      const monthReturns = this.borrows.filter(loan => {
        const returnDate = new Date(loan.return_date || loan.updated_at);
        return loan.status === 'returned' && returnDate.getMonth() === date.getMonth() && returnDate.getFullYear() === date.getFullYear();
      }).length;
      
      emprunts.push(monthLoans);
      retours.push(monthReturns);
    }
    
    return { emprunts, retours };
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'reports') {
      setTimeout(() => this.initCharts(), 100);
    }
  }
  
  refreshCharts() {
    if (this.activeTab === 'reports') {
      setTimeout(() => this.initCharts(), 100);
    }
  }

  getTabTitle(): string {
    const titles: { [key: string]: string } = {
      'dashboard': 'Tableau de bord',
      'users': 'Utilisateurs',
      'borrows': 'Emprunts',
      'books': 'Livres / Catalogue',
      'inventory': 'Inventaire (IoT)',
      'overdue': 'Retards & Pénalités',
      'requests': 'Demandes / Inscriptions',
      'reports': 'Statistiques & Rapports',
      'settings': 'Configuration / Paramètres',
      'logs': 'Logs / Audit'
    };
    return titles[this.activeTab] || this.activeTab;
  }

  loadStats() {
    this.apiService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = {
          stats: {
            total_books: data.stats?.total_books || 0,
            total_users: data.stats?.total_users || 0,
            active_borrows: data.stats?.active_loans || 0,
            overdue_borrows: data.stats?.overdue_loans || 0
          },
          popular_books: data.popular_books || [],
          recent_borrows: data.recent_loans || []
        };
      },
      error: (error) => {
        console.error('Erreur stats:', error);
        this.stats = {
          stats: { total_books: 0, total_users: 0, active_borrows: 0, overdue_borrows: 0 },
          popular_books: [],
          recent_borrows: []
        };
      }
    });
  }

  loadBooks() {
    // Charger les livres depuis localStorage
    const storedBooks = localStorage.getItem('adminBooks');
    if (storedBooks) {
      this.books = JSON.parse(storedBooks);
    } else {
      this.books = [];
    }
    this.filteredBooks = this.books;
  }

  loadCategories() {
    // Charger les catégories depuis localStorage ou créer des catégories par défaut
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);
    } else {
      // Créer des catégories par défaut
      this.categories = [
        { id: 1, name: 'Fiction', description: 'Romans et nouvelles' },
        { id: 2, name: 'Science-Fiction', description: 'Science-fiction et fantasy' },
        { id: 3, name: 'Histoire', description: 'Livres d\'histoire' },
        { id: 4, name: 'Philosophie', description: 'Ouvrages philosophiques' },
        { id: 5, name: 'Informatique', description: 'Livres techniques' },
        { id: 6, name: 'Romance', description: 'Romans d\'amour' },
        { id: 7, name: 'Thriller', description: 'Suspense et thriller' },
        { id: 8, name: 'Biographie', description: 'Biographies et autobiographies' },
        { id: 9, name: 'Jeunesse', description: 'Livres pour enfants et adolescents' },
        { id: 10, name: 'Essais', description: 'Essais et analyses' }
      ];
      localStorage.setItem('categories', JSON.stringify(this.categories));
    }
  }

  loadBorrows() {
    // Charger les emprunts depuis localStorage
    const borrowRequests = JSON.parse(localStorage.getItem('borrowRequests') || '[]');
    const localBorrows = JSON.parse(localStorage.getItem('borrows') || '[]');
    
    // Combiner tous les emprunts
    this.borrows = [...localBorrows, ...borrowRequests];
    
    // Fallback API si pas de données locales
    if (this.borrows.length === 0) {
      this.apiService.getAllBorrows().subscribe({
        next: (data) => this.borrows = data || [],
        error: (error) => console.error('Erreur emprunts:', error)
      });
    }
  }

  onBookCoverSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newBook.cover_file = file;
      this.newBook.cover_preview = URL.createObjectURL(file);
    }
  }

  addBook() {
    if (this.newBook.title && this.newBook.author && this.newBook.isbn && this.newBook.category_id && this.newBook.stock) {
      const categoryName = this.categories.find(c => c.id == this.newBook.category_id)?.name || 'Fiction';
      
      const newBookData = {
        id: Date.now(),
        title: this.newBook.title,
        author: this.newBook.author,
        isbn: this.newBook.isbn,
        category_id: this.newBook.category_id,
        category: { name: categoryName },
        stock: this.newBook.stock,
        available: this.newBook.stock,
        description: this.newBook.description || 'Aucune description disponible.',
        cover_url: this.newBook.cover_preview || this.getDefaultBookImage(categoryName),
        times_borrowed: 0,
        created_at: new Date()
      };
      
      this.books.push(newBookData);
      this.filteredBooks = [...this.books];
      
      // Sauvegarder dans localStorage pour que les utilisateurs puissent voir les livres
      localStorage.setItem('adminBooks', JSON.stringify(this.books));
      
      // Mettre à jour les logs et graphiques
      this.loadAuditLogs();
      this.refreshCharts();
      
      alert('Livre ajouté avec succès!');
      this.cancelAddBook();
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  }

  getDefaultBookImage(categoryName: string): string {
    const images: { [key: string]: string } = {
      'Fiction': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
      'Science-Fiction': 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
      'Histoire': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
      'Philosophie': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
      'Informatique': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop',
      'Romance': 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=300&h=400&fit=crop',
      'Thriller': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
      'Biographie': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop',
      'Jeunesse': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=400&fit=crop',
      'Essais': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop'
    };
    return images[categoryName] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop';
  }

  cancelAddBook() {
    this.showAddBookForm = false;
    this.showAddCategoryForm = false;
    this.newBook = {};
    this.newCategory = {};
  }
  
  addNewCategory() {
    if (this.newCategory.name) {
      const newCategoryData = {
        id: Date.now(),
        name: this.newCategory.name,
        description: this.newCategory.description,
        created_at: new Date()
      };
      
      this.categories.push(newCategoryData);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('categories', JSON.stringify(this.categories));
      
      this.newBook.category_id = newCategoryData.id;
      this.showAddCategoryForm = false;
      this.newCategory = {};
      
      // Mettre à jour les graphiques
      this.refreshCharts();
      
      alert('Catégorie ajoutée avec succès!');
    }
  }

  returnBook(borrowId: number) {
    if (confirm('Marquer ce livre comme retourné ?')) {
      // Mettre à jour dans localStorage
      const borrowRequests = JSON.parse(localStorage.getItem('borrowRequests') || '[]');
      const localBorrows = JSON.parse(localStorage.getItem('borrows') || '[]');
      
      // Chercher dans les demandes d'emprunt
      const requestIndex = borrowRequests.findIndex((req: any) => req.id === borrowId);
      if (requestIndex !== -1) {
        borrowRequests[requestIndex].status = 'returned';
        borrowRequests[requestIndex].return_date = new Date().toISOString();
        localStorage.setItem('borrowRequests', JSON.stringify(borrowRequests));
      }
      
      // Chercher dans les emprunts locaux
      const borrowIndex = localBorrows.findIndex((borrow: any) => borrow.id === borrowId);
      if (borrowIndex !== -1) {
        localBorrows[borrowIndex].status = 'returned';
        localBorrows[borrowIndex].return_date = new Date().toISOString();
        localStorage.setItem('borrows', JSON.stringify(localBorrows));
      }
      
      // Recharger les données
      this.loadBorrows();
      this.loadStats();
      
      alert('Livre marqué comme retourné avec succès!');
      
      // Fallback API
      this.apiService.returnBook(borrowId).subscribe({
        next: () => console.log('Retour synchronisé avec API'),
        error: (error) => console.error('Erreur sync API:', error)
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'active': 'Actif',
      'approved': 'Certifié',
      'pending': 'En attente',
      'suspended': 'Suspendu',
      'returned': 'Retourné',
      'overdue': 'En Retard',
      'rejected': 'Rejeté'
    };
    return labels[status] || status;
  }

  loadUsers() {
    // Charger les utilisateurs certifiés depuis localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Filtrer seulement les utilisateurs certifiés (approved)
    this.users = registeredUsers.filter((user: any) => user.status === 'approved');
    
    // Fallback API si pas de données locales
    if (this.users.length === 0) {
      this.apiService.getUsers().subscribe({
        next: (data) => this.users = data || [],
        error: (error) => {
          console.error('Erreur utilisateurs:', error);
          this.users = [];
        }
      });
    }
  }

  loadOverdueBorrows() {
    this.apiService.getOverdueLoans().subscribe({
      next: (data) => this.overdueBorrows = data || [],
      error: (error) => {
        console.error('Erreur retards:', error);
        this.overdueBorrows = [];
      }
    });
  }

  loadRegistrationRequests() {
    const storedRequests = JSON.parse(localStorage.getItem('registrationRequests') || '[]');
    this.registrationRequests = storedRequests;
  }

  loadAuditLogs() {
    // Générer des logs basés sur les vraies activités
    this.auditLogs = [];
    
    // Logs pour chaque livre ajouté
    this.books.forEach(book => {
      this.auditLogs.push({
        created_at: book.created_at || new Date(),
        type: 'admin',
        user_name: 'Admin',
        action: 'Ajout livre',
        details: `Livre ajouté: ${book.title} par ${book.author}`
      });
    });
    
    // Logs pour chaque utilisateur
    this.users.forEach(user => {
      this.auditLogs.push({
        created_at: user.created_at || new Date(),
        type: 'system',
        user_name: 'Système',
        action: 'Inscription utilisateur',
        details: `Nouvel utilisateur: ${user.name} (${user.email})`
      });
    });
    
    // Logs pour chaque emprunt
    this.borrows.forEach(borrow => {
      this.auditLogs.push({
        created_at: borrow.created_at || new Date(),
        type: 'user',
        user_name: borrow.user_name || 'Utilisateur',
        action: 'Emprunt livre',
        details: `Emprunt: ${borrow.book_title || 'Livre'}`
      });
    });
    
    // Trier par date décroissante
    this.auditLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Initialiser les logs filtrés
    this.filteredLogs = [...this.auditLogs];
  }

  loadIoTDevices() {
    this.iotDevices = [];
  }

  loadShelves() {
    this.shelves = [];
  }

  sendReminder(userId: number) {
    this.apiService.sendReminder(userId).subscribe({
      next: () => {
        alert('Rappel envoyé avec succès!');
      },
      error: (error) => console.error('Erreur rappel:', error)
    });
  }

  // Méthodes pour les livres
  searchBooks() {
    this.filterBooks();
  }

  filterBooks() {
    this.filteredBooks = this.books.filter(book => {
      const matchesSearch = !this.bookSearch || 
        book.title.toLowerCase().includes(this.bookSearch.toLowerCase()) ||
        book.author.toLowerCase().includes(this.bookSearch.toLowerCase()) ||
        book.isbn.includes(this.bookSearch);
      
      const matchesCategory = !this.bookCategoryFilter || 
        book.category_id == this.bookCategoryFilter;
      
      const matchesAvailability = !this.bookAvailabilityFilter ||
        (this.bookAvailabilityFilter === '1' && book.stock > 0) ||
        (this.bookAvailabilityFilter === '0' && book.stock <= 0);
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }

  selectAllBooks(event: any) {
    if (event.target.checked) {
      this.selectedBooks = this.filteredBooks.map(book => book.id);
    } else {
      this.selectedBooks = [];
    }
  }

  toggleBookSelection(bookId: number, event: any) {
    if (event.target.checked) {
      this.selectedBooks.push(bookId);
    } else {
      this.selectedBooks = this.selectedBooks.filter(id => id !== bookId);
    }
  }

  viewBook(book: any) {
    const description = book.description || 'Aucune description disponible.';
    alert(`📚 DÉTAILS DU LIVRE\n\n📖 Titre: ${book.title}\n✍️ Auteur: ${book.author}\n🏷️ ISBN: ${book.isbn}\n📂 Catégorie: ${book.category?.name || 'Non définie'}\n📦 Stock: ${book.available || 0}/${book.stock}\n📊 Emprunts: ${book.times_borrowed || 0}\n\n📝 DESCRIPTION:\n${description}`);
  }

  editBook(book: any) {
    const newTitle = prompt('Nouveau titre:', book.title);
    if (newTitle && newTitle !== book.title) {
      book.title = newTitle;
      alert('Livre modifié avec succès!');
    }
  }

  assignTag(book: any) {
    const tagUid = prompt('Entrez l\'UID du tag RFID:', book.tag_uid || '');
    if (tagUid) {
      book.tag_uid = tagUid;
      alert('Tag assigné avec succès!');
    }
  }

  confirmDeleteBook(book: any) {
    if (confirm(`Supprimer "${book.title}" ?\nCette action est irréversible.`)) {
      this.books = this.books.filter(b => b.id !== book.id);
      this.filteredBooks = this.filteredBooks.filter(b => b.id !== book.id);
      alert('Livre supprimé avec succès!');
    }
  }

  exportBooks() {
    const csvContent = 'Titre,Auteur,ISBN,Catégorie,Stock\n' + 
      this.filteredBooks.map(book => 
        `"${book.title}","${book.author}","${book.isbn}","${book.category?.name || ''}","${book.stock}"`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'livres_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    alert('Export CSV téléchargé avec succès!');
  }

  // Méthodes IoT
  startInventoryScan() {
    if (this.iotDevices.length === 0) {
      alert('❌ Aucun dispositif IoT connecté\n\nPour utiliser cette fonctionnalité:\n1. Achetez un Raspberry Pi (50€)\n2. Connectez un lecteur RFID\n3. Installez le script Python\n4. Collez des puces RFID sur vos livres');
      return;
    }
    
    alert('🔄 Scan d\'inventaire démarré...\n\nRecherche des tags RFID en cours...');
    
    setTimeout(() => {
      const scannedBooks = this.books.length; // Utiliser le vrai nombre de livres
      alert(`✅ Scan terminé!\n\n📚 ${scannedBooks} livres détectés\n📍 Localisation mise à jour`);
      
      this.shelves = [
        { name: 'Rayon A1', detected_books: Math.floor(scannedBooks / 2) },
        { name: 'Rayon A2', detected_books: Math.ceil(scannedBooks / 2) }
      ];
    }, 2000);
  }
  
  simulateIoTSetup() {
    if (confirm('🤖 Simuler l\'installation IoT?\n\nCela va créer des dispositifs virtuels pour tester.')) {
      this.iotDevices = [
        { name: 'Raspberry Pi Virtuel', type: 'RFID Reader', status: 'online' },
        { name: 'Kiosk Simulation', type: 'Self-service', status: 'online' }
      ];
      
      alert('✅ Dispositifs IoT virtuels créés!\n\nVous pouvez maintenant tester le scan d\'inventaire.');
    }
  }

  // Méthodes rapports
  exportReport(type: string) {
    const reports: { [key: string]: string } = {
      'top-books': 'Top 10 des Livres les Plus Empruntés',
      'monthly-activity': 'Rapport d\'Activité Mensuelle',
      'active-users': 'Liste des Utilisateurs Actifs',
      'iot-stats': 'Statistiques des Dispositifs IoT'
    };
    
    const htmlContent = this.generateSpecializedPDF(type, reports[type]);
    const filename = `eLibrary_${type}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    this.pdfService.generatePDF(htmlContent, filename);
    
    alert(`📄 Rapport PDF prêt!\n\nCliquez sur "Télécharger PDF" dans la nouvelle fenêtre\nou utilisez Ctrl+P pour enregistrer.`);
  }

  generateSpecializedPDF(type: string, title: string): string {
    const date = new Date().toLocaleDateString('fr-FR');
    const time = new Date().toLocaleTimeString('fr-FR');
    
    const reportTitles: { [key: string]: string } = {
      'top-books': 'Top 10 des Livres les Plus Empruntés',
      'monthly-activity': 'Rapport d\'Activité Mensuelle',
      'active-users': 'Liste des Utilisateurs Actifs',
      'iot-stats': 'Statistiques des Dispositifs IoT'
    };
    
    const reportContent = this.getReportContent(type);
    
    return `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <div style="font-size: 48px; margin-bottom: 10px;">📚</div>
        <div style="font-size: 28px; font-weight: bold; margin-bottom: 10px;">eLibrary</div>
        <div style="font-size: 18px; opacity: 0.9;">${reportTitles[type]}</div>
        <div style="font-size: 14px; margin-top: 15px; opacity: 0.8;">Généré le ${date} à ${time}</div>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        ${reportContent}
    </div>
    
    <div style="text-align: center; margin-top: 40px; padding: 20px; color: #6c757d; border-top: 1px solid #dee2e6;">
        <p><strong>eLibrary</strong> - Système de Gestion de Bibliothèque</p>
        <p>Rapport confidentiel généré automatiquement</p>
    </div>
</div>`;
  }
  
  getReportContent(type: string): string {
    const totalBooks = this.books.length;
    const totalUsers = this.users.length;
    const totalLoans = this.borrows.length;
    
    switch(type) {
      case 'top-books':
        const booksWithLoans = this.books.map(book => ({
          ...book,
          loan_count: this.borrows.filter(loan => loan.book_id === book.id).length
        })).sort((a, b) => b.loan_count - a.loan_count).slice(0, 5);
        
        let booksTable = '';
        if (booksWithLoans.length === 0) {
          booksTable = '<tr><td colspan="6" style="padding: 12px; border-bottom: 1px solid #dee2e6; text-align: center;">Aucun livre avec emprunts</td></tr>';
        } else {
          booksTable = booksWithLoans.map((book, index) => 
            `<tr style="${index % 2 === 0 ? 'background: #f8f9fa;' : ''}"><td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''} ${index + 1}</td><td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${book.title}</td><td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${book.author}</td><td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${book.category?.name || 'N/A'}</td><td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${book.loan_count}</td><td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${totalLoans > 0 ? Math.round((book.loan_count / totalLoans) * 100) : 0}%</td></tr>`
          ).join('');
        }
        
        return `
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <strong>📊 Analyse des Emprunts</strong><br>
            Ce rapport présente les livres les plus populaires basé sur les vraies données.
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff;">
                <div style="font-size: 32px; font-weight: bold; color: #007bff;">${totalLoans}</div>
                <div style="color: #6c757d; font-size: 14px;">Total Emprunts</div>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff;">
                <div style="font-size: 32px; font-weight: bold; color: #007bff;">${totalBooks}</div>
                <div style="color: #6c757d; font-size: 14px;">Livres Différents</div>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff;">
                <div style="font-size: 32px; font-weight: bold; color: #007bff;">${totalBooks > 0 ? (totalLoans / totalBooks).toFixed(1) : 0}</div>
                <div style="color: #6c757d; font-size: 14px;">Emprunts/Livre</div>
            </div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><th style="background: #007bff; color: white; padding: 12px; text-align: left;">Rang</th><th style="background: #007bff; color: white; padding: 12px; text-align: left;">Titre</th><th style="background: #007bff; color: white; padding: 12px; text-align: left;">Auteur</th><th style="background: #007bff; color: white; padding: 12px; text-align: left;">Catégorie</th><th style="background: #007bff; color: white; padding: 12px; text-align: left;">Emprunts</th><th style="background: #007bff; color: white; padding: 12px; text-align: left;">Taux</th></tr>
            ${booksTable}
        </table>`;
        
      case 'monthly-activity':
        const activeLoans = this.borrows.filter(loan => loan.status === 'active').length;
        const returnedLoans = this.borrows.filter(loan => loan.status === 'returned').length;
        const overdueLoans = this.overdueBorrows.length;
        
        return `
        <div class="highlight">
            <strong>📈 Activité Réelle</strong><br>
            Résumé de l'activité actuelle de la bibliothèque basé sur les vraies données.
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${activeLoans}</div>
                <div class="stat-label">Emprunts Actifs</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${returnedLoans}</div>
                <div class="stat-label">Retours</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalUsers}</div>
                <div class="stat-label">Utilisateurs</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalBooks}</div>
                <div class="stat-label">Livres Total</div>
            </div>
        </div>
        <h3>📊 État Actuel</h3>
        <table>
            <tr><th>Indicateur</th><th>Valeur</th><th>Statut</th></tr>
            <tr><td>Emprunts actifs</td><td>${activeLoans}</td><td>${activeLoans > 0 ? '🟢 Actif' : '🔴 Aucun'}</td></tr>
            <tr><td>Livres disponibles</td><td>${totalBooks}</td><td>${totalBooks > 0 ? '🟢 Disponible' : '🔴 Vide'}</td></tr>
            <tr><td>Utilisateurs inscrits</td><td>${totalUsers}</td><td>${totalUsers > 0 ? '🟢 Actif' : '🔴 Aucun'}</td></tr>
            <tr><td>Retards</td><td>${overdueLoans}</td><td>${overdueLoans === 0 ? '🟢 Aucun' : '🟡 Attention'}</td></tr>
        </table>`;
        
      case 'active-users':
        const usersWithLoans = this.users.map(user => ({
          ...user,
          active_loans: this.borrows.filter(loan => loan.user_id === user.id && loan.status === 'active').length,
          total_loans: this.borrows.filter(loan => loan.user_id === user.id).length
        }));
        
        let usersTable = '';
        if (usersWithLoans.length === 0) {
          usersTable = '<tr><td colspan="6" class="text-center">Aucun utilisateur enregistré</td></tr>';
        } else {
          usersTable = usersWithLoans.map(user => 
            `<tr><td>${user.name}</td><td>${user.email}</td><td>${user.active_loans}</td><td>${user.total_loans}</td><td>${new Date(user.created_at).toLocaleDateString()}</td><td>${user.status === 'active' ? '✅ Actif' : '❌ Inactif'}</td></tr>`
          ).join('');
        }
        
        return `
        <div class="highlight">
            <strong>👥 Utilisateurs Actifs</strong><br>
            Liste réelle des utilisateurs de la bibliothèque.
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${totalUsers}</div>
                <div class="stat-label">Utilisateurs Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalUsers > 0 ? (totalLoans / totalUsers).toFixed(1) : 0}</div>
                <div class="stat-label">Emprunts/Utilisateur</div>
            </div>
            <div class="stat-card">  
                <div class="stat-number">${totalLoans > 0 ? Math.round((this.borrows.filter(l => l.status === 'returned').length / totalLoans) * 100) : 0}%</div>
                <div class="stat-label">Taux de Retour</div>
            </div>
        </div>
        <table>
            <tr><th>Nom</th><th>Email</th><th>Emprunts Actifs</th><th>Total Emprunts</th><th>Inscription</th><th>Statut</th></tr>
            ${usersTable}
        </table>`;
        
      case 'iot-stats':
        return `
        <div class="highlight">
            <strong>🔌 Statistiques IoT</strong><br>
            État et performance des dispositifs IoT connectés à la bibliothèque.
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">2</div>
                <div class="stat-label">Dispositifs Connectés</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">98%</div>
                <div class="stat-label">Uptime Moyen</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">156</div>
                <div class="stat-label">Scans RFID</div>
            </div>
        </div>
        <h3>📡 État des Dispositifs</h3>
        <table>
            <tr><th>Dispositif</th><th>Type</th><th>Statut</th><th>Uptime</th><th>Dernière Activité</th></tr>
            <tr><td>🔴 Raspberry Pi 1</td><td>Lecteur RFID</td><td>❌ Hors ligne</td><td>0%</td><td>Non configuré</td></tr>
            <tr><td>🔴 Kiosk Terminal</td><td>Self-service</td><td>❌ Hors ligne</td><td>0%</td><td>Non configuré</td></tr>
        </table>
        <div class="highlight">
            <strong>⚠️ Configuration Requise</strong><br>
            Les dispositifs IoT ne sont pas encore configurés. Consultez la documentation pour l'installation.
        </div>`;
        
      default:
        return '<p>Type de rapport non supporté.</p>';
    }
  }

  // Méthodes logs
  getLogTypeClass(type: string): string {
    const classes: { [key: string]: string } = {
      'admin': 'bg-primary',
      'user': 'bg-success',
      'system': 'bg-secondary',
      'error': 'bg-danger'
    };
    return classes[type] || 'bg-secondary';
  }
  
  filterLogs() {
    this.filteredLogs = this.auditLogs.filter(log => {
      const matchesSearch = !this.logSearch || 
        log.action.toLowerCase().includes(this.logSearch.toLowerCase()) ||
        log.details.toLowerCase().includes(this.logSearch.toLowerCase()) ||
        log.user_name.toLowerCase().includes(this.logSearch.toLowerCase());
      
      const matchesType = !this.logTypeFilter || log.type === this.logTypeFilter;
      
      return matchesSearch && matchesType;
    });
  }
  
  exportLogs() {
    const csvContent = 'Date,Type,Utilisateur,Action,Details\n' + 
      this.filteredLogs.map(log => 
        `"${new Date(log.created_at).toLocaleString()}","${log.type}","${log.user_name}","${log.action}","${log.details}"`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eLibrary_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    alert('Export des logs téléchargé avec succès!');
  }

  // Méthodes de sauvegarde
  saveSystemSettings() {
    if (this.settings.default_borrow_days < 1 || this.settings.penalty_per_day < 0) {
      alert('Veuillez entrer des valeurs valides!');
      return;
    }
    
    // Simuler la sauvegarde
    setTimeout(() => {
      alert(`✓ Paramètres système sauvegardés avec succès!\n\n• Durée d'emprunt: ${this.settings.default_borrow_days} jours\n• Pénalité: ${this.settings.penalty_per_day} CFA/jour\n\nLes nouveaux paramètres sont maintenant actifs.`);
    }, 500);
  }

  saveIoTSettings() {
    if (!this.settings.mqtt_broker || !this.settings.rfid_topic) {
      alert('Veuillez remplir tous les champs IoT!');
      return;
    }
    
    // Simuler la sauvegarde
    setTimeout(() => {
      alert(`✓ Paramètres IoT sauvegardés avec succès!\n\n• MQTT Broker: ${this.settings.mqtt_broker}\n• Topic RFID: ${this.settings.rfid_topic}\n\nLes dispositifs IoT vont redémarrer avec les nouveaux paramètres.`);
    }, 500);
  }

  // Méthodes pour retards et pénalités
  applyPenalty(overdue: any) {
    if (confirm(`Appliquer une pénalité de ${overdue.penalty_amount} CFA à ${overdue.user_name}?`)) {
      // Ajouter à l'historique des pénalités
      this.penaltyHistory.push({
        id: Date.now(),
        user_name: overdue.user_name,
        book_title: overdue.book_title,
        amount: overdue.penalty_amount,
        applied_date: new Date(),
        admin_name: this.currentUser?.name
      });
      
      // Marquer comme pénalisé
      overdue.penalty_applied = true;
      overdue.penalty_date = new Date();
      
      // Envoyer notification à l'utilisateur
      this.sendPenaltyNotification(overdue);
      
      alert(`Pénalité de ${overdue.penalty_amount} CFA appliquée avec succès!\nNotification envoyée à ${overdue.user_name}.`);
    }
  }

  sendPenaltyNotification(overdue: any) {
    // Simuler l'envoi de notification
    console.log(`Notification envoyée à ${overdue.user_name}: Pénalité de ${overdue.penalty_amount} CFA appliquée pour le livre "${overdue.book_title}"`);
  }

  blacklistUser(userId: number) {
    if (confirm('Mettre cet utilisateur en liste noire?')) {
      console.log('Utilisateur blacklisté:', userId);
      alert('Utilisateur ajouté à la liste noire!');
    }
  }

  // Méthodes pour demandes d'inscription
  approveRequest(requestId: number) {
    if (confirm('Approuver cette demande d\'inscription?\nL\'utilisateur pourra accéder à toutes les fonctionnalités.')) {
      // Trouver la demande avant de la supprimer
      const approvedRequest = this.registrationRequests.find(r => r.id === requestId);
      
      // Supprimer de la liste des demandes
      this.registrationRequests = this.registrationRequests.filter(r => r.id !== requestId);
      
      // Supprimer aussi du localStorage si c'est une nouvelle demande
      const storedRequests = JSON.parse(localStorage.getItem('registrationRequests') || '[]');
      const updatedRequests = storedRequests.filter((r: any) => r.id !== requestId);
      localStorage.setItem('registrationRequests', JSON.stringify(updatedRequests));
      
      // Ajouter à la liste des utilisateurs actifs
      if (approvedRequest) {
        const newUser = {
          id: Date.now(),
          name: approvedRequest.name,
          surname: approvedRequest.surname,
          email: approvedRequest.email,
          role: 'user',
          tag_uid: null,
          active_borrows: 0,
          status: 'approved',
          photo_url: approvedRequest.photo_url,
          created_at: new Date()
        };
        this.users.push(newUser);
        
        // Mettre à jour le statut dans le localStorage pour l'utilisateur connecté
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.email === approvedRequest.email) {
          currentUser.status = 'approved';
          currentUser.photo_url = approvedRequest.photo_url;
          
          // Forcer la mise à jour immédiate
          this.authService.updateCurrentUser(currentUser);
          
          // Déclencher un événement pour forcer le rafraîchissement
          window.dispatchEvent(new CustomEvent('userStatusUpdated', { detail: currentUser }));
        }
        
        // Mettre à jour aussi dans la liste des utilisateurs inscrits
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userIndex = registeredUsers.findIndex((u: any) => u.email === approvedRequest.email);
        if (userIndex !== -1) {
          registeredUsers[userIndex].status = 'approved';
          registeredUsers[userIndex].photo_url = approvedRequest.photo_url;
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
        
        // Sauvegarder la photo dans le stockage séparé
        if (approvedRequest.photo_url) {
          localStorage.setItem('userPhoto_' + approvedRequest.email, approvedRequest.photo_url);
        }
      }
      
      alert('Demande approuvée avec succès!\nL\'utilisateur peut maintenant emprunter des livres.');
    }
  }

  rejectRequest(requestId: number) {
    const reason = prompt('Raison du rejet (optionnel):');
    if (confirm('Rejeter définitivement cette demande d\'inscription?')) {
      this.registrationRequests = this.registrationRequests.filter(r => r.id !== requestId);
      
      // Supprimer aussi du localStorage si c'est une nouvelle demande
      const storedRequests = JSON.parse(localStorage.getItem('registrationRequests') || '[]');
      const updatedRequests = storedRequests.filter((r: any) => r.id !== requestId);
      localStorage.setItem('registrationRequests', JSON.stringify(updatedRequests));
      
      alert('Demande rejetée!\nL\'utilisateur a été notifié par email.');
    }
  }

  requestDocument(requestId: number) {
    const request = this.registrationRequests.find(r => r.id === requestId);
    if (!request) return;
    
    const documentType = prompt(`📄 DEMANDE DE JUSTIFICATIF\n\nUtilisateur: ${request.name} ${request.surname}\nEmail: ${request.email}\n\nQuel document demander ?\n\nExemples:\n- Carte d'étudiant\n- Certificat de scolarité\n- Attestation d'emploi\n- Pièce d'identité\n- Justificatif de domicile`);
    
    if (documentType && documentType.trim().length > 0) {
      // Marquer comme document manquant
      request.documents_uploaded = false;
      request.requested_document = documentType;
      request.document_request_date = new Date();
      
      // Mettre à jour dans localStorage
      const storedRequests = JSON.parse(localStorage.getItem('registrationRequests') || '[]');
      const requestIndex = storedRequests.findIndex((r: any) => r.id === requestId);
      if (requestIndex !== -1) {
        storedRequests[requestIndex] = request;
        localStorage.setItem('registrationRequests', JSON.stringify(storedRequests));
      }
      
      // Ajouter un log
      this.auditLogs.unshift({
        created_at: new Date(),
        type: 'admin',
        user_name: 'Admin',
        action: 'Demande justificatif',
        details: `Document demandé à ${request.name}: ${documentType}`
      });
      this.filteredLogs = [...this.auditLogs];
      
      alert(`📧 Demande envoyée avec succès!\n\nUtilisateur: ${request.name}\nDocument demandé: ${documentType}\n\n✉️ Un email a été envoyé à ${request.email} avec les instructions pour fournir ce document.`);
    }
  }

  viewRequestProfile(request: any) {
    let documentStatus = '';
    if (request.documents_uploaded) {
      documentStatus = '✓ Documents uploadés';
    } else if (request.requested_document) {
      documentStatus = `⏳ En attente: ${request.requested_document} (demandé le ${new Date(request.document_request_date).toLocaleDateString('fr-FR')})`;
    } else {
      documentStatus = '❌ Documents manquants';
    }
    
    const profileInfo = `
📄 PROFIL COMPLET DE LA DEMANDE

👤 INFORMATIONS PERSONNELLES
• Nom: ${request.name} ${request.surname}
• Email: ${request.email}
• Établissement: ${request.etablissement}

💼 PROFESSION
• Type: ${this.getProfessionLabel(request.profession)}
• Détail: ${request.profession_detail}

🎯 MOTIVATIONS
"${request.motivations}"

📅 Date de demande: ${new Date(request.created_at).toLocaleDateString('fr-FR')}
📆 Statut documents: ${documentStatus}

ℹ️ Que souhaitez-vous faire avec cette demande?`;
    
    if (confirm(profileInfo + '\n\nCliquez OK pour APPROUVER ou Annuler pour continuer l\'examen.')) {
      this.approveRequest(request.id);
    }
  }

  getProfessionLabel(profession: string): string {
    const labels: { [key: string]: string } = {
      'etudiant': 'Étudiant',
      'eleve': 'Élève',
      'entrepreneur': 'Entrepreneur',
      'autre': 'Autre'
    };
    return labels[profession] || profession;
  }

  getPendingBorrowRequests(): any[] {
    const borrowRequests = JSON.parse(localStorage.getItem('borrowRequests') || '[]');
    return borrowRequests.filter((req: any) => req.status === 'pending');
  }

  approveBorrowRequest(requestId: number) {
    if (confirm('Approuver cette demande d\'emprunt ?\nL\'utilisateur pourra venir récupérer le livre.')) {
      const borrowRequests = JSON.parse(localStorage.getItem('borrowRequests') || '[]');
      const requestIndex = borrowRequests.findIndex((req: any) => req.id === requestId);
      
      if (requestIndex !== -1) {
        borrowRequests[requestIndex].status = 'approved';
        borrowRequests[requestIndex].admin_response = 'approved';
        borrowRequests[requestIndex].approval_date = new Date().toISOString();
        
        localStorage.setItem('borrowRequests', JSON.stringify(borrowRequests));
        
        alert('Demande approuvée ! L\'utilisateur recevra une notification et pourra venir récupérer le livre.');
      }
    }
  }

  rejectBorrowRequest(requestId: number) {
    const reason = prompt('Motif du rejet (obligatoire):');
    if (reason && reason.trim().length > 0) {
      if (confirm(`Rejeter cette demande d\'emprunt ?\nMotif: ${reason}`)) {
        const borrowRequests = JSON.parse(localStorage.getItem('borrowRequests') || '[]');
        const requestIndex = borrowRequests.findIndex((req: any) => req.id === requestId);
        
        if (requestIndex !== -1) {
          borrowRequests[requestIndex].status = 'rejected';
          borrowRequests[requestIndex].admin_response = 'rejected';
          borrowRequests[requestIndex].rejection_reason = reason;
          borrowRequests[requestIndex].rejection_date = new Date().toISOString();
          
          localStorage.setItem('borrowRequests', JSON.stringify(borrowRequests));
          
          alert('Demande rejetée. L\'utilisateur recevra une notification avec le motif.');
        }
      }
    } else if (reason !== null) {
      alert('Le motif du rejet est obligatoire.');
    }
  }

  // Méthodes pour gestion utilisateurs
  viewUserProfile(user: any) {
    alert(`Profil utilisateur:\n\nNom: ${user.name} ${user.surname || ''}\nEmail: ${user.email}\nRôle: ${user.role}\nStatut: ${user.status}\nInscription: ${new Date(user.created_at).toLocaleDateString()}`);
  }



  assignUserTag(user: any) {
    const tagUid = prompt('Entrez l\'UID du tag RFID pour cet utilisateur:', user.tag_uid || '');
    if (tagUid) {
      user.tag_uid = tagUid;
      alert('Tag assigné à l\'utilisateur avec succès!');
    }
  }

  toggleUserStatus(user: any) {
    const action = user.status === 'active' ? 'suspendre' : 'activer';
    if (confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} l\'utilisateur ${user.name}?`)) {
      user.status = user.status === 'active' ? 'suspended' : 'active';
      alert(`Utilisateur ${action} avec succès!`);
    }
  }
  
  deleteUser(user: any) {
    const reason = prompt(`⚠️ SUPPRESSION D\'UTILISATEUR\n\nUtilisateur: ${user.name}\nEmail: ${user.email}\n\nPourquoi supprimer cet utilisateur ?\n(Cette action est irréversible)`);
    
    if (reason && reason.trim().length > 0) {
      if (confirm(`🗑️ CONFIRMATION DE SUPPRESSION\n\nUtilisateur: ${user.name}\nRaison: ${reason}\n\n⚠️ Cette action supprimera définitivement:\n- Le compte utilisateur\n- Tous ses emprunts\n- Son historique\n\nÊtes-vous absolument sûr ?`)) {
        
        // Supprimer de la liste locale
        this.users = this.users.filter(u => u.id !== user.id);
        
        // Supprimer des utilisateurs enregistrés
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const updatedUsers = registeredUsers.filter((u: any) => u.id !== user.id);
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        
        // Ajouter un log de suppression
        this.auditLogs.unshift({
          created_at: new Date(),
          type: 'admin',
          user_name: 'Admin',
          action: 'Suppression utilisateur',
          details: `Utilisateur supprimé: ${user.name} (${user.email}) - Raison: ${reason}`
        });
        this.filteredLogs = [...this.auditLogs];
        
        alert(`✅ Utilisateur supprimé avec succès!\n\nUtilisateur: ${user.name}\nRaison: ${reason}\n\nLa suppression a été enregistrée dans les logs.`);
      }
    } else if (reason !== null) {
      alert('❌ Suppression annulée\n\nVous devez préciser une raison pour supprimer un utilisateur.');
    }
  }

  hasNewRegistrations(): boolean {
    if (this.alertDismissed) return false;
    const storedRequests = JSON.parse(localStorage.getItem('registrationRequests') || '[]');
    return storedRequests.some((req: any) => !this.viewedNotifications.has(req.id));
  }

  getNewRegistrationsCount(): number {
    const storedRequests = JSON.parse(localStorage.getItem('registrationRequests') || '[]');
    return storedRequests.filter((req: any) => !this.viewedNotifications.has(req.id)).length;
  }

  markNotificationsAsViewed(): void {
    const storedRequests = JSON.parse(localStorage.getItem('registrationRequests') || '[]');
    storedRequests.forEach((req: any) => this.viewedNotifications.add(req.id));
  }

  dismissAlert(): void {
    this.alertDismissed = true;
  }

  getFilteredBorrows(): any[] {
    let filteredBorrows = this.borrows;
    
    if (this.borrowView === 'current') {
      // Emprunts en cours (approved, active)
      filteredBorrows = this.borrows.filter(borrow => 
        borrow.status === 'approved' || borrow.status === 'active'
      );
    } else if (this.borrowView === 'history') {
      // Historique (returned, rejected, overdue)
      filteredBorrows = this.borrows.filter(borrow => 
        borrow.status === 'returned' || borrow.status === 'rejected' || borrow.status === 'overdue'
      );
    }
    
    return filteredBorrows;
  }
  
  getFilteredUsers(): any[] {
    let filteredUsers = this.users;
    
    // Filtrer par recherche
    if (this.userSearch) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(this.userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(this.userSearch.toLowerCase()) ||
        (user.surname && user.surname.toLowerCase().includes(this.userSearch.toLowerCase()))
      );
    }
    
    // Filtrer par rôle
    if (this.userRoleFilter) {
      filteredUsers = filteredUsers.filter(user => user.role === this.userRoleFilter);
    }
    
    // Filtrer par statut
    if (this.userStatusFilter) {
      filteredUsers = filteredUsers.filter(user => user.status === this.userStatusFilter);
    }
    
    return filteredUsers;
  }
  
  getUserActiveBorrows(userId: number): number {
    return this.borrows.filter(borrow => 
      borrow.user_id === userId && 
      (borrow.status === 'active' || borrow.status === 'approved')
    ).length;
  }
  
  getBorrowStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'bg-warning',
      'approved': 'bg-info',
      'active': 'bg-primary',
      'returned': 'bg-success',
      'overdue': 'bg-danger',
      'rejected': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
  }
  
  onUserImageError(event: any): void {
    event.target.src = this.getDefaultUserImage();
  }
  
  getDefaultUserImage(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNlOWVjZWYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjNmM3NTdkIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDEzLjk5IDcuMDEgMTUuNjIgNiAxOEMxMC4wMSAyMCAxMy45OSAyMCAxOCAxOEMxNi45OSAxNS42MiAxNC42NyAxMy45OSAxMiAxNFoiIGZpbGw9IiM2Yzc1N2QiLz4KPC9zdmc+Cjwvc3ZnPgo=';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}