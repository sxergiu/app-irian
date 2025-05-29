import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingAvailabilityResourceService {

  http = inject(HttpClient);
  amenities = signal<string[]>([])

  constructor() {
    this.fetchAmenities()
  }

  private fetchAmenities() {
    this.http.get<string[]>(`http://localhost:8080/api/room/amenities`).subscribe(amenities => {
        this.amenities.set(amenities);
    });
  }
}
