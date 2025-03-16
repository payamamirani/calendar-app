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

  protected addNewAppointment(data?: DialogData): void {
    this.showAppointmentDialog(data);
  }

  protected updateAppointment(appointment: Appointment): void {
    this.updateAppointmentDialog(appointment);
  }

  protected deleteAppointment(appointment: Appointment): void {
    this.appointmentService.delete(appointment);
    this.reload();
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
