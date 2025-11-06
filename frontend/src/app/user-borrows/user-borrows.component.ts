import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowService } from '../services/borrow.service';

@Component({
  selector: 'app-user-borrows',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h2><i class="fas fa-book-reader"></i> Mes Emprunts</h2>
        </div>
      </div>

      <!-- Statut utilisateur -->
      <div class="row mb-4" *ngIf="!isAdmin()">
        <div class="col-12">
          <div class="alert" [ngClass]="getUserStatusClass()">
            <i class="fas" [ngClass]="getUserStatusIcon()"></i>
            {{getUserStatusMessage()}}
          </div>
        </div>
      </div>

      <!-- Liste des emprunts -->
      <div class="row" *ngIf="borrows.length > 0; else noBorrows">
        <div class="col-md-6 mb-3" *ngFor="let borrow of borrows">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-3">
                  <img [src]="borrow.cover_image || 'assets/default-book.jpg'" 
                       class="img-fluid rounded" [alt]="borrow.title">
                </div>
                <div class="col-9">
                  <h5 class="card-title">{{borrow.title}}</h5>
                  <p class="card-text">
                    <strong>Auteur:</strong> {{borrow.author}}<br>
                    <strong>Catégorie:</strong> {{borrow.category_name}}<br>
                    <strong>Demandé le:</strong> {{formatDate(borrow.request_date)}}
                  </p>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="badge" [ngClass]="getStatusClass(borrow.status)">
                      {{getStatusText(borrow.status)}}
                    </span>
                    <small class="text-muted" *ngIf="borrow.due_date">
                      Retour prévu: {{formatDate(borrow.due_date)}}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noBorrows>
        <div class="row">
          <div class="col-12 text-center py-5">
            <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
            <h4 class="text-muted">Aucun emprunt</h4>
            <p class="text-muted">Vous n'avez pas encore emprunté de livres.</p>
            <a href="/books" class="btn btn-primary">
              <i class="fas fa-search"></i> Parcourir le catalogue
            </a>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .alert {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .card {
      transition: transform 0.2s;
    }
    
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class UserBorrowsComponent implements OnInit {
  borrows: any[] = [];

  constructor(private borrowService: BorrowService) {}

  ngOnInit() {
    this.loadUserBorrows();
  }

  loadUserBorrows() {
    this.borrowService.getUserBorrows().subscribe({
      next: (response) => {
        if (response.success) {
          this.borrows = response.borrows;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des emprunts:', error);
      }
    });
  }

  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  }

  getUserStatusClass(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.status === 'approved' ? 'alert-success' : 'alert-warning';
  }

  getUserStatusIcon(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.status === 'approved' ? 'fa-check-circle' : 'fa-clock';
  }

  getUserStatusMessage(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.status === 'approved') {
      return 'Votre compte est certifié. Vous pouvez emprunter des livres.';
    }
    return 'Votre compte est en attente de certification. Vous ne pouvez pas encore emprunter de livres.';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'approved': return 'bg-info';
      case 'active': return 'bg-success';
      case 'returned': return 'bg-secondary';
      case 'overdue': return 'bg-danger';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'active': return 'En cours';
      case 'returned': return 'Retourné';
      case 'overdue': return 'En retard';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }
}