import {Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoomFilterComponent} from './room-filter/room-filter.component';
import {AvailabilityTableComponent} from './availability-table/availability-table.component';
import {timeSlots} from '../data/timeslots.data';
import {RoomFilterModel} from '../domain/room.filter.model';
import {featureBookingCalendarStore} from './+store/feature-booking-calendar.store';

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

}
