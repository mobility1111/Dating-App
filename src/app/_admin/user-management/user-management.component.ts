
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { __values } from 'tslib';



@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: Partial<User>[] = [];
  bsModalRef!: BsModalRef;

  constructor(private adminService: AdminService, private modalService: BsModalService) {}

  ngOnInit(): void {
    console.log('🚀 ngOnInit triggered'); // ✅ Check if this logs
    this.getUsersWithRoles();
  }

  getUsersWithRoles(): void {
    this.adminService.getUsersWithRoles().subscribe({
      next: (users) => {
        this.users = users.map(user => ({
          ...user,
          roles: user.roles ?? [] // Ensures roles is never undefined
        }));
      },
      error: (error) => console.error('Error fetching users:', error)
    });
  }

  openRolesModal(user: Partial<User>) {
    if (!user.username) {
      console.error("User must have a username before opening the modal.");
      return;
    }
  
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        user: {
          username: user.username,
          token: user.token ?? '', // ✅ Default to an empty string
          photoUrl: user.photoUrl ?? '',
          knownAs: user.knownAs ?? '',
          gender: user.gender ?? '',
          roles: user.roles ?? []
        },
        roles: this.getRolesArray(user)
      }
    };
  
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
  
    this.bsModalRef.content.updateSelectedRoles.subscribe((values: any[]) => {
      const rolesToUpdate = {
        roles: values.filter(el => el.checked).map(el => el.name)
      };
  
      if (rolesToUpdate.roles.length) {
        this.adminService.updateUserRoles(user.username as string, rolesToUpdate.roles)
          .subscribe(() => {
            user.roles = [...rolesToUpdate.roles];
          });
      }
    });
  }
  
  
  
  
  private getRolesArray(user: Partial<User>) {
    // Define the correct structure for roles
    const roles: { name: string; value: string; checked: boolean }[] = [];
    const userRoles = user.roles ?? []; // Ensure it's never undefined
  
    // Ensure availableRoles includes 'checked' property by default
    const availableRoles: { name: string; value: string; checked: boolean }[] = [
      { name: 'Admin', value: 'Admin', checked: false },
      { name: 'Moderator', value: 'Moderator', checked: false },
      { name: 'Member', value: 'Member', checked: false }
    ];
  
    availableRoles.forEach(role => {
      role.checked = userRoles.includes(role.name); // Set checked property based on user roles
      roles.push(role);
    });
  
    return roles;
  }
  
  

}
