import { Directive, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment, TimeSlot } from '../appointment/appointment.model';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { AppointmentService } from '../appointment/appointment.service';

@Directive()
export abstract class BaseAppointment {
  private readonly dialog = inject(MatDialog);
  protected readonly appointmentService = inject(AppointmentService);
  protected readonly saved = signal('');

  protected showAppointmentDialog(data?: {
    date: Date;
    timeSlot?: TimeSlot;
  }): void {
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      data: { saved: this.saved(), ...data },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.reload();
    });
  }

  protected updateAppointmentDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      data: { appointment: appointment, saved: this.saved() },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.reload();
    });
  }

  protected abstract reload(): void;
}
