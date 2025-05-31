import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState
} from '@ngrx/signals';
import { AvailableRoomModel } from '../../domain/available.room.model';
import {RoomFilterModel, RoomFilterRangeModel} from '../../domain/room.filter.model';
import { computed, inject } from '@angular/core';
import { RoomService } from '../../../room/room.service';
import { BookingResourceService } from '../../booking-resource.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {debounceTime, of, pipe, switchMap, tap} from 'rxjs';
import {DateTime} from 'luxon';

export const featureBookingCalendarStore = signalStore(

  withState({
    loading: 0,
    availableRooms: [] as AvailableRoomModel[],
    amenities: [] as string[],
    selectedRoom: null as AvailableRoomModel | null,
    filters: null as RoomFilterModel | null,
    date: null as DateTime | null,
    monthlyAvailability: {} as { [key: string]: AvailableRoomModel[] }
  }),

  withComputed((state) => ({
    amenities: computed(() => state.amenities()),
    rooms: computed(() => state.availableRooms()),
    selectedRoom: computed(() => state.selectedRoom()),
    monthlyAvailabilityMap: computed(() => state.monthlyAvailability()),

    roomsWithProcessedSlots: computed<AvailableRoomModel[]>((): AvailableRoomModel[] => {
      const processed = state.availableRooms().map(room => {
        const newRoom = {
          ...room,
          availableSlots: room.availableSlots.map(slot => ({
            startTime: toNumTime(slot.startTime),
            endTime: toNumTime(slot.endTime),
          })),
          bookedSlots: (room.bookedSlots ?? []).map(slot => ({
            startTime: toNumTime(slot.startTime),
            endTime: toNumTime(slot.endTime)
          }))
        };

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

    loadAvailableRoomsRange: rxMethod<DateTime>(
      pipe(
        debounceTime(300),
        tap(() => patchState(state, { loading: state.loading() + 1 })),
        switchMap((activeMonth) => {
          const filters = state.filters();

          if (!filters) return of({} as { [key: string]: AvailableRoomModel[] }); // fallback typed as object with string keys

          const requestFilter: RoomFilterRangeModel = {
            startDate: activeMonth.startOf('month').toISODate()!,
            endDate: activeMonth.endOf('month').toISODate()!,
            requiredAmenities: filters.requiredAmenities,
            minCapacity: filters.minCapacity,
          };

          return roomService.fetchMonthlyAvailability(requestFilter);
        }),
        tap((availabilityMap) => {
          patchState(state, {
            loading: state.loading() - 1,
            monthlyAvailability: availabilityMap
          });
        })
      )
    ),

    updateFilters: (filter: RoomFilterModel) => {
      patchState(state, {
        filters: filter
      });

    },

    updateSelectedRoom: (room: AvailableRoomModel) => {
      patchState(state, {
        selectedRoom: room
      });
    },

    updateDatepicker: (date:DateTime) => {
      patchState(state, {
        date: date
      })
    },

    updateMonthlyCalendar: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { loading: state.loading() + 1 })),
        switchMap(() => {
          const currentDate = state.date();
          const currentFilters = state.filters();

          if (!currentDate || !currentFilters) {
            patchState(state, { loading: state.loading() - 1 });
            return of(null);  // no fetch
          }

          return roomService.fetchMonthlyAvailability({
            ...currentFilters,
            startDate: currentDate.startOf('month').toISODate()!,
            endDate: currentDate.endOf('month').toISODate()!
          });
        }),
        tap((availabilityMap) => {
          if (availabilityMap) {
            patchState(state, {
              monthlyAvailability: availabilityMap,
            });
          }
          patchState(state, { loading: state.loading() - 1 });
        })
      )
    )


  })),

  withHooks({
    onInit(store) {
      store.loadRoomAmenities(void 0);
      store.loadAvailableRooms(store.filters);
    }
  })
);

function toNumTime(time: number[] | number): number {
  if (Array.isArray(time)) {
    return time[0] * 60 + time[1];
  }
  return time;
}




