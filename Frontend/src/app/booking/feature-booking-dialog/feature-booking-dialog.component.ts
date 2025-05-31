import {Component, Inject, model, output, computed, signal, inject, effect, AfterViewInit} from '@angular/core';
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

  booking = model.required<CreateBookingModel>();
  bookingChanged = output<CreateBookingModel>();

  namedGroups = signal<GroupModel[]>([]);
  groupService = inject(GroupService);

  constructor(
    public dialogRef: MatDialogRef<FeatureBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      interval: Timeslot,
      room: AvailableRoomModel,
      date: string
    }
  ) {

    this.fetchGroups();

    this.booking.set({
      date: this.data.date,
      namedGroupId: undefined,
      roomId: this.data.room.id!,
      startTime: this.minutesToTimeString(this.data.interval.startTime),
      endTime: this.minutesToTimeString(this.data.interval.endTime),
    });
  }

  onSubmit(bookingForm: NgForm) {
    if (bookingForm.valid && this.isValidTimeRange()) {

      this.dialogRef.close(this.booking());
    }
    else {
      console.log("INVALID TIME")
    }
  }

  isValidTimeRange(): boolean {
    const startTime = this.booking()!.startTime;
    const endTime = this.booking()!.endTime;

    if (!startTime || !endTime) return false;

    const startMinutes = typeof startTime === 'string' ?
      this.timeStringToMinutes(startTime) : startTime;
    const endMinutes = typeof endTime === 'string' ?
      this.timeStringToMinutes(endTime) : endTime;

    return endMinutes > startMinutes;
  }

  private minutesToTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
  }

  private timeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getDuration(): number {
    const start = this.timeStringToMinutes(this.booking()!.startTime!);
    const end = this.timeStringToMinutes(this.booking()!.endTime!);
    return end - start;
  }

  getFormattedStartTime(): string {
    return this.minutesToTimeString(this.data.interval.startTime);
  }

  getFormattedEndTime(): string {
    return this.minutesToTimeString(this.data.interval.endTime);
  }

  getMaxStartTime(): string {
    return this.minutesToTimeString(this.data.interval.endTime-30);
  }

  getMinEndTime(): string {
    return this.minutesToTimeString(this.data.interval.startTime+30);
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
}
