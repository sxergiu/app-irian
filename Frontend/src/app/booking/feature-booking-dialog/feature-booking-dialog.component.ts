import {Component, Inject, model, output, computed, signal, inject, effect, AfterViewInit, input} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {AvailableRoomModel, Timeslot} from '../domain/available.room.model';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatError, MatFormField, MatHint, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {CreateBookingModel} from '../domain/create.booking.model';
import {MatSelect, MatOption, MatSelectModule} from '@angular/material/select';
import { MatTimepickerModule} from '@angular/material/timepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {BookingValidatorDirective} from '../booking-validator.directive';
import {MatIconModule} from '@angular/material/icon';
import {GroupModel} from '../../named-groups/domain/group.models';
import {GroupService} from '../../named-groups/groups.service';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {BookingResourceService} from '../booking-resource.service';
import {BookingModel} from '../domain/booking.model';

// Type for flexible time representation
type TimeValue = number | number[];

@Component({
  selector: 'app-feature-booking-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    MatSelectModule,
    MatTimepickerModule,
    FormsModule,
    BookingValidatorDirective,
    MatIconModule,
    MatAutocompleteTrigger,
    MatAutocomplete
  ],
  templateUrl: './feature-booking-dialog.component.html',
  styleUrl: './feature-booking-dialog.component.scss'
})

export class FeatureBookingDialogComponent {

  groupService = inject(GroupService);
  bookingService = inject(BookingResourceService);

  booking = model.required<CreateBookingModel>();
  bookingChanged = output<CreateBookingModel>();
  namedGroups = signal<GroupModel[]>([]);

  constructor(
    public dialogRef: MatDialogRef<FeatureBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      interval: Timeslot,
      room?: AvailableRoomModel,
      date: string,
      namedGroupId?: number,
      roomId: number
      isEdit: boolean
      booking?: BookingModel
    }
  ) {

    this.fetchGroups();

    console.log(this.data.interval)
    console.log(this.data.room)
    console.log(this.data.date)
    console.log(typeof this.data.interval)

      if( !this.data.isEdit ) {
        const startTime = this.timeValueToTimeString(this.data.interval.startTime);
        const endTime = this.timeValueToTimeString(this.data.interval.endTime);

        this.booking.set({
          id: Math.random(),
          date: this.data.date,
          namedGroupId: undefined,
          roomId: this.data.room?.id ?? this.data.roomId,
          time: {
            startTime: startTime,
            endTime: endTime
          }
        });

        console.log(this.booking())
      }
      else {

        const editBooking = this.data.booking;

        this.booking.set({
          id: editBooking?.id ?? Math.random(),
          date: editBooking?.date,
          namedGroupId: editBooking?.namedGroupId,
          roomId: editBooking?.roomId
          , time: {
            startTime: editBooking?.startTime,
            endTime: editBooking?.endTime
          }
        })

        console.log(this.booking())
      }
  }

  onSubmit(bookingForm: NgForm) {

    if (bookingForm.valid) {

      this.bookingService.createOrUpdateBooking(this.booking(), this.data.isEdit);
      console.log("CREATED BOOKING ");

      this.dialogRef.close();
    }
    else {
      console.log("INVALID TIME")
    }
  }

  updateDate(newDate: string): void {
    this.booking.update(current => ({
      ...current,
      date: newDate
    }));
  }

  updateStartTime(newStartTime: string): void {
    this.booking.update(current => ({
      ...current,
      time: {
        ...current.time,
        startTime: this.extractHourOnly(newStartTime)
      }
    }));
  }

  updateEndTime(newEndTime: string): void {
    this.booking.update(current => ({
      ...current,
      time: {
        ...current.time,
        endTime: this.extractHourOnly(newEndTime)
      }
    }));
  }

  updateNamedGroup(groupId: number | undefined): void {
    this.booking.update(current => ({
      ...current,
      namedGroupId: groupId
    }));
  }

  updateRoomId(roomId: number): void {
    this.booking.update(current => ({
      ...current,
      roomId: roomId
    }));
  }

  /**
   * Converts a TimeValue (number or number[]) to minutes since 00:00
   * @param timeValue - Either minutes since 00:00 (number) or [hours, minutes] array
   * @returns Total minutes since 00:00
   */
  private timeValueToMinutes(timeValue: TimeValue): number {
    if (Array.isArray(timeValue)) {
      // timeValue is [hours, minutes]
      const [hours, minutes] = timeValue;
      return hours * 60 + (minutes || 0);
    } else {
      // timeValue is already minutes since 00:00
      return timeValue;
    }
  }

  private extractHourOnly(dateStr: string) {
    const date = new Date(dateStr);
    const hours = String(date.getHours()).padStart(2, '0');
    return `${hours}:00`;
  }

  /**
   * Converts a TimeValue to a time string (HH:MM format)
   * @param timeValue - Either minutes since 00:00 (number) or [hours, minutes] array
   * @returns Time string in HH:MM format
   */
  private timeValueToTimeString(timeValue: TimeValue): string {
    const totalMinutes = this.timeValueToMinutes(timeValue);
    return this.minutesToTimeString(totalMinutes);
  }

  private minutesToTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
  }

  private timeStringToMinutes(time: unknown): number {
    if (typeof time === 'string') {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }

    if (typeof time === 'number') {
      return time;
    }

    if (Array.isArray(time)) {
      const [hours, minutes] = time;
      return hours * 60 + (minutes || 0);
    }

    if (time instanceof Date) {
      return time.getHours() * 60 + time.getMinutes();
    }

    console.warn('Invalid time format:', time);
    return 0;
  }

  getDuration(): number {
    const start = this.timeStringToMinutes(this.booking()!.time.startTime!);
    const end = this.timeStringToMinutes(this.booking()!.time.endTime!);
    return end - start;
  }

  getFormattedStartTime(): string {
    return this.timeValueToTimeString(this.data.interval.startTime);
  }

  getFormattedEndTime(): string {
    return this.timeValueToTimeString(this.data.interval.endTime);
  }

  getMaxStartTime(): string {
    const endMinutes = this.timeValueToMinutes(this.data.interval.endTime);
    return this.minutesToTimeString(endMinutes - 30);
  }

  getMinEndTime(): string {
    const startMinutes = this.timeValueToMinutes(this.data.interval.startTime);
    return this.minutesToTimeString(startMinutes + 30);
  }

  fetchGroups(): void {

    this.groupService.getGroups().subscribe({
      next: (data) => {
        this.namedGroups.set(data);
      }
    });
  }

  displayGroupName = (groupId: number): string => {
    const group = this.namedGroups().find(g => g.id === groupId);
    return group ? `${group.name} - ${group.numberOfPeople} people` : '';
  };

  selectGroupName = (groupId: number | undefined): string => {
    if( !!groupId ) return 'Select';
    const group = this.namedGroups().find(g => g.id === groupId);
    return group ? `${group.name} - ${group.numberOfPeople} people` : '';
  };

  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
