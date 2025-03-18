import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseAppointment } from '../base/base-appointment';
import {
  Appointment,
  getDateIndexInDay,
  TimeSlot,
} from '../appointment/appointment.model';
import { getDateString } from '../utils/functions';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentComponent } from '../appointment/appointment.component';

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    AppointmentComponent,
  ],
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.scss',
})
export class DayViewComponent extends BaseAppointment {
  protected timeSlots: TimeSlot[] = [];
  protected appointments: Appointment[] = [];
  protected appointmentsMap = new Map<TimeSlot, Appointment>();

  protected activeDate = new Date();

  constructor(private readonly activatedRoute: ActivatedRoute) {
    super();
    this.initPage();
  }

  protected override reload(): void {
    this.timeSlots = [];
    this.appointments = [];
    this.appointmentsMap = new Map<TimeSlot, Appointment>();
    this.generateTimeSlots();
    this.loadAppointments();
  }

  protected drop(event: CdkDragDrop<Appointment[]>): void {
    const originalAppointment = { ...event.item.data } as Appointment;
    const appointment = event.item.data as Appointment;
    const duration =
      new Date(appointment.toTime).valueOf() -
      new Date(appointment.fromTime).valueOf();
    const timeSlot = this.timeSlots[event.currentIndex];
    appointment.fromTime = new Date(
      getDateString(appointment.date) + ' ' + timeSlot.time
    );
    appointment.toTime = new Date(appointment.fromTime.valueOf() + duration);

    this.appointmentService.update(appointment).subscribe({
      next: () => {
        this.toastService.show('Appointment updated successfully');
        this.reload();
      },
      error: (err) => {
        appointment.fromTime = originalAppointment.fromTime;
        appointment.toTime = originalAppointment.toTime;
        this.toastService.show(err.message);
      },
    });
  }

  private initPage() {
    this.activatedRoute.params
      .pipe(
        map((param) => {
          const year = param['year'] as number;
          const month = param['month'] as number;
          const day = param['day'] as number;

          return new Date(year, month - 1, day, 0, 0, 0);
        })
      )
      .subscribe((date) => {
        this.activeDate = date;
        this.reload();
      });
  }

  private generateTimeSlots(): void {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date(0, 0, 0, hour, minute).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        this.timeSlots.push({ time });
      }
    }
  }

  private loadAppointments(): void {
    this.appointmentService.get().subscribe((result) => {
      this.appointments = result.filter((appointment) => {
        return (
          new Date(appointment.date).toDateString() ===
          this.activeDate.toDateString()
        );
      });
      this.appointmentsMap = new Map<TimeSlot, Appointment>();
      this.appointments.forEach((appointment) => {
        const timeSlot =
          this.timeSlots[getDateIndexInDay(appointment.fromTime)];
        this.appointmentsMap.set(timeSlot, appointment);
      });
    });
  }
}
