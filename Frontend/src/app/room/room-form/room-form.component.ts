import { Component, model, output, signal } from '@angular/core';
import { RoomModel } from '../domain/room.model';
import { MapsComponent } from '../maps/maps.component';
import { PinModel } from '../maps/domain/pin.model';
import {FormsModule, NgForm} from '@angular/forms';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [MapsComponent, FormsModule],
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss']
})
export class RoomFormComponent {

  roomChanged = output<RoomModel>();
  room = model.required<RoomModel>();

  center = model({ lat: 46.77, lng: 23.59 });
  markerPosition = model({ lat: 46.77, lng: 23.59 });
  mapSelected = model(false);


  get isValid(): boolean {
    const r = this.room();
    return r.name?.trim() !== '' && r.capacity > 0 && (r.city?.trim() !== '' || this.mapSelected());
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

  onPlaceSelected(pin: PinModel) {
    this.room.update(r => ({
      ...r,
      lat: pin.lat,
      lng: pin.lng,
      city: pin.city || r.city,
      address: pin.address || ''
    }));
    this.mapSelected.set(true);
  }

  get amenities() {
    return this.room().amenities?.join(' ') ?? '';
  }
}
