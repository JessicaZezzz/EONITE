import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/auth.model';
import { emailValidator } from '../../services/email-validator.directive';
import { passwordConfirmationValidator } from '../../services/confirm-password';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

export const StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

@Component({
  selector: 'app-sign-up-user',
  templateUrl: './sign-up-user.component.html',
  styleUrls: ['./sign-up-user.component.css']
})
export class SignUpUserComponent {
  reactiveForm!: FormGroup;
  user?:User;
  confPassword?:string;
  acceptcb:boolean = false;
  openDialogErrorDiv: boolean = false;
  openDialogSuccessDiv: boolean = false;

  constructor(private restService: RestApiServiceService, private router: Router) {
    this.user = {} as User;
  }

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      firstName: new FormControl(this.user?.first_name, [
        Validators.required,
      ]),
      lastName: new FormControl(this.user?.last_name, [
        Validators.required,
      ]),
      birthDate: new FormControl(this.user?.birth_date, [
        Validators.required,
      ]),
      phoneNumber: new FormControl(this.user?.phone_number, [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10)
      ]),
      email: new FormControl(this.user?.email, [
        Validators.required,
        emailValidator(),
      ]),
      password: new FormControl(this.user?.password, [
        Validators.required,
        Validators.pattern(StrongPasswordRegx),
        Validators.minLength(12),
      ]),
      confirmPassword: new FormControl(this.confPassword, [
        Validators.required
      ]),
      acceptTnC: new FormControl(this.acceptcb, [
        Validators.requiredTrue
      ]),
    },{
      validators: passwordConfirmationValidator('password', 'confirmPassword')
    });
  }

  get firstName() {
    return this.reactiveForm.get('firstName')!;
  }

  get lastName() {
    return this.reactiveForm.get('lastName')!;
  }

  get birthDate() {
    return this.reactiveForm.get('birthDate')!;
  }

  get phoneNumber() {
    return this.reactiveForm.get('phoneNumber')!;
  }

  get email() {
    return this.reactiveForm.get('email')!;
  }

  get password() {
    return this.reactiveForm.get('password')!;
  }

  get confirmPassword() {
    return this.reactiveForm.get('confirmPassword')!;
  }

  get acceptTnC() {
    return this.reactiveForm.get('acceptTnC')!;
  }

  public submit(): void {
    if (this.reactiveForm.invalid) {
      for (const control of Object.keys(this.reactiveForm.controls)) {
        this.reactiveForm.controls[control].markAsTouched();
      }
      return;
    }

    let postUser: User = {};
      postUser.first_name = this.reactiveForm.value.firstName;
      postUser.last_name = this.reactiveForm.value.lastName;
      let dates = this.reactiveForm.value.birthDate;
      var year = dates.substring(0, 4);
      var month = dates.substring(5, 7);
      var day = dates.substring(8, 10);
      const bdate = new DatePipe('en-US');
      postUser.birth_date = bdate.transform(new Date(parseInt(year),parseInt(month),parseInt(day)),"yyyy-MM-ddThh:mm:ssZZZZZ");
      postUser.photo_id = 1;
      postUser.phone_number = this.reactiveForm.value.phoneNumber;
      postUser.email = this.reactiveForm.value.email;
      postUser.password = this.reactiveForm.value.password;
      postUser.role = 'USER';
      console.log(JSON.stringify(postUser));

      this.restService.postsignInUser(JSON.stringify(postUser)).subscribe(event=>{
        if(event.statusCode == 200){
          this.openDialogSuccessDiv = true;
        }else if(event.statusCode == 500){
          this.openDialogErrorDiv = true;
        }
      })

  }

  redirect(): void {
    this.router.navigate(['/login']);
  }

  back(){
    this.router.navigate(['/signup']);
  }

}
