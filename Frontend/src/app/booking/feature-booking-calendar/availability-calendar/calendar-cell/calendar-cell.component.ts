import {Component, effect, input, signal} from '@angular/core';
import {AvailableRoomModel} from '../../../domain/available.room.model';
import {FeatureTimelineBarComponent} from '../../feature-timeline-bar/feature-timeline-bar.component';
import {DateTime} from 'luxon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-calendar-cell',
  imports: [
    FeatureTimelineBarComponent,
    NgIf
  ],
  templateUrl: './calendar-cell.component.html',
  styleUrl: './calendar-cell.component.scss'
})
export class CalendarCellComponent {

  rooms = input.required<AvailableRoomModel[]>();
  room = input.required<AvailableRoomModel | null>();

  day = input.required<DateTime>();
  dayAsString = signal<string>("")

  get selectedRoomForDay(): AvailableRoomModel | null {

    const selected = this.room();
    if (!selected) return null;

    return this.rooms().find(r => r.id === selected.id) ?? null;
  }

  constructor() {
    effect(() => {

      const dateString = this.day().toString().substr(0,10);
      this.dayAsString.set(dateString);
      console.log("calendar string" + dateString)
    });
  }

}
