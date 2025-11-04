import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-penalties',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row">
      <div class="col-12">
        <h2><i class="fas fa-exclamation-triangle"></i> Retards & Pénalités</h2>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-12">
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          Les pénalités sont calculées automatiquement selon la configuration système.
          Taux actuel : 300 CFA par jour de retard.
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5>Emprunts en Retard</h5>
            <button class="btn btn-primary btn-sm" (click)="loadOverdueLoans()">
              <i class="fas fa-sync"></i> Actualiser
            </button>
          </div>
          <div class="card-body">
            <div class="table-responsive" *ngIf="overdueLoans.length > 0">
              <table class="table table-striped">
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
                  <tr *ngFor="let loan of overdueLoans" class="table-warning">
                    <td>{{loan.user_name}}</td>
                    <td>{{loan.book_title}}</td>
                    <td>{{loan.due_date}}</td>
                    <td>
                      <span class="badge bg-danger">{{loan.days_overdue}} jours</span>
                    </td>
                    <td>
                      <strong class="text-danger">{{loan.penalty_formatted}}</strong>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary" (click)="sendReminder(loan.id)">
                        <i class="fas fa-envelope"></i> Rappel
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div *ngIf="overdueLoans.length === 0" class="text-center py-5">
              <i class="fas fa-check-circle fa-3x text-success mb-3"></i>
              <h5 class="text-success">Aucun retard actuellement</h5>
              <p class="text-muted">Tous les emprunts sont à jour !</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6>Statistiques des Retards</h6>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-6">
                <h4 class="text-danger">{{overdueLoans.length}}</h4>
                <small class="text-muted">Emprunts en retard</small>
              </div>
              <div class="col-6">
                <h4 class="text-warning">{{getTotalPenalties()}} CFA</h4>
                <small class="text-muted">Pénalités totales</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PenaltiesComponent implements OnInit {
  overdueLoans: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadOverdueLoans();
  }

  loadOverdueLoans() {
    this.apiService.getOverdueLoans().subscribe({
      next: (data) => this.overdueLoans = data,
      error: (error) => console.error('Erreur:', error)
    });
  }

  getTotalPenalties(): number {
    return this.overdueLoans.reduce((total, loan) => total + loan.penalty_amount, 0);
  }

  sendReminder(loanId: number) {
    // Implémentation du rappel
    console.log('Envoi rappel pour emprunt:', loanId);
  }
}