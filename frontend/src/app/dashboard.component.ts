import { Component, OnInit } from '@angular/core';
import { NotificationService } from './services/notification.service';
import { LoanService } from './services/loan.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  notifications: any[] = [];
  unreadCount: number = 4;
  activeLoans: any[] = [];
  showNotification = false;
  latestNotification: any;

  constructor(
    private notificationService: NotificationService,
    private loanService: LoanService
  ) {}

  ngOnInit() {
    this.loadNotifications();
    this.loadActiveLoans();
    this.checkNewNotifications();
  }

  checkNewNotifications() {
    this.notificationService.getNotifications().subscribe(data => {
      if (data.length > 0 && !data[0].is_read) {
        this.latestNotification = data[0];
        this.showNotification = true;
        setTimeout(() => this.showNotification = false, 5000);
      }
    });
  }

  closeNotification() {
    this.showNotification = false;
    if (this.latestNotification) {
      this.markAsRead(this.latestNotification.id);
    }
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data;
    });
  }

  loadUnreadCount() {
    this.notificationService.getUnreadCount().subscribe(data => {
      this.unreadCount = data.count;
    });
  }

  loadActiveLoans() {
    this.loanService.getActiveLoans().subscribe(data => {
      this.activeLoans = data;
    });
  }

  markAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.is_read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
    });
  }

  returnBook(loanId: number) {
    this.loanService.returnBook(loanId).subscribe(() => {
      this.loadActiveLoans();
    });
  }
}