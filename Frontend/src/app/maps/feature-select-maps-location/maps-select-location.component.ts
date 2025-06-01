import {
  Component,
  ViewChild,
  AfterViewInit,
  NgZone,
  ElementRef,
  input,
  output,
  effect,
  signal,
  computed,
  untracked,
} from '@angular/core';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { PinModel } from '../domain/pin.model';
import { LoaderService } from '../loader.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-maps-select-location',
  standalone: true,
  imports: [GoogleMap, MapAdvancedMarker, NgIf],
  templateUrl: './maps-select-location.component.html',
  styleUrls: ['./maps-select-location.component.scss'],
})
export class MapsSelectLocationComponent implements AfterViewInit {
  @ViewChild('googleMap', { static: false }) googleMap!: GoogleMap;

  center = input<{ lat: number; lng: number }>({ lat: 40.73061, lng: -73.935242 });
  markerPosition = input<{ lat: number; lng: number } | null>(null);
  autocompleteInputRef = input<ElementRef<HTMLInputElement> | null>(null);

  placeSelected = output<PinModel>();
  mapReady = output<boolean>();

  isMapReady = signal(false);
  private marker = signal<google.maps.marker.AdvancedMarkerElement | null>(null);
  private autocomplete = signal<google.maps.places.Autocomplete | null>(null);

  constructor(private loader: LoaderService, private ngZone: NgZone) {


    effect(() => {
      const newCenter = this.center();
      if (this.isMapReady() && this.googleMap?.googleMap) {
        untracked(() => {
          this.googleMap.googleMap?.setCenter(newCenter);
        });
      }
    });


    effect(() => {
      const newPosition = this.markerPosition();
      const mapReady = this.isMapReady();

      if (mapReady) {
        untracked(() => {
          if (newPosition) {
            this.addMarker(newPosition.lat, newPosition.lng);
          } else {
            const currentMarker = this.marker();
            if (currentMarker) {
              currentMarker.map = null;
              this.marker.set(null);
            }
          }
        });
      }
    });

    effect(() => {
      const inputRef = this.autocompleteInputRef();
      const mapReady = this.isMapReady();
      const currentAutocomplete = this.autocomplete();

      console.log('Autocomplete input ref changed:', inputRef);

      if (inputRef && mapReady && !currentAutocomplete) {
        console.log('Initializing autocomplete...');
        untracked(() => {
          this.initializeAutocomplete();
        });
      }
    });
  }

  ngAfterViewInit() {
    this.loader.load().then(() => {
      console.log('Maps component ready');

      this.isMapReady.set(true);
      this.mapReady.emit(true);

      const inputRef = this.autocompleteInputRef();
      console.log('Input ref available on init:', inputRef);
      if (inputRef?.nativeElement) {
        console.log('Initializing autocomplete on init...');
        this.initializeAutocomplete();
      }

      const currentCenter = this.center();
      const currentMarkerPos = this.markerPosition();

      if (this.googleMap?.googleMap) {
        this.googleMap.googleMap.setCenter(currentCenter);

        if (currentMarkerPos) {
          this.addMarker(currentMarkerPos.lat, currentMarkerPos.lng);
        }
      }
    });
  }

  private initializeAutocomplete() {
    const inputRef = this.autocompleteInputRef();
    console.log('Initializing autocomplete with input:', inputRef);

    if (!inputRef?.nativeElement || this.autocomplete()) {
      console.log('Skipping autocomplete init - no input or already exists');
      return;
    }

    const input = inputRef.nativeElement;
    console.log('Creating autocomplete for input element:', input);

    const autocompleteInstance = new google.maps.places.Autocomplete(input, {
      fields: ['geometry', 'formatted_address', 'address_components'],
    });

    this.autocomplete.set(autocompleteInstance);

    console.log('Autocomplete created, adding listener...');
    autocompleteInstance.addListener('place_changed', () => {
      console.log('Place changed event triggered');
      this.ngZone.run(() => {
        const currentAutocomplete = this.autocomplete();
        if (!currentAutocomplete) return;

        const place = currentAutocomplete.getPlace();
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

    const currentMarker = this.marker();
    if (currentMarker) {
      currentMarker.map = null;
    }

    const newMarker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat, lng },
      map: this.googleMap.googleMap!,
      title: 'Selected Location',
    });

    this.marker.set(newMarker);
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
    this.isMapReady.set(true);
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

            this.googleMap.googleMap?.setCenter({ lat, lng });
            this.addMarker(lat, lng);

            this.placeSelected.emit(pin);
          } else {
            console.warn('Geocoding failed:', status);
          }
        });
      });
    });
  }

}
