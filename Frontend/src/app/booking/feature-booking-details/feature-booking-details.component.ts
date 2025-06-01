import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BookingResourceService} from '../booking-resource.service';
import {MatCardModule} from '@angular/material/card';
import {GoogleMap, MapAdvancedMarker} from '@angular/google-maps';
import {NgIf} from '@angular/common';
import {BookingDetailsModel} from '../domain/booking.details.model';
import {LoaderService} from '../../maps/loader.service';

@Component({
  selector: 'app-booking-details',
  imports: [
    MatCardModule,
    GoogleMap,
    MapAdvancedMarker,
    NgIf
  ],
  templateUrl: './feature-booking-details.component.html',
  styleUrl: './feature-booking-details.component.scss'
})

export class FeatureBookingDetailsComponent implements OnInit {

  booking = signal<BookingDetailsModel | null>(null);
  markerPosition = signal<google.maps.LatLngLiteral | null>(null);

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingResourceService,
    private loader: LoaderService,
    private router: Router
  ) {}

  googleReady = signal(false);

  ngOnInit(): void {

    this.loader.load()
    const id = Number(this.route.snapshot.paramMap.get('id'));

    const checkGoogle = () => {
      if (window.google && window.google.maps) {
        this.googleReady.set(true);
      } else {
        setTimeout(checkGoogle, 100);
      }
    };

    checkGoogle();

    this.bookingService.getById(id).subscribe(data => {
      this.booking.set(data);
      const { latitude, longitude } = data.room.locationGeo;
      this.markerPosition.set({ lat: latitude, lng: longitude });
    });
  }

  goBack(){
    this.router.navigate(['bookings'])
  }
}
