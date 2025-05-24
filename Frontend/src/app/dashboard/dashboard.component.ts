import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import {User} from '../auth/models/authModels';;
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{

  currentUser: User | null = null;
  authService = inject(AuthService);
  constructor(
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
