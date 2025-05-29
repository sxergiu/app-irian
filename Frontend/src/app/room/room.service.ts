import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BackendRoom, mapBackendRoomToFrontend, RoomModel } from './domain/room.model';
import {RoomFilterModel} from '../booking/domain/room.filter.model';
import {Observable} from 'rxjs';
import {AvailableRoomModel} from '../booking/domain/available.room.model';

@Injectable({ providedIn: 'root' })
export class RoomService {

  private apiUrl = 'http://localhost:8080/api/room';
  private rooms = signal<RoomModel[]>([]);

  constructor(private http: HttpClient) {
    this.fetchRooms();
  }

  getRooms() {
    return this.rooms;
  }

  saveOrUpdateRoom(room: RoomModel) {
    const dto: any = {
      name: room.name,
      capacity: room.capacity,
      amenities: room.amenities,
      location: room.address,
      locationGeo: {
        latitude: room.lat,
        longitude: room.lng
      }
    };

    if (room.id == null || room.id === 0) {

      this.http.post(this.apiUrl, dto)
        .subscribe(() => this.fetchRooms());

    } else {

      this.http.put(`${this.apiUrl}/${room.id}`, dto)
        .subscribe(() => this.fetchRooms());
    }
  }

  deleteRoom(room: RoomModel) {
    this.http.delete(`${this.apiUrl}/${room.id}`)
      .subscribe(() => this.fetchRooms());
  }

  private fetchRooms() {
    this.http.get<BackendRoom[]>(this.apiUrl)
      .subscribe(rooms => {
        const mappedRooms = rooms.map(mapBackendRoomToFrontend);
        this.rooms.set(mappedRooms);
      });
  }

  fetchAmenities() {
    return this.http.get<string[]>(`${this.apiUrl}/amenities`);
  }

  fetchAvailableRooms(filter?: RoomFilterModel): Observable<AvailableRoomModel[]> {
    return this.http.post<AvailableRoomModel[]>(`${this.apiUrl}/available`, filter);
  }

}
