import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Toast, ToastNotificationService } from '../../services/toast-notification.service';

@Component({
  selector: 'app-toast-notification',
  standalone: false,
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.css']
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private destroyed$ = new Subject<void>();

  constructor(private toastService: ToastNotificationService) {}

  ngOnInit(): void {
    this.toastService.getToasts().pipe(
      takeUntil(this.destroyed$)
    ).subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
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
