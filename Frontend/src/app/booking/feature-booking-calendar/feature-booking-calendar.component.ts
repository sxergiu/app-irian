import {Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoomFilterComponent} from './room-filter/room-filter.component';
import {AvailabilityTableComponent} from './availability-table/availability-table.component';
import {timeSlots} from '../data/timeslots.data';
import {RoomFilterModel} from '../domain/room.filter.model';
import {featureBookingCalendarStore} from './+store/feature-booking-calendar.store';
import {Timeslot} from '../domain/available.room.model';

@Component({
  selector: 'app-feature-booking-calendar-page',
  standalone: true,
  imports: [CommonModule, RoomFilterComponent, AvailabilityTableComponent, RoomFilterComponent, AvailabilityTableComponent],
  templateUrl: `feature-booking-calendar.component.html`,
  styleUrls : [`feature-booking-calendar.component.scss`],
  providers : [featureBookingCalendarStore]
})

export class FeatureBookingCalendarComponent {

  protected readonly timeSlots = timeSlots;

  store = inject(featureBookingCalendarStore);

  onFilterChange(filter: RoomFilterModel) {
    this.store.updateFilters(filter);
  }

  onSlotSelected(data: { roomId: number, slot: string }) {
    console.log('User clicked:', data);
  }

  selectInterval(interval: any) {
    console.log('Selected interval: ' + interval);
  }

  getIntervalOffset(interval: Timeslot): number {
    const totalMinutes = 14 * 60; // from 07:00 to 21:00
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
