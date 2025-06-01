import {Component, inject} from '@angular/core';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader, MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatDivider} from "@angular/material/divider";
import {
    MatList,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
    MatListSubheaderCssMatStyler
} from "@angular/material/list";
import {BookingModel} from '../domain/booking.model';
import {BookingResourceService} from '../booking-resource.service';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-feature-booking-export',
    imports: [
        MatAccordion,
        MatDivider,
        MatExpansionPanel,
        MatExpansionPanelDescription,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatIcon,
        MatList,
        MatListItem,
        MatListItemIcon,
        MatListItemTitle,
        MatListSubheaderCssMatStyler
    ],
  templateUrl: './feature-booking-export.component.html',
  styleUrl: './feature-booking-export.component.scss'
})
export class FeatureBookingExportComponent {

  bookingService = inject(BookingResourceService);

  constructor() {
    this.bookingService.fetchExports();
  }

}
