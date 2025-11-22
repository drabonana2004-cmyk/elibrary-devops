import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-avatar-container">
      <img [src]="photoUrl" 
           [alt]="userName + ' - Photo de profil'" 
           [class]="avatarClass"
           (error)="onImageError()"
           [style.width]="size + 'px'"
           [style.height]="size + 'px'">
      <span *ngIf="showName" class="user-name">{{userName}}</span>
    </div>
  `,
  styles: [`
    .user-avatar-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    img {
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e0e0e0;
    }
    
    .user-name {
      font-weight: 500;
      color: #333;
    }
  `]
})
export class UserAvatarComponent implements OnInit {
  @Input() size: number = 40;
  @Input() showName: boolean = true;
  @Input() avatarClass: string = '';
  
  photoUrl: string = 'assets/default-avatar.png';
  userName: string = 'Utilisateur';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.name;
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        this.photoUrl = storedUser.photo_url || 
                       localStorage.getItem('userPhoto_' + user.email) || 
                       'assets/default-avatar.png';
      }
    });
  }

  onImageError() {
    this.photoUrl = 'assets/default-avatar.png';
  }
}