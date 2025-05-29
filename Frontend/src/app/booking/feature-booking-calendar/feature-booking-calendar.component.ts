import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoomFilterComponent} from './room-filter/room-filter.component';
import {AvailabilityTableComponent} from './availability-table/availability-table.component';
import {timeSlots} from '../data/timeslots.data';

@Component({
  selector: 'app-feature-booking-calendar-page',
  standalone: true,
  imports: [CommonModule, RoomFilterComponent, AvailabilityTableComponent, RoomFilterComponent, AvailabilityTableComponent],
  templateUrl: `feature-booking-calendar.component.html`,
  styleUrls : [`feature-booking-calendar.component.scss`]
})

export class FeatureBookingCalendarComponent {

  selectedDate = new Date();
  filters = { capacity: 0, amenities: [] as string[] };

  // For now, stubbed data
  filteredRooms = [
    {
      id: 1,
      name: 'Room A',
      capacity: 10,
      amenities: ['wifi', 'projector'],
      availability: {
        '08:00': true,
        '09:00': true,
        '10:00': false,
        '11:00': true,
        '12:00': true,
        '13:00': false,
        '14:00': true,
        '15:00': true,
        '16:00': true,
        '17:00': true,
      }
    },
    {
      id: 2,
      name: 'Room B',
      capacity: 20,
      amenities: ['whiteboard'],
      availability: {
        '08:00': false,
        '09:00': true,
        '10:00': true,
        '11:00': true,
        '12:00': false,
        '13:00': true,
        '14:00': true,
        '15:00': true,
        '16:00': true,
        '17:00': false,
      }
    }
  ];

  onDateChange(date: Date) {
    this.selectedDate = date;
    // TODO: Fetch availability based on new date
  }

  onFilterChange(filters: { capacity: number, amenities: string[] }) {
    this.filters = filters;
    // TODO: Fetch filtered rooms
  }

  onSlotSelected(data: { roomId: number, slot: string }) {
    console.log('User clicked:', data);
    // TODO: Show modal to confirm booking
  }

  protected readonly timeSlots = timeSlots;
}
