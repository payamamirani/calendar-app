import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DayViewRoutingModule } from './day-view-routing.module';
import { DayViewComponent } from './day-view.component';

@NgModule({
  imports: [CommonModule, DayViewRoutingModule, DayViewComponent],
})
export class DayViewModule {}
