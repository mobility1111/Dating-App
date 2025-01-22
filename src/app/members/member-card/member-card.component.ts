import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';


@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member | undefined;

  constructor(private memberService: MembersService,private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    if (!this.member) {
      console.warn('Member data is undefined');
      return;
    }
    console.log('Member data:', this.member); // This will show us the full member object
  }

  viewProfile(username: string | undefined) {
    if (!username) {
      console.error('Username is undefined');
      return;
    }
    console.log('Navigating to:', username);
    this.router.navigate(['/members', username]);
  }
  
  testMember(): void {
    console.log('Member:', this.member);
  }

  addLike(member: Member) {
    this.memberService.addLike(member.username).subscribe({
      next: () => alert('You liked ' + member.knownAs)
    });
  }
  


// addLike(member: Member) {
//   this.memberService.addLike(member.username).subscribe({
//     next: () => this.toastr.success('You have liked ' + member.knownAs)
//   })
// }
  

}
