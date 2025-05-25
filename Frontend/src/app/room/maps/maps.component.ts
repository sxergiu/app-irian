import {
  Component,
  EventEmitter,
  Output,
  Input,
  SimpleChanges,
  OnChanges,
  ViewChild,
  AfterViewInit,
  NgZone,
  ElementRef,
} from '@angular/core';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { PinModel } from './domain/pin.model';
import { LoaderService } from './loader.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [GoogleMap, MapAdvancedMarker, NgIf],
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements AfterViewInit, OnChanges {
  @ViewChild('googleMap', { static: false }) googleMap!: GoogleMap;

  @Input() center: { lat: number; lng: number } = { lat: 40.73061, lng: -73.935242 };
  @Input() markerPosition: { lat: number; lng: number } | null = null;
  @Input() autocompleteInputRef: ElementRef<HTMLInputElement> | null = null;

  @Output() placeSelected = new EventEmitter<PinModel>();
  @Output() mapReady = new EventEmitter<boolean>();

  zoom = 12;
  isMapReady = false;
  marker!: google.maps.marker.AdvancedMarkerElement | null;
  autocomplete: google.maps.places.Autocomplete | null = null;

  constructor(private loader: LoaderService, private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.loader.load().then(() => {
      this.isMapReady = true;
      this.mapReady.emit(true);

      // Initialize autocomplete if input reference is provided
      if (this.autocompleteInputRef?.nativeElement) {
        this.initializeAutocomplete();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // Handle center changes
    if (changes['center'] && this.isMapReady && this.googleMap?.googleMap) {
      const newCenter = changes['center'].currentValue;
      this.googleMap.googleMap.setCenter(newCenter);
    }

    // Handle marker position changes
    if (changes['markerPosition'] && this.isMapReady) {
      const newPosition = changes['markerPosition'].currentValue;
      if (newPosition) {
        this.addMarker(newPosition.lat, newPosition.lng);
      } else if (this.marker) {
        this.marker.map = null;
        this.marker = null;
      }
    }

    // Initialize autocomplete when input reference becomes available
    if (changes['autocompleteInputRef'] &&
      changes['autocompleteInputRef'].currentValue &&
      this.isMapReady &&
      !this.autocomplete) {
      this.initializeAutocomplete();
    }
  }

  private initializeAutocomplete() {
    if (!this.autocompleteInputRef?.nativeElement || this.autocomplete) return;

    const input = this.autocompleteInputRef.nativeElement;

    this.autocomplete = new google.maps.places.Autocomplete(input, {
      fields: ['geometry', 'formatted_address', 'address_components'],
    });

    this.autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = this.autocomplete!.getPlace();

        if (!place.geometry || !place.geometry.location) {
          console.warn('No geometry in selected place');
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address ?? '';
        const city = this.extractCity(place.address_components);

        const pin: PinModel = { lat, lng, address, city };
        this.placeSelected.emit(pin);
      });
    });
  }

  extractCity(components: google.maps.GeocoderAddressComponent[] | undefined): string {
    if (!components) return '';
    const cityComp = components.find(c =>
      c.types.includes('locality') || c.types.includes('administrative_area_level_1')
    );
    return cityComp?.long_name ?? '';
  }

  addMarker(lat: number, lng: number) {
    // Remove existing marker
    if (this.marker) {
      this.marker.map = null;
    }

    // Add new marker
    this.marker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat, lng },
      map: this.googleMap.googleMap!,
      title: 'Selected Location',
    });
  }

  handlePlaceSelection(event: google.maps.MapMouseEvent) {
    const latLng = event.latLng;
    if (!latLng) return;

    const lat = latLng.lat();
    const lng = latLng.lng();

    if (!google.maps?.Geocoder) {
      console.error('Google Maps Geocoder unavailable.');
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      this.ngZone.run(() => {
        let address = '';
        let city = '';

        if (status === 'OK' && results && results.length > 0) {
          const place = results[0];
          address = place.formatted_address ?? '';
          city = this.extractCity(place.address_components);
        }

        const pin: PinModel = { lat, lng, city, address };
        this.placeSelected.emit(pin);
      });
    });
  }

  onMapReady() {
    this.isMapReady = true;
    this.mapReady.emit(true);
  }

  public geocodeAndSetPin(address: string) {
    if (!address?.trim()) return;

    this.loader.load().then(() => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        this.ngZone.run(() => {
          if (status === 'OK' && results && results.length > 0) {
            const place = results[0];
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const city = this.extractCity(place.address_components);

            const pin: PinModel = {
              lat,
              lng,
              address: place.formatted_address ?? address,
              city
            };

            // Move the map and add marker
            this.googleMap.googleMap?.setCenter({ lat, lng });
            this.addMarker(lat, lng);

            // Emit the pin data
            this.placeSelected.emit(pin);
          } else {
            console.warn('Geocoding failed:', status);
          }
        });
      });
    });
  }

}
