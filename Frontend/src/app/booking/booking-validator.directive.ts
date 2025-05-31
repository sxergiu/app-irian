import {Directive, Input, input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[appBookingValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: BookingValidatorDirective,
      multi: true,
    },
  ],
})

export class BookingValidatorDirective implements Validator {

  @Input('appTimeCompare') compareTo!: string;

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.parent || !this.compareTo) return null;

    const startTimeControl = control.parent.get(this.compareTo);

    if (!startTimeControl) return null;

    const startTime = startTimeControl.value;
    const endTime = control.value;

    if (!startTime || !endTime) return null; // required validator handles empties

    if (startTime >= endTime) {
      return {timeCompare: true};
    }

    return null;
  }
}
