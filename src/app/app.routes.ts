import { Routes } from '@angular/router';
import { DayViewComponent } from './day-view/day-view.component';

export const routes: Routes = [
  { path: '', component: DayViewComponent },
  { path: 'day/:year/:month/:day', component: DayViewComponent },
];
