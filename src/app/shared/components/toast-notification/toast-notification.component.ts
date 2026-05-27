import { Component, OnInit } from '@angular/core';
import { Toast, ToastNotificationService } from '../../services/toast-notification.service';

@Component({
  selector: 'app-toast-notification',
  standalone: false,
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.css']
})
export class ToastNotificationComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastNotificationService) {}

  ngOnInit(): void {
    this.toastService.getToasts().subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  close(id: string): void {
    this.toastService.remove(id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '●';
    }
  }
}
