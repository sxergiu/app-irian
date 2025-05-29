import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-availability-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'availability-table.component.html',
  styleUrls: ['availability-table.component.scss']

})

export class AvailabilityTableComponent {
  @Input() rooms: any[] = [];
  @Input() timeSlots: string[] = [];
  @Output() slotSelected = new EventEmitter<{ roomId: number, slot: string }>();
}
