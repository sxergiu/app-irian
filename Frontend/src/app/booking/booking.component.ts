import {Component, inject, OnInit, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MOCK_BOOKINGS} from './data/booking.data';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {AuthService} from '../auth/auth.service';
import {BookingModel} from './domain/booking.model';
import {NgIf} from '@angular/common';
import {BookingResourceService} from './booking-resource.service';


@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    NgIf
  ],
  templateUrl: 'booking.component.html',
  styleUrls: ['booking.component.scss']
})

export class BookingComponent {

  bookingService = inject(BookingResourceService);
  auth = inject(AuthService);
  isAdmin = this.auth.isAdmin();
  displayedColumns: string[] = [];

  constructor() {
    this.displayedColumns = [
      'id',
      'room',
      'location',
      'group',
      'date',
      'time',
      ...(this.isAdmin ? ['user'] : []),
      'actions'
    ];
  }

  get bookings() {
    return this.bookingService.getBookings();
  }

  viewDetails(booking: BookingModel) {
    console.log('View booking', booking);
  }
}
