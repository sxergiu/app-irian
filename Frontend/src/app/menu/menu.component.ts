import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    MatIcon
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    if( !this.authService.isAuthenticated() ) {
      this.router.navigate(['/login']);
    }
  }

  home(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
