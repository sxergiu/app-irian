import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
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
import { MapsComponent } from '../maps/maps.component';
import { PinModel } from '../maps/domain/pin.model';
import { FormsModule, NgForm } from '@angular/forms';
import { LoaderService } from '../maps/loader.service';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [MapsComponent, FormsModule],
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoomFormComponent implements AfterViewInit {
  roomChanged = output<RoomModel>();
  room = model.required<RoomModel>();
  cancel = output<void>();

  manualAddress = model('');
  private selectedPin: PinModel | undefined;

  @ViewChild('autocompleteInput', { static: false }) autocompleteInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MapsComponent, { static: false }) mapsComponent!: MapsComponent;

  address: string = '';
  center = model({ lat: 46.77, lng: 23.59 });
  markerPosition = model<{ lat: number; lng: number } | null>(null);
  mapReady = signal(false);

  constructor(private loaderService: LoaderService, private ngZone: NgZone) {
    // Create an effect that watches for room changes and updates the map accordingly
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
    // Update the autocomplete input
    if (this.autocompleteInput?.nativeElement) {
      this.autocompleteInput.nativeElement.value = room.address || '';
    }

    // Update the manual address model
    this.manualAddress.set(room.address || '');

    // If room has coordinates, update map directly
    if (room.lat && room.lng) {
      this.center.set({ lat: room.lat, lng: room.lng });
      this.markerPosition.set({ lat: room.lat, lng: room.lng });
    } else if (room.address?.trim()) {
      // If no coordinates but has address, geocode it
      this.mapsComponent?.geocodeAndSetPin(room.address);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  ngAfterViewInit() {
    if (this.mapsComponent && this.autocompleteInput) {
      // Pass reference to MapsComponent
      this.mapsComponent.autocompleteInputRef = this.autocompleteInput;

      setTimeout(() => {
        this.mapsComponent.ngOnChanges({
          autocompleteInputRef: {
            currentValue: this.autocompleteInput,
            previousValue: null,
            firstChange: true,
            isFirstChange: () => true
          }
        });

        // Initial setup with current room data
        const currentRoom = this.room();
        if (currentRoom?.address?.trim()) {
          this.updateMapWithRoomData(currentRoom);
        }
      });
    }
  }

  onMapReady(ready: boolean) {
    this.mapReady.set(ready);

    // When map becomes ready, update it with current room data if available
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

  cityChanged(value: string) {
    this.room.update(r => ({ ...r, city: value }));
  }

  capacityChanged(value: number) {
    this.room.update(r => ({ ...r, capacity: value }));
  }

  amenitiesChanged(value: string) {
    const amenities = value.split(',').map(a => a.trim());
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
      city: pin.city || r.city,
      address: pin.address || ''
    }));

    // Update manual address input to show selected address
    this.manualAddress.set(pin.address);

    // Update map center and marker position
    this.center.set({ lat: pin.lat, lng: pin.lng });
    this.markerPosition.set({ lat: pin.lat, lng: pin.lng });
  }

  get amenities() {
    return this.room().amenities?.join(' ') ?? '';
  }

  async onManualAddressChange() {
    const address = this.manualAddress();

    if (!address.trim()) {
      // Clear marker if address is empty
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

            // Extract city if possible
            const city =
              place.address_components?.find((comp) =>
                comp.types.includes('locality')
              )?.long_name || '';

            // Update the room model with new location info
            this.room.update(r => ({
              ...r,
              lat,
              lng,
              city: city || r.city,
              address: address
            }));

            // Update the map center and marker
            this.center.set({lat, lng});
            this.markerPosition.set({lat, lng});
          } else {
            alert('Address not found, please try another one.');
            // Clear marker if address not found
            this.markerPosition.set(null);
          }
        });
      });
    } catch (error) {
      console.error('Google Maps failed to load', error);
    }
  }

  // Method to handle manual address input changes
  onAddressInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.manualAddress.set(target.value);
  }
}
