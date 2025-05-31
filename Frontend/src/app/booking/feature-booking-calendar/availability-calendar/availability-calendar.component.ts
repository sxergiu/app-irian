import {AfterViewInit, Component, computed, effect, Input, input, OnInit, output, signal} from '@angular/core';
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

export class AvailabilityCalendarComponent implements AfterViewInit{

    availableRooms = input.required<AvailableRoomModel[]>();
    selectedRoom = input.required<AvailableRoomModel | null>();
    filteredDate = input<DateTime | null>();

    calendarMap = input<Record<string, AvailableRoomModel[]>>();
    availableByDate = computed(() => this.calendarMap() ?? {});

    activeDay = signal<DateTime | null>(null);
    monthChange = output<DateTime>()

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

    effect(() => {
      const currentMonth = this.firstDayOfActiveMonth();
      const selectedRoom = this.selectedRoom();

      console.log(this.selectedRoom()?.availableSlots);
      this.monthChange.emit(currentMonth);
    });

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
  }

  goToDate(date: DateTime | null): void {
    if (!date) return;

    this.firstDayOfActiveMonth.set(date.startOf('month'));
    this.activeDay.set(date);
  }

  ngAfterViewInit(): void {

    this.activeDay.set(this.filteredDate() ?? null);
    this.goToDate(this.activeDay())

  }


  getRoomsForDay(day: DateTime): AvailableRoomModel[] {

    const dayIso = day.toISODate();
    const map = this.availableByDate();


    if( dayIso === null  || !map){
      console.log("DAY NULL");
      return [];
    }

    return map[dayIso] || [];
  }

}
