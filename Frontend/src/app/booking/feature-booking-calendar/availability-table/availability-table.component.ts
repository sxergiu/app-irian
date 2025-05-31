import {AfterViewInit, Component, effect, input, output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {AvailableRoomModel, Timeslot} from '../../domain/available.room.model';
import {MatPaginator} from '@angular/material/paginator';
import {FeatureTimelineBarComponent} from '../feature-timeline-bar/feature-timeline-bar.component';


@Component({
  selector: 'app-availability-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatPaginator, MatPaginator, FeatureTimelineBarComponent],
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
