import {BookingModel} from '../domain/booking.model';


export const MOCK_BOOKINGS : BookingModel[]  = [
  {
    id: 1,
    roomId: 101,
    roomName: 'Ocean View',
    roomLocation: 'Miami, FL',
    namedGroupId: 1001,
    namedGroupName: 'Engineering Team',
    date: '2025-06-10',
    startTime: '10:00',
    endTime: '12:00',
    userId: 1,
    userName: 'alice@example.com'
  },
  {
    id: 2,
    roomId: 102,
    roomName: 'Mountain Hall',
    roomLocation: 'Denver, CO',
    namedGroupId: 1002,
    namedGroupName: 'Marketing Team',
    date: '2025-06-11',
    startTime: '14:00',
    endTime: '15:30',
    userId: 2,
    userName: 'bob@example.com'
  },
  {
    id: 3,
    roomId: 103,
    roomName: 'City Center',
    roomLocation: 'New York, NY',
    namedGroupId: 1003,
    namedGroupName: 'Design Group',
    date: '2025-06-12',
    startTime: '09:00',
    endTime: '11:00',
    userId: 1,
    userName: 'alice@example.com'
  }
];
