import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row">
      <div class="col-12">
        <h2><i class="fas fa-chart-bar"></i> Statistiques & Rapports</h2>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h6>Rapports PDF</h6>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <button class="btn btn-outline-primary" (click)="downloadReport('books')">
                <i class="fas fa-file-pdf"></i> Rapport des Livres
              </button>
              <button class="btn btn-outline-success" (click)="downloadReport('loans')">
                <i class="fas fa-file-pdf"></i> Rapport des Emprunts
              </button>
              <button class="btn btn-outline-info" (click)="downloadReport('users')">
                <i class="fas fa-file-pdf"></i> Rapport des Utilisateurs
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h6>Statistiques en Temps Réel</h6>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-3">
                <h4 class="text-primary">{{stats.total_books || 0}}</h4>
                <small>Livres Total</small>
              </div>
              <div class="col-3">
                <h4 class="text-success">{{stats.total_users || 0}}</h4>
                <small>Utilisateurs</small>
              </div>
              <div class="col-3">
                <h4 class="text-warning">{{stats.active_loans || 0}}</h4>
                <small>Emprunts Actifs</small>
              </div>
              <div class="col-3">
                <h4 class="text-danger">{{stats.overdue_loans || 0}}</h4>
                <small>En Retard</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6>Livres par Catégorie</h6>
          </div>
          <div class="card-body">
            <div *ngFor="let item of reportStats.books_by_category" class="d-flex justify-content-between mb-2">
              <span>{{item.name}}</span>
              <span class="badge bg-primary">{{item.count}}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6>Livres Populaires</h6>
          </div>
          <div class="card-body">
            <div *ngFor="let book of reportStats.popular_books?.slice(0, 5)" class="d-flex justify-content-between mb-2">
              <span>{{book.title}}</span>
              <span class="badge bg-success">{{book.loans_count}} emprunts</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h6>Activité Mensuelle</h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div *ngFor="let month of reportStats.loans_by_month" class="col-md-2 text-center mb-3">
                <div class="border rounded p-2">
                  <h5>{{month.count}}</h5>
                  <small>Mois {{month.month}}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  stats: any = {};
  reportStats: any = {
    books_by_category: [],
    loans_by_month: [],
    popular_books: [],
    user_activity: []
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadStats();
    this.loadReportStats();
  }

  loadStats() {
    this.apiService.getDashboardStats().subscribe({
      next: (data) => this.stats = data.stats || {},
      error: (error) => console.error('Erreur:', error)
    });
  }

  loadReportStats() {
    this.apiService.getReportStats().subscribe({
      next: (data) => this.reportStats = data,
      error: (error) => console.error('Erreur:', error)
    });
  }

  downloadReport(type: string) {
    this.apiService.downloadReport(type).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport_${type}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => console.error('Erreur téléchargement:', error)
    });
  }
}