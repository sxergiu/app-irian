import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  inject, input,
  output,
  Output,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
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

  amenities = input<string[]>();

  filterChange = output<RoomFilterModel>();

  selectedCapacity = signal<number>(0);
  selectedDate = signal<string>("");
  selectedAmenities = signal<string[]>([]);

  filter = computed<RoomFilterModel>(() => ({
    date: this.selectedDate(),
    minCapacity: this.selectedCapacity(),
    requiredAmenities: this.selectedAmenities()
  }));

  constructor() {

    effect(() => {
      this.filterChange.emit(this.filter());
    });

  }

  private getDateArray(date: Date): number[] {
    return [
      date.getFullYear(),
      date.getMonth() + 1, // getMonth() returns 0-11, so add 1
      date.getDate()
    ];
  }

  onCapacityChange(capacity: number): void {
    this.selectedCapacity.set(capacity);
  }

  onDateChange(date: string): void {
    this.selectedDate.set(date);
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
  }

  isAmenitySelected(amenity: string): boolean {
    return this.selectedAmenities().includes(amenity);
  }

  resetFilters(): void {
    this.selectedCapacity.set(0);
    this.selectedDate.set("");
    this.selectedAmenities.set([]);
  }
}
