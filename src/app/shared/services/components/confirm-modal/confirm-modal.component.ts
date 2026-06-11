import { Component, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ConfirmService } from '../../confirm.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnDestroy {
  @ViewChild('confirmButton') confirmButton?: ElementRef<HTMLButtonElement>;

  visible = false;
  message = '¿Confirmar acción?';
  title = 'Confirmar';
  private currentResolve?: (value: boolean) => void;
  private sub?: Subscription;

  constructor(private confirmService: ConfirmService) {
    this.sub = this.confirmService.getRequest().subscribe((req: { message: string; title: string; resolve: (value: boolean) => void } | null) => {
      if (req) {
        this.message = req.message;
        this.title = req.title;
        this.currentResolve = req.resolve;
        this.visible = true;
        setTimeout(() => this.confirmButton?.nativeElement.focus(), 0);
      } else {
        this.visible = false;
        this.currentResolve = undefined;
      }
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (this.visible) {
      event.preventDefault();
      this.onCancel();
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onConfirm(): void {
    this.visible = false;
    this.confirmService.clearRequest();
    this.currentResolve?.(true);
    this.currentResolve = undefined;
  }

  onCancel(): void {
    this.visible = false;
    this.confirmService.clearRequest();
    this.currentResolve?.(false);
    this.currentResolve = undefined;
  }
}
