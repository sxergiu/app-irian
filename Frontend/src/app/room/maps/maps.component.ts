import {
  Component,
  ViewChild,
  AfterViewInit,
  NgZone,
  ElementRef,
  input,
  output,
  effect,
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
export class MapsComponent implements AfterViewInit {
  @ViewChild('googleMap', { static: false }) googleMap!: GoogleMap;

  // Input signals
  center = input<{ lat: number; lng: number }>({ lat: 40.73061, lng: -73.935242 });
  markerPosition = input<{ lat: number; lng: number } | null>(null);
  autocompleteInputRef = input<ElementRef<HTMLInputElement> | null>(null);

  // Output signals
  placeSelected = output<PinModel>();
  mapReady = output<boolean>();

  zoom = 12;
  isMapReady = false;
  marker!: google.maps.marker.AdvancedMarkerElement | null;
  autocomplete: google.maps.places.Autocomplete | null = null;

  // Map options - will be initialized after Google Maps loads
  mapOptions: google.maps.MapOptions = {};

  // Marker options - will be initialized after Google Maps loads
  markerOptions: google.maps.marker.AdvancedMarkerElementOptions = {};

  constructor(private loader: LoaderService, private ngZone: NgZone) {
    // Effect to handle center changes
    effect(() => {
      const newCenter = this.center();
      if (this.isMapReady && this.googleMap?.googleMap) {
        this.googleMap.googleMap.setCenter(newCenter);
      }
    });

    // Effect to handle marker position changes
    effect(() => {
      const newPosition = this.markerPosition();
      if (this.isMapReady) {
        if (newPosition) {
          this.addMarker(newPosition.lat, newPosition.lng);
        } else if (this.marker) {
          this.marker.map = null;
          this.marker = null;
        }
      }
    });

    // Effect to handle autocomplete input reference changes
    effect(() => {
      const inputRef = this.autocompleteInputRef();
      console.log('Autocomplete input ref changed:', inputRef);
      if (inputRef && this.isMapReady && !this.autocomplete) {
        console.log('Initializing autocomplete...');
        this.initializeAutocomplete();
      }
    });
  }

  ngAfterViewInit() {
    this.loader.load().then(() => {
      console.log('Maps component ready');

      // Initialize map and marker options after Google Maps is loaded
      this.mapOptions = {
        disableDefaultUI: false,
        clickableIcons: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.markerOptions = {
        gmpDraggable: false
      };

      this.isMapReady = true;
      this.mapReady.emit(true);

      // Initialize autocomplete if input reference is already provided
      const inputRef = this.autocompleteInputRef();
      console.log('Input ref available on init:', inputRef);
      if (inputRef?.nativeElement) {
        console.log('Initializing autocomplete on init...');
        this.initializeAutocomplete();
      }

      // Apply initial center and marker if they exist
      const currentCenter = this.center();
      const currentMarker = this.markerPosition();

      if (this.googleMap?.googleMap) {
        this.googleMap.googleMap.setCenter(currentCenter);

        if (currentMarker) {
          this.addMarker(currentMarker.lat, currentMarker.lng);
        }
      }
    });
  }

  private initializeAutocomplete() {
    const inputRef = this.autocompleteInputRef();
    console.log('Initializing autocomplete with input:', inputRef);
    if (!inputRef?.nativeElement || this.autocomplete) {
      console.log('Skipping autocomplete init - no input or already exists');
      return;
    }

    const input = inputRef.nativeElement;
    console.log('Creating autocomplete for input element:', input);

    this.autocomplete = new google.maps.places.Autocomplete(input, {
      fields: ['geometry', 'formatted_address', 'address_components'],
    });

    console.log('Autocomplete created, adding listener...');
    this.autocomplete.addListener('place_changed', () => {
      console.log('Place changed event triggered');
      this.ngZone.run(() => {
        const place = this.autocomplete!.getPlace();
        console.log('Selected place:', place);

        if (!place.geometry || !place.geometry.location) {
          console.warn('No geometry in selected place');
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address ?? '';
        const city = this.extractCity(place.address_components);

        const pin: PinModel = { lat, lng, address, city };
        console.log('Emitting pin:', pin);
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
