import {Component, inject} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-main-page',
  imports: [
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  authService = inject(AuthService);
}
