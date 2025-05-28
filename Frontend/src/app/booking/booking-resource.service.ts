import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RoomModel} from '../room/domain/room.model';
import {BookingModel} from './domain/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingResourceService {

  private apiUrl = 'http://localhost:8080/api/booking';
  http = inject(HttpClient);
  private bookings = signal<BookingModel[]>([])

  constructor() {
    this.fetchBookings();
  }

  private fetchBookings() {
    this.http.get<BookingModel[]>(`${this.apiUrl}`).subscribe(bookings => {
      const fixedBookings = bookings.map(b => ({
        ...b,
        date: this.formatDate(b.date),             // b.date is number[]
        startTime: this.formatTime(b.startTime),   // b.startTime is number[]
        endTime: this.formatTime(b.endTime)        // b.endTime is number[]
      }));
      this.bookings.set(fixedBookings);
    });
  }

  private formatDate(raw: string): string {
    const [year, month, day] = raw;
    return `${year}-${this.pad(month)}-${this.pad(day)}`;
  }

  private formatTime(raw: string): string {
    const [hour, minute] = raw;
    return `${this.pad(hour)}:${this.pad(minute)}`;
  }

  private pad(n: string): string {
    return n.toString().padStart(2, '0');
  }


  getBookings() {
    return this.bookings;
  }

}
