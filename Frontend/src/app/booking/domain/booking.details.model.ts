


export interface BookingDetailsModel {
  id: number;
  date: string;
  startTime: string;
  endTime: string;

  group: {
    id: number;
    name: string;
    numberOfPeople: number;
  };

  user: {
    id: number;
    name: string;
    email: string;
  };

  room: {
    id: number;
    name: string;
    location: string;
    capacity: number;
    amenities: string[];
    locationGeo: {
      latitude: number;
      longitude: number;
    };
  };
}
