import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const auth = this.authService.isAuthenticated();
    console.log('AuthGuard: authenticated =', auth);
    if (auth) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
