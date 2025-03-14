import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseAppointment } from '../base/base-appointment';
import { Appointment, TimeSlot } from '../appointment/appointment.model';
import { getDateString } from '../utils/functions';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule, MatButtonModule],
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.scss',
})
export class DayViewComponent extends BaseAppointment {
  protected hours: string[] = [
    '12 AM',
    '1 AM',
    '2 AM',
    '3 AM',
    '4 AM',
    '5 AM',
    '6 AM',
    '7 AM',
    '8 AM',
    '9 AM',
    '10 AM',
    '11 AM',
    '12 PM',
    '1 PM',
    '2 PM',
    '3 PM',
    '4 PM',
    '5 PM',
    '6 PM',
    '7 PM',
    '8 PM',
    '9 PM',
    '10 PM',
    '11 PM',
  ];
  protected timeSlots: TimeSlot[] = [];
  protected appointments: Appointment[] = [];
  protected appointmentsMap = new Map<TimeSlot, Appointment>();

  private readonly initialIndicatorTop = 10;
  private readonly indicatorTopPerHour = 41;
  private activeDate = new Date();

  constructor(private readonly activatedRoute: ActivatedRoute) {
    super();
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

  protected override reload(): void {
    this.timeSlots = [];
    this.appointments = [];
    this.appointmentsMap = new Map<TimeSlot, Appointment>();
    this.generateTimeSlots();
    this.loadAppointments();
  }

  protected onDoubleClick(timeSlot: TimeSlot): void {
    this.showAppointmentDialog({ date: this.activeDate, timeSlot: timeSlot });
  }

  protected drop(event: CdkDragDrop<Appointment[]>): void {
    const originalAppointment = { ...event.item.data } as Appointment;
    let appointment = event.item.data as Appointment;
    const duration =
      new Date(appointment.toTime).valueOf() -
      new Date(appointment.fromTime).valueOf();
    const timeSlot = this.timeSlots[event.currentIndex];
    appointment.fromTime = new Date(
      getDateString(appointment.date) + ' ' + timeSlot.time
    );
    appointment.toTime = new Date(appointment.fromTime.valueOf() + duration);

    if (!this.appointmentService.update(appointment)) {
      appointment.fromTime = originalAppointment.fromTime;
      appointment.toTime = originalAppointment.toTime;
    }

    this.reload();
  }

  protected getAppointmentHeight(appointment?: Appointment | null): string {
    if (!appointment) {
      return ``;
    }

    const duration =
      (new Date(appointment.toTime).valueOf() -
        new Date(appointment.fromTime).valueOf()) /
      3600000;

    return `${(duration * this.indicatorTopPerHour) / 0.5}`;
  }

  protected getAppointmentTop(appointment?: Appointment | null): string {
    if (!appointment) {
      return ``;
    }

    const index = this.getTimeSlotIndex(appointment.fromTime);

    return `${this.initialIndicatorTop + index * this.indicatorTopPerHour}`;
  }

  protected updateAppointment(appointment: Appointment): void {
    this.updateAppointmentDialog(appointment);
  }

  protected deleteAppointment(appointment: Appointment): void {
    this.appointmentService.delete(appointment);
    this.reload();
  }

  protected getAppointment(time: TimeSlot): Appointment | undefined {
    return this.appointmentsMap.get(time);
  }

  protected addNewAppointment(): void {
    this.showAppointmentDialog({ date: this.activeDate });
  }

  protected onAppointmentDoubleClick(appointment?: Appointment): void {
    if (!appointment) {
      return;
    }

    this.updateAppointment(appointment);
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
          this.timeSlots[this.getTimeSlotIndex(appointment.fromTime)];
        this.appointmentsMap.set(timeSlot, appointment);
      });
    });
  }

  private getTimeSlotIndex(date: Date): number {
    const correctDate = new Date(date);

    const hours = correctDate.getHours();
    const minutes = correctDate.getMinutes();

    const totalMinutes = hours * 60 + minutes;

    const index = Math.floor(totalMinutes / 30);

    return index;
  }
}
