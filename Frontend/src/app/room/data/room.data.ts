import {RoomModel} from '../domain/room.model';

export const MOCK_ROOMS: RoomModel[] = [
  {
    name: 'Conference Room A',
    address: 'New York',
    capacity: 50,
    amenities: ['Projector', 'Whiteboard', 'Wi-Fi'],
    lat: 40.712776,
    lng: -74.005974
  },
  {
    name: 'Training Hall',
    address: 'San Francisco',
    capacity: 100,
    amenities: ['Sound System', 'Stage', 'Air Conditioning'],
    lat: 37.774929,
    lng: -122.419418
  },
  {
    name: 'Workshop Space',
    address: 'Berlin',
    capacity: 30,
    amenities: ['Whiteboard', 'High Tables'],
    lat: 52.520008,
    lng: 13.404954
  },
  {
    name: 'Meeting Pod',
    address: 'London',
    capacity: 6,
    amenities: ['Wi-Fi', 'Monitor'],
    lat: 51.507351,
    lng: -0.127758
  }
];
