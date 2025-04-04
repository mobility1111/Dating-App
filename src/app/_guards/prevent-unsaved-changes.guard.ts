import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';


@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<MemberEditComponent> {
  constructor() {}

  canDeactivate(component: MemberEditComponent): Observable<boolean> {
    if (component.editForm?.dirty) {
      //return confirm('')
    }
    return of(true);
  }
  
}
