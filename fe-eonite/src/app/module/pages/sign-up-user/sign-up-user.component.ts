import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from '../../models/auth.model';
import { emailValidator } from '../../services/email-validator.directive';

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
  constructor() {
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

  checkPasswords(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let pass = this.reactiveForm.get('password')?.value;
      let confirmPass = this.confPassword;
      return pass === confirmPass ? null : { notSame: true };
    };
  }

  public validate(): void {
    if (this.reactiveForm.invalid) {
      for (const control of Object.keys(this.reactiveForm.controls)) {
        this.reactiveForm.controls[control].markAsTouched();
      }
      return;
    }

    this.user = this.reactiveForm.value;
    console.log(this.user)
  }

}
