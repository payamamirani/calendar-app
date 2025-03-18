import { Component, inject, model, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { AppointmentService } from '../appointment/appointment.service';

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogData } from '../appointment/appointment.model';
import { appointmentDateRangeValidator } from '../validators/dateRange.validator';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MoveIconComponent } from '../move-icon/move-icon.component';
import { ToastService } from '../base/toast.service';
import { getDateString, getTimeString } from '../utils/functions';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    CdkDrag,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatTimepickerModule,
    MatDialogClose,
    MoveIconComponent,
  ],
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.scss'],
})
export class AppointmentDialogComponent implements OnInit {
  protected readonly toastService = inject(ToastService);
  private readonly dialogRef = inject(MatDialogRef<AppointmentDialogComponent>);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  protected readonly saved = model(this.data.saved);
  protected appointmentForm?: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    const { appointment, date, fromTime, toTime } = this.data;

    this.appointmentForm = this.fb.group(
      {
        title: [this.data.appointment?.title, Validators.required],
        date: [appointment ? appointment.date : date, Validators.required],
        fromTime: [
          appointment ? appointment.fromTime : fromTime,
          Validators.required,
        ],
        toTime: [
          appointment ? appointment.toTime : toTime,
          Validators.required,
        ],
        description: [this.data.appointment?.description],
      },
      { validators: appointmentDateRangeValidator() }
    );
  }

  onSubmit(): void {
    if (this.appointmentForm?.valid) {
      if (this.data.appointment) {
        this.updateAppointment();
      } else {
        this.addNewAppointment();
      }
      this.appointmentForm.reset();
    }
  }

  private addNewAppointment(): void {
    const { model } = this.appointmentForm!.value;
    model.fromTime = new Date(
      getDateString(model.date) + ' ' + getTimeString(model.fromTime)
    );
    model.toTime = new Date(
      getDateString(model.date) + ' ' + getTimeString(model.toTime)
    );

    this.appointmentService.add(model).subscribe({
      next: () => {
        this.toastService.show('Appointment added successfully.');
      },
      error: (err) => {
        this.toastService.show(err.message);
      },
    });
  }

  private updateAppointment() {
    this.appointmentService
      .update({
        id: this.data.appointment!.id,
        ...this.appointmentForm!.value,
      })
      .subscribe({
        next: () => {
          this.toastService.show('Appointment updated successfully.');
        },
        error: (err) => {
          this.toastService.show(err.message);
        },
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
