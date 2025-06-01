import {AfterViewInit, Component, effect, inject, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {AuthService} from '../../auth/auth.service';
import {BookingModel} from '../domain/booking.model';
import {NgIf} from '@angular/common';
import {BookingResourceService} from '../booking-resource.service';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {IsBookingPastPipe} from '../is-booking-past.pipe';
import {Timeslot} from '../domain/available.room.model';
import {FeatureBookingDialogComponent} from '../feature-booking-dialog/feature-booking-dialog.component';
import {MatDialog} from '@angular/material/dialog';

import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {FeatureBookingExportComponent} from '../feature-booking-export/feature-booking-export.component';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    NgIf,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    IsBookingPastPipe,
    MatDividerModule,
    MatListModule,
    FeatureBookingExportComponent
  ],
  templateUrl: 'feature-booking-table.component.html',
  styleUrls: ['feature-booking-table.component.scss']
})

export class FeatureBookingTableComponent implements AfterViewInit{

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  bookingService = inject(BookingResourceService);
  auth = inject(AuthService);
  router = inject(Router);
  readonly dialog = inject(MatDialog);

  bookings = this.bookingService.getBookings();

  isAdmin = this.auth.isAdmin();

  dataSource = new MatTableDataSource<BookingModel>();

  readonly displayedColumns: string[] = [
    'id',
    'roomName',
    'roomLocation',
    'namedGroupName',
    'date',
    'time',
    ...(this.isAdmin ? ['userName'] : []),
    'actions'
  ];

  constructor() {
    effect(() => {
      this.dataSource.data = this.bookings();
    });
  }

  ngAfterViewInit(): void {

    console.log('Total records:', this.bookings());
    console.log('Page size:', this.paginator.pageSize);
    console.log('Paginator exists:', !!this.paginator);

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

     this.bookings.set(this.bookings().map(b => ({
       ...b,
       isPast: this.isBookingPast(b)
     })));

  }

  viewDetails(booking: BookingModel) {
    console.log('View booking', booking);
    this.router.navigate(['bookings', booking.id]);
  }

  openDialog(booking: BookingModel) {

    const dialogRef = this.dialog.open(FeatureBookingDialogComponent, {
      data: {
        interval: {
          startTime: booking.startTime,
          endTime: booking.endTime
        } as unknown as Timeslot,
        room: booking.roomId,
        date: booking.date,
        isEdit: true,
        booking: booking
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  isBookingPast(booking: BookingModel): boolean {
    const today = new Date().toISOString().split('T')[0];
    const bookingDate = new Date(booking.date).toISOString().split('T')[0];
    return bookingDate < today;
  }

  deleteBooking($event: BookingModel) {
    this.bookingService.deleteBooking($event);
  }

}
