import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-kiosk',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header text-white py-4" style="background: linear-gradient(135deg, #9370DB 0%, #8A2BE2 50%, #FF69B4 100%); border-radius: 20px 20px 0 0;">
              <h3 class="mb-1">
                <i class="fas fa-wifi me-2"></i>Kiosque IoT
              </h3>
              <p class="mb-0 opacity-75">Emprunt et retour automatique par RFID</p>
            </div>
            <div class="card-body">
              
              <!-- Utilisateur connecté -->
              <div *ngIf="currentUser" class="alert alert-info">
                <h5><i class="fas fa-user"></i> Utilisateur: {{currentUser.name}}</h5>
                <p class="mb-0">ID: {{currentUser.id}} | Email: {{currentUser.email}}</p>
              </div>
              
              <!-- Instructions -->
              <div class="row mb-4">
                <div class="col-md-6">
                  <div class="card" style="border: 3px solid #228B22; background: linear-gradient(135deg, rgba(34,139,34,0.1), rgba(50,205,50,0.1));">
                    <div class="card-body text-center">
                      <i class="fas fa-book fa-3x mb-3" style="color: #228B22;"></i>
                      <h5 style="color: #228B22;">Pour Emprunter</h5>
                      <p>Placez le livre sur le lecteur RFID</p>
                      <small class="text-muted">Le système détectera automatiquement le livre</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card" style="border: 3px solid #FF8C00; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,215,0,0.1));">
                    <div class="card-body text-center">
                      <i class="fas fa-undo fa-3x mb-3" style="color: #FF8C00;"></i>
                      <h5 style="color: #FF8C00;">Pour Retourner</h5>
                      <p>Placez le livre emprunté sur le lecteur</p>
                      <small class="text-muted">Le retour sera automatiquement enregistré</small>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Simulation de scan (pour test sans hardware) -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5><i class="fas fa-cog"></i> Simulation de Scan (Test)</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <label class="form-label">Tag UID (simulé)</label>
                      <select class="form-select" [(ngModel)]="simulatedTagUid">
                        <option value="">Sélectionner un livre...</option>
                        <option value="A1B2C3D4">Le Petit Prince (A1B2C3D4)</option>
                        <option value="E5F6G7H8">1984 (E5F6G7H8)</option>
                        <option value="I9J0K1L2">Algorithmique (I9J0K1L2)</option>
                        <option value="M3N4O5P6">Histoire de France (M3N4O5P6)</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">&nbsp;</label>
                      <button class="btn btn-primary w-100" 
                              (click)="simulateScan()" 
                              [disabled]="!simulatedTagUid || scanning">
                        <i class="fas fa-qrcode"></i> Simuler Scan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Statut en temps réel -->
              <div class="card">
                <div class="card-header">
                  <h5><i class="fas fa-activity"></i> Activité en Temps Réel</h5>
                </div>
                <div class="card-body">
                  <div *ngIf="scanning" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2">Traitement du scan...</p>
                  </div>
                  
                  <div *ngIf="lastResult" class="alert" 
                       [class.alert-success]="lastResult.status === 'borrowed' || lastResult.status === 'returned'"
                       [class.alert-warning]="lastResult.status === 'user_required'"
                       [class.alert-danger]="lastResult.status === 'unknown_tag' || lastResult.status === 'unavailable'">
                    <h6>
                      <i class="fas" 
                         [class.fa-check]="lastResult.status === 'borrowed' || lastResult.status === 'returned'"
                         [class.fa-exclamation-triangle]="lastResult.status === 'user_required' || lastResult.status === 'unavailable'"
                         [class.fa-times]="lastResult.status === 'unknown_tag'"></i>
                      {{getStatusTitle(lastResult.status)}}
                    </h6>
                    <p class="mb-0">{{lastResult.message}}</p>
                    <small *ngIf="lastResult.book" class="text-muted">Livre: {{lastResult.book}}</small>
                  </div>
                  
                  <!-- Historique des scans -->
                  <div *ngIf="scanHistory.length > 0">
                    <h6>Historique des Scans</h6>
                    <div class="list-group">
                      <div *ngFor="let scan of scanHistory.slice(0, 5)" 
                           class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                          <h6 class="mb-1">{{scan.book || 'Tag: ' + scan.tag_uid}}</h6>
                          <small>{{scan.timestamp | date:'short'}}</small>
                        </div>
                        <p class="mb-1">{{scan.message}}</p>
                        <span class="badge" 
                              [class.bg-success]="scan.status === 'borrowed' || scan.status === 'returned'"
                              [class.bg-warning]="scan.status === 'user_required'"
                              [class.bg-danger]="scan.status === 'unknown_tag'">
                          {{getStatusTitle(scan.status)}}
                        </span>
                      </div>
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
    .card {
      margin-bottom: 1.5rem;
      border: none;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    .card:hover {
      transform: translateY(-3px);
    }
    .spinner-border {
      width: 4rem;
      height: 4rem;
      border-width: 4px;
    }
    .alert {
      border-radius: 15px;
      border: none;
      font-weight: 500;
    }
    .btn {
      border-radius: 12px;
      font-weight: 600;
      padding: 12px 24px;
    }
    .list-group-item {
      border-radius: 12px;
      margin-bottom: 8px;
      border: 1px solid #e9ecef;
      transition: all 0.3s ease;
    }
    .list-group-item:hover {
      transform: translateX(5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
  `]
})
export class KioskComponent implements OnInit, OnDestroy {
  currentUser = this.authService.getCurrentUser();
  simulatedTagUid = '';
  scanning = false;
  lastResult: any = null;
  scanHistory: any[] = [];
  private pollSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Polling pour les mises à jour en temps réel (simulation)
    this.pollSubscription = interval(5000).subscribe(() => {
      if (this.currentUser) {
        this.loadMyBorrows();
      }
    });
  }

  ngOnDestroy() {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
  }

  simulateScan() {
    if (!this.simulatedTagUid || !this.currentUser) return;

    this.scanning = true;
    this.lastResult = null;

    // Simuler l'appel IoT
    const payload = {
      device_id: 'kiosk_web',
      tag_uid: this.simulatedTagUid,
      user_id: this.currentUser.id
    };

    // Appel direct à l'endpoint IoT
    fetch('http://localhost:8000/api/iot/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
      this.scanning = false;
      this.lastResult = result;
      
      // Ajouter à l'historique
      this.scanHistory.unshift({
        ...result,
        tag_uid: this.simulatedTagUid,
        timestamp: new Date()
      });

      // Recharger les emprunts
      this.loadMyBorrows();
    })
    .catch(error => {
      this.scanning = false;
      this.lastResult = {
        status: 'error',
        message: 'Erreur de connexion au serveur'
      };
      console.error('Erreur scan:', error);
    });
  }

  loadMyBorrows() {
    this.apiService.getMyBorrows().subscribe({
      next: (borrows) => {
        // Mise à jour silencieuse des emprunts
      },
      error: (error) => console.error('Erreur emprunts:', error)
    });
  }

  getStatusTitle(status: string): string {
    const titles: { [key: string]: string } = {
      'borrowed': 'Emprunt Réussi',
      'returned': 'Retour Réussi',
      'unknown_tag': 'Tag Inconnu',
      'user_required': 'Utilisateur Requis',
      'unavailable': 'Livre Indisponible',
      'error': 'Erreur'
    };
    return titles[status] || status;
  }
}