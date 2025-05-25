import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {AuthInterceptor} from './app/auth/auth.interceptor'; // your route definitions

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideRouter(routes) // <- required if you use <router-outlet>
  ]
})
