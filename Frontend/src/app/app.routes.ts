import { Routes } from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './auth/auth.guard';
import {NamedGroupsComponent} from './named-groups/named-groups.component';
import {BindingComponent} from './binding/binding.component';
import {FeatureBookingTableComponent} from './booking/feature-booking-table/feature-booking-table.component';
import {FeatureBookingDetailsComponent} from './booking/feature-booking-details/feature-booking-details.component';
import {FeatureBookingCalendarComponent} from './booking/feature-booking-calendar/feature-booking-calendar.component';
import {MainPageComponent} from './main-page/main-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '',
    component: BindingComponent,
    children: [
      { path: 'home', component: MainPageComponent, canActivate: [AuthGuard],  data: { roles: ['USER', 'ADMIN'] } },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],  data: { roles: ['USER', 'ADMIN'] } },
      { path: 'groups', component: NamedGroupsComponent, canActivate: [AuthGuard],  data: { roles: ['ADMIN'] } },
      { path: 'bookings', component: FeatureBookingTableComponent, canActivate: [AuthGuard], data: {roles: ['ADMIN', 'USER'] } },
      { path: 'book', component: FeatureBookingCalendarComponent, canActivate: [AuthGuard], data: {roles: ['ADMIN', 'USER'] } },
      { path: 'bookings/:id', component: FeatureBookingDetailsComponent, canActivate: [AuthGuard], data: {roles: ['ADMIN', 'USER'] } }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
