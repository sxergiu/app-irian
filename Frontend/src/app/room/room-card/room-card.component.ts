import {Component, input} from '@angular/core';
import {RoomModel} from '../domain/room.model';

@Component({
  selector: 'app-room-card',
  imports: [],
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.scss'
})
export class RoomCardComponent {

  room = input.required<RoomModel>();
}
