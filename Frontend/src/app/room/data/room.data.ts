import {RoomModel} from '../domain/room.model';

export const MOCK_ROOMS: RoomModel[] = [
  {
    id: 1,
    name: 'Conference Room A',
    address: 'New York',
    capacity: 50,
    amenities: ['Projector', 'Whiteboard', 'Wi-Fi', 'Air Conditioning', 'Sound System', 'High tables', 'Monitor', 'Elephant', 'Choir'],
    lat: 40.712776,
    lng: -74.005974
  },
  {
    id: 2,
    name: 'Training Hall',
    address: 'San Francisco',
    capacity: 100,
    amenities: ['Sound System', 'Stage', 'Air Conditioning'],
    lat: 37.774929,
    lng: -122.419418
  },
  {
    id: 3,
    name: 'Workshop Space',
    address: 'Berlin',
    capacity: 30,
    amenities: ['Whiteboard', 'High Tables'],
    lat: 52.520008,
    lng: 13.404954
  },
  {
    id: 4,
    name: 'Meeting Pod',
    address: 'London',
    capacity: 6,
    amenities: ['Wi-Fi', 'Monitor'],
    lat: 51.507351,
    lng: -0.127758
  },
  {
    id: 5,
    name: 'Spaceship',
    address: 'Arad',
    capacity: 5,
    amenities: ['Wi-Fi', 'Monitor', 'Radio'],
    lat:  46.1833,
    lng: 21.3167
  },
  {
    id: 6,
    name: 'Workshop Space #2',
    address: 'Frankfurt',
    capacity: 40,
    amenities: ['Whiteboard', 'High Tables', 'AC'],
    lat: 50.1109,
    lng: 8.6821
  },
];
