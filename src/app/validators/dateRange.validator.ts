import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Appointment } from '../appointment/appointment.model';

export function appointmentDateRangeValidator(
  fromDateKey: string,
  toDateKey: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const fromDate = (formGroup.value as Appointment).fromTime;
    const toDate = (formGroup.value as Appointment).toTime;

    if (fromDate && toDate && new Date(toDate) <= new Date(fromDate)) {
      return { dateRange: true };
    }

    return null;
  };
}
