
// import { Component, OnInit } from '@angular/core';  
// import { Member } from 'src/app/_models/member';  
// import { MembersService } from 'src/app/_services/members.service';  
// import { UserParams } from 'src/app/_models/userParams'; // Update the import as necessary  
// import { User } from 'src/app/_models/user'; // Import your User model  
// import { AccountService } from 'src/app/_services/account.service'; // Import AccountService  

// @Component({  
//   selector: 'app-member-list',  
//   templateUrl: './member-list.component.html',  
//   styleUrls: ['./member-list.component.css']  
// })  
// export class MemberListComponent implements OnInit {  
//   members: Member[] = [];  
//   pageSize = 5;  
//   currentPage = 1;  
//   totalPages = 0;  
//   userParams!: UserParams; // Instance of UserParams  

//   constructor(private memberService: MembersService, private accountService: AccountService) { }  

//   ngOnInit(): void {  
//     this.loadCurrentUser(); // Load the current user  
//   }  

//   // Load the current user and then load members  
//   loadCurrentUser() {  
//     this.accountService.currentUser$.subscribe(user => {  
//       if (user) {  
//         this.userParams = new UserParams(user); // Create UserParams with the current user  
//         this.loadMembers(); // Now load members  
//       }  
//     });  
//   }  

//   loadMembers() {  
//     this.memberService.getMembers(this.userParams).subscribe({  
//       next: members => {  
//         this.members = members;  
//         this.totalPages = Math.ceil(this.members.length / this.pageSize);  
//       }  
//     });  
//   }  

//   get paginatedMembers(): Member[] {  
//     const startIndex = (this.currentPage - 1) * this.pageSize;  
//     return this.members.slice(startIndex, startIndex + this.pageSize);  
//   }  

//   pageChanged(page: number) {  
//     if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {  
//       this.currentPage = page;  
//       window.scrollTo(0, 0);  
//     }  
//   }  

//   getPageNumbers(): number[] {  
//     const maxPages = 5;  
//     let startPage = Math.max(1, this.currentPage - 2);  
//     let endPage = Math.min(this.totalPages, startPage + maxPages - 1);  
    
//     if (endPage - startPage + 1 < maxPages) {  
//       startPage = Math.max(1, endPage - maxPages + 1);  
//     }  
    
//     return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);  
//   }  
// }




import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[] | undefined;
  pagination: Pagination | undefined;
  userParams: UserParams;  // Remove the | undefined
  user!: User;
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];

  constructor(private memberService: MembersService, private accountService: AccountService) {
    const params = this.memberService.getUserParams();
    if (params === null) {
      throw new Error('User parameters could not be initialized');
    }
    this.userParams = params;
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    if (!this.userParams) return;  // Add safety check
    
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }

  resetFilters() {
    const params = this.memberService.resetUserParams();
    if (params) {
      this.userParams = params;
      this.loadMembers();
    }
  }

  pageChanged(event: any) {
    if (this.userParams) {
      this.userParams.pageNumber = event.page;
      this.memberService.setUserParams(this.userParams)
      this.loadMembers();
    }
  }
}