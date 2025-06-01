import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isBookingPast',
  pure: true
})

export class IsBookingPastPipe implements PipeTransform {

  transform(date: string | Date): boolean {
    const today = new Date().toISOString().split('T')[0];
    const booking = new Date(date).toISOString().split('T')[0];
    return booking < today;
  }

}
