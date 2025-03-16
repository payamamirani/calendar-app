import { Directive, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment, DialogData } from '../appointment/appointment.model';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { AppointmentService } from '../appointment/appointment.service';

@Directive()
export abstract class BaseAppointment {
  private readonly dialog = inject(MatDialog);
  protected readonly appointmentService = inject(AppointmentService);
  protected readonly saved = signal('');

  protected showAppointmentDialog(data?: DialogData): void {
    this.showDialog({ ...data });
  }

  protected updateAppointmentDialog(appointment: Appointment): void {
    this.showDialog({ appointment });
  }

  private showDialog(data: DialogData) {
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '600px',
      data: { ...data, saved: this.saved() },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.reload();
    });
  }

  protected abstract reload(): void;
}
