import { Routes } from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './auth/auth.guard';
import {NamedGroupsComponent} from './named-groups/named-groups.component';
import {BindingComponent} from './binding/binding.component';
import {BookingComponent} from './booking/booking.component';
import {BookingDetailsComponent} from './booking/booking-details/booking-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '',
    component: BindingComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],  data: { roles: ['USER', 'ADMIN'] } },
      { path: 'groups', component: NamedGroupsComponent, canActivate: [AuthGuard],  data: { roles: ['ADMIN'] } },
      { path: 'bookings', component: BookingComponent, canActivate: [AuthGuard], data: {roles: ['ADMIN', 'USER'] } },
      { path: 'bookings/:id', component: BookingDetailsComponent, canActivate: [AuthGuard], data: {roles: ['ADMIN', 'USER'] } }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
