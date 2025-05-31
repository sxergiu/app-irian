
export interface AvailableRoomModel {

  id: number;
  name: string;
  location: string;
  capacity: number;
  amenities: string[];
  availableSlots: Timeslot[];
  bookedSlots: Timeslot[];
}

export interface Timeslot {
  startTime: number;
  endTime: number;
}
