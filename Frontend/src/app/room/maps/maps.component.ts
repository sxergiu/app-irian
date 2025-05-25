import {Component, EventEmitter, Input, output, Output, signal} from '@angular/core';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import {PinModel} from './domain/pin.model';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  imports: [
    GoogleMap,
    MapMarker
  ],
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent {

  selectedPin = signal<PinModel | null>(null);

  @Output()
  placeSelected = new EventEmitter<PinModel>();

  defaultLat = 40.73061;
  defaultLng = -73.935242;
  zoom = 12;

  center = signal({ lat: this.defaultLat, lng: this.defaultLng });

  handlePlaceSelection(event: google.maps.MapMouseEvent) {
    const latLng = event.latLng;
    if (!latLng) return;

    const lat = latLng.lat();
    const lng = latLng.lng();

    // Ensure Google Maps JS is loaded
    if (typeof google === 'undefined' || !google.maps?.Geocoder) {
      console.error('Google Maps JS not loaded.');
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const address = results[0].formatted_address;
        const city =
          results[0].address_components?.find(c =>
            c.types.includes('locality')
          )?.long_name || '';

        const pin: PinModel = { lat, lng, city, address };
        this.selectedPin.set(pin);
        this.center.set({ lat, lng });
        this.placeSelected.emit(pin);
      } else {
        const pin: PinModel = { lat, lng, city: '', address: '' };
        this.selectedPin.set(pin);
        this.center.set({ lat, lng });
        this.placeSelected.emit(pin);
      }
    });
  }


}
