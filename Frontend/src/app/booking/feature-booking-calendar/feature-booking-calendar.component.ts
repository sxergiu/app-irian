import {Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoomFilterComponent} from './room-filter/room-filter.component';
import {AvailabilityTableComponent} from './availability-table/availability-table.component';
import {RoomFilterModel} from '../domain/room.filter.model';
import {featureBookingCalendarStore} from './+store/feature-booking-calendar.store';
import {AvailableRoomModel, Timeslot} from '../domain/available.room.model';

@Component({
  selector: 'app-feature-booking-calendar-page',
  standalone: true,
  imports: [CommonModule, RoomFilterComponent, AvailabilityTableComponent, RoomFilterComponent, AvailabilityTableComponent],
  templateUrl: `feature-booking-calendar.component.html`,
  styleUrls : [`feature-booking-calendar.component.scss`],
  providers : [featureBookingCalendarStore]
})

export class FeatureBookingCalendarComponent {

  store = inject(featureBookingCalendarStore);

  onFilterChange(filter: RoomFilterModel) {
    this.store.updateFilters(filter);
  }

  onSlotSelected(data: AvailableRoomModel) {
    console.log('User clicked:', data);
  }


}
