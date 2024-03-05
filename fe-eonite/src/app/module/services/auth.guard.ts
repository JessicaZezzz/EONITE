import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = sessionStorage.getItem('ACCESS_TOKEN');
        if (user) {
            return true;
        } else {
            // not logged in so redirect to login page with the return url
            alert('Session Expired! Please Log In')
            this.router.navigate(['/home']);
            window.sessionStorage.clear();
            return false;
        }
    }
}
