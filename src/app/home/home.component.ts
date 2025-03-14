import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DateInfoComponent } from '../date-info/date-info.component';
import { RouterModule } from '@angular/router';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    DateInfoComponent,
    CalendarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected showDate = new Date();

  protected onDayChanged(day: Date): void {
    this.showDate = day;
  }
}
