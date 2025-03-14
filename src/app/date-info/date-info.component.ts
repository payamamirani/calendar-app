import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { ShowSelectedDateComponent } from '../show-selected-date/show-selected-date.component';

@Component({
  selector: 'app-date-info',
  standalone: true,
  imports: [MatButtonModule, MatSelectModule, ShowSelectedDateComponent],
  templateUrl: './date-info.component.html',
  styleUrl: './date-info.component.scss',
})
export class DateInfoComponent implements OnChanges {
  @Input({ required: true }) date!: Date;
  @Output() addEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private readonly router: Router) {}

  ngOnChanges(): void {
    this.redirectToCalendar();
  }

  private redirectToCalendar(): void {
    this.router.navigate([
      `day/${this.date.getFullYear()}/${
        this.date.getMonth() + 1
      }/${this.date.getDate()}`,
    ]);
  }

  protected onTodayClicked(): void {
    this.date = new Date();
    this.redirectToCalendar();
  }

  protected addNewAppointment(): void {
    this.addEvent.emit();
  }
}
