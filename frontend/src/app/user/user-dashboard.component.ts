import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-layout">
      <!-- Top Navigation -->
      <nav class="top-nav">
        <div class="nav-brand">
          <div class="nav-logo">
            <div class="nav-wifi"></div>
            <div class="nav-book"></div>
          </div>
          <span>eLibrary</span>
        </div>
        <div class="nav-links">
          <a class="nav-link" [class.active]="activeTab === 'catalog'" (click)="setActiveTab('catalog')">
            <i class="fas fa-search"></i>
            <span>Catalogue</span>
          </a>
          <a class="nav-link" [class.active]="activeTab === 'my-account'" (click)="setActiveTab('my-account')">
            <i class="fas fa-user"></i>
            <span>Mon compte</span>
            <span *ngIf="currentBorrows.length > 0" class="notification-badge">{{currentBorrows.length}}</span>
          </a>
          <a class="nav-link" [class.active]="activeTab === 'kiosk'" (click)="setActiveTab('kiosk')">
            <i class="fas fa-wifi"></i>
            <span>Kiosque</span>
          </a>
          <a class="nav-link" [class.active]="activeTab === 'notifications'" (click)="setActiveTab('notifications')">
            <i class="fas fa-bell"></i>
            <span>Notifications</span>
            <span *ngIf="unreadNotifications > 0" class="notification-badge">{{unreadNotifications}}</span>
          </a>
          <a class="nav-link" [class.active]="activeTab === 'profile'" (click)="setActiveTab('profile')">
            <i class="fas fa-cog"></i>
            <span>Profil</span>
          </a>
          <a class="nav-link" [class.active]="activeTab === 'help'" (click)="setActiveTab('help')">
            <i class="fas fa-question-circle"></i>
            <span>Aide</span>
            <span *ngIf="faqs.length > 0" class="notification-badge">{{faqs.length}}</span>
          </a>
        </div>
        <div class="nav-user">
          <div class="user-info">
            <div class="d-flex align-items-center">
              <div class="user-avatar me-2">
                <img [src]="getUserPhotoUrl() || getDefaultUserImage()" (error)="onImageError($event)"
                     alt="Photo de profil" class="profile-photo">
              </div>
              <div>
                <span class="user-name">{{currentUser?.name}}</span>
                <br>
                <span class="user-status" [class]="getUserStatusClass()">
                  {{getUserStatusText()}}
                </span>
              </div>
            </div>
          </div>
          <button class="btn btn-outline-light btn-sm" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="main-content">

        <!-- Catalogue / Rechercher un livre -->
        <div *ngIf="activeTab === 'catalog'" class="content-section">
          <div class="section-header">
            <h3><i class="fas fa-search"></i> Catalogue des livres</h3>
            <p class="text-muted">Recherchez et découvrez nos livres disponibles</p>
          </div>
        <div class="row mb-4">
          <div class="col-md-8">
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Rechercher un livre..." 
                     [(ngModel)]="searchTerm" (keyup.enter)="searchBooks()">
              <button class="btn btn-primary" type="button" (click)="searchBooks()">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          <div class="col-md-4">
            <button class="btn btn-outline-primary w-100" (click)="showByCategory = !showByCategory">
              <i class="fas fa-th-list me-2"></i>{{showByCategory ? 'Vue Liste' : 'Vue Catégories'}}
            </button>
          </div>
        </div>

        <!-- Vue par catégories -->
        <div *ngIf="showByCategory">
          <div *ngFor="let category of categoriesWithBooks" class="mb-5">
            <div class="category-header mb-3">
              <h4 class="text-primary"><i class="fas fa-folder-open me-2"></i>{{category.name}}</h4>
              <p class="text-muted">{{category.description}} ({{category.books.length}} livres)</p>
            </div>
            <div class="row">
              <div class="col-md-6 col-lg-4 mb-4" *ngFor="let book of category.books">
                <div class="card book-card h-100">
                  <div class="book-cover">
                    <img [src]="book.cover_url" [alt]="book.title" class="cover-image" (error)="onBookImageError($event, book)">
                  </div>
                  <div class="card-header border-0 pb-2">
                    <div class="d-flex justify-content-between">
                      <span class="badge" [style.background]="getGenreColor(book.genre)">{{book.genre}}</span>
                      <span class="badge" [class]="book.available > 0 ? 'bg-success' : 'bg-danger'">
                        {{book.available}}/{{book.stock}}
                      </span>
                    </div>
                  </div>
                  <div class="card-body">
                    <h6 class="card-title text-primary mb-2">{{book.title}}</h6>
                    <p class="text-muted small mb-2"><i class="fas fa-user me-1"></i>{{book.author}}</p>
                    <button class="btn btn-sm btn-outline-info w-100 mb-2" (click)="showDescription(book)">
                      <i class="fas fa-info-circle me-1"></i>Voir description
                    </button>
                  </div>
                  <div class="card-footer border-0 pt-0">
                    <button *ngIf="book.available > 0" 
                            class="btn btn-gradient btn-sm w-100"
                            (click)="requestBorrow(book.id)">
                      <i class="fas fa-hand-paper me-1"></i>Demander
                    </button>
                    <button *ngIf="book.available === 0" class="btn btn-outline-secondary btn-sm w-100" disabled>
                      <i class="fas fa-times me-1"></i>Indisponible
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vue liste classique -->
        <div *ngIf="!showByCategory">
          <div class="row">
            <div class="col-md-6 col-lg-4 mb-4" *ngFor="let book of books">
              <div class="card book-card h-100">
                <div class="book-cover">
                  <img [src]="book.cover_url" [alt]="book.title" class="cover-image" (error)="onBookImageError($event, book)">
                </div>
                <div class="card-header border-0 pb-2">
                  <div class="d-flex justify-content-between">
                    <span class="badge" [style.background]="getGenreColor(book.genre)">{{book.genre}}</span>
                    <span class="badge" [class]="book.available > 0 ? 'bg-success' : 'bg-danger'">
                      {{book.available}}/{{book.stock}}
                    </span>
                  </div>
                </div>
                <div class="card-body">
                  <h6 class="card-title text-primary mb-2">{{book.title}}</h6>
                  <p class="text-muted small mb-2"><i class="fas fa-user me-1"></i>{{book.author}}</p>
                  <button class="btn btn-sm btn-outline-info w-100 mb-2" (click)="showDescription(book)">
                    <i class="fas fa-info-circle me-1"></i>Voir description
                  </button>
                </div>
                <div class="card-footer border-0 pt-0">
                  <button *ngIf="book.available > 0" 
                          class="btn btn-gradient btn-sm w-100"
                          (click)="requestBorrow(book.id)">
                    <i class="fas fa-hand-paper me-1"></i>Demander
                  </button>
                  <button *ngIf="book.available === 0" class="btn btn-outline-secondary btn-sm w-100" disabled>
                    <i class="fas fa-times me-1"></i>Indisponible
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="books.length === 0 && !showByCategory" class="text-center py-5">
          <i class="fas fa-book fa-3x text-muted mb-3"></i>
          <p class="text-muted">Aucun livre trouvé</p>
        </div>
      </div>

      <!-- Modal Description -->
      <div class="modal fade" [class.show]="selectedBook" [style.display]="selectedBook ? 'block' : 'none'" *ngIf="selectedBook">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{selectedBook.title}}</h5>
              <button type="button" class="btn-close" (click)="closeDescription()"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-8">
                  <h6 class="text-primary">Description</h6>
                  <p>{{selectedBook.description}}</p>
                </div>
                <div class="col-md-4">
                  <h6 class="text-primary">Informations</h6>
                  <p><strong>Auteur:</strong> {{selectedBook.author}}</p>
                  <p><strong>Genre:</strong> <span class="badge" [style.background]="getGenreColor(selectedBook.genre)">{{selectedBook.genre}}</span></p>
                  <p><strong>Disponibilité:</strong> {{selectedBook.available}}/{{selectedBook.stock}}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button *ngIf="selectedBook.available > 0" 
                      class="btn btn-gradient"
                      (click)="requestBorrow(selectedBook.id); closeDescription()">
                <i class="fas fa-hand-paper me-2"></i>Demander l'emprunt
              </button>
              <button class="btn btn-secondary" (click)="closeDescription()">Fermer</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade" [class.show]="selectedBook" *ngIf="selectedBook" (click)="closeDescription()"></div>

        <!-- Mon compte / Mes emprunts -->
        <div *ngIf="activeTab === 'my-account'" class="content-section">
          <div class="section-header">
            <h3><i class="fas fa-user"></i> Mon compte</h3>
            <p class="text-muted">Gérez vos emprunts et votre historique</p>
          </div>
          
          <!-- Sous-navigation -->
          <div class="sub-nav mb-4">
            <button class="btn" [class]="borrowView === 'current' ? 'btn-primary' : 'btn-outline-primary'" (click)="borrowView = 'current'">
              Demandes en attente
            </button>
            <button class="btn" [class]="borrowView === 'history' ? 'btn-primary' : 'btn-outline-primary'" (click)="borrowView = 'history'">
              Historique
            </button>
          </div>
          <!-- Emprunts en cours -->
          <div *ngIf="borrowView === 'current'">
            <div class="row">
              <div class="col-md-6 mb-3" *ngFor="let borrow of currentBorrows">
                <div class="card borrow-card">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <h6 class="card-title mb-0">{{borrow.title}}</h6>
                      <span class="badge" [class]="getBorrowStatusClass(borrow.status)">{{getStatusLabel(borrow.status)}}</span>
                    </div>
                    <p class="text-muted small mb-2">{{borrow.author}}</p>
                    <div class="borrow-dates">
                      <div class="date-item">
                        <i class="fas fa-calendar-plus text-primary"></i>
                        <span *ngIf="borrow.status === 'pending'">Demandé le: {{borrow.date_emprunt | date}}</span>
                        <span *ngIf="borrow.status !== 'pending'">Emprunté: {{borrow.date_emprunt | date}}</span>
                      </div>
                      <div class="date-item" *ngIf="borrow.date_retour_prevue">
                        <i class="fas fa-calendar-check" [class]="borrow.status === 'overdue' ? 'text-danger' : 'text-success'"></i>
                        <span>Retour prévu: {{borrow.date_retour_prevue | date}}</span>
                      </div>
                      <div class="date-item" *ngIf="borrow.status === 'rejected' && borrow.rejection_reason">
                        <i class="fas fa-exclamation-triangle text-danger"></i>
                        <span class="text-danger">Motif: {{borrow.rejection_reason}}</span>
                      </div>
                    </div>
                    <div class="mt-3" *ngIf="borrow.status === 'pending'">
                      <small class="text-muted">
                        <i class="fas fa-clock me-1"></i>
                        Votre demande est en cours de traitement par l'administrateur.
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="currentBorrows.length === 0" class="empty-state">
              <i class="fas fa-clock fa-3x text-muted mb-3"></i>
              <h5 class="text-muted">Aucune demande en attente</h5>
              <p class="text-muted">Explorez notre catalogue pour faire une demande d'emprunt</p>
              <button class="btn btn-primary" (click)="setActiveTab('catalog')">
                <i class="fas fa-search"></i> Parcourir le catalogue
              </button>
            </div>
          </div>

          <!-- Historique -->
          <div *ngIf="borrowView === 'history'">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Livre</th>
                    <th>Auteur</th>
                    <th>Date emprunt</th>
                    <th>Date retour</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let borrow of borrowHistory">
                    <td>{{borrow.title}}</td>
                    <td>{{borrow.author}}</td>
                    <td>{{borrow.date_emprunt | date}}</td>
                    <td>{{borrow.date_retour_effective | date}}</td>
                    <td><span class="badge" [class]="getBorrowStatusClass(borrow.status)">{{getStatusLabel(borrow.status)}}</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline-info" (click)="downloadReceipt(borrow.id)" title="Télécharger reçu">
                        <i class="fas fa-download"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div *ngIf="borrowHistory.length === 0" class="empty-state">
              <i class="fas fa-history fa-3x text-muted mb-3"></i>
              <h5 class="text-muted">Aucun historique</h5>
              <p class="text-muted">Vos emprunts passés apparaîtront ici</p>
            </div>
          </div>
      </div>

        <!-- Kiosque (Self-service) -->
        <div *ngIf="activeTab === 'kiosk'" class="content-section">
          <div class="section-header">
            <h3><i class="fas fa-wifi"></i> Kiosque Self-Service</h3>
            <p class="text-muted">Empruntez et retournez vos livres en autonomie</p>
          </div>
          
          <div class="kiosk-interface">
            <div class="user-session">
              <div class="session-card">
                <h5><i class="fas fa-user-circle"></i> Session active</h5>
                <p><strong>{{currentUser?.name}}</strong></p>
                <p class="text-muted">ID: {{currentUser?.id}}</p>
                <div class="qr-code-placeholder">
                  <i class="fas fa-qrcode fa-3x"></i>
                  <p>Code QR de session</p>
                </div>
              </div>
            </div>
            
            <div class="instructions">
              <div class="instruction-card">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h6>Posez votre carte</h6>
                  <p>Placez votre carte RFID sur le lecteur</p>
                </div>
              </div>
              <div class="instruction-card">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h6>Scannez le livre</h6>
                  <p>Posez le livre sur le lecteur RFID</p>
                </div>
              </div>
              <div class="instruction-card">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h6>Confirmation</h6>
                  <p>L'opération sera confirmée automatiquement</p>
                </div>
              </div>
            </div>
            
            <div class="scan-result" *ngIf="lastScanResult">
              <div class="alert" [class]="lastScanResult.success ? 'alert-success' : 'alert-danger'">
                <i class="fas" [class]="lastScanResult.success ? 'fa-check-circle' : 'fa-times-circle'"></i>
                {{lastScanResult.message}}
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div *ngIf="activeTab === 'notifications'" class="content-section">
          <div class="section-header">
            <h3><i class="fas fa-bell"></i> Notifications</h3>
            <p class="text-muted">Vos messages et alertes</p>
          </div>
          <div class="notifications-list">
            <div *ngFor="let notification of notifications" class="notification-item" [class.unread]="!notification.is_read">
              <div class="notification-icon">
                <i class="fas" [class]="getNotificationIcon(notification.type)"></i>
              </div>
              <div class="notification-content">
                <h6>{{notification.title}}</h6>
                <p>{{notification.message}}</p>
                <small class="text-muted">{{notification.created_at | date:'short'}}</small>
              </div>
              <div class="notification-actions">
                <button class="btn btn-sm btn-outline-primary" (click)="markAsRead(notification.id)" *ngIf="!notification.is_read">
                  <i class="fas fa-check"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div *ngIf="notifications.length === 0" class="empty-state">
            <i class="fas fa-bell fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">Aucune notification</h5>
            <p class="text-muted">Vous serez notifié des événements importants ici</p>
          </div>
        </div>

        <!-- Profil -->
        <div *ngIf="activeTab === 'profile'" class="content-section">
          <div class="section-header">
            <h3><i class="fas fa-user"></i> Mon profil</h3>
            <p class="text-muted">Gérez vos informations personnelles</p>
          </div>
          
          <div class="row">
            <div class="col-md-8">
              <div class="card">
                <div class="card-header">
                  <h5>Informations personnelles</h5>
                </div>
                <div class="card-body">
                  <form>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Nom</label>
                          <input type="text" class="form-control" [(ngModel)]="userProfile.name" name="name">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Prénom</label>
                          <input type="text" class="form-control" [(ngModel)]="userProfile.surname" name="surname">
                        </div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control" [(ngModel)]="userProfile.email" name="email">
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Téléphone</label>
                      <input type="tel" class="form-control" [(ngModel)]="userProfile.phone" name="phone">
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Nouveau mot de passe</label>
                      <input type="password" class="form-control" [(ngModel)]="newPassword" name="password">
                    </div>
                    <button type="submit" class="btn btn-primary" (click)="updateProfile()">
                      <i class="fas fa-save"></i> Sauvegarder
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-header">
                  <h5>Carte bibliothèque</h5>
                </div>
                <div class="card-body text-center">
                  <div class="card-uid">
                    <i class="fas fa-id-card fa-3x mb-3"></i>
                    <p><strong>Tag UID:</strong></p>
                    <code>{{userProfile.tag_uid || 'Non assigné'}}</code>
                  </div>
                  <button class="btn btn-outline-primary mt-3" (click)="requestNewCard()">
                    <i class="fas fa-sync"></i> Demander remplacement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Aide / FAQ -->
        <div *ngIf="activeTab === 'help'" class="content-section">
          <div class="section-header">
            <h3><i class="fas fa-question-circle"></i> Aide & FAQ</h3>
            <p class="text-muted">Trouvez des réponses à vos questions</p>
          </div>
          
          <div class="row">
            <div class="col-md-8">
              <div class="faq-list">
                <div class="faq-item" *ngFor="let faq of faqs; let i = index">
                  <div class="faq-question" (click)="toggleFAQ(i)">
                    <h6>{{faq.question}}</h6>
                    <i class="fas" [class]="faq.expanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                  </div>
                  <div class="faq-answer" [class.expanded]="faq.expanded">
                    <p>{{faq.answer}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-header">
                  <h5>Informations pratiques</h5>
                </div>
                <div class="card-body">
                  <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <div>
                      <strong>Horaires</strong>
                      <p class="mb-0">Lun-Ven: 8h-18h<br>Sam: 9h-17h</p>
                    </div>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-envelope"></i>
                    <div>
                      <strong>Contact</strong>
                      <p class="mb-0">elibrary&#64;gmail.com</p>
                    </div>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-phone"></i>
                    <div>
                      <strong>Téléphone</strong>
                      <p class="mb-0">+226 61630303</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .top-nav {
      background: linear-gradient(135deg, #5A9BD4 0%, #87CEEB 50%, #20B2AA 100%);
      color: white;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .nav-brand {
      display: flex;
      align-items: center;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .nav-logo {
      width: 32px;
      height: 32px;
      margin-right: 0.5rem;
      position: relative;
    }
    .nav-wifi {
      width: 16px;
      height: 4px;
      background: white;
      border-radius: 8px 8px 0 0;
      margin: 0 auto 2px;
    }
    .nav-book {
      width: 24px;
      height: 20px;
      background: white;
      border-radius: 3px;
      margin: 0 auto;
      position: relative;
    }
    .nav-book::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      right: 3px;
      height: 14px;
      background: rgba(255,255,255,0.3);
      border-radius: 1px;
    }
    .nav-links {
      display: flex;
      gap: 1rem;
    }
    .nav-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem 1rem;
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s;
      cursor: pointer;
      position: relative;
    }
    .nav-link:hover {
      background: rgba(255,255,255,0.1);
      color: white;
    }
    .nav-link.active {
      background: rgba(255,255,255,0.2);
      color: white;
    }
    .nav-link i {
      font-size: 1.2rem;
      margin-bottom: 0.25rem;
    }
    .nav-link span {
      font-size: 0.8rem;
    }
    .notification-badge {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      background: #dc3545;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid rgba(255,255,255,0.3);
    }
    .profile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .default-avatar {
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: white;
      font-size: 1.2rem;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .user-name {
      font-weight: 500;
    }
    .user-status {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 12px;
      margin-top: 2px;
    }
    .status-pending {
      background: rgba(255,193,7,0.2);
      color: #856404;
    }
    .status-approved {
      background: rgba(40,167,69,0.2);
      color: #155724;
    }
    .status-rejected {
      background: rgba(220,53,69,0.2);
      color: #721c24;
    }
    .main-content {
      flex: 1;
      padding: 2rem;
      background: #f8f9fa;
    }
    .content-section {
      max-width: 1200px;
      margin: 0 auto;
    }
    .section-header {
      margin-bottom: 2rem;
    }
    .section-header h3 {
      color: #495057;
      margin-bottom: 0.5rem;
    }
    .sub-nav {
      display: flex;
      gap: 0.5rem;
    }
    .book-card {
      transition: all 0.3s ease;
      border: none;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      border-radius: 12px;
      overflow: hidden;
    }
    .book-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0,0,0,0.15);
    }
    .book-cover {
      height: 200px;
      overflow: hidden;
      position: relative;
    }
    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .book-card:hover .cover-image {
      transform: scale(1.05);
    }
    .borrow-card {
      border: none;
      border-radius: 12px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
      transition: all 0.3s;
    }
    .borrow-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    .borrow-dates {
      background: #f8f9fa;
      padding: 0.75rem;
      border-radius: 8px;
      margin-top: 1rem;
    }
    .date-item {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .date-item:last-child {
      margin-bottom: 0;
    }
    .date-item i {
      margin-right: 0.5rem;
      width: 16px;
    }
    .empty-state {
      text-align: center;
      padding: 3rem;
    }
    .kiosk-interface {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .session-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      text-align: center;
    }
    .qr-code-placeholder {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      margin-top: 1rem;
    }
    .instructions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .instruction-card {
      display: flex;
      align-items: center;
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }
    .step-number {
      width: 40px;
      height: 40px;
      background: #007bff;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      margin-right: 1rem;
    }
    .step-content h6 {
      margin-bottom: 0.25rem;
    }
    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .notification-item {
      display: flex;
      align-items: flex-start;
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
      border-left: 4px solid #dee2e6;
    }
    .notification-item.unread {
      border-left-color: #007bff;
      background: #f8f9ff;
    }
    .notification-icon {
      width: 40px;
      height: 40px;
      background: #e9ecef;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
    }
    .notification-content {
      flex: 1;
    }
    .notification-content h6 {
      margin-bottom: 0.5rem;
    }
    .card-uid {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
    }
    .info-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    .info-item i {
      width: 20px;
      margin-right: 1rem;
      margin-top: 0.25rem;
      color: #007bff;
    }
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .faq-item {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .faq-question {
      padding: 1rem;
      cursor: pointer;
      display: flex;
      justify-content: between;
      align-items: center;
      background: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }
    .faq-question:hover {
      background: #e9ecef;
    }
    .faq-question h6 {
      margin: 0;
      flex: 1;
    }
    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }
    .faq-answer.expanded {
      max-height: 200px;
    }
    .faq-answer p {
      padding: 1rem;
      margin: 0;
    }
    .btn-gradient {
      background: linear-gradient(45deg, #4CAF50, #66BB6A);
      border: none;
      color: white;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    .btn-gradient:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
      color: white;
    }
    @media (max-width: 768px) {
      .top-nav {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }
      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
      }
      .kiosk-interface {
        grid-template-columns: 1fr;
      }
      .main-content {
        padding: 1rem;
      }
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  activeTab = 'catalog';
  books: any[] = [];
  categories: any[] = [];
  categoriesWithBooks: any[] = [];
  myBorrows: any[] = [];
  currentBorrows: any[] = [];
  borrowHistory: any[] = [];
  notifications: any[] = [];
  searchTerm = '';
  selectedCategory = '';
  showByCategory = true;
  selectedBook: any = null;
  unreadNotifications = 0;
  currentUser = this.authService.getCurrentUser();
  borrowView = 'current';
  lastScanResult: any = null;
  userProfile: any = {};
  newPassword = '';
  faqs: any[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.createTestBooksIfNeeded();
    this.loadBooks();
    this.loadMyBorrows();
    this.loadNotifications();
    this.loadUserProfile();
    this.loadFAQs();
    
    // Écouter les changements d'utilisateur pour mettre à jour la photo et le statut
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Écouter les mises à jour de statut utilisateur
    window.addEventListener('userStatusUpdated', (event: any) => {
      this.currentUser = event.detail;
    });
    
    // Vérifier périodiquement les mises à jour de statut
    setInterval(() => {
      this.checkUserStatusUpdate();
    }, 1000);
  }

  createTestBooksIfNeeded() {
    const existingBooks = localStorage.getItem('adminBooks');
    if (!existingBooks || JSON.parse(existingBooks).length === 0) {
      const testBooks = [
        {
          id: 1,
          title: 'Le Petit Prince',
          author: 'Antoine de Saint-Exupéry',
          isbn: '9782070408504',
          category_id: 1,
          category: { id: 1, name: 'Fiction' },
          stock: 5,
          available: 5,
          description: 'Un conte poétique et philosophique sous l\'apparence d\'un conte pour enfants.',
          cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop'
        },
        {
          id: 2,
          title: 'Dune',
          author: 'Frank Herbert',
          isbn: '9782266320580',
          category_id: 2,
          category: { id: 2, name: 'Science-Fiction' },
          stock: 3,
          available: 3,
          description: 'Une épopée de science-fiction dans un univers désertique lointain.',
          cover_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop'
        },
        {
          id: 3,
          title: 'Clean Code',
          author: 'Robert C. Martin',
          isbn: '9780132350884',
          category_id: 5,
          category: { id: 5, name: 'Informatique' },
          stock: 6,
          available: 6,
          description: 'Guide pour écrire du code propre et maintenable.',
          cover_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop'
        },
        {
          id: 4,
          title: 'Harry Potter à l\'\u00e9cole des sorciers',
          author: 'J.K. Rowling',
          isbn: '9782070541270',
          category_id: 9,
          category: { id: 9, name: 'Jeunesse' },
          stock: 8,
          available: 8,
          description: 'Le premier tome de la saga du jeune sorcier.',
          cover_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop'
        },
        {
          id: 5,
          title: 'Da Vinci Code',
          author: 'Dan Brown',
          isbn: '9782253121251',
          category_id: 7,
          category: { id: 7, name: 'Thriller' },
          stock: 5,
          available: 5,
          description: 'Un thriller captivant mêlant art, histoire et mystère.',
          cover_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop'
        }
      ];
      localStorage.setItem('adminBooks', JSON.stringify(testBooks));
      console.log('Livres de test créés:', testBooks);
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'my-account') {
      this.loadMyBorrows();
    } else if (tab === 'notifications') {
      this.loadNotifications();
    } else if (tab === 'profile') {
      this.loadUserProfile();
    }
  }

  loadBooks() {
    // Charger d'abord depuis localStorage
    const storedBooks = JSON.parse(localStorage.getItem('adminBooks') || '[]');
    console.log('Livres depuis localStorage:', storedBooks);
    
    if (storedBooks.length > 0) {
      this.books = storedBooks.map((book: any) => ({
        ...book,
        genre: book.category?.name || 'Fiction',
        available: book.available || book.stock || 0,
        stock: book.stock || 0,
        cover_url: book.cover_url || this.getDefaultBookImage(book.category?.name || 'Fiction')
      }));
      console.log('Livres formatés:', this.books);
      this.groupBooksByCategory();
    }
    
    // Essayer aussi de charger depuis l'API
    this.apiService.getBooks().subscribe({
      next: (response) => {
        console.log('Réponse API books:', response);
        const apiBooks = response.data || response || [];
        
        if (apiBooks.length > 0) {
          // Combiner avec les livres localStorage
          const allBooks = [...apiBooks, ...storedBooks];
          
          // Supprimer les doublons basés sur l'ISBN
          const uniqueBooks = allBooks.filter((book, index, self) => 
            index === self.findIndex(b => b.isbn === book.isbn)
          );
          
          this.books = uniqueBooks.map((book: any) => ({
            ...book,
            genre: book.category?.name || 'Fiction',
            available: book.available_quantity || book.available || book.stock || 0,
            stock: book.quantity || book.stock || 0,
            cover_url: book.cover_url || this.getDefaultBookImage(book.category?.name || 'Fiction')
          }));
          
          console.log('Livres combinés API + localStorage:', this.books);
          this.groupBooksByCategory();
        }
      },
      error: (error) => {
        console.error('Erreur API (utilisation localStorage uniquement):', error);
        // Les livres localStorage sont déjà chargés
      }
    });
  }

  getDefaultBookImage(genre: string): string {
    const images: { [key: string]: string } = {
      'Fiction': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
      'Science-Fiction': 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
      'Histoire': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
      'Philosophie': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
      'Informatique': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop',
      'Romance': 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=300&h=400&fit=crop',
      'Thriller': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop'
    };
    return images[genre] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop';
  }

  groupBooksByCategory() {
    console.log('Groupement par catégories - Livres:', this.books);
    console.log('Catégories disponibles:', this.categories);
    
    this.categoriesWithBooks = this.categories.map(category => {
      const categoryBooks = this.books.filter(book => book.category_id === category.id);
      console.log(`Catégorie ${category.name} (ID: ${category.id}):`, categoryBooks);
      return {
        ...category,
        books: categoryBooks
      };
    }).filter(category => category.books.length > 0);
    
    console.log('Catégories avec livres:', this.categoriesWithBooks);
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

  loadMyBorrows() {
    const localBorrows = JSON.parse(localStorage.getItem('localBorrows') || '[]');
    const borrowRequests = JSON.parse(localStorage.getItem('borrowRequests') || '[]')
      .filter((req: any) => req.user_email === this.currentUser?.email)
      .map((req: any) => ({
        id: req.id,
        title: req.book_title,
        author: req.book_author,
        date_emprunt: req.request_date,
        date_retour_prevue: req.status === 'approved' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : null,
        date_retour_effective: null,
        status: req.status,
        rejection_reason: req.rejection_reason
      }));
    
    const allBorrows = [...localBorrows, ...borrowRequests];
    this.myBorrows = allBorrows;
    this.currentBorrows = allBorrows.filter((b: any) => b.status === 'pending');
    this.borrowHistory = allBorrows.filter((b: any) => b.status === 'returned' || b.status === 'rejected');
  }

  loadNotifications() {
    // Charger depuis localStorage d'abord
    const localNotifications = JSON.parse(localStorage.getItem('userNotifications_' + this.currentUser?.email) || '[]');
    this.notifications = localNotifications;
    this.unreadNotifications = localNotifications.filter((n: any) => !n.is_read).length;
    
    // Essayer de charger depuis l'API aussi
    this.apiService.getNotifications().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.notifications = response;
          this.unreadNotifications = response.filter((n: any) => !n.is_read).length;
        } else if (response.success) {
          this.notifications = response.notifications;
          this.unreadNotifications = response.notifications.filter((n: any) => !n.is_read).length;
        }
      },
      error: (error: any) => console.error('Erreur notifications API:', error)
    });
  }

  searchBooks() {
    this.loadBooks();
  }

  filterByCategory() {
    this.loadBooks();
  }

  requestBorrow(bookId: number) {
    if ((this.currentUser as any)?.status !== 'approved') {
      alert('Votre compte doit être certifié par l\'administrateur pour emprunter des livres.');
      return;
    }

    const book = this.books.find(b => b.id === bookId);
    if (!book || book.available <= 0) {
      alert('Ce livre n\'est pas disponible');
      return;
    }
    
    // Créer une demande d'emprunt en attente
    const borrowRequest = {
      id: Date.now(),
      user_id: this.currentUser?.id || 1,
      user_name: this.currentUser?.name || 'Utilisateur',
      user_email: this.currentUser?.email || '',
      book_id: bookId,
      book_title: book.title,
      book_author: book.author,
      request_date: new Date().toISOString(),
      status: 'pending',
      admin_response: null,
      rejection_reason: null
    };
    
    // Sauvegarder la demande
    const borrowRequests = JSON.parse(localStorage.getItem('borrowRequests') || '[]');
    borrowRequests.push(borrowRequest);
    localStorage.setItem('borrowRequests', JSON.stringify(borrowRequests));
    
    alert('Demande d\'emprunt envoyée ! Vous recevrez une notification une fois que l\'administrateur aura traité votre demande.');
    this.loadMyBorrows();
  }

  showDescription(book: any) {
    this.selectedBook = book;
  }

  closeDescription() {
    this.selectedBook = null;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente de validation',
      'approved': 'Approuvé - À récupérer',
      'active': 'En cours',
      'returned': 'Retourné',
      'overdue': 'En retard',
      'rejected': 'Refusé'
    };
    return labels[status] || status;
  }

  // Nouvelles méthodes
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

  requestExtension(borrowId: number) {
    console.log('Demande de prolongation pour emprunt:', borrowId);
    alert('Demande de prolongation envoyée!');
  }

  downloadReceipt(borrowId: number) {
    console.log('Télécharger reçu pour emprunt:', borrowId);
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'info': 'fa-info-circle',
      'warning': 'fa-exclamation-triangle',
      'error': 'fa-times-circle',
      'success': 'fa-check-circle'
    };
    return icons[type] || 'fa-bell';
  }

  markAsRead(notificationId: number) {
    // Marquer comme lu dans localStorage
    const localNotifications = JSON.parse(localStorage.getItem('userNotifications_' + this.currentUser?.email) || '[]');
    const notification = localNotifications.find((n: any) => n.id === notificationId);
    if (notification) {
      notification.is_read = true;
      localStorage.setItem('userNotifications_' + this.currentUser?.email, JSON.stringify(localNotifications));
    }
    
    // Essayer de marquer comme lu via l'API si la méthode existe
    if (this.apiService.markNotificationAsRead) {
      this.apiService.markNotificationAsRead(notificationId).subscribe({
        next: () => this.loadNotifications(),
        error: (error: any) => {
          console.error('Erreur API:', error);
          this.loadNotifications(); // Recharger depuis localStorage
        }
      });
    } else {
      this.loadNotifications();
    }
  }

  loadUserProfile() {
    this.userProfile = {
      name: this.currentUser?.name || '',
      surname: '',
      email: this.currentUser?.email || '',
      phone: '',
      tag_uid: null
    };
  }

  updateProfile() {
    console.log('Mise à jour profil:', this.userProfile);
    alert('Profil mis à jour avec succès!');
  }

  requestNewCard() {
    if (confirm('Demander un remplacement de carte? L\'ancienne sera désactivée.')) {
      console.log('Demande de remplacement de carte');
      alert('Demande de remplacement envoyée!');
    }
  }

  loadFAQs() {
    this.faqs = [
      {
        question: 'Comment emprunter un livre?',
        answer: 'Vous pouvez emprunter un livre en utilisant le kiosque self-service ou en faisant une demande via le catalogue en ligne.',
        expanded: false
      },
      {
        question: 'Combien de temps puis-je garder un livre?',
        answer: 'La durée d\'emprunt standard est de 14 jours, avec possibilité de prolongation.',
        expanded: false
      },
      {
        question: 'Comment utiliser le kiosque IoT?',
        answer: 'Placez votre carte RFID sur le lecteur, puis posez le livre. L\'opération sera automatiquement détectée et traitée.',
        expanded: false
      },
      {
        question: 'Que faire si j\'ai perdu ma carte?',
        answer: 'Vous pouvez demander un remplacement via votre profil ou contacter l\'administration.',
        expanded: false
      }
    ];
  }

  toggleFAQ(index: number) {
    this.faqs[index].expanded = !this.faqs[index].expanded;
  }

  getUserStatusClass(): string {
    const status = (this.currentUser as any)?.status || 'pending';
    return `status-${status}`;
  }

  getUserStatusText(): string {
    const statusTexts: { [key: string]: string } = {
      'pending': 'En attente',
      'approved': 'Certifié',
      'rejected': 'Refusé'
    };
    return statusTexts[(this.currentUser as any)?.status || 'pending'] || 'En attente';
  }

  getUserStatus(): string {
    return (this.currentUser as any)?.status || 'pending';
  }

  getUserPhotoUrl(): string | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const separatePhoto = localStorage.getItem('userPhoto_' + user.email);
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const registeredUser = registeredUsers.find((u: any) => u.email === user.email);
        
        return registeredUser?.photo_url || user.photo_url || separatePhoto || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }
  
  checkUserStatusUpdate(): void {
    const userStr = localStorage.getItem('user');
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    if (userStr) {
      try {
        const storedUser = JSON.parse(userStr);
        const updatedUser = registeredUsers.find((u: any) => u.email === storedUser.email);
        
        if (updatedUser && (updatedUser.status !== storedUser.status || updatedUser.photo_url !== storedUser.photo_url)) {
          storedUser.status = updatedUser.status;
          storedUser.photo_url = updatedUser.photo_url;
          localStorage.setItem('user', JSON.stringify(storedUser));
          this.currentUser = storedUser;
          
          // Forcer la mise à jour de l'interface
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      } catch (e) {
        console.error('Erreur lors de la vérification du statut:', e);
      }
    }
  }

  onImageError(event: any): void {
    event.target.src = this.getDefaultUserImage();
  }

  onBookImageError(event: any, book: any): void {
    event.target.src = this.getDefaultBookImage(book.genre || 'Fiction');
  }
  
  getDefaultUserImage(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNlOWVjZWYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjNmM3NTdkIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDEzLjk5IDcuMDEgMTUuNjIgNiAxOEMxMC4wMSAyMCAxMy45OSAyMCAxOCAxOEMxNi45OSAxNS42MiAxNC42NyAxMy45OSAxMiAxNFoiIGZpbGw9IiM2Yzc1N2QiLz4KPC9zdmc+Cjwvc3ZnPgo=';
  }

  goToKiosk() {
    this.setActiveTab('kiosk');
  }

  getGenreColor(genre: string): string {
    const colors: { [key: string]: string } = {
      'Fiction': 'linear-gradient(45deg, #FF6347, #FF4500)',
      'Science-Fiction': 'linear-gradient(45deg, #4682B4, #1E90FF)',
      'Histoire': 'linear-gradient(45deg, #D2691E, #CD853F)',
      'Philosophie': 'linear-gradient(45deg, #9370DB, #8A2BE2)',
      'Informatique': 'linear-gradient(45deg, #20B2AA, #00CED1)',
      'Romance': 'linear-gradient(45deg, #FF69B4, #FFB6C1)',
      'Thriller': 'linear-gradient(45deg, #2F4F4F, #696969)',
      'Action': 'linear-gradient(45deg, #DC143C, #B22222)',
      'Romantique': 'linear-gradient(45deg, #FF1493, #FF69B4)',
      'Fait Divers': 'linear-gradient(45deg, #32CD32, #228B22)'
    };
    return colors[genre] || 'linear-gradient(45deg, #DAA520, #B8860B)';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}