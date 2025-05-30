import {AfterViewInit, Component, effect, input, output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {AvailableRoomModel, Timeslot} from '../../domain/available.room.model';
import {MatPaginator} from '@angular/material/paginator';


@Component({
  selector: 'app-availability-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatPaginator, MatPaginator],
  templateUrl: 'availability-table.component.html',
  styleUrls: ['availability-table.component.scss']

})

export class AvailabilityTableComponent implements AfterViewInit{

  rooms = input<AvailableRoomModel[]>([])
  slotSelected = output<AvailableRoomModel>();
  dataSource = new MatTableDataSource<AvailableRoomModel>(this.rooms());
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {

    effect(() => {
      this.dataSource.data = this.rooms();
    });
  }

  get displayedColumns(): string[] {
    return ['room','intervals'];
  }

  selectInterval(interval: any) {
    console.log('Selected interval: ' + interval);
  }

  getIntervalOffset(interval: Timeslot): number {
    const totalMinutes = 14 * 60; // from 07:00 to 21:00
    return ((interval.startTime - 7 * 60) / totalMinutes) * 100;
  }

  getIntervalWidth(interval: Timeslot): number {
    const totalMinutes = 14 * 60;
    return ((interval.endTime - interval.startTime) / totalMinutes) * 100;
  }

  formatInterval(interval: Timeslot): string {
    const format = (min: number) =>
      `${Math.floor(min / 60).toString().padStart(2, '0')}:${(min % 60).toString().padStart(2, '0')}`;
    return `${format(interval.startTime)} - ${format(interval.endTime)}`;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
