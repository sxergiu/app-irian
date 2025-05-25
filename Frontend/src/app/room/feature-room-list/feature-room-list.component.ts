import {Component, input, output} from '@angular/core';
import {RoomModel} from '../domain/room.model';
import {RoomCardComponent} from '../room-card/room-card.component';

@Component({
  selector: 'app-feature-room-list',
  imports: [
    RoomCardComponent
  ],
  templateUrl: './feature-room-list.component.html',
  styleUrl: './feature-room-list.component.scss'
})
export class FeatureRoomListComponent {

  rooms =  input<RoomModel[]>([]);
  roomSelected = output<RoomModel>();
  roomDeleted = output<RoomModel>();

  editClicked(room: RoomModel) {
    this.roomSelected.emit(room);
  }

  deleteClicked(room: RoomModel) {
    this.roomDeleted.emit(room);
  }

}
