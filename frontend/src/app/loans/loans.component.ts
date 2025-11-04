import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Loan, Book } from '../services/api.service';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="row">
      <div class="col-12">
        <h2><i class="fas fa-handshake"></i> Gestion des Emprunts</h2>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-8">
        <div class="btn-group" role="group">
          <button type="button" class="btn" 
                  [class]="activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'"
                  (click)="setActiveTab('all')">
            Tous les Emprunts
          </button>
          <button type="button" class="btn" 
                  [class]="activeTab === 'overdue' ? 'btn-warning' : 'btn-outline-warning'"
                  (click)="setActiveTab('overdue')">
            En Retard ({{overdueLoans.length}})
          </button>
        </div>
      </div>
      <div class="col-md-4">
        <button class="btn btn-success w-100" (click)="showLoanForm = true">
          <i class="fas fa-plus"></i> Nouvel Emprunt
        </button>
      </div>
    </div>

    <!-- Formulaire de nouvel emprunt -->
    <div class="card mb-4" *ngIf="showLoanForm">
      <div class="card-header">
        <h5>Nouvel Emprunt</h5>
      </div>
      <div class="card-body">
        <form (ngSubmit)="createLoan()">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">ID Utilisateur</label>
                <input type="number" class="form-control" [(ngModel)]="newLoan.user_id" name="user_id" required>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">ID Livre</label>
                <input type="number" class="form-control" [(ngModel)]="newLoan.book_id" name="book_id" required>
              </div>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success">Créer l'Emprunt</button>
            <button type="button" class="btn btn-secondary" (click)="cancelLoan()">Annuler</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Liste des emprunts -->
    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Livre</th>
                <th>Date d'Emprunt</th>
                <th>Date d'Échéance</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let loan of displayedLoans">
                <td>{{loan.id}}</td>
                <td>{{loan.user?.name || 'Utilisateur #' + loan.user_id}}</td>
                <td>{{loan.book?.title || 'Livre #' + loan.book_id}}</td>
                <td>{{loan.loan_date | date}}</td>
                <td>{{loan.due_date | date}}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-success': loan.status === 'returned',
                    'bg-warning': loan.status === 'overdue',
                    'bg-primary': loan.status === 'active'
                  }">
                    {{getStatusLabel(loan.status)}}
                  </span>
                </td>
                <td>
                  <button *ngIf="loan.status === 'active'" 
                          class="btn btn-sm btn-outline-success"
                          (click)="returnBook(loan.id)">
                    <i class="fas fa-check"></i> Retourner
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="displayedLoans.length === 0" class="text-center py-5">
          <i class="fas fa-handshake fa-3x text-muted mb-3"></i>
          <p class="text-muted">Aucun emprunt trouvé</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table th {
      border-top: none;
    }
    .btn-group .btn {
      border-radius: 0;
    }
    .btn-group .btn:first-child {
      border-top-left-radius: 0.375rem;
      border-bottom-left-radius: 0.375rem;
    }
    .btn-group .btn:last-child {
      border-top-right-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
  `]
})
export class LoansComponent implements OnInit {
  loans: Loan[] = [];
  overdueLoans: Loan[] = [];
  displayedLoans: Loan[] = [];
  activeTab = 'all';
  showLoanForm = false;
  newLoan: { user_id?: number; book_id?: number } = {};

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadLoans();
    this.loadOverdueLoans();
  }

  loadLoans() {
    this.apiService.getLoans().subscribe({
      next: (response) => {
        this.loans = response.data || response;
        this.updateDisplayedLoans();
      },
      error: (error) => console.error('Erreur lors du chargement des emprunts:', error)
    });
  }

  loadOverdueLoans() {
    this.apiService.getOverdueLoans().subscribe({
      next: (data) => {
        this.overdueLoans = data;
        this.updateDisplayedLoans();
      },
      error: (error) => console.error('Erreur lors du chargement des emprunts en retard:', error)
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.updateDisplayedLoans();
  }

  updateDisplayedLoans() {
    if (this.activeTab === 'overdue') {
      this.displayedLoans = this.overdueLoans;
    } else {
      this.displayedLoans = this.loans;
    }
  }

  createLoan() {
    if (this.newLoan.user_id && this.newLoan.book_id) {
      this.apiService.createLoan(this.newLoan as { user_id: number; book_id: number }).subscribe({
        next: () => {
          this.loadLoans();
          this.cancelLoan();
        },
        error: (error) => console.error('Erreur lors de la création de l\'emprunt:', error)
      });
    }
  }

  returnBook(loanId: number) {
    this.apiService.returnBook(loanId).subscribe({
      next: () => {
        this.loadLoans();
        this.loadOverdueLoans();
      },
      error: (error) => console.error('Erreur lors du retour du livre:', error)
    });
  }

  cancelLoan() {
    this.showLoanForm = false;
    this.newLoan = {};
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'active': 'Actif',
      'returned': 'Retourné',
      'overdue': 'En Retard'
    };
    return labels[status] || status;
  }
}