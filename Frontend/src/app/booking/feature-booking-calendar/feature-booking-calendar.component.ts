import {Component, computed, inject, input, model} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoomFilterComponent} from './room-filter/room-filter.component';
import {AvailabilityTableComponent} from './availability-table/availability-table.component';
import {RoomFilterModel} from '../domain/room.filter.model';
import {featureBookingCalendarStore} from './+store/feature-booking-calendar.store';
import {AvailableRoomModel, Timeslot} from '../domain/available.room.model';
import {MatIcon} from '@angular/material/icon';
import {AvailabilityCalendarComponent} from './availability-calendar/availability-calendar.component';
import {DateTime} from 'luxon';

@Component({
  selector: 'app-feature-booking-calendar-page',
  standalone: true,
  imports: [CommonModule, MatIcon, RoomFilterComponent, AvailabilityTableComponent, AvailabilityCalendarComponent],
  templateUrl: `feature-booking-calendar.component.html`,
  styleUrls : [`feature-booking-calendar.component.scss`],
  providers : [featureBookingCalendarStore]
})

export class FeatureBookingCalendarComponent {

  store = inject(featureBookingCalendarStore);

  checked = false;
  disabled = false;

  onFilterChange(filter: RoomFilterModel) {
    this.store.updateFilters(filter);
  }

  onSlotSelected(data: AvailableRoomModel) {
    console.log('User clicked:', data);
  }

  toggle(): void {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.onViewChange();
    }
  }

  onViewChange(): void {
    if (this.checked) {
      console.log('Switched to Calendar View');
      this.showCalendarView();
    } else {
      console.log('Switched to Table View');
      this.showTableView();
    }
  }

  private showCalendarView(): void {
    const selectedRoom = this.store.selectedRoom();
    const date = this.store.date();

    if (selectedRoom && date) {
      this.store.loadAvailableRoomsRange(date);
    }
  }

  private showTableView(): void {

      const filters = this.store.filters();
      if (filters) {
        this.store.loadAvailableRooms(filters);
      }
  }

  onRoomSelected($event: AvailableRoomModel) {
    this.store.updateSelectedRoom($event);
  }

  onDatepickerChange($event: DateTime) {
    this.store.updateDatepicker($event)
  }

  onCalendarMonthChanged(newMonth: DateTime) {

    if (this.store.filters() && this.store.selectedRoom()) {
      this.store.loadAvailableRoomsRange(newMonth);
    }
  }

}
