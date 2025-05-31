import {Component, effect, input} from '@angular/core';
import {AvailableRoomModel} from '../../../domain/available.room.model';
import {FeatureTimelineBarComponent} from '../../feature-timeline-bar/feature-timeline-bar.component';

@Component({
  selector: 'app-calendar-cell',
  imports: [
    FeatureTimelineBarComponent
  ],
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
