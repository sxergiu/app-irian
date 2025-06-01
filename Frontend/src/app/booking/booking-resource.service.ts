import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BookingModel} from './domain/booking.model';
import {BookingDetailsModel} from './domain/booking.details.model';
import {map, Observable, tap} from 'rxjs';
import {CreateBookingModel} from './domain/create.booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingResourceService {

  private apiUrl = 'http://localhost:8080/api/booking';
  http = inject(HttpClient);
  private bookings = signal<BookingModel[]>([])
  exportFiles = signal<string[]>([]);

  constructor() {
    this.fetchBookings();
    this.fetchExports();
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

  createOrUpdateBooking(booking: CreateBookingModel, isEdit: boolean) {

    if( !isEdit ) {
      this.http.post<BookingDetailsModel>(`${this.apiUrl}`, {
        roomId: booking.roomId,
        namedGroupId: booking.namedGroupId,
        date: booking.date,
        startTime: booking.time.startTime,
        endTime: booking.time.endTime
      }).subscribe(_ => {
        this.fetchBookings()
      });
    }
    else {
      this.http.put<BookingDetailsModel>(`${this.apiUrl}/${booking.id}`, {
        roomId: booking.roomId,
        namedGroupId: booking.namedGroupId,
        date: booking.date,
        startTime: booking.time.startTime,
        endTime: booking.time.endTime
      }).subscribe(_ => {
        this.fetchBookings()
      })
    }
  }

  fetchExports(): void {
    this.http.get<string[]>(`${this.apiUrl}/export/list`).subscribe({
      next: (files) => this.exportFiles.set(files),
      error: (err) => console.error('Failed to fetch exports', err)
    });
  }

  downloadFile(fileName: string): void {
    const params = new HttpParams().set('fileName', fileName);
    this.http.get(`${this.apiUrl}/export/url`, { params, responseType: 'text' }).subscribe({
      next: (presignedUrl) => window.open(presignedUrl, '_blank'),
      error: (err) => console.error('Failed to get presigned URL', err)
    });
  }

  exportBookings(): void {
    this.http.post<string>(`${this.apiUrl}/export`, {}).subscribe({
      next: (fileName) => {
        console.log('Export created:', fileName);
        this.downloadFile(fileName);
        this.fetchExports();
      },
      error: (err) => console.error('Failed to export bookings', err)
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
