import { Component } from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import {FooterComponent} from '../footer/footer.component';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-binding',
  imports: [
    MenuComponent,
    FooterComponent,
    DashboardComponent,
    RouterOutlet
  ],
  templateUrl: './binding.component.html',
  styleUrl: './binding.component.scss'
})
export class BindingComponent {

}
