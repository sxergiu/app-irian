import {Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoomFilterComponent} from './room-filter/room-filter.component';
import {AvailabilityTableComponent} from './availability-table/availability-table.component';
import {RoomFilterModel} from '../domain/room.filter.model';
import {featureBookingCalendarStore} from './+store/feature-booking-calendar.store';
import {AvailableRoomModel, Timeslot} from '../domain/available.room.model';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {AvailabilityCalendarComponent} from './availability-calendar/availability-calendar.component';

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
  // Handle view change logic
  onViewChange(): void {
    if (this.checked) {
      console.log('Switched to Calendar View');
      // Add your calendar view logic here
      this.showCalendarView();
    } else {
      console.log('Switched to Table View');
      // Add your table view logic here
      this.showTableView();
    }
  }

  private showCalendarView(): void {
    // Your calendar view implementation
    // e.g., change route, show/hide components, etc.
  }

  private showTableView(): void {
    // Your table view implementation
    // e.g., change route, show/hide components, etc.
  }
}
