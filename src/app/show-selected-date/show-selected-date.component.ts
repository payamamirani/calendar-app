import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-show-selected-date',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-selected-date.component.html',
  styleUrl: './show-selected-date.component.scss',
})
export class ShowSelectedDateComponent {
  @Input({ required: true }) selectedDate: Date = new Date();
}
