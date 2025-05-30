import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  inject, input, model,
  output,
  Output,
  signal
} from '@angular/core';
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


@Component({
  selector: 'app-room-filter',
  standalone: true,
  imports: [CommonModule,
    FormsModule, MatFormFieldModule, MatDatepickerModule,
    MatFormFieldModule, MatSelectModule, MatExpansionModule, MatInput, MatIcon, MatIconButton, MatChipsModule],
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

  dateChange = output<DateTime>();

  view= input.required<boolean>();
  amenities = input<string[]>([]);
  selectedAmenities = signal<string[]>([]);

  constructor() {

    effect(() => {

      this.filterChange.emit(this.filter());

    });

  }

    onCapacityChange($event: number): void {
    this.filter.update(filter => {
      return {
        ...filter,
       minCapacity: $event
      }
    })
  }

  onDateChange($event: string): void {
    this.filter.update(filter => {
      return {
        ...filter,
        date: $event
      }
    })
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

}
