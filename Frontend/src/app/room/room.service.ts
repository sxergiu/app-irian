import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoomModel } from './domain/room.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private apiUrl = 'http://localhost:8080/api/room';

  constructor(private http: HttpClient) {}

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
}
