import {Component, computed, Input, input, signal} from '@angular/core';
import {DateTime, Info, Interval} from 'luxon';
import {NgClass} from '@angular/common';
import {AvailableRoomModel} from '../../domain/available.room.model';
import {CalendarCellComponent} from './calendar-cell/calendar-cell.component';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-availability-calendar',
  imports: [
    NgClass,
    CalendarCellComponent,
    MatIconModule
  ],
  templateUrl: './availability-calendar.component.html',
  styleUrl: './availability-calendar.component.scss'
})

export class AvailabilityCalendarComponent {

  availableRooms = input.required<AvailableRoomModel[]>();
  selectedRoom = input.required<AvailableRoomModel | null>();

  activeDay = signal<DateTime | null>(null);

  today = computed<DateTime>(() => DateTime.local())
  firstDayOfActiveMonth = signal<DateTime> (
    this.today().startOf('month')
  )
  weekDays = computed<string[]>(() =>
    Info.weekdays('short')
  )

  daysOfMonth = computed(() => {
    return Interval.fromDateTimes(
      this.firstDayOfActiveMonth(),
      this.firstDayOfActiveMonth().endOf('month').endOf('week')
    ).splitBy({day: 1}).map( (d) => {

      if( d.start == null) {
        throw new Error('Wrong Dates');
      }
      return d.start;
    })
  })

  DATE_MED = DateTime.DATE_MED;

  constructor() {
    //console.log("selected room " + this.selectedRoom()?.name)
  }

  goToPrevMonth(): void {
    this.firstDayOfActiveMonth.set(
      this.firstDayOfActiveMonth().minus({ month: 1})
    )
  }

  goToNextMonth(): void {
    this.firstDayOfActiveMonth.set(
      this.firstDayOfActiveMonth().plus({ month: 1})
    )
  }

  goToToday(): void {
    this.firstDayOfActiveMonth.set(
      this.today().startOf('month')
    )

    this.activeDay.set(this.today());
  }
}
