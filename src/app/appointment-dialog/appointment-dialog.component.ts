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

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatTimepickerModule,
    MatDialogClose,
  ],
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.scss'],
})
export class AppointmentDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<AppointmentDialogComponent>);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  protected readonly saved = model(this.data.saved);
  protected appointmentForm?: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    const fromTime =
      this.data.appointment?.fromTime ??
      new Date(
        this.data.date?.toDateString() + ' ' + this.data.timeSlot?.time
      ) ??
      undefined;
    const date = this.data.appointment?.date ?? this.data.date ?? undefined;
    this.appointmentForm = this.fb.group(
      {
        title: [this.data.appointment?.title, Validators.required],
        date: [date, Validators.required],
        fromTime: [fromTime, Validators.required],
        toTime: [this.data.appointment?.toTime, Validators.required],
        description: [this.data.appointment?.description],
      },
      { validators: appointmentDateRangeValidator('fromDate', 'toDate') }
    );
  }

  onSubmit(): void {
    if (this.appointmentForm?.valid) {
      if (this.data.appointment) {
        this.appointmentService.update({
          id: this.data.appointment.id,
          ...this.appointmentForm.value,
        });
      } else {
        this.appointmentService.add(this.appointmentForm.value);
      }
      this.appointmentForm.reset();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
