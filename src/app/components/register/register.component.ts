
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm!: FormGroup;
  maxDate!: Date;
  validationErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService, 
    private toastr: ToastrService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'], // Default value 'male'
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      const parent = control?.parent as FormGroup;
      const matchingControl = parent?.controls[matchTo];
      return control?.value === matchingControl?.value ? null : { isMatching: true };
    };
  }

  register() {
    this.accountService.register(this.registerForm.value).subscribe(response => {
      this.router.navigateByUrl('/members');
      this.cancel();
    }, error => {
      this.validationErrors = error;
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}









// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';

// import { AccountService } from 'src/app/_services/account.service';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css']
// })
// export class RegisterComponent implements OnInit {
//   //@Input() usersFromHomeComponent: any;
//   @Output() cancelRegister = new EventEmitter();
//   model: any = {};
//   registerForm!: FormGroup;
//   fb: any;

  
//   constructor(private accountService: AccountService, private toastr: ToastrService, 
//     private router: Router) { }

// ngOnInit(): void {
//     this.initializeForm();
// }

// initializeForm() {
//   this.registerForm = new FormGroup({
//       username: new FormControl('', Validators.required),
//       password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
//       confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
//   });

//   this.registerForm.controls['password'].valueChanges.subscribe(() => {
//       this.registerForm.controls['confirmPassword'].updateValueAndValidity();
//   });
// }


// matchValues(matchTo: string): ValidatorFn {
//   return (control: AbstractControl) => {
//       const parent = control?.parent as FormGroup; // Explicitly cast the parent as FormGroup
//       const matchingControl = parent?.controls[matchTo] as AbstractControl; // Ensure controls are properly typed

//       return control?.value === matchingControl?.value
//           ? null
//           : { isMatching: true };
//   };
// }



//   register(){
//     this.accountService.register(this.model).subscribe(response => {

//     })
//   }

//   cancel(){
//      this.cancelRegister.emit(false)
//   }

// }
