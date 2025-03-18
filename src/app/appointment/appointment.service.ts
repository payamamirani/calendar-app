import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Appointment } from './appointment.model';
import { IService } from '../base/service-interface';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService implements IService<Appointment>, OnDestroy {
  private readonly storageKey = 'CALENDAR_APP_APPOINTMENT_STORAGE';
  private appointments: Appointment[] = [];

  private readonly storageSubject = new BehaviorSubject<Appointment[]>(
    this.appointments
  );

  private readonly storage$ = this.storageSubject.asObservable();
  private readonly storage = sessionStorage;

  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.initStorage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initStorage(): void {
    const savedAppointments = this.storage.getItem(this.storageKey);
    if (savedAppointments) {
      this.appointments = JSON.parse(savedAppointments);
      this.storageSubject.next(this.appointments);
    } else {
      this.appointments.forEach((appointment) => this.add(appointment));
    }
  }

  add(model: Appointment): Observable<void> {
    return new Observable<void>((observer) => {
      model.id = this.appointments.length + 1;

      if (
        this.appointments.some((existAppointment) =>
          this.hasOverlap(model, existAppointment)
        )
      ) {
        observer.error(() => new Error('Appointment has overlap'));
        return;
      }

      this.appointments.push(model);
      this.storage.setItem(this.storageKey, JSON.stringify(this.appointments));
      this.storageSubject.next(this.appointments);

      observer.next();
      observer.complete();
    }).pipe(takeUntil(this.destroy$));
  }

  get(): Observable<Appointment[]> {
    return this.storage$.pipe(takeUntil(this.destroy$));
  }

  delete(id: number): Observable<void> {
    return new Observable<void>((observer) => {
      this.appointments = this.appointments.filter((app) => app.id !== id);
      this.storage.setItem(this.storageKey, JSON.stringify(this.appointments));
      this.storageSubject.next(this.appointments);
      observer.next();
      observer.complete();
    }).pipe(takeUntil(this.destroy$));
  }

  update(appointment: Appointment): Observable<void> {
    return new Observable<void>((observer) => {
      const index = this.appointments.findIndex(
        (app) => app.id === appointment.id
      );

      if (index === -1) {
        observer.error(new Error('Appointment not found'));
        return;
      }

      if (
        this.appointments.some((existAppointment) =>
          this.hasOverlap(appointment, existAppointment)
        )
      ) {
        observer.error(new Error('Appointment has overlap'));
        return;
      }

      const updatedAppointments = [
        ...this.appointments.slice(0, index),
        appointment,
        ...this.appointments.slice(index + 1),
      ];

      this.appointments = updatedAppointments;
      this.storage.setItem(this.storageKey, JSON.stringify(this.appointments));
      this.storageSubject.next(this.appointments);
      observer.next();
      observer.complete();
    }).pipe(takeUntil(this.destroy$));
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
}
