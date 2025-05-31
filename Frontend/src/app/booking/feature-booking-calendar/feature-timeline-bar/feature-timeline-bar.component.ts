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
  isVertical = input.required<boolean>()

  selectInterval(interval: any) {
    console.log('Selected interval: ' + interval);
  }

  getIntervalOffset(interval: Timeslot): number {
    const totalMinutes = 14 * 60;
    console.log('Horizontal offset - startTime:', interval.startTime, 'type:', typeof interval.startTime);
    const result = ((interval.startTime - 7 * 60) / totalMinutes) * 100;
    console.log('Horizontal result:', result);
    return result;
  }

  getIntervalWidth(interval: Timeslot): number {
    const totalMinutes = 14 * 60;
    return ((interval.endTime - interval.startTime) / totalMinutes) * 100;
  }

  getVerticalOffset(interval: any): number {
    const totalMinutes = 14 * 60;
    const startMinutes = Array.isArray(interval.startTime)
      ? interval.startTime[0] * 60 + interval.startTime[1]
      : interval.startTime;
    return ((startMinutes - 7 * 60) / totalMinutes) * 100;
  }

  getVerticalHeight(interval: any): number {
    const totalMinutes = 14 * 60;
    const startMinutes = Array.isArray(interval.startTime)
      ? interval.startTime[0] * 60 + interval.startTime[1]
      : interval.startTime;
    const endMinutes = Array.isArray(interval.endTime)
      ? interval.endTime[0] * 60 + interval.endTime[1]
      : interval.endTime;
    return ((endMinutes - startMinutes) / totalMinutes) * 100;
  }

  formatInterval(interval: Timeslot): string {
    const format = (min: number) =>
      `${Math.floor(min / 60).toString().padStart(2, '0')}:${(min % 60).toString().padStart(2, '0')}`;
    return `${format(interval.startTime)} - ${format(interval.endTime)}`;
  }

  formatVerticalInterval(interval: any): string {
    const startHours = Array.isArray(interval.startTime)
      ? interval.startTime[0]
      : Math.floor(interval.startTime / 60);
    const startMinutes = Array.isArray(interval.startTime)
      ? interval.startTime[1]
      : interval.startTime % 60;

    const endHours = Array.isArray(interval.endTime)
      ? interval.endTime[0]
      : Math.floor(interval.endTime / 60);
    const endMinutes = Array.isArray(interval.endTime)
      ? interval.endTime[1]
      : interval.endTime % 60;

    return `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')} - ${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  }

}
