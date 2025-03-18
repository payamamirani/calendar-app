import { Directive, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment, DialogData } from '../appointment/appointment.model';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { AppointmentService } from '../appointment/appointment.service';
import { ToastService } from './toast.service';

@Directive()
export abstract class BaseAppointment {
  protected readonly toastService = inject(ToastService);
  private readonly dialog = inject(MatDialog);
  protected readonly appointmentService = inject(AppointmentService);
  protected readonly saved = signal('');

  protected addNewAppointment(data?: DialogData): void {
    this.showAppointmentDialog(data);
  }

  protected updateAppointment(appointment: Appointment): void {
    this.updateAppointmentDialog(appointment);
  }

  protected deleteAppointment(appointment: Appointment): void {
    this.appointmentService.delete(appointment.id).subscribe({
      next: () => {
        this.reload();
      },
      error: (err) => {
        this.toastService.show(err.message);
      },
    });
  }

  protected abstract reload(): void;

  private showAppointmentDialog(data?: DialogData): void {
    this.showDialog({ ...data });
  }

  private updateAppointmentDialog(appointment: Appointment): void {
    this.showDialog({ appointment });
  }

  private showDialog(data: DialogData) {
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '40vw',
      data: { ...data, saved: this.saved() },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.reload();
    });
  }
}
