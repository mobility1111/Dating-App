import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, Observable, of, pipe, take } from 'rxjs';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { Params } from '@angular/router';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user!: User;
  userParams!: UserParams;

  constructor(private http: HttpClient, private accountService: AccountService) {

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.user = user; // Safe assignment
        this.userParams = new UserParams(user);
      }
    });
  }

  
//   getMembers(page?: number, itemsPerPage?: number): Observable<PaginatedResult<Member[]>> {  
//     let params = new HttpParams();  

//     // Append parameters only if they are defined  
//     if (page !== undefined && itemsPerPage !== undefined) {  
//         params = params.append('pageNumber', page.toString());  
//         params = params.append('pageSize', itemsPerPage.toString());  
//     }  

//     // Create a new PaginatedResult object  
//     const paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();  

//     return this.http.get<Member[]>(this.baseUrl + 'users', { observe: 'response', params }).pipe(  
//         map(response => {  
//             // Safely handle the response body  
//             paginatedResult.result = response.body ?? [];  

//             // Safely parse the pagination header  
//             const paginationHeader = response.headers.get('Pagination');  
//             if (paginationHeader) {  
//                 const paginationData = JSON.parse(paginationHeader);  
                
//                 // Map the header properties to the expected lowercase properties  
//                 paginatedResult.pagination = {  
//                     currentPage: paginationData.CurrentPage,  
//                     itemsPerPage: paginationData.ItemsPerPage,  
//                     totalItems: paginationData.TotalItems,  
//                     totalPages: paginationData.TotalPages  
//                 };  
//             }  

//             return paginatedResult; // Return the paginated result  
//         })  
//     );  
// }

  // getMembers() {
  //   if (this.members.length > 0) return of(this.members);
  //   return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
  //     map(members => {
  //       this.members = members;
  //       return members;
  //     })
  //   );
  // }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }


  getMembers(userParams: UserParams){  
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response){
      return of(response);
    }


    let params = getPaginationHeaders(userParams.pageNumber,userParams.pageSize)

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
   
    params = params.append('oderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http)
    .pipe(map(response => {
      this.memberCache.set(Object.values(userParams).join('-'), response);
      return response;
    }))
}



  // getMember(username: string) {
  //   const member = this.members.find(x => x.username === username);
  //   if (member !== undefined) return of(member);
  //   return this.http.get<Member>(this.baseUrl + 'users/' + username);
  // }
  
  getMember(username: string) {
    const member = [...this.memberCache.values()]
    .reduce((arr, elem) => arr.concat(elem.result), [])
    .find((member: Member) => member.username === username)

    if (member){
      return of(member);
    }
    if (member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
  


  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member }
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);

    params = params.append('predicate', predicate);

    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params, this.http);
  }

  
  
}
