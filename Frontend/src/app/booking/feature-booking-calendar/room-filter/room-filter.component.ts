import {ChangeDetectionStrategy, Component, effect, input, model, output, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import {
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  MatExpansionModule,
} from '@angular/material/expansion';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {RoomFilterModel} from '../../domain/room.filter.model';
import {DateTime} from 'luxon';
import {FeatureSelectRoomComponent} from '../feature-select-room/feature-select-room.component';
import {AvailableRoomModel} from '../../domain/available.room.model';

@Component({
  selector: 'app-room-filter',
  standalone: true,
  imports: [CommonModule,
    FormsModule, MatFormFieldModule, MatDatepickerModule,
    MatFormFieldModule, MatSelectModule, MatExpansionModule, MatInput, MatIcon, MatIconButton, MatChipsModule, FeatureSelectRoomComponent],
  templateUrl: `room-filter.component.html`,
  styleUrls: [`room-filter.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RoomFilterComponent {

  filter = model<RoomFilterModel>({
    date: "",
    minCapacity: 0,
    requiredAmenities: []
  });
  filterChange = output<RoomFilterModel>();

  view= input.required<boolean>();
  amenities = input<string[]>([]);
  selectedAmenities = signal<string[]>([]);

  availableRooms = input.required<AvailableRoomModel[]>();
  selectedRoom = output<AvailableRoomModel>();

  dateChange = output<DateTime>();

    constructor() {

      effect(() => {

        const currentFilter = this.filter();

        if(!currentFilter)
          return;

        this.filterChange.emit(currentFilter);

        const currentDate = currentFilter.date;

        if (this.isDate(currentDate)) {
          const dateTime = DateTime.fromJSDate(currentDate);
          this.dateChange.emit(dateTime);

          console.log("FILTER EMITS" +dateTime.toJSDate())
        } else if (typeof currentDate === 'string') {

          const dateTime = DateTime.fromISO(currentDate);
          if (dateTime.isValid) {
            this.dateChange.emit(dateTime);

            console.log("FILTER EMITS" +dateTime.toString())
          }
        }
      });
    }

    isDate(value: unknown): value is Date {
      return value instanceof Date && !isNaN(value.getTime());
    }


  onCapacityChange($event: number): void {
    this.filter.update(filter => {
      return {
        ...filter,
       minCapacity: $event
      }
    })
  }

  onDateChange($event: Date): void {
    const localDateOnly = DateTime.fromJSDate($event).toISODate(); // '2025-05-16'
    this.filter.update(filter => ({
      ...filter,
      date: (localDateOnly ?? undefined)
    }));
  }

  toggleAmenity(amenity: string): void {
    const currentSelected = this.selectedAmenities();
    const index = currentSelected.indexOf(amenity);

    if (index >= 0) {
      const newSelected = currentSelected.filter(a => a !== amenity);
      this.selectedAmenities.set(newSelected);
    } else {

      this.selectedAmenities.set([...currentSelected, amenity]);
    }

    this.filter.update(filter => {
      return {
        ...filter,
        requiredAmenities: this.selectedAmenities()
      }
    })
  }

  onRoomSelected($event: AvailableRoomModel) {
    this.selectedRoom.emit($event);
  }

}


