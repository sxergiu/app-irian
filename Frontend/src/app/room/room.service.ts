import { HttpClient } from '@angular/common/http';
import {Injectable, signal} from '@angular/core';
import {BackendRoom, mapBackendRoomToFrontend, RoomModel} from './domain/room.model';
import {map} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private apiUrl = 'http://localhost:8080/api/room';
  private rooms = signal<RoomModel[]>([]);

  constructor(private http: HttpClient) {
        this.fetchRooms();
  }

  getRooms() {
      return this.rooms
  }

  createRoom(room: RoomModel) {
    return this.http.post(this.apiUrl, room);
  }

  checkNameUnique(name: string) {
    return this.http.get<boolean>(`${this.apiUrl}/check-name?name=${name}`);
  }

  saveOrUpdateRoom(room: RoomModel) {

  }

  deleteRoom($event: RoomModel) {

  }

  private fetchRooms() {
    this.http.get<BackendRoom[]>('http://localhost:8080/api/room/getAll')
      .subscribe(rooms => {
        const mappedRooms = rooms.map(mapBackendRoomToFrontend);
        this.rooms.set(mappedRooms);
      });
  }
}
