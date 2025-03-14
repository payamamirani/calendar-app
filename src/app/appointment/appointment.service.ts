import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, fromEvent, map, Observable } from 'rxjs';
import { Appointment } from './appointment.model';
import { getDateString, getTimeString } from '../utils/functions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private _snackBar = inject(MatSnackBar);

  private readonly storageKey = 'CALENDAR_APP_APPOINTMENT_STORAGE';
  private appointments: Appointment[] = [];
  private readonly storageSubject = new BehaviorSubject<Appointment[]>(
    this.appointments
  );
  private readonly storage$ = this.storageSubject.asObservable();
  private readonly storage = sessionStorage;

  constructor() {
    this.initStorage();
    this.watchStorage();
  }

  private initStorage(): void {
    let savedAppointments = this.storage.getItem(this.storageKey);
    if (savedAppointments) {
      this.appointments = JSON.parse(savedAppointments);
      this.storageSubject.next(this.appointments);
    } else {
      this.appointments.forEach((appointment) => this.add(appointment));
    }
  }

  private watchStorage(): void {
    fromEvent<StorageEvent>(window, 'storage')
      .pipe(
        filter((event) => event.key === this.storageKey),
        map((event) =>
          event.newValue ? (JSON.parse(event.newValue) as Appointment[]) : null
        )
      )
      .subscribe((data) => {
        if (data) {
          this.storageSubject.next(data);
        }
      });
  }

  add(appointment: Appointment): void {
    appointment.id = this.appointments.length + 1;
    appointment.fromTime = new Date(
      getDateString(appointment.date) +
        ' ' +
        getTimeString(appointment.fromTime)
    );
    appointment.toTime = new Date(
      getDateString(appointment.date) + ' ' + getTimeString(appointment.toTime)
    );

    if (
      this.appointments.some((existAppointment) =>
        this.hasOverlap(appointment, existAppointment)
      )
    ) {
      return this.openSnackBar('Appointment has overlap');
    }

    this.appointments.push(appointment);
    this.storage.setItem(this.storageKey, JSON.stringify(this.appointments));
    this.storageSubject.next(this.appointments);
  }

  get(): Observable<Appointment[]> {
    return this.storage$.pipe();
  }

  delete(appointment: Appointment): void {
    this.appointments = this.appointments.filter(
      (app) => app.id !== appointment.id
    );
    this.storage.setItem(this.storageKey, JSON.stringify(this.appointments));
    this.storageSubject.next(this.appointments);
  }

  update(appointment: Appointment): boolean {
    const index = this.appointments.findIndex(
      (app) => app.id === appointment.id
    );

    if (index === -1) {
      return false;
    }

    if (
      this.appointments.some((existAppointment) =>
        this.hasOverlap(appointment, existAppointment)
      )
    ) {
      this.openSnackBar('Appointment has overlap');

      return false;
    }

    const updatedAppointments = [
      ...this.appointments.slice(0, index),
      appointment,
      ...this.appointments.slice(index + 1),
    ];

    this.appointments = updatedAppointments;
    this.storage.setItem(this.storageKey, JSON.stringify(this.appointments));
    this.storageSubject.next(this.appointments);
    return true;
  }

  private hasOverlap(
    newAppointment: Appointment,
    existingAppointment: Appointment
  ): boolean {
    if (newAppointment.id === existingAppointment.id) {
      return false;
    }

    const aFrom = new Date(newAppointment.fromTime).valueOf();
    const aTo = new Date(newAppointment.toTime).valueOf();
    const bFrom = new Date(existingAppointment.fromTime).valueOf();
    const bTo = new Date(existingAppointment.toTime).valueOf();

    const latestStart = new Date(Math.max(aFrom, bFrom));
    const earliestEnd = new Date(Math.min(aTo, bTo));

    return latestStart < earliestEnd;
  }

  private openSnackBar(message: string): void {
    this._snackBar.open(message, 'Dismiss');
  }
}
