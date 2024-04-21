import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from '../../models/auth.model';
import { emailValidator } from '../../services/email-validator.directive';
import { passwordConfirmationValidator } from '../../services/confirm-password';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { imagedflt } from '../../models/photo.model';
import { MatDialog } from '@angular/material/dialog';
import { GenerateOtpComponent } from '../generate-otp/generate-otp.component';

export const StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

@Component({
  selector: 'app-sign-up-user',
  templateUrl: './sign-up-user.component.html',
  styleUrls: ['./sign-up-user.component.css']
})
export class SignUpUserComponent {
  maxDate: string;
  reactiveForm!: FormGroup;
  user?:User;
  confPassword?:string;
  acceptcb:boolean = false;
  openDialogErrorDiv: boolean = false;
  openDialogSuccessDiv: boolean = false;
  dfltImg:string = imagedflt;

  constructor(private restService: RestApiServiceService, private router: Router,public dialog: MatDialog) {
    this.user = {} as User;
    const today = new Date();
    const eightYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.maxDate = eightYearsAgo.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      firstName: new FormControl(this.user?.firstName, [
        Validators.required,
      ]),
      lastName: new FormControl(this.user?.lastName, [
        Validators.required,
      ]),
      birthDate: new FormControl(this.user?.birthDate, [
        Validators.required,
      ]),
      phoneNumber: new FormControl(this.user?.phoneNumber, [
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
      validators: [passwordConfirmationValidator('password', 'confirmPassword'),this.emailcheckValidator()]
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

  emailcheckValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const email = formGroup.get('email');
      if(email?.value!=''){
        this.restService.checkEmailUser(email?.value).subscribe(e => {
          if (e != null) email?.setErrors({ emailCheck: true });
          return null;
        });
      }
      return null;
    };
  }

  public submit(): void {
    if (this.reactiveForm.invalid) {
      for (const control of Object.keys(this.reactiveForm.controls)) {
        this.reactiveForm.controls[control].markAsTouched();
      }
      return;
    }

    let postUser: User = {};
      postUser.firstName = this.reactiveForm.value.firstName;
      postUser.lastName = this.reactiveForm.value.lastName;
      let dates = this.reactiveForm.value.birthDate;
      var year = dates.substring(0, 4);
      var month = dates.substring(5, 7);
      var day = dates.substring(8, 10);
      const bdate = new DatePipe('en-US');
      postUser.birthDate = bdate.transform(new Date(parseInt(year),parseInt(month)-1,parseInt(day)),"yyyy-MM-ddThh:mm:ssZZZZZ");
      postUser.photo = this.dfltImg;
      postUser.phoneNumber = this.reactiveForm.value.phoneNumber;
      postUser.email = this.reactiveForm.value.email;
      postUser.password = this.reactiveForm.value.password;
      postUser.role = 'USER';
      console.log(JSON.stringify(postUser));

      let generateOTP:otp={
        userType:postUser.role,
        email:postUser.email!,
        option:'signup'
      };
      const dialogRef = this.dialog.open(GenerateOtpComponent, {
        data:generateOTP
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.restService.postsignInUser(JSON.stringify(postUser)).subscribe(event=>{
            if(event.statusCode == 200){
              this.openDialogSuccessDiv = true;
            }else if(event.statusCode == 500){
              this.openDialogErrorDiv = true;
            }
          });
        }else{};
      });
  }

  redirect(): void {
    this.router.navigate(['/login']);
  }

  back(){
    this.router.navigate(['/signup']);
  }

  home(){
    this.router.navigate(['/home']);
  }

}

export interface otp{
  userType: string;
  email: string;
  option:string;
  confirmationToken?:string;
}
