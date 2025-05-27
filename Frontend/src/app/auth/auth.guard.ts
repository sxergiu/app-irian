import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const isAuth = this.authService.isAuthenticated();
    const currentRole = this.authService.getRole();
    const expectedRoles: string[] = route.data['roles'];

    console.log('AuthGuard: authenticated =', isAuth, ' with role =', currentRole);

    if (!isAuth || !currentRole) {
      this.router.navigate(['/login']);
      return false;
    }

    if( expectedRoles && !expectedRoles.includes(currentRole) ) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
