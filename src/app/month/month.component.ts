import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-month',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './month.component.html',
  styleUrl: './month.component.scss',
})
export class MonthComponent {
  @Input() activeMonth: Date = new Date();
  @Output() activeMonthChanged: EventEmitter<Date> = new EventEmitter<Date>();

  protected previousMonth(): void {
    this.activeMonth = new Date(
      this.activeMonth.getFullYear(),
      this.activeMonth.getMonth() - 1,
      1
    );

    this.activeMonthChanged?.emit(this.activeMonth);
  }

  protected nextMonth(): void {
    this.activeMonth = new Date(
      this.activeMonth.getFullYear(),
      this.activeMonth.getMonth() + 1,
      1
    );

    this.activeMonthChanged?.emit(this.activeMonth);
  }
}
