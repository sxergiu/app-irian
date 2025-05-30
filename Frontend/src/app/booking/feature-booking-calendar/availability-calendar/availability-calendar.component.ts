import {Component, computed, effect, EventEmitter, input, output, Output, Signal, signal} from '@angular/core';
import {DateTime, Info, Interval} from 'luxon';
import {NgClass} from '@angular/common';
import {AvailableRoomModel} from '../../domain/available.room.model';
import {filter} from 'rxjs';

@Component({
  selector: 'app-availability-calendar',
  imports: [
    NgClass
  ],
  templateUrl: './availability-calendar.component.html',
  styleUrl: './availability-calendar.component.scss'
})

export class AvailabilityCalendarComponent {

  availableRooms = input.required<AvailableRoomModel[]>();
  selectedDay = output<DateTime>();

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

    effect(() => {

      const activeDay = this.activeDay();

      if( activeDay != null ) {
        this.selectedDay.emit(activeDay)
      }

    });

  }
}
