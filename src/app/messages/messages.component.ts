import { Component, ChangeDetectorRef } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  messages?: Message[];
  pagination?: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  username?: string;
  loading = false;

  constructor(
    private messageService: MessageService,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.username = user?.username;
    });
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    if (!this.username) {
      console.error('Username is not available.');
      return;
    }
  
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container, this.username).subscribe(
      response => {
        console.log('Messages:', response.result); // Debug log
        console.log('Pagination:', response.pagination); // Debug log
        this.messages = response.result;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error => {
        console.error('Error loading messages:', error);
      }
    );
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() =>{
      this.messages?.splice(this.messages.findIndex(m => m .id ), 1);
    })
  }
  

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMessages();
  }
}









// import { Component } from '@angular/core';
// import { Message } from '../_models/message';
// import { Pagination } from '../_models/pagination';
// import { MessageService } from '../_services/message.service';

// @Component({
//   selector: 'app-messages',
//   templateUrl: './messages.component.html',
//   styleUrls: ['./messages.component.css']
// })
// export class MessagesComponent {
//   messages?: Message[];
//   pagination?: Pagination;
//   container = 'Inbox';
//   pageNumber = 1;
//   pageSize = 5;
//   // loading = false;

//   constructor(private messageService: MessageService) { }

//   ngOnInit(): void {
//     this.loadMessages();
//   }

//   loadMessages() {
//     //this.loading = true;
//     this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe( response => {
//         this.messages = response.result;
//         this.pagination = response.pagination;
//     })
//   }

//   pageChanged(event: any) {
//       this.pageNumber = event.page;
//       this.loadMessages();
//   }

// }
