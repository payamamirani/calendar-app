import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./day-view/day-view.module').then((m) => m.DayViewModule),
  },
  {
    path: 'day/:year/:month/:day',
    loadChildren: () =>
      import('./day-view/day-view.module').then((m) => m.DayViewModule),
  },
  { path: '**', redirectTo: '' },
];
