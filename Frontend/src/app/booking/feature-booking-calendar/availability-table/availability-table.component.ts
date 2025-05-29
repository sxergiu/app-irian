import {Component, Input, Output, EventEmitter, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {AvailableRoomModel} from '../../domain/available.room.model';

@Component({
  selector: 'app-availability-table',
  standalone: true,
  imports: [CommonModule,MatTableModule,MatIconModule,MatButtonModule],
  templateUrl: 'availability-table.component.html',
  styleUrls: ['availability-table.component.scss']

})

export class AvailabilityTableComponent {

  rooms = input<AvailableRoomModel[]>([])
  @Input() timeSlots: string[] = [];
  @Output() slotSelected = new EventEmitter<{ roomId: number; slot: string }>();

  get displayedColumns(): string[] {
    return ['room', ...this.timeSlots];
  }
}
