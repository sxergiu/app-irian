import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RoomModel} from '../room/domain/room.model';
import {BookingModel} from './domain/booking.model';
import {BookingDetailsModel} from './domain/booking.details.model';
import {map, Observable} from 'rxjs';
import {CreateBookingModel} from './domain/create.booking.model';

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
        date: this.formatDate(b.date),
        startTime: this.formatTime(b.startTime),
        endTime: this.formatTime(b.endTime)
      }));
      this.bookings.set(fixedBookings);
    });
  }

  getBookings() {
    return this.bookings;
  }

  deleteBooking(booking: BookingModel) {
    this.http.delete<void>(`${this.apiUrl}/${booking.id}`).subscribe(_ => this.fetchBookings());
  }

  getById(id: number): Observable<BookingDetailsModel> {
    return this.http.get<BookingDetailsModel>(`${this.apiUrl}/${id}`).pipe(
      map(b => ({
        ...b,
        date: this.formatDate(b.date),
        startTime: this.formatTime(b.startTime),
        endTime: this.formatTime(b.endTime)
      }))
    );
  }

  createBooking(booking: CreateBookingModel) {
    this.http.post<BookingDetailsModel>(`${this.apiUrl}`, {
      roomId: booking.roomId,
      namedGroupId: booking.namedGroupId,
      date: booking.date,
      startTime: booking.time.startTime,
      endTime: booking.time.endTime
    }).subscribe( _ => {
      this.fetchBookings()
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
}
