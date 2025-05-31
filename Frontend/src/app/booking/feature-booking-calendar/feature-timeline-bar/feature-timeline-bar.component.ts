import {Component, input} from '@angular/core';
import {NgForOf} from "@angular/common";
import {AvailableRoomModel, Timeslot} from '../../domain/available.room.model';
import {DateTime} from 'luxon';

@Component({
  selector: 'app-feature-timeline-bar',
    imports: [
        NgForOf
    ],
  templateUrl: './feature-timeline-bar.component.html',
  styleUrl: './feature-timeline-bar.component.scss'
})
export class FeatureTimelineBarComponent {

  room = input.required<AvailableRoomModel>()
  isVertical = input<boolean>()

  selectInterval(interval: any) {
    console.log('Selected interval: ' + interval);
  }

  getIntervalOffset(interval: Timeslot): number {
    const totalMinutes = 14 * 60;
    return ((interval.startTime - 7 * 60) / totalMinutes) * 100;
  }

  getIntervalWidth(interval: Timeslot): number {
    const totalMinutes = 14 * 60;
    return ((interval.endTime - interval.startTime) / totalMinutes) * 100;
  }

  formatInterval(interval: Timeslot): string {
    const format = (min: number) =>
      `${Math.floor(min / 60).toString().padStart(2, '0')}:${(min % 60).toString().padStart(2, '0')}`;
    return `${format(interval.startTime)} - ${format(interval.endTime)}`;
  }


}
