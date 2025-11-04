import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, DashboardStats } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row">
      <div class="col-12">
        <h2><i class="fas fa-tachometer-alt"></i> Tableau de Bord</h2>
      </div>
    </div>

    <div class="row mb-4" *ngIf="stats">
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
                <h4>{{stats.stats.active_loans}}</h4>
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
                <h4>{{stats.stats.overdue_loans}}</h4>
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
            <div *ngFor="let book of stats?.popular_books" class="mb-2">
              <strong>{{book.title}}</strong> - {{book.author}}
              <small class="text-muted">({{book.loans_count}} emprunts)</small>
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
            <div *ngFor="let loan of stats?.recent_loans" class="mb-2">
              <strong>{{loan.book?.title}}</strong>
              <br><small class="text-muted">{{loan.user?.name}} - {{loan.loan_date | date}}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-bottom: 1rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.apiService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        console.log('Stats chargées:', data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        // Données par défaut en cas d'erreur
        this.stats = {
          stats: { total_books: 0, total_users: 0, active_loans: 0, overdue_loans: 0 },
          popular_books: [],
          recent_loans: []
        };
      }
    });
  }
}