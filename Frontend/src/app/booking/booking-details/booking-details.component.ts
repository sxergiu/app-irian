import {Component, input, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BookingResourceService} from '../booking-resource.service';
import {MatCard, MatCardModule} from '@angular/material/card';
import {GoogleMap, MapAdvancedMarker, MapMarker} from '@angular/google-maps';
import {NgIf} from '@angular/common';
import {mockBookingDetails} from '../data/booking.details.data';
import {BookingDetailsModel} from '../domain/booking.details.model';
import {join} from '@angular/compiler-cli';
import {LoaderService} from '../../maps/loader.service';

@Component({
  selector: 'app-booking-details',
  imports: [
    MatCardModule,
    GoogleMap,
    MapAdvancedMarker,
    NgIf
  ],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss'
})

export class BookingDetailsComponent implements OnInit {

  booking = signal<BookingDetailsModel | null>(null);
  markerPosition = signal<google.maps.LatLngLiteral | null>(null);
  mapOptions: google.maps.MapOptions = {
    zoom: 15
  };

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
        setTimeout(checkGoogle, 100); // keep checking
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
