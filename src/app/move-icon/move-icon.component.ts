import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-move-icon',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './move-icon.component.html',
  styleUrl: './move-icon.component.scss',
})
export class MoveIconComponent {
  @Input() hide = false;
}
