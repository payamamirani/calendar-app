import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Appointment,
  DialogData,
  getDateIndexInDay,
  TimeSlot,
} from './appointment.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MoveIconComponent } from '../move-icon/move-icon.component';

@Component({
  selector: 'app-appointment',
  imports: [
    CdkDrag,
    DragDropModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MoveIconComponent,
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
})
export class AppointmentComponent {
  @Input({ required: true }) timeSlot!: TimeSlot;
  @Input({ required: true }) date!: Date;

  @Input() appointment?: Appointment;
  @Output() newAppointment = new EventEmitter<DialogData>();
  @Output() updateAppointment = new EventEmitter<Appointment>();
  @Output() deleteAppointment = new EventEmitter<Appointment>();

  private readonly initialTop = 10;
  private readonly topPerHour = 41;

  protected getHeight(): string {
    if (!this.appointment) {
      return ``;
    }

    const duration =
      (new Date(this.appointment.toTime).valueOf() -
        new Date(this.appointment.fromTime).valueOf()) /
      3600000;

    return `${(duration * this.topPerHour) / 0.5}`;
  }

  protected getTop(): string {
    const index = getDateIndexInDay(
      new Date(this.date.toDateString() + ' ' + this.timeSlot.time)
    );

    return `${this.initialTop + index * this.topPerHour}`;
  }

  protected update(): void {
    this.updateAppointment.emit(this.appointment);
  }

  protected delete(): void {
    this.deleteAppointment.emit(this.appointment);
  }

  protected onDoubleClick(): void {
    const fromTime = new Date(
      this.date.toDateString() + ' ' + this.timeSlot.time
    );
    const minutesToAdd = 30;
    const toTime = new Date(fromTime.getTime() + minutesToAdd * 60 * 1000);

    this.newAppointment.emit({ date: this.date, fromTime, toTime });
  }
}
