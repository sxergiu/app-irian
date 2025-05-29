import {ChangeDetectionStrategy, Component, EventEmitter, inject, output, Output, signal} from '@angular/core';
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
import {BookingAvailabilityResourceService} from '../booking-availability-resource.service';
import {MatChipsModule} from '@angular/material/chips';

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

  filterChange = output<{ capacity: number, amenities: string[] }>()
  capacity = 0;
  availabilityService = inject(BookingAvailabilityResourceService);
  amenities = signal<string[]>([]);
  selectedAmenities = signal<string[]>([]);

  @Output() dateChange = new EventEmitter<Date>();
  selected = new Date();

  constructor() {
    this.amenities = this.availabilityService.amenities;
  }

  emitChange() {
    this.filterChange.emit({ capacity: this.capacity, amenities: this.amenities() });
  }


  toggleAmenity(amenity: string): void {
    const index = this.selectedAmenities().indexOf(amenity);
    if (index >= 0) {
      this.selectedAmenities().splice(index, 1);
    } else {
      this.selectedAmenities().push(amenity);
    }
    this.emitChange();
  }
}
