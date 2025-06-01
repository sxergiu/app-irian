import {
  Component,
  ElementRef,
  model,
  NgZone,
  output,
  signal,
  ViewChild,
  AfterViewInit,
  effect
} from '@angular/core';
import { RoomModel } from '../domain/room.model';
import { MapsSelectLocationComponent } from '../../maps/feature-select-maps-location/maps-select-location.component';
import { PinModel } from '../../maps/domain/pin.model';
import { FormsModule, NgForm } from '@angular/forms';
import { LoaderService } from '../../maps/loader.service';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [MapsSelectLocationComponent, FormsModule],
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss']
})

export class RoomFormComponent implements AfterViewInit {

  roomChanged = output<RoomModel>();
  room = model.required<RoomModel>();
  cancel = output<void>();

  manualAddress = model('');

  @ViewChild('autocompleteInput', { static: false }) autocompleteInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MapsSelectLocationComponent, { static: false }) mapsComponent!: MapsSelectLocationComponent;

  autocompleteInputSignal = signal<ElementRef<HTMLInputElement> | null>(null);

  address: string = '';
  center = model({ lat: 46.77, lng: 23.59 });
  markerPosition = model<{ lat: number; lng: number } | null>(null);
  mapReady = signal(false);

  constructor(private loaderService: LoaderService, private ngZone: NgZone) {

    effect(() => {
      const room = this.room();

      if (room?.address && this.isComponentReady()) {
        this.updateMapWithRoomData(room);
      }
    });

  }

  private isComponentReady(): boolean {
    return (this.mapsComponent && this.autocompleteInput && this.mapReady());
  }

  private updateMapWithRoomData(room: RoomModel) {

    if (this.autocompleteInput?.nativeElement) {
      this.autocompleteInput.nativeElement.value = room.address || '';
    }

    this.manualAddress.set(room.address || '');


    if (room.lat && room.lng) {
      this.center.set({ lat: room.lat, lng: room.lng });
      this.markerPosition.set({ lat: room.lat, lng: room.lng });
    } else if (room.address?.trim()) {
      this.mapsComponent?.geocodeAndSetPin(room.address);
    }
  }

  ngAfterViewInit() {
    if (this.mapsComponent && this.autocompleteInput) {

      this.autocompleteInputSignal.set(this.autocompleteInput);

      setTimeout(() => {
        const currentRoom = this.room();
        if (currentRoom?.address?.trim()) {
          this.updateMapWithRoomData(currentRoom);
        }
      }, 100);
    }
  }

  onMapReady(ready: boolean) {
    this.mapReady.set(ready);

    if (ready) {
      const currentRoom = this.room();
      if (currentRoom?.address) {
        setTimeout(() => this.updateMapWithRoomData(currentRoom), 100);
      }
    }
  }

  onSubmit(roomForm: NgForm) {
    if (roomForm.valid) {
      this.roomChanged.emit(this.room());
    }
  }

  nameChanged(value: string) {
    this.room.update(r => ({ ...r, name: value }));
  }

  capacityChanged(value: number) {
    this.room.update(r => ({ ...r, capacity: value }));
  }

  amenitiesChanged(value: string) {
    const amenities = value.split(' ').map(a => a.trim());
    this.room.update(r => ({ ...r, amenities }));
  }

  addressChange(value: string) {
    this.manualAddress.set(value);
    this.room.update(r => ({...r, address: value}));
  }

  onPlaceSelected(pin: PinModel) {
    this.room.update(r => ({
      ...r,
      lat: pin.lat,
      lng: pin.lng,
      address: pin.address || ''
    }));

    this.manualAddress.set(pin.address);

    this.center.set({ lat: pin.lat, lng: pin.lng });
    this.markerPosition.set({ lat: pin.lat, lng: pin.lng });
  }

  get amenities() {
    return this.room().amenities?.join(' ') ?? '';
  }

  async onManualAddressChange() {
    const address = this.manualAddress();

    if (!address.trim()) {
      this.markerPosition.set(null);
      return;
    }

    console.log("address " + this.manualAddress());

    try {
      await this.loaderService.load();
      const geocoder = new google.maps.Geocoder();

      await geocoder.geocode({address}, (results, status) => {
        this.ngZone.run(() => {
          if (status === 'OK' && results && results.length > 0) {
            const place = results[0];
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            // Update the room model with new location info
            this.room.update(r => ({
              ...r,
              lat,
              lng,
              address: address
            }));

            this.center.set({lat, lng});
            this.markerPosition.set({lat, lng});
          } else {

            alert('Something weird happened. Sorry');
            this.markerPosition.set(null);

          }
        });
      });
    } catch (error) {
      console.error('Google Maps failed to load', error);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
