import {ChangeDetectionStrategy, Component, EventEmitter, output, Output, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {
  MatAccordion, MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-room-filter',
  standalone: true,
  imports: [CommonModule,
    FormsModule, MatFormFieldModule, MatDatepickerModule,
    MatFormFieldModule, MatSelectModule, MatExpansionModule, MatInput, MatIcon, MatIconButton],
  templateUrl: `room-filter.component.html`,
  styleUrls: [`room-filter.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomFilterComponent {

  readonly panelOpenState = signal(false);
  filterChange = output<{ capacity: number, amenities: string[] }>()
  capacity = 0;
  amenities: string[] = [];
  allAmenities = ['wifi', 'projector', 'whiteboard', 'air conditioning'];

  @Output() dateChange = new EventEmitter<Date>();
  selected = new Date();

  emitChange() {
    this.filterChange.emit({ capacity: this.capacity, amenities: this.amenities });
  }
}
