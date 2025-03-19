import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment'; // ✅ Import environment

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = environment.apiUrl; // ✅ Use environment variable

  constructor(private http: HttpClient) {}

  getUsersWithRoles(): Observable<Partial<User>[]> {
    return this.http.get<Partial<User>[]>(`${this.baseUrl}Admin/users-with-roles`).pipe(
      tap(users => console.log('✅ Users from API:', users)), // ✅ Log API response
      catchError(error => {
        console.error(' Error fetching users:', error);
        return throwError(() => error);
      })
    );
  }

  updateUserRoles(username: string, roles: string[]): Observable<string[]> {
    return this.http.post<string[]>(`${this.baseUrl}Admin/edit-roles/${username}?roles=${roles}`, {}).pipe(
      tap(response => console.log('✅ Updated roles:', response)),
      catchError(error => {
        console.error(' Error updating roles:', error);
        return throwError(() => error);
      })
    );
  }
}
