import {Component, inject, signal} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import {RoomModel} from '../room/domain/room.model';
import { RoomFormComponent } from '../room/room-form/room-form.component';
import { CommonModule } from '@angular/common';
import { RoomService } from '../room/room.service';
import {FeatureRoomListComponent} from '../room/feature-room-list/feature-room-list.component';
import {FooterComponent} from '../footer/footer.component';
import {MenuComponent} from '../menu/menu.component';
import {BookingComponent} from '../booking/booking.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FeatureRoomListComponent,
    RoomFormComponent,
    BookingComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  authService = inject(AuthService);
  router = inject(Router);
  roomService = inject(RoomService);

  get rooms(){
    return this.roomService.getRooms()
  }

  room = signal<RoomModel | null>(null);

  constructor() {
    if( !this.authService.isAuthenticated() ) {
      this.router.navigate(['/login']);
    }
  }

  addNewRoom(): void {
    this.room.set({
      id: 0,
      name: '',
      amenities: [],
      capacity: 0,
      lat: 0,
      lng: 0,
      address: ''
    });
  }

  onRoomChanged($event: RoomModel): void {
    this.roomService.saveOrUpdateRoom($event);
    console.log($event.address);
    this.room.set(null);
  }

  onRoomSelected($event: RoomModel): void {
    this.room.set($event);
  }

  onRoomDeleted($event: RoomModel): void {
    this.roomService.deleteRoom($event);
  }

  onCancel() {
    this.room.set(null);
  }

}
