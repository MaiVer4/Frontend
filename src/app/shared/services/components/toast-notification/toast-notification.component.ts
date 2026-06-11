import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Toast, ToastNotificationService } from '../../toast-notification.service';

@Component({
  selector: 'app-toast-notification',
  standalone: false,
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private destroyed$ = new Subject<void>();

  constructor(private toastService: ToastNotificationService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.toastService.getToasts().pipe(
      takeUntil(this.destroyed$)
    ).subscribe(toasts => {
      this.toasts = toasts;
      // Ensure OnPush components update when toasts change
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  close(id: string): void {
    this.toastService.remove(id);
  }

  trackByToastId(index: number, toast: Toast): string {
    return toast.id;
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
