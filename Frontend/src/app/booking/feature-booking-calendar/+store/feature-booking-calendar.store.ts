import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState
} from '@ngrx/signals';
import { AvailableRoomModel, Timeslot } from '../../domain/available.room.model';
import { RoomFilterModel } from '../../domain/room.filter.model';
import { computed, inject } from '@angular/core';
import { RoomService } from '../../../room/room.service';
import { BookingResourceService } from '../../booking-resource.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';

export const featureBookingCalendarStore = signalStore(

  withState({
    loading: 0,
    availableRooms: [] as AvailableRoomModel[],
    amenities: [] as string[],
    filters: null as RoomFilterModel | null
  }),

  withComputed((state) => ({
    amenities: computed(() => state.amenities()),
    rooms: computed(() => state.availableRooms()),

    roomsWithBookedSlots: computed<AvailableRoomModel[]>((): AvailableRoomModel[] => {
      const defaultSlot: Timeslot = { startTime: 7 * 60, endTime: 21 * 60 };

      return state.availableRooms().map((room) => {
        const sortedAvailable = [...room.availableSlots].sort((a, b) => a.startTime - b.startTime);
        const bookedSlots = subtractAvailableFromDefault(defaultSlot, sortedAvailable);

        return {
          ...room,
          bookedSlots
        };
      });
    }),

    roomsWithProcessedSlots: computed<AvailableRoomModel[]>((): AvailableRoomModel[] => {
      const processed = state.availableRooms().map(room => {
        const newRoom = {
          ...room,
          availableSlots: room.availableSlots.map(slot => ({
            startTime: maybeConvertTimeArray(slot.startTime),
            endTime: maybeConvertTimeArray(slot.endTime),
          })),
          bookedSlots: (room.bookedSlots ?? []).map(slot => ({
            startTime: maybeConvertTimeArray(slot.startTime),
            endTime: maybeConvertTimeArray(slot.endTime)
          }))
        };
        console.log('Processed room:', newRoom);
        return newRoom;
      });

      return processed;
    })

  })),

  withMethods((state, roomService = inject(RoomService), bookingService = inject(BookingResourceService)) => ({

    loadRoomAmenities: rxMethod((input$) =>
      input$.pipe(
        debounceTime(300),
        tap(() => patchState(state, { loading: state.loading() + 1 })),
        switchMap(() => roomService.fetchAmenities()),
        tap((data) => {
          patchState(state, {
            loading: state.loading() - 1,
            amenities: data
          });
        })
      )
    ),

    loadAvailableRooms: rxMethod<RoomFilterModel | null>(
      pipe(
        debounceTime(300),
        tap(() => patchState(state, { loading: state.loading() + 1 })),
        switchMap((filter) => roomService.fetchAvailableRooms(filter || undefined)),
        tap((rooms) => {
          patchState(state, {
            loading: state.loading() - 1,
            availableRooms: rooms
          });
        })
      )
    ),

    updateFilters: (filter: RoomFilterModel) => {
      patchState(state, { filters: filter });
    }

  })),

  withHooks({
    onInit(store) {
      store.loadRoomAmenities(void 0);
      store.loadAvailableRooms(store.filters);
    }
  })
);

function subtractAvailableFromDefault(defaultSlot: Timeslot, available: Timeslot[]): Timeslot[] {
  let result: Timeslot[] = [];
  let currentStart = defaultSlot.startTime;

  for (const slot of available) {
    if (slot.startTime > currentStart) {
      result.push({ startTime: currentStart, endTime: slot.startTime });
    }
    currentStart = Math.max(currentStart, slot.endTime);
  }

  if (currentStart < defaultSlot.endTime) {
    result.push({ startTime: currentStart, endTime: defaultSlot.endTime });
  }

  return result;
}

/**
 * Converts a time represented as [hour, minute] array to total minutes
 */
function timeArrayToMinutes(time: number[]): number {
  return time[0] * 60 + time[1];
}

function maybeConvertTimeArray(time: number[] | number): number {
  if (Array.isArray(time)) {
    return time[0] * 60 + time[1];
  }
  return time; // already in minutes
}
