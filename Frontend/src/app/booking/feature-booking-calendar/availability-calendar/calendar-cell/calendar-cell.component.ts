import {Component, effect, input} from '@angular/core';
import {AvailableRoomModel} from '../../../domain/available.room.model';

@Component({
  selector: 'app-calendar-cell',
  imports: [],
  templateUrl: './calendar-cell.component.html',
  styleUrl: './calendar-cell.component.scss'
})
export class CalendarCellComponent {

  room = input.required<AvailableRoomModel | null>()

  constructor() {
    effect(() => {
        this.room()
    });
  }
}
