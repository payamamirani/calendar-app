import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MonthComponent } from '../month/month.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MonthComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  protected today: Date = new Date();
  protected selectedDate = new Date();
  protected activeMonth: Date = new Date();
  protected daysInMonth: Date[] = [];

  @Output() dayChangeEvent: EventEmitter<Date> = new EventEmitter<Date>();

  constructor() {
    this.generateDaysInMonth();
  }

  protected formatDate(date: Date): string {
    return date.getDate().toString();
  }

  protected isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  protected onActiveMonthChanged(month: Date): void {
    this.activeMonth = month;
    this.generateDaysInMonth();
  }

  private generateDaysInMonth(): void {
    const year = this.activeMonth.getFullYear();
    const month = this.activeMonth.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = Array.from(
      { length: numDays },
      (_, i) => new Date(year, month, i + 1)
    );
  }

  protected onDayClick(day: Date): void {
    this.selectedDate = day;
    this.dayChangeEvent.emit(day);
  }
}
