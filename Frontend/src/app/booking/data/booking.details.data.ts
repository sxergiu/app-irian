import {BookingDetailsModel} from '../domain/booking.details.model';


export const mockBookingDetails: BookingDetailsModel = {
  id: 1,
  date: '2025-06-10',
  startTime: '10:00',
  endTime: '12:00',
  group: {
    id: 45,
    name: "Board of Directors",
    numberOfPeople: 9
  },
  user: {
    id: 2,
    name: "alex",
    email: "user@example.com"
  },
  room: {
    id: 1,
    name: "Ocean View Meeting Room",
    location: "San Francisco",
    capacity: 12,
    amenities: ["Projector", "Wi-Fi", "Whiteboard"],
    locationGeo: {
      latitude: 37.7749,
      longitude: -122.4194
    }
  }
};
