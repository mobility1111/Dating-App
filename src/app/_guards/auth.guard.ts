import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root', // Ensures the guard is injectable and available throughout the app
})
export class AuthGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private router: Router // To redirect the user if unauthorized
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map((user) => {
        if (user) return true;
        alert('You shall not pass!')
        console.log('You shall not pass!');
        this.router.navigateByUrl('/');  // Redirect to home
        return false;
      })
    );
}
  
}
