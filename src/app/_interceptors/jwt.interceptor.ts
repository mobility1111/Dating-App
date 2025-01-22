import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { AccountService } from '../_services/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let modifiedRequest = request;  // Create a new variable
    
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          modifiedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`  // Fix the string template syntax
            }
          });
        }
      }
    });
    
    return next.handle(modifiedRequest);  // Use the modified request
}
}
