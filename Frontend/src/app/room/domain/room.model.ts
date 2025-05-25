
export interface RoomModel{
  name: string;
  capacity: number;
  amenities: string[];
  address: string;
  lat?: number;
  lng?: number;
}

export interface BackendRoom {
  id: number;
  name: string;
  location: string;
  capacity: number;
  amenities: string[];
  locationGeo: {
    latitude: number;
    longitude: number;
  };
}

export function mapBackendRoomToFrontend(room: BackendRoom): RoomModel {
  return {
    name: room.name,
    capacity: room.capacity,
    amenities: room.amenities,
    address: room.location,
    lat: room.locationGeo?.latitude,
    lng: room.locationGeo?.longitude
  };
}
