import {Component, input, output} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {AvailableRoomModel} from '../../domain/available.room.model';

@Component({
  selector: 'app-feature-select-room',
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './feature-select-room.component.html',
  styleUrl: './feature-select-room.component.scss'
})
export class FeatureSelectRoomComponent {


  rooms = input.required<AvailableRoomModel[]>()

  selectedRoom = output<AvailableRoomModel>()
  selectedRoomValue?: AvailableRoomModel;

}
